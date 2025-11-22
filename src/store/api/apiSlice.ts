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

export interface Report {
  _id: string;
  name: string;
  email: string;
  contact_info?: string;
  message: string;
  case?: string | Case;
  relation_to_victim?: string;
  report_type: string[];
  urgency: string;
  type?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Contact {
  _id: string;
  name: string;
  email: string;
  mobile_number: string;
  message: string;
  type?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteRequest {
  _id: string;
  reason: string;
  email?: string;
  caseId: string;
  status?: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Information {
  _id: string;
  note: string;
  files: string[];
  caseId: string;
  status: string;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Case {
  _id: string;
  generated_id: string;
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
  tagTypes: ["Case", "User", "Auth", "Contact", "Report", "DeleteRequest"],
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

    updateCaseImage: builder.mutation<
      ApiResponse<{ case: Case }>,
      { caseId: string; imageType: "proofOfId" | "proofOfDeath"; file: File }
    >({
      query: ({ caseId, imageType, file }) => {
        const formData = new FormData();
        formData.append("caseId", caseId);
        formData.append("imageType", imageType);
        formData.append(imageType, file);

        return {
          url: `/cases/update-image/${caseId}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (result, error, { caseId }) => [
        { type: "Case", id: caseId },
        "Case",
      ],
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

    // User management endpoints
    deleteUser: builder.mutation<ApiResponse<{ user: User }>, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "DELETE",
      }),
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        // Optimistic update - remove user from list
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getAllUsers", undefined, (draft) => {
            if (draft.data?.users) {
              draft.data.users = draft.data.users.filter(
                (user) => user._id !== userId
              );
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      invalidatesTags: ["User"],
    }),

    deactivateUser: builder.mutation<ApiResponse<{ user: User }>, string>({
      query: (userId) => ({
        url: `/users/deactivate/${userId}`,
        method: "PATCH",
      }),
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        // Optimistic update - set user as inactive
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getAllUsers", undefined, (draft) => {
            const userIndex = draft.data?.users?.findIndex(
              (user) => user._id === userId
            );
            if (
              userIndex !== undefined &&
              userIndex >= 0 &&
              draft.data?.users
            ) {
              draft.data.users[userIndex].isActive = false;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      invalidatesTags: ["User"],
    }),

    activateUser: builder.mutation<ApiResponse<{ user: User }>, string>({
      query: (userId) => ({
        url: `/users/activate/${userId}`,
        method: "PATCH",
      }),
      async onQueryStarted(userId, { dispatch, queryFulfilled }) {
        // Optimistic update - set user as active
        const patchResult = dispatch(
          apiSlice.util.updateQueryData("getAllUsers", undefined, (draft) => {
            const userIndex = draft.data?.users?.findIndex(
              (user) => user._id === userId
            );
            if (
              userIndex !== undefined &&
              userIndex >= 0 &&
              draft.data?.users
            ) {
              draft.data.users[userIndex].isActive = true;
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic update on error
          patchResult.undo();
        }
      },
      invalidatesTags: ["User"],
    }),

    // Change password endpoint (for current user)
    changePassword: builder.mutation<
      ApiResponse<{ user: User }>,
      {
        currentPassword: string;
        newPassword: string;
        confirmPassword: string;
      }
    >({
      query: ({ currentPassword, newPassword, confirmPassword }) => ({
        url: "/users/change-password",
        method: "PATCH",
        body: { currentPassword, newPassword, confirmPassword },
      }),
      invalidatesTags: ["User"],
    }),

    // Get user records endpoint
    getUserRecords: builder.query<ApiResponse<{ cases: Case[] }>, string>({
      query: (userId) => `/users/user-records/${userId}`,
      providesTags: (result, error, userId) => [{ type: "Case", id: userId }],
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

    getVerifiedCases: builder.query<ApiResponse<{ cases: Case[] }>, void>({
      query: () => "/cases/verified-cases",
      providesTags: ["Case"],
    }),

    // Dashboard stats endpoint
    getDashboardStats: builder.query<ApiResponse<DashboardStats>, void>({
      query: () => "/cases/dashboard-stats",
      providesTags: ["Case", "User"],
    }),

    // Case assignment endpoint
    assignCase: builder.mutation<
      ApiResponse<{ case: Case }>,
      { caseId: string; assignedTo: string }
    >({
      query: ({ caseId, assignedTo }) => ({
        url: `/cases/assign-case/${caseId}`,
        method: "POST",
        body: { assignedTo },
      }),
      async onQueryStarted(
        { caseId, assignedTo },
        { dispatch, queryFulfilled, getState }
      ) {
        // Get user info for optimistic update
        const state = getState() as RootState;
        const usersResult = apiSlice.endpoints.getAllUsers.select()(state);
        const assignedUser = usersResult.data?.data?.users?.find(
          (user) => user._id === assignedTo
        );

        // Optimistic updates for all case lists
        const patchResults: { undo: () => void }[] = [];

        // Update pending cases
        const pendingPatch = dispatch(
          apiSlice.util.updateQueryData(
            "getPendingCases",
            undefined,
            (draft) => {
              const caseIndex = draft.data?.cases?.findIndex(
                (c) => c._id === caseId
              );
              if (
                caseIndex !== undefined &&
                caseIndex >= 0 &&
                draft.data?.cases
              ) {
                const case_ = draft.data.cases[caseIndex];
                if (assignedUser?.role === "moderator") {
                  case_.status = "under_review";
                  case_.userModeratorVerified = assignedUser;
                } else if (assignedUser?.role === "third_party_moderator") {
                  case_.status = "third_party_review";
                  case_.userThirdPartyVerified = assignedUser;
                } else if (
                  assignedUser?.role === "digital_forensics_moderator"
                ) {
                  case_.status = "digital_forensics_review";
                  case_.userDigitalForensicsVerified = assignedUser;
                }
              }
            }
          )
        );
        patchResults.push(pendingPatch);

        // Update cases under review
        const underReviewPatch = dispatch(
          apiSlice.util.updateQueryData(
            "getCasesUnderReview",
            undefined,
            (draft) => {
              const caseIndex = draft.data?.cases?.findIndex(
                (c) => c._id === caseId
              );
              if (
                caseIndex !== undefined &&
                caseIndex >= 0 &&
                draft.data?.cases
              ) {
                const case_ = draft.data.cases[caseIndex];
                if (assignedUser?.role === "moderator") {
                  case_.userModeratorVerified = assignedUser;
                }
              }
            }
          )
        );
        patchResults.push(underReviewPatch);

        // Update third party review cases
        const thirdPartyPatch = dispatch(
          apiSlice.util.updateQueryData(
            "getCasesForThirdPartyReview",
            undefined,
            (draft) => {
              const caseIndex = draft.data?.cases?.findIndex(
                (c) => c._id === caseId
              );
              if (
                caseIndex !== undefined &&
                caseIndex >= 0 &&
                draft.data?.cases
              ) {
                const case_ = draft.data.cases[caseIndex];
                if (assignedUser?.role === "third_party_moderator") {
                  case_.userThirdPartyVerified = assignedUser;
                }
              }
            }
          )
        );
        patchResults.push(thirdPartyPatch);

        // Update digital forensics review cases
        const digitalForensicsPatch = dispatch(
          apiSlice.util.updateQueryData(
            "getCasesForDigitalForensicsReview",
            undefined,
            (draft) => {
              const caseIndex = draft.data?.cases?.findIndex(
                (c) => c._id === caseId
              );
              if (
                caseIndex !== undefined &&
                caseIndex >= 0 &&
                draft.data?.cases
              ) {
                const case_ = draft.data.cases[caseIndex];
                if (assignedUser?.role === "digital_forensics_moderator") {
                  case_.userDigitalForensicsVerified = assignedUser;
                }
              }
            }
          )
        );
        patchResults.push(digitalForensicsPatch);

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic updates on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: ["Case"],
    }),

    // Case verification endpoint
    verifyCase: builder.mutation<ApiResponse<{ case: Case }>, string>({
      query: (caseId) => ({
        url: `/cases/verify/${caseId}`,
        method: "PATCH",
      }),
      async onQueryStarted(caseId, { dispatch, queryFulfilled, getState }) {
        // Get current user info for optimistic update
        const state = getState() as RootState;
        const currentUser = state.auth.user;

        // Optimistic updates for all case lists
        const patchResults: { undo: () => void }[] = [];

        if (currentUser?.role === "moderator") {
          // Update cases under review - remove from list as it moves to third party review
          const underReviewPatch = dispatch(
            apiSlice.util.updateQueryData(
              "getCasesUnderReview",
              undefined,
              (draft) => {
                if (draft.data?.cases) {
                  draft.data.cases = draft.data.cases.filter(
                    (c) => c._id !== caseId
                  );
                }
              }
            )
          );
          patchResults.push(underReviewPatch);

          // Update third party review cases - add to list
          const thirdPartyPatch = dispatch(
            apiSlice.util.updateQueryData(
              "getCasesForThirdPartyReview",
              undefined,
              (draft) => {
                const caseIndex = draft.data?.cases?.findIndex(
                  (c) => c._id === caseId
                );
                if (
                  caseIndex !== undefined &&
                  caseIndex >= 0 &&
                  draft.data?.cases
                ) {
                  const case_ = draft.data.cases[caseIndex];
                  case_.isVerified = true;
                  case_.status = "under_third_party_review";
                  case_.userModeratorVerified = currentUser;
                }
              }
            )
          );
          patchResults.push(thirdPartyPatch);
        } else if (currentUser?.role === "third_party_moderator") {
          // Update third party review cases - remove from list
          const thirdPartyPatch = dispatch(
            apiSlice.util.updateQueryData(
              "getCasesForThirdPartyReview",
              undefined,
              (draft) => {
                if (draft.data?.cases) {
                  draft.data.cases = draft.data.cases.filter(
                    (c) => c._id !== caseId
                  );
                }
              }
            )
          );
          patchResults.push(thirdPartyPatch);

          // Update digital forensics review cases - add to list
          const digitalForensicsPatch = dispatch(
            apiSlice.util.updateQueryData(
              "getCasesForDigitalForensicsReview",
              undefined,
              (draft) => {
                const caseIndex = draft.data?.cases?.findIndex(
                  (c) => c._id === caseId
                );
                if (
                  caseIndex !== undefined &&
                  caseIndex >= 0 &&
                  draft.data?.cases
                ) {
                  const case_ = draft.data.cases[caseIndex];
                  case_.isThirdPartyVerified = true;
                  case_.status = "under_digital_forensics_review";
                  case_.userThirdPartyVerified = currentUser;
                }
              }
            )
          );
          patchResults.push(digitalForensicsPatch);
        } else if (currentUser?.role === "digital_forensics_moderator") {
          // Update digital forensics review cases - remove from list
          const digitalForensicsPatch = dispatch(
            apiSlice.util.updateQueryData(
              "getCasesForDigitalForensicsReview",
              undefined,
              (draft) => {
                if (draft.data?.cases) {
                  draft.data.cases = draft.data.cases.filter(
                    (c) => c._id !== caseId
                  );
                }
              }
            )
          );
          patchResults.push(digitalForensicsPatch);

          // Update verified cases - add to list
          const verifiedPatch = dispatch(
            apiSlice.util.updateQueryData(
              "getVerifiedCases",
              undefined,
              (draft) => {
                const caseIndex = draft.data?.cases?.findIndex(
                  (c) => c._id === caseId
                );
                if (
                  caseIndex !== undefined &&
                  caseIndex >= 0 &&
                  draft.data?.cases
                ) {
                  const case_ = draft.data.cases[caseIndex];
                  case_.isDigitalForensicsVerified = true;
                  case_.status = "verified";
                  case_.userDigitalForensicsVerified = currentUser;
                }
              }
            )
          );
          patchResults.push(verifiedPatch);
        }

        try {
          await queryFulfilled;
        } catch {
          // Revert optimistic updates on error
          patchResults.forEach((patch) => patch.undo());
        }
      },
      invalidatesTags: ["Case"],
    }),

    // Reports endpoints
    getReports: builder.query<ApiResponse<{ reports: Report[] }>, void>({
      query: () => "/reports",
      providesTags: ["Report"],
    }),

    // Contacts endpoints
    getContacts: builder.query<ApiResponse<{ contacts: Contact[] }>, void>({
      query: () => "/contacts",
      providesTags: ["Contact"],
    }),

    // Delete Request endpoints
    getDeleteRequests: builder.query<
      ApiResponse<{ deleteRequests: DeleteRequest[] }>,
      void
    >({
      query: () => "/delete-requests",
      providesTags: ["DeleteRequest"],
    }),
    updateDeleteRequestStatus: builder.mutation<
      ApiResponse<{ deleteRequest: DeleteRequest }>,
      { id: string; status: string; adminNotes?: string }
    >({
      query: ({ id, status, adminNotes }) => ({
        url: `/delete-requests/${id}/status`,
        method: "PATCH",
        body: { status, adminNotes },
      }),
      invalidatesTags: ["DeleteRequest"],
    }),
    deleteDeleteRequest: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/delete-requests/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["DeleteRequest"],
    }),

    // Information endpoints
    getAllInformation: builder.query<
      ApiResponse<{ information: Information[] }>,
      void
    >({
      query: () => "/information",
      providesTags: ["Information"],
    }),
    updateInformationStatus: builder.mutation<
      ApiResponse<{ information: Information }>,
      { id: string; status: string; adminNotes?: string }
    >({
      query: ({ id, status, adminNotes }) => ({
        url: `/information/${id}/status`,
        method: "PATCH",
        body: { status, adminNotes },
      }),
      invalidatesTags: ["Information"],
    }),
    deleteInformation: builder.mutation<ApiResponse<void>, string>({
      query: (id) => ({
        url: `/information/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Information"],
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

  // Delete Request hooks
  useGetDeleteRequestsQuery,
  useUpdateDeleteRequestStatusMutation,
  useDeleteDeleteRequestMutation,

  // Information hooks
  useGetAllInformationQuery,
  useUpdateInformationStatusMutation,
  useDeleteInformationMutation,

  // User hooks
  useGetAllUsersQuery,
  useAddUserMutation,
  useAddModeratorMutation,

  // User management hooks
  useDeleteUserMutation,
  useDeactivateUserMutation,
  useActivateUserMutation,
  useChangePasswordMutation,
  useGetUserRecordsQuery,

  // Case review hooks
  useGetPendingCasesQuery,
  useGetCasesUnderReviewQuery,
  useGetCasesForThirdPartyReviewQuery,
  useGetCasesForDigitalForensicsReviewQuery,
  useGetVerifiedCasesQuery,

  // Dashboard stats hook
  useGetDashboardStatsQuery,

  // Case assignment hook
  useAssignCaseMutation,

  // Case verification hook
  useVerifyCaseMutation,

  // Case image update hook
  useUpdateCaseImageMutation,

  // Reports hooks
  useGetReportsQuery,

  // Contacts hooks
  useGetContactsQuery,
} = apiSlice;
