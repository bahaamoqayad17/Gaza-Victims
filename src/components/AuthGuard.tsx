import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { isTokenValid } from "@/lib/tokenUtils";
import { toast } from "sonner";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
  redirectAuthenticatedTo?: string; // Where to redirect if user is already authenticated
}

/**
 * AuthGuard component that protects routes based on authentication status
 *
 * Features:
 * - Checks if user is authenticated
 * - Validates JWT token expiry
 * - Handles expired tokens with automatic logout
 * - Role-based access control
 * - Redirects to appropriate pages
 */
export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = "/auth",
  allowedRoles = [],
  redirectAuthenticatedTo = "/",
}) => {
  const [isValidating, setIsValidating] = useState(true);
  const dispatch = useAppDispatch();
  const location = useLocation();

  const { isAuthenticated, token, user } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // If authentication is not required, allow access
        if (!requireAuth) {
          setIsValidating(false);
          return;
        }

        // Check if user is authenticated in Redux state
        if (!isAuthenticated || !token || !user) {
          setIsValidating(false);
          return;
        }

        // Validate token expiry
        if (!isTokenValid(token)) {
          console.log("Token expired or invalid, logging out...");

          // Clear auth state and localStorage
          dispatch(logout());

          // Show notification
          toast.error("Your session has expired. Please log in again.");

          setIsValidating(false);
          return;
        }

        // Check role-based access if roles are specified
        if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
          console.log(
            `Access denied. Required roles: ${allowedRoles.join(
              ", "
            )}, User role: ${user.role}`
          );
          toast.error("You don't have permission to access this page.");
          setIsValidating(false);
          return;
        }

        // All checks passed
        setIsValidating(false);
      } catch (error) {
        console.error("Auth validation error:", error);

        // On any error, clear auth state for security
        dispatch(logout());
        toast.error("Authentication error. Please log in again.");
        setIsValidating(false);
      }
    };

    validateAuth();
  }, [isAuthenticated, token, user, requireAuth, allowedRoles, dispatch]);

  // Show loading state while validating
  if (isValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If authentication is not required, check if we should redirect authenticated users
  if (!requireAuth) {
    // If user is authenticated and we have a redirect destination, redirect them
    if (
      isAuthenticated &&
      token &&
      user &&
      isTokenValid(token) &&
      redirectAuthenticatedTo
    ) {
      return <Navigate to={redirectAuthenticatedTo} replace />;
    }
    // Otherwise, render children (allow unauthenticated access)
    return <>{children}</>;
  }

  // Check authentication status after validation
  if (!isAuthenticated || !token || !user) {
    // Save the current location to redirect back after login
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  // Check if token is still valid (double-check)
  if (!isTokenValid(token)) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page or home
    return <Navigate to="/" replace />;
  }

  // All checks passed, render protected content
  return <>{children}</>;
};

/**
 * Higher-order component for easier usage
 */
export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>,
  authOptions?: Omit<AuthGuardProps, "children">
) => {
  return (props: P) => (
    <AuthGuard {...authOptions}>
      <Component {...props} />
    </AuthGuard>
  );
};

/**
 * Hook to check if current user has required role
 */
export const useHasRole = (requiredRoles: string | string[]): boolean => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !user) {
    return false;
  }

  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return roles.includes(user.role);
};

/**
 * Hook to check if user is authenticated with valid token
 */
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated, token } = useAppSelector((state) => state.auth);

  if (!isAuthenticated || !token) {
    return false;
  }

  return isTokenValid(token);
};
