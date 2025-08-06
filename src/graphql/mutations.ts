import { gql } from "@apollo/client";

export const mutations = gql`
  scalar Upload

  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    passwordChangedAt: String
  }

  type AuthResponse {
    status: String!
    token: String!
    data: AuthData!
  }

  type AuthData {
    user: User!
  }

  type MessageResponse {
    status: String!
    message: String!
  }

  type Case {
    _id: ID!
    name: String!
    age: Int!
    gender: String!
    occupation: String
    story: String
    leftBehind: [String]
    portraitPhoto: String
    additionalAttachments: [String]
    socialMediaLinks: [String]
    location: Location
    locationName: String
    causeOfDeath: String
    circumstances: String
    perpetrator: String
    evidenceDescription: String
    witness_information: String
    proofOfId: String
    proofOfDeath: String
    proofOfDeathGraphic: Boolean
    additionalEvidence: String
    additionalEvidenceGraphic: Boolean
    sourceOfInformation: String
    newsLinks: [String]
    notes: String
    date: String
    status: String!
    submittedBy: String!
    relationshipToVictim: String
    actionTaken: String
    isVerified: Boolean!
    isThirdPartyVerified: Boolean!
    isDigitalForensicsVerified: Boolean!
    consentAgreed: Boolean!
    safetyAcknowledged: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  input CaseInput {
    name: String!
    age: Int!
    gender: String!
    occupation: String
    story: String
    leftBehind: [String]
    socialMediaLinks: [String]
    location: LocationInput
    locationName: String
    causeOfDeath: String
    circumstances: String
    perpetrator: String
    evidenceDescription: String
    witness_information: String
    sourceOfInformation: String
    newsLinks: [String]
    notes: String
    date: String
    submittedBy: String!
    relationshipToVictim: String
    consentAgreed: Boolean!
    safetyAcknowledged: Boolean!
  }

  input LocationInput {
    lat: String
    lng: String
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    passwordConfirm: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input ForgotPasswordInput {
    email: String!
  }

  input VerifyOTPInput {
    email: String!
    otp: String!
  }

  input ResetPasswordInput {
    email: String!
    password: String!
    passwordConfirm: String!
  }

  type Location {
    lat: String
    lng: String
  }

  type Mutation {
    register(input: RegisterInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    forgotPassword(input: ForgotPasswordInput!): MessageResponse!
    verifyOTP(input: VerifyOTPInput!): MessageResponse!
    resetPassword(input: ResetPasswordInput!): AuthResponse!
    addUser(input: RegisterInput!): User
    createCase(
      caseData: CaseInput!
      portraitPhoto: Upload
      additionalPhotos: [Upload]
      proofOfId: Upload
      proofOfDeath: Upload
      additionalEvidence: Upload
    ): Case
  }
`;

// Specific mutation definitions for use with Apollo Client
export const REGISTER_USER = gql`
  mutation RegisterUser($input: RegisterInput!) {
    register(input: $input) {
      status
      token
      data {
        user {
          _id
          name
          email
          role
          passwordChangedAt
        }
      }
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginInput!) {
    login(input: $input) {
      status
      token
      data {
        user {
          _id
          name
          email
          role
          passwordChangedAt
        }
      }
    }
  }
`;

export const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordInput!) {
    forgotPassword(input: $input) {
      status
      message
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation VerifyOTP($input: VerifyOTPInput!) {
    verifyOTP(input: $input) {
      status
      message
    }
  }
`;

export const RESET_PASSWORD = gql`
  mutation ResetPassword($input: ResetPasswordInput!) {
    resetPassword(input: $input) {
      status
      token
      data {
        user {
          _id
          name
          email
          role
          passwordChangedAt
        }
      }
    }
  }
`;

export const ADD_USER = gql`
  mutation AddUser($input: RegisterInput!) {
    addUser(input: $input) {
      _id
      name
      email
      role
      passwordChangedAt
    }
  }
`;

export const CREATE_CASE = gql`
  mutation CreateCase(
    $caseData: CaseInput!
    $portraitPhoto: Upload
    $additionalPhotos: [Upload]
    $proofOfId: Upload
    $proofOfDeath: Upload
    $additionalEvidence: Upload
  ) {
    createCase(
      caseData: $caseData
      portraitPhoto: $portraitPhoto
      additionalPhotos: $additionalPhotos
      proofOfId: $proofOfId
      proofOfDeath: $proofOfDeath
      additionalEvidence: $additionalEvidence
    ) {
      _id
      name
      age
      gender
      occupation
      story
      leftBehind
      portraitPhoto
      additionalAttachments
      socialMediaLinks
      location {
        lat
        lng
      }
      locationName
      causeOfDeath
      circumstances
      perpetrator
      evidenceDescription
      witness_information
      proofOfId
      proofOfDeath
      proofOfDeathGraphic
      additionalEvidence
      additionalEvidenceGraphic
      sourceOfInformation
      newsLinks
      notes
      date
      status
      submittedBy
      relationshipToVictim
      actionTaken
      isVerified
      isThirdPartyVerified
      isDigitalForensicsVerified
      consentAgreed
      safetyAcknowledged
      createdAt
      updatedAt
    }
  }
`;
