/**
 * JWT Token utilities for validation and expiry checking
 */

export interface DecodedToken {
  id: string;
  iat: number; // issued at
  exp: number; // expires at
}

/**
 * Decode JWT token without verification (client-side only)
 * Note: This is for expiry checking only, server should verify signature
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // JWT has 3 parts separated by dots: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decode base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    const parsedPayload = JSON.parse(decodedPayload) as DecodedToken;

    return parsedPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return true; // Consider invalid tokens as expired
  }

  // exp is in seconds, Date.now() is in milliseconds
  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
};

/**
 * Check if token is valid (exists and not expired)
 */
export const isTokenValid = (token: string | null): boolean => {
  if (!token || typeof token !== "string") {
    return false;
  }

  return !isTokenExpired(token);
};

/**
 * Get token expiry time in milliseconds
 */
export const getTokenExpiryTime = (token: string): number | null => {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) {
    return null;
  }

  // Convert to milliseconds
  return decoded.exp * 1000;
};

/**
 * Get time until token expires in minutes
 */
export const getTimeUntilExpiry = (token: string): number | null => {
  const expiryTime = getTokenExpiryTime(token);
  if (!expiryTime) {
    return null;
  }

  const currentTime = Date.now();
  const timeUntilExpiry = expiryTime - currentTime;

  // Return in minutes, negative if already expired
  return Math.floor(timeUntilExpiry / (1000 * 60));
};
