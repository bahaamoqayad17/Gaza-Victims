import { gql } from "@apollo/client";

export const queries = gql`
  type User {
    _id: ID!
    name: String!
    email: String!
    role: String!
    passwordChangedAt: String
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

  type Location {
    lat: String
    lng: String
  }

  type Query {
    users: [User]
    cases: [Case]
    case(id: ID!): Case
    casesLocations: [Location]
  }
`;

// Specific query definitions for use with Apollo Client
export const GET_ALL_CASES = gql`
  query GetAllCases {
    cases {
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

export const GET_CASE_BY_ID = gql`
  query GetCaseById($id: ID!) {
    case(id: $id) {
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

export const GET_CASES_LOCATIONS = gql`
  query GetCasesLocations {
    casesLocations {
      lat
      lng
    }
  }
`;

export const GET_ALL_USERS = gql`
  query GetAllUsers {
    users {
      _id
      name
      email
      role
      passwordChangedAt
    }
  }
`;
