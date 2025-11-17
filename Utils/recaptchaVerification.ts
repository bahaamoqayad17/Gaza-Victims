import AppError from "./AppError";

/**
 * Verify reCAPTCHA token with Google's API
 * @param captchaToken - The reCAPTCHA token from the frontend
 * @returns Promise<boolean> - Returns true if verification is successful
 */
export const verifyRecaptcha = async (
  captchaToken: string
): Promise<boolean> => {
  if (!captchaToken) {
    throw new AppError("reCAPTCHA token is required", 400);
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY is not set in environment variables");
    throw new AppError("reCAPTCHA verification is not configured", 500);
  }

  try {
    const url = new URL("https://www.google.com/recaptcha/api/siteverify");
    url.searchParams.append("secret", secretKey);
    url.searchParams.append("response", captchaToken);

    const response = await fetch(url.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (!response.ok) {
      throw new Error(`reCAPTCHA API returned status ${response.status}`);
    }

    const data = await response.json();
    const { success, score } = data;

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
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    throw new AppError("Failed to verify reCAPTCHA", 500);
  }
};

