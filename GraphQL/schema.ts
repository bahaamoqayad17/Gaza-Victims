import { gql } from "apollo-server-express";

export const typeDefs = gql`
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

  type Query {
    users: [User]
    user(id: ID!): User
    cases: [Case]
    case(id: ID!): Case
    casesLocations: [Location]
  }

  type Mutation {
    register(input: RegisterInput!): AuthResponse!
    login(input: LoginInput!): AuthResponse!
    forgotPassword(input: ForgotPasswordInput!): MessageResponse!
    verifyOTP(input: VerifyOTPInput!): MessageResponse!
    resetPassword(input: ResetPasswordInput!): AuthResponse!
    createUser(
      name: String!
      email: String!
      password: String!
      passwordConfirm: String!
    ): User
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
