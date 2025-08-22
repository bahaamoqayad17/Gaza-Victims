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
  passwordChangedAt?: string;
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
  submittedBy: string;
  relationshipToVictim?: string;
  actionTaken?: string;
  isVerified: boolean;
  isThirdPartyVerified: boolean;
  isDigitalForensicsVerified: boolean;
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

export interface Report {
  _id: string;
  name: string;
  email: string;
  contact_info?: string;
  message: string;
  case?: string;
  relation_to_victim?: string;
  report_type: string[];
  urgency: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportInput {
  name: string;
  email: string;
  contact_info?: string;
  message: string;
  caseId?: string;
  relation_to_victim?: string;
  report_type: string[];
  urgency: string;
  type: string[];
  captchaValue: string;
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
  tagTypes: ["Case", "User", "Auth", "Contact", "Report"],
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

    downloadCase: builder.mutation<Blob, { generated_id: string }>({
      query: (data) => ({
        url: `/cases/download`,
        method: "POST",
        body: data,
        responseHandler: async (response) => {
          return response.blob();
        },
      }),
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
      ApiResponse<{
        locations: Array<{
          lat: string;
          lng: string;
          locationName?: string;
          caseCount: number;
          recentCases: Array<{
            _id: string;
            name: string;
            date?: string;
            age: number;
            gender: string;
            status: string;
            isVerified: boolean;
          }>;
        }>;
        totalLocations: number;
        totalCasesWithLocation: number;
        lastUpdated: string;
      }>,
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

    // Report endpoints
    createReport: builder.mutation<
      ApiResponse<{ report: Report }>,
      ReportInput
    >({
      query: (reportData) => {
        const body: Record<string, unknown> = {
          name: reportData.name,
          email: reportData.email,
          message: reportData.message,
          report_type: reportData.report_type,
          urgency: reportData.urgency,
          type: reportData.type,
        };

        // Only include optional fields if they have values
        if (reportData.contact_info) {
          body.contact_info = reportData.contact_info;
        }
        if (reportData.caseId) {
          body.caseId = reportData.caseId;
        }
        if (reportData.relation_to_victim) {
          body.relation_to_victim = reportData.relation_to_victim;
        }

        return {
          url: "/reports",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["Report"],
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
  useDownloadCaseMutation,
  useCreateCaseMutation,
  useGetCasesLocationsQuery,
  useGetHomePageDataQuery,

  // Contact hooks
  useCreateContactMutation,
  useSearchContactsQuery,

  // User hooks
  useGetAllUsersQuery,
  useAddUserMutation,

  // Report hooks
  useCreateReportMutation,
} = apiSlice;
