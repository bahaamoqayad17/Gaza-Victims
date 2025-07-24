import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";

interface MobileTooltipProps {
  content: string;
  children: React.ReactNode;
  className?: string;
}

export const MobileTooltip = ({ content, children, className = "" }: MobileTooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      setPosition({
        x: rect.left + rect.width / 2,
        y: rect.top + scrollTop - 10
      });
    }
    
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        tooltipRef.current &&
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleScroll = () => {
      if (isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    window.addEventListener('scroll', handleScroll);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isOpen]);

  const tooltip = isOpen ? (
    <div
      ref={tooltipRef}
      className="fixed z-[9999] bg-gray-900 text-white text-xs px-3 py-2 rounded-md shadow-lg max-w-xs transform -translate-x-1/2 -translate-y-full"
      style={{
        left: position.x,
        top: position.y,
      }}
    >
      <div className="relative">
        {content}
        {/* Arrow */}
        <div 
          className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"
        />
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleClick}
        className={`touch-manipulation ${className}`}
      >
        {children}
      </button>
      {tooltip && createPortal(tooltip, document.body)}
    </>
  );
};