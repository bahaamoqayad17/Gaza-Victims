import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2, Download, RotateCcw, Eraser } from "lucide-react";

interface ImageEditorProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageType: "proofOfId" | "proofOfDeath";
  onSave?: (editedImageUrl: string) => void;
  isSaving?: boolean;
}

export const ImageEditor = ({
  isOpen,
  onClose,
  imageUrl,
  imageType,
  onSave,
  isSaving = false,
}: ImageEditorProps) => {
  const [blurAmount, setBlurAmount] = useState(5);
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const maskCanvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const canvasSizeRef = useRef<{
    width: number;
    height: number;
    scale: number;
  }>({
    width: 0,
    height: 0,
    scale: 1,
  });

  useEffect(() => {
    if (isOpen && imageUrl) {
      // Reset when opening editor
      setBlurAmount(5);
      setBrushSize(30);
      setIsErasing(false);
      imageRef.current = null;

      // Small delay to ensure dialog is rendered
      const timer = setTimeout(() => {
        // Load image directly from URL
        const img = new Image();

        // Try with CORS first
        img.crossOrigin = "anonymous";
        img.src = imageUrl;

        img.onload = () => {
          if (img.width > 0 && img.height > 0) {
            imageRef.current = img;
            // Small delay to ensure canvas refs are ready
            setTimeout(() => {
              initializeCanvas();
            }, 50);
          }
        };

        img.onerror = () => {
          // Fallback: try without CORS
          console.warn("Failed to load image with CORS, trying without...");
          const img2 = new Image();
          img2.onload = () => {
            if (img2.width > 0 && img2.height > 0) {
              imageRef.current = img2;
              setTimeout(() => {
                initializeCanvas();
              }, 50);
            }
          };
          img2.onerror = () => {
            console.error("Failed to load image:", imageUrl);
          };
          img2.src = imageUrl;
        };

        img.src = imageUrl;
      }, 100);

      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, imageUrl]);

  useEffect(() => {
    if (imageRef.current) {
      redrawCanvas();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blurAmount]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const img = imageRef.current;

    if (!canvas || !maskCanvas || !img) {
      console.warn("Canvas or image not ready:", {
        canvas: !!canvas,
        maskCanvas: !!maskCanvas,
        img: !!img,
      });
      return;
    }

    if (img.width === 0 || img.height === 0) {
      console.warn("Image has invalid dimensions:", img.width, img.height);
      return;
    }

    const maxWidth = 1200;
    const maxHeight = 800;
    let width = img.width;
    let height = img.height;
    let scale = 1;

    // Scale down if too large
    if (width > maxWidth || height > maxHeight) {
      scale = Math.min(maxWidth / width, maxHeight / height);
      width = width * scale;
      height = height * scale;
    }

    // Ensure minimum dimensions
    if (width < 1) width = 1;
    if (height < 1) height = 1;

    canvas.width = width;
    canvas.height = height;
    maskCanvas.width = width;
    maskCanvas.height = height;

    canvasSizeRef.current = { width, height, scale };

    // Draw base image
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (ctx) {
      // Clear any previous content
      ctx.clearRect(0, 0, width, height);
      // Draw the image
      try {
        ctx.drawImage(img, 0, 0, width, height);
        console.log("Image drawn to canvas:", width, "x", height);
      } catch (error) {
        console.error("Error drawing image to canvas:", error);
      }
    }

    // Clear mask
    const maskCtx = maskCanvas.getContext("2d");
    if (maskCtx) {
      maskCtx.clearRect(0, 0, width, height);
    }

    redrawCanvas();
  };

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    const maskCanvas = maskCanvasRef.current;
    const img = imageRef.current;
    if (!canvas || !maskCanvas || !img) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const maskCtx = maskCanvas.getContext("2d");
    if (!ctx || !maskCtx) return;

    const { width, height } = canvasSizeRef.current;

    // Clear and draw base image
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(img, 0, 0, width, height);

    // Check if there's any blur mask
    const maskData = maskCtx.getImageData(0, 0, width, height);
    const hasBlur = maskData.data.some((val, idx) => idx % 4 === 3 && val > 0);

    if (hasBlur && blurAmount > 0) {
      // Create blurred version
      const blurCanvas = document.createElement("canvas");
      blurCanvas.width = width;
      blurCanvas.height = height;
      const blurCtx = blurCanvas.getContext("2d");

      if (blurCtx) {
        // Draw blurred image
        blurCtx.filter = `blur(${blurAmount}px)`;
        blurCtx.drawImage(img, 0, 0, width, height);
        blurCtx.filter = "none";

        // Create a composite canvas for masked blur
        const compositeCanvas = document.createElement("canvas");
        compositeCanvas.width = width;
        compositeCanvas.height = height;
        const compositeCtx = compositeCanvas.getContext("2d");

        if (compositeCtx) {
          // Draw blurred image
          compositeCtx.drawImage(blurCanvas, 0, 0);

          // Use mask to determine alpha - destination-in keeps only where mask is opaque
          compositeCtx.globalCompositeOperation = "destination-in";
          compositeCtx.drawImage(maskCanvas, 0, 0);

          // Now composite the masked blur over the original
          ctx.globalCompositeOperation = "source-over";
          ctx.drawImage(compositeCanvas, 0, 0);
        }
      }
    }

    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  };

  const getCanvasCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number;
    let clientY: number;

    if ("touches" in e) {
      if (e.touches.length === 0) return null;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const drawOnMask = (x: number, y: number, isErase: boolean) => {
    const maskCanvas = maskCanvasRef.current;
    if (!maskCanvas) return;

    const ctx = maskCanvas.getContext("2d");
    if (!ctx) return;

    ctx.globalCompositeOperation = isErase ? "destination-out" : "source-over";
    ctx.globalAlpha = isErase ? 1 : 0.8;

    if (lastPointRef.current) {
      // Draw line from last point to current point
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
    } else {
      // Draw circle at current point
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x, y };
    redrawCanvas();
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isProcessing || isSaving) return;
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    lastPointRef.current = coords;
    drawOnMask(coords.x, coords.y, isErasing);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isProcessing || isSaving) return;
    e.preventDefault();

    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    drawOnMask(coords.x, coords.y, isErasing);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (isProcessing || isSaving) return;
    e.preventDefault();
    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    setIsDrawing(true);
    lastPointRef.current = coords;
    drawOnMask(coords.x, coords.y, isErasing);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || isProcessing || isSaving) return;
    e.preventDefault();

    const coords = getCanvasCoordinates(e);
    if (!coords) return;

    drawOnMask(coords.x, coords.y, isErasing);
  };

  const handleTouchEnd = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;

    if (!canvas) {
      throw new Error("Canvas not available");
    }

    setIsProcessing(true);
    try {
      // Check if canvas is tainted by trying to get image data
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        throw new Error("Failed to get canvas context");
      }

      // Try to read a pixel to check if canvas is tainted
      let isTainted = false;
      try {
        ctx.getImageData(0, 0, 1, 1);
      } catch (taintError) {
        isTainted = true;
        console.error("Canvas is tainted:", taintError);
      }

      // if (isTainted) {
      //   setIsProcessing(false);
      //   throw new Error(
      //     "Cannot export image due to CORS restrictions. The image may not have loaded correctly through the proxy. Please close and reopen the editor, or refresh the page."
      //   );
      // }

      // Try to export as blob
      const blob = await new Promise<Blob | null>((resolve, reject) => {
        try {
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Failed to create blob from canvas"));
              }
            },
            "image/png",
            1.0
          );
        } catch (error) {
          reject(error);
        }
      });

      if (!blob) {
        setIsProcessing(false);
        throw new Error("Failed to create blob from canvas");
      }

      if (blob.size === 0) {
        setIsProcessing(false);
        throw new Error("Created empty blob from canvas");
      }

      console.log("Canvas exported successfully, blob size:", blob.size);

      const editedImageUrl = URL.createObjectURL(blob);

      if (onSave) {
        onSave(editedImageUrl);
        // Don't set isProcessing to false here - let parent handle it
        // The parent will close the dialog when done
      } else {
        const link = document.createElement("a");
        link.href = editedImageUrl;
        link.download = `${imageType}-edited-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(editedImageUrl);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error("Error saving image:", error);
      setIsProcessing(false);
      throw error; // Re-throw so parent can handle it
    }
  };

  const handleReset = () => {
    const maskCanvas = maskCanvasRef.current;
    if (maskCanvas) {
      const ctx = maskCanvas.getContext("2d");
      if (ctx) {
        ctx.clearRect(0, 0, maskCanvas.width, maskCanvas.height);
      }
    }
    lastPointRef.current = null;
    redrawCanvas();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Image - Selective Blur</DialogTitle>
          <DialogDescription>
            Draw on the image to apply blur. Use the eraser to remove blur.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Canvas Container */}
          <div className="relative border rounded-lg overflow-hidden bg-muted">
            <div className="relative">
              <canvas
                ref={canvasRef}
                className={`w-full h-auto max-h-[60vh] object-contain ${
                  isProcessing || isSaving
                    ? "cursor-not-allowed"
                    : "cursor-crosshair"
                }`}
                style={{ display: "block" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
              {/* Hidden mask canvas for drawing */}
              <canvas ref={maskCanvasRef} style={{ display: "none" }} />

              {/* Loading Overlay */}
              {(isProcessing || isSaving) && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-10">
                  <div className="bg-background rounded-lg p-6 flex flex-col items-center gap-3">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm font-medium">
                      {isSaving ? "Uploading image..." : "Processing image..."}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Please wait...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              isProcessing || isSaving ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            {/* Blur Intensity */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="blur-slider">Blur Intensity</Label>
                <span className="text-sm text-muted-foreground">
                  {blurAmount.toFixed(1)}px
                </span>
              </div>
              <Slider
                id="blur-slider"
                min={0}
                max={20}
                step={0.5}
                value={[blurAmount]}
                onValueChange={(value) => setBlurAmount(value[0])}
                className="w-full"
                disabled={isProcessing || isSaving}
              />
            </div>

            {/* Brush Size */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="brush-slider">Brush Size</Label>
                <span className="text-sm text-muted-foreground">
                  {brushSize}px
                </span>
              </div>
              <Slider
                id="brush-slider"
                min={5}
                max={100}
                step={5}
                value={[brushSize]}
                onValueChange={(value) => setBrushSize(value[0])}
                className="w-full"
                disabled={isProcessing || isSaving}
              />
            </div>
          </div>

          {/* Tool Selection */}
          <div
            className={`flex items-center gap-2 ${
              isProcessing || isSaving ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <Button
              variant={!isErasing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsErasing(false)}
              disabled={isProcessing || isSaving}
            >
              Paint Blur
            </Button>
            <Button
              variant={isErasing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsErasing(true)}
              disabled={isProcessing || isSaving}
            >
              <Eraser className="h-4 w-4 mr-2" />
              Erase Blur
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isProcessing || isSaving}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isProcessing || isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={async () => {
              try {
                await handleSave();
              } catch (error) {
                // Error is already handled in handleSave and will be shown via toast
                console.log("Save failed bahaa:", error);
                console.error("Save failed:", error);
              }
            }}
            disabled={isProcessing || isSaving}
          >
            {isProcessing || isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {isSaving ? "Uploading..." : "Processing..."}
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Save Image
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
