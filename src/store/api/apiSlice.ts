import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";

// Define API response types
export interface ApiResponse<T = unknown> {
  status: "success" | "fail" | "error";
  message?: string;
  data?: T;
  results?: number;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCases: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  casesReviewed: number;
  secondaryEmail?: string;
  mobile_number?: string;
  timezone?: string;
  organization_name?: string;
  department?: string;
  start_date?: string;
  end_date?: string;
  specializations?: string[];
  languages?: string[];
  security_clearance?: string;
  notes?: string;
  contact_name?: string;
  contact_number?: string;
  contact_email?: string;
  contact_relationship?: string;
  passwordChangedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    activeVerifiers: number;
  };
  cases: {
    total: number;
    pending: number;
    underReview: number;
    thirdPartyReview: number;
    digitalForensicsReview: number;
    verified: number;
    verifiedToday: number;
  };
}

export interface AuthResponse {
  status: string;
  token: string;
  data: {
    user: User;
  };
}

export interface Case {
  _id: string;
  name: string;
  age: number;
  gender: string;
  occupation?: string;
  story?: string;
  leftBehind?: string[];
  portraitPhoto?: string;
  additionalAttachments?: string[];
  socialMediaLinks?: string[];
  location?: {
    lat: string;
    lng: string;
  };
  locationName?: string;
  causeOfDeath?: string;
  circumstances?: string;
  perpetrator?: string;
  evidenceDescription?: string;
  witness_information?: string;
  proofOfId?: string;
  proofOfDeath?: string;
  proofOfDeathGraphic?: boolean;
  additionalEvidence?: string;
  additionalEvidenceGraphic?: boolean;
  sourceOfInformation?: string;
  newsLinks?: string[];
  notes?: string;
  date?: string;
  status: string;
  urgency: string;
  submittedBy: string;
  relationshipToVictim?: string;
  actionTaken?: string;
  isVerified: boolean;
  isThirdPartyVerified: boolean;
  isDigitalForensicsVerified: boolean;
  userThirdPartyVerified?:
    | string
    | { _id: string; name: string; email: string };
  userDigitalForensicsVerified?:
    | string
    | { _id: string; name: string; email: string };
  userModeratorVerified?: string | { _id: string; name: string; email: string };
  consentAgreed: boolean;
  safetyAcknowledged: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CaseInput {
  name: string;
  age: number;
  gender: string;
  occupation?: string;
  story?: string;
  leftBehind?: string[];
  socialMediaLinks?: string[];
  location?: {
    lat: string;
    lng: string;
  };
  locationName?: string;
  causeOfDeath?: string;
  circumstances?: string;
  perpetrator?: string;
  evidenceDescription?: string;
  witness_information?: string;
  sourceOfInformation?: string;
  newsLinks?: string[];
  notes?: string;
  date?: string;
  submittedBy: string;
  relationshipToVictim?: string;
  consentAgreed: boolean;
  safetyAcknowledged: boolean;
}

export interface HomePageData {
  recentCases: Case[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCases: number;
    limit: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  timelineData: Array<{
    _id: number;
    months: Array<{
      name: string;
      month: number;
      cases: number;
    }>;
    totalCases: number;
  }>;
  mapData: {
    locations: Array<{
      lat: string;
      lng: string;
      locationName: string;
      caseCount: number;
      recentCases: Case[];
    }>;
    totalLocations: number;
  };
  statistics: {
    totalCases: number;
    uniqueLocations: number;
    verifiedCases: number;
    thirdPartyVerified: number;
    digitalForensicsVerified: number;
    pendingCases: number;
    verifiedStatusCases: number;
    verificationRate: string;
  };
  chartData: {
    casesByMonth: Array<{ _id: number; count: number; monthName: string }>;
    casesByStatus: Array<{ _id: string; count: number }>;
    casesByGender: Array<{ _id: string; count: number }>;
    casesByAgeGroup: Array<{ _id: string; count: number }>;
    topLocationsByCases: Array<{ _id: string; count: number }>;
  };
  recentActivity: {
    newCasesLast30Days: number;
    verifiedLast30Days: number;
  };
  lastUpdated: string;
  dataVersion: string;
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    // Add auth token if available
    const state = getState() as RootState;
    const token = state.auth.token;

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Case", "User", "Auth", "Contact"],
  endpoints: (builder) => ({
    // Auth endpoints
    register: builder.mutation<
      AuthResponse,
      {
        name: string;
        email: string;
        password: string;
        passwordConfirm: string;
      }
    >({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<
      AuthResponse,
      {
        email: string;
        password: string;
      }
    >({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    forgotPassword: builder.mutation<ApiResponse, { email: string }>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    verifyOTP: builder.mutation<ApiResponse, { email: string; otp: string }>({
      query: (data) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<
      AuthResponse,
      {
        email: string;
        password: string;
        passwordConfirm: string;
      }
    >({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),

    // Case endpoints
    getAllCases: builder.query<
      ApiResponse<{ cases: Case[] }>,
      {
        page?: number;
        limit?: number;
        sort?: string;
        filter?: string;
      }
    >({
      query: (params = {}) => ({
        url: "/cases",
        params,
      }),
      providesTags: ["Case"],
    }),

    getCaseById: builder.query<ApiResponse<{ case: Case }>, string>({
      query: (id) => `/cases/${id}`,
      providesTags: (result, error, id) => [{ type: "Case", id }],
    }),

    createCase: builder.mutation<ApiResponse<{ case: Case }>, FormData>({
      query: (formData) => ({
        url: "/cases",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Case"],
    }),

    getCasesLocations: builder.query<
      ApiResponse<{ locations: Array<{ lat: string; lng: string }> }>,
      void
    >({
      query: () => "/cases/locations",
      providesTags: ["Case"],
    }),

    getHomePageData: builder.query<
      ApiResponse<HomePageData>,
      {
        page?: number;
        limit?: number;
      }
    >({
      query: (params = {}) => ({
        url: "/cases/homepage",
        params,
      }),
      providesTags: ["Case"],
    }),

    // Contact endpoints
    createContact: builder.mutation<
      ApiResponse,
      {
        name: string;
        email: string;
        mobile_number: string;
        message: string;
        type?: string;
      }
    >({
      query: (contactData) => ({
        url: "/contacts",
        method: "POST",
        body: contactData,
      }),
      invalidatesTags: ["Contact"],
    }),

    searchContacts: builder.query<
      ApiResponse<{ contacts: unknown[] }>,
      {
        q?: string;
        type?: string;
        limit?: number;
      }
    >({
      query: (params) => ({
        url: "/contacts/search",
        params,
      }),
      providesTags: ["Contact"],
    }),

    // User endpoints (protected)
    getAllUsers: builder.query<ApiResponse<{ users: User[] }>, void>({
      query: () => "/users",
      providesTags: ["User"],
    }),

    addUser: builder.mutation<
      ApiResponse<{ user: User }>,
      {
        name: string;
        email: string;
        password: string;
        passwordConfirm: string;
      }
    >({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    addModerator: builder.mutation<
      ApiResponse<{ user: User }>,
      {
        firstName: string;
        lastName: string;
        email: string;
        secondaryEmail?: string;
        phone?: string;
        role: string;
        organization?: string;
        department?: string;
        specializations?: string[];
        languages?: string[];
        timeZone?: string;
        startDate?: string;
        securityClearance?: string;
        notes?: string;
        emergencyContact?: {
          name?: string;
          relationship?: string;
          phone?: string;
          email?: string;
        };
        password: string;
      }
    >({
      query: (moderatorData) => ({
        url: "/users/add-moderator",
        method: "POST",
        body: moderatorData,
      }),
      invalidatesTags: ["User"],
    }),

    // Case review endpoints (protected)
    getPendingCases: builder.query<ApiResponse<{ cases: Case[] }>, void>({
      query: () => "/cases/pending-cases",
      providesTags: ["Case"],
    }),

    getCasesUnderReview: builder.query<ApiResponse<{ cases: Case[] }>, void>({
      query: () => "/cases/cases-under-review",
      providesTags: ["Case"],
    }),

    getCasesForThirdPartyReview: builder.query<
      ApiResponse<{ cases: Case[] }>,
      void
    >({
      query: () => "/cases/third-party-review",
      providesTags: ["Case"],
    }),

    getCasesForDigitalForensicsReview: builder.query<
      ApiResponse<{ cases: Case[] }>,
      void
    >({
      query: () => "/cases/digital-forensics-review",
      providesTags: ["Case"],
    }),

    // Dashboard stats endpoint
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => "/cases/dashboard-stats",
      providesTags: ["Case", "User"],
    }),
  }),
});

export const {
  // Auth hooks
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,

  // Case hooks
  useGetAllCasesQuery,
  useGetCaseByIdQuery,
  useCreateCaseMutation,
  useGetCasesLocationsQuery,
  useGetHomePageDataQuery,

  // Contact hooks
  useCreateContactMutation,
  useSearchContactsQuery,

  // User hooks
  useGetAllUsersQuery,
  useAddUserMutation,
  useAddModeratorMutation,

  // Case review hooks
  useGetPendingCasesQuery,
  useGetCasesUnderReviewQuery,
  useGetCasesForThirdPartyReviewQuery,
  useGetCasesForDigitalForensicsReviewQuery,

  // Dashboard stats hook
  useGetDashboardStatsQuery,
} = apiSlice;
