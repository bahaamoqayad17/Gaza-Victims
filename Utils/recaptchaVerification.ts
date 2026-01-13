import AppError from "./AppError";

/**
 * Verify reCAPTCHA token with Google's API with retry logic
 * @param captchaToken - The reCAPTCHA token from the frontend
 * @param retries - Number of retry attempts (default: 2)
 * @returns Promise<boolean> - Returns true if verification is successful
 */
const attemptRecaptchaVerification = async (
  captchaToken: string,
  secretKey: string,
  timeout: number = 8000
): Promise<boolean> => {
  const url = new URL("https://www.google.com/recaptcha/api/siteverify");
  url.searchParams.append("secret", secretKey);
  url.searchParams.append("response", captchaToken);

  // Create an AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`reCAPTCHA API returned status ${response.status}`);
    }

    const data = await response.json();
    const { success, score, "error-codes": errorCodes } = data;

    // Log error codes if present for debugging
    if (errorCodes && errorCodes.length > 0) {
      console.warn("reCAPTCHA API returned error codes:", errorCodes);
    }

    // For reCAPTCHA v2, success is a boolean
    // For reCAPTCHA v3, we also check the score (typically > 0.5 is considered human)
    if (success) {
      // If it's v3 and has a score, check if score is acceptable
      if (score !== undefined) {
        return score >= 0.5;
      }
      // For v2, success is enough
      return true;
    }

    return false;
  } catch (fetchError: any) {
    clearTimeout(timeoutId);
    throw fetchError;
  }
};

export const verifyRecaptcha = async (
  captchaToken: string,
  retries: number = 2
): Promise<boolean> => {
  if (!captchaToken) {
    throw new AppError("reCAPTCHA token is required", 400);
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;
  // const skipRecaptcha = process.env.SKIP_RECAPTCHA === "true";
  const allowRecaptchaFailure = "true";

  // Allow skipping reCAPTCHA in development/test environments
  // if (skipRecaptcha) {
  //   console.warn(
  //     "⚠️  reCAPTCHA verification is disabled (SKIP_RECAPTCHA=true)"
  //   );
  //   return true;
  // }

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not set in environment variables");
    throw new AppError("reCAPTCHA verification is not configured", 500);
  }

  let lastError: any = null;

  // Retry logic for transient network failures
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      // Increase timeout slightly on retries
      const timeout = 8000 + attempt * 2000; // 8s, 10s, 12s

      if (attempt > 0) {
        console.log(
          `Retrying reCAPTCHA verification (attempt ${attempt + 1}/${
            retries + 1
          })...`
        );
        // Wait before retry (exponential backoff)
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
      }

      const result = await attemptRecaptchaVerification(
        captchaToken,
        secretKey,
        timeout
      );
      return result;
    } catch (error: any) {
      lastError = error;

      // Check if it's a timeout or connection error
      const isTimeoutError =
        error.name === "AbortError" ||
        error.code === "UND_ERR_CONNECT_TIMEOUT" ||
        error.message?.includes("timeout") ||
        error.message?.includes("TIMEOUT");

      // Check if it's a network error
      const isNetworkError =
        error.message?.includes("fetch failed") ||
        error.message?.includes("ECONNREFUSED") ||
        error.message?.includes("ENOTFOUND") ||
        error.code === "UND_ERR_CONNECT_TIMEOUT";

      // If it's the last attempt or not a retryable error, break
      if (attempt === retries || (!isTimeoutError && !isNetworkError)) {
        break;
      }

      console.warn(
        `reCAPTCHA verification attempt ${attempt + 1} failed:`,
        error.message || error.code
      );
    }
  }

  // Handle final error
  if (lastError) {
    const isTimeoutError =
      lastError.name === "AbortError" ||
      lastError.code === "UND_ERR_CONNECT_TIMEOUT" ||
      lastError.message?.includes("timeout");

    if (isTimeoutError) {
      console.error(
        "reCAPTCHA verification failed after retries - connection timeout to Google API"
      );

      // If allowed, gracefully degrade by accepting the request
      if (allowRecaptchaFailure) {
        console.warn(
          "⚠️  ALLOW_RECAPTCHA_FAILURE is enabled - accepting request despite reCAPTCHA timeout."
        );
        return true;
      }

      throw new AppError(
        "reCAPTCHA verification timed out. The service may be temporarily unavailable. Please try again later.",
        408
      );
    }

    console.error("Error verifying reCAPTCHA:", lastError);
    throw new AppError("Failed to verify reCAPTCHA. Please try again.", 500);
  }

  throw new AppError("Failed to verify reCAPTCHA", 500);
};
