import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Upload: { input: any; output: any; }
};

export type AuthData = {
  __typename?: 'AuthData';
  user: User;
};

export type AuthResponse = {
  __typename?: 'AuthResponse';
  data: AuthData;
  status: Scalars['String']['output'];
  token: Scalars['String']['output'];
};

export type Case = {
  __typename?: 'Case';
  _id: Scalars['ID']['output'];
  actionTaken?: Maybe<Scalars['String']['output']>;
  additionalAttachments?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  additionalEvidence?: Maybe<Scalars['String']['output']>;
  additionalEvidenceGraphic?: Maybe<Scalars['Boolean']['output']>;
  age: Scalars['Int']['output'];
  causeOfDeath?: Maybe<Scalars['String']['output']>;
  circumstances?: Maybe<Scalars['String']['output']>;
  consentAgreed: Scalars['Boolean']['output'];
  createdAt: Scalars['String']['output'];
  date?: Maybe<Scalars['String']['output']>;
  evidenceDescription?: Maybe<Scalars['String']['output']>;
  gender: Scalars['String']['output'];
  isDigitalForensicsVerified: Scalars['Boolean']['output'];
  isThirdPartyVerified: Scalars['Boolean']['output'];
  isVerified: Scalars['Boolean']['output'];
  leftBehind?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  location?: Maybe<Location>;
  locationName?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  newsLinks?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  notes?: Maybe<Scalars['String']['output']>;
  occupation?: Maybe<Scalars['String']['output']>;
  perpetrator?: Maybe<Scalars['String']['output']>;
  portraitPhoto?: Maybe<Scalars['String']['output']>;
  proofOfDeath?: Maybe<Scalars['String']['output']>;
  proofOfDeathGraphic?: Maybe<Scalars['Boolean']['output']>;
  proofOfId?: Maybe<Scalars['String']['output']>;
  relationshipToVictim?: Maybe<Scalars['String']['output']>;
  safetyAcknowledged: Scalars['Boolean']['output'];
  socialMediaLinks?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  sourceOfInformation?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  story?: Maybe<Scalars['String']['output']>;
  submittedBy: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  witness_information?: Maybe<Scalars['String']['output']>;
};

export type CaseInput = {
  age: Scalars['Int']['input'];
  causeOfDeath?: InputMaybe<Scalars['String']['input']>;
  circumstances?: InputMaybe<Scalars['String']['input']>;
  consentAgreed: Scalars['Boolean']['input'];
  date?: InputMaybe<Scalars['String']['input']>;
  evidenceDescription?: InputMaybe<Scalars['String']['input']>;
  gender: Scalars['String']['input'];
  leftBehind?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  location?: InputMaybe<LocationInput>;
  locationName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  newsLinks?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  notes?: InputMaybe<Scalars['String']['input']>;
  occupation?: InputMaybe<Scalars['String']['input']>;
  perpetrator?: InputMaybe<Scalars['String']['input']>;
  relationshipToVictim?: InputMaybe<Scalars['String']['input']>;
  safetyAcknowledged: Scalars['Boolean']['input'];
  socialMediaLinks?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  sourceOfInformation?: InputMaybe<Scalars['String']['input']>;
  story?: InputMaybe<Scalars['String']['input']>;
  submittedBy: Scalars['String']['input'];
  witness_information?: InputMaybe<Scalars['String']['input']>;
};

export type ForgotPasswordInput = {
  email: Scalars['String']['input'];
};

export type Location = {
  __typename?: 'Location';
  lat?: Maybe<Scalars['String']['output']>;
  lng?: Maybe<Scalars['String']['output']>;
};

export type LocationInput = {
  lat?: InputMaybe<Scalars['String']['input']>;
  lng?: InputMaybe<Scalars['String']['input']>;
};

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  message: Scalars['String']['output'];
  status: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCase?: Maybe<Case>;
  createUser?: Maybe<User>;
  forgotPassword: MessageResponse;
  login: AuthResponse;
  register: AuthResponse;
  resetPassword: AuthResponse;
  verifyOTP: MessageResponse;
};


export type MutationCreateCaseArgs = {
  additionalEvidence?: InputMaybe<Scalars['Upload']['input']>;
  additionalPhotos?: InputMaybe<Array<InputMaybe<Scalars['Upload']['input']>>>;
  caseData: CaseInput;
  portraitPhoto?: InputMaybe<Scalars['Upload']['input']>;
  proofOfDeath?: InputMaybe<Scalars['Upload']['input']>;
  proofOfId?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationCreateUserArgs = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirm: Scalars['String']['input'];
};


export type MutationForgotPasswordArgs = {
  input: ForgotPasswordInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationResetPasswordArgs = {
  input: ResetPasswordInput;
};


export type MutationVerifyOtpArgs = {
  input: VerifyOtpInput;
};

export type Query = {
  __typename?: 'Query';
  case?: Maybe<Case>;
  cases?: Maybe<Array<Maybe<Case>>>;
  user?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryCaseArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['ID']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirm: Scalars['String']['input'];
};

export type ResetPasswordInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  passwordConfirm: Scalars['String']['input'];
};

export type User = {
  __typename?: 'User';
  _id: Scalars['ID']['output'];
  email: Scalars['String']['output'];
  name: Scalars['String']['output'];
  passwordChangedAt?: Maybe<Scalars['String']['output']>;
  role: Scalars['String']['output'];
};

export type VerifyOtpInput = {
  email: Scalars['String']['input'];
  otp: Scalars['String']['input'];
};

export type AdditionalEntityFields = {
  path?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthData: ResolverTypeWrapper<AuthData>;
  AuthResponse: ResolverTypeWrapper<AuthResponse>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Case: ResolverTypeWrapper<Case>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  CaseInput: CaseInput;
  ForgotPasswordInput: ForgotPasswordInput;
  Location: ResolverTypeWrapper<Location>;
  LocationInput: LocationInput;
  LoginInput: LoginInput;
  MessageResponse: ResolverTypeWrapper<MessageResponse>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RegisterInput: RegisterInput;
  ResetPasswordInput: ResetPasswordInput;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<User>;
  VerifyOTPInput: VerifyOtpInput;
  AdditionalEntityFields: AdditionalEntityFields;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthData: AuthData;
  AuthResponse: AuthResponse;
  String: Scalars['String']['output'];
  Case: Case;
  ID: Scalars['ID']['output'];
  Boolean: Scalars['Boolean']['output'];
  Int: Scalars['Int']['output'];
  CaseInput: CaseInput;
  ForgotPasswordInput: ForgotPasswordInput;
  Location: Location;
  LocationInput: LocationInput;
  LoginInput: LoginInput;
  MessageResponse: MessageResponse;
  Mutation: {};
  Query: {};
  RegisterInput: RegisterInput;
  ResetPasswordInput: ResetPasswordInput;
  Upload: Scalars['Upload']['output'];
  User: User;
  VerifyOTPInput: VerifyOtpInput;
  AdditionalEntityFields: AdditionalEntityFields;
};

export type UnionDirectiveArgs = {
  discriminatorField?: Maybe<Scalars['String']['input']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type UnionDirectiveResolver<Result, Parent, ContextType = any, Args = UnionDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AbstractEntityDirectiveArgs = {
  discriminatorField: Scalars['String']['input'];
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type AbstractEntityDirectiveResolver<Result, Parent, ContextType = any, Args = AbstractEntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EntityDirectiveArgs = {
  embedded?: Maybe<Scalars['Boolean']['input']>;
  additionalFields?: Maybe<Array<Maybe<AdditionalEntityFields>>>;
};

export type EntityDirectiveResolver<Result, Parent, ContextType = any, Args = EntityDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type ColumnDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']['input']>;
};

export type ColumnDirectiveResolver<Result, Parent, ContextType = any, Args = ColumnDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type IdDirectiveArgs = { };

export type IdDirectiveResolver<Result, Parent, ContextType = any, Args = IdDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type LinkDirectiveArgs = {
  overrideType?: Maybe<Scalars['String']['input']>;
};

export type LinkDirectiveResolver<Result, Parent, ContextType = any, Args = LinkDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type EmbeddedDirectiveArgs = { };

export type EmbeddedDirectiveResolver<Result, Parent, ContextType = any, Args = EmbeddedDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type MapDirectiveArgs = {
  path: Scalars['String']['input'];
};

export type MapDirectiveResolver<Result, Parent, ContextType = any, Args = MapDirectiveArgs> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AuthDataResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthData'] = ResolversParentTypes['AuthData']> = {
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthResponse'] = ResolversParentTypes['AuthResponse']> = {
  data?: Resolver<ResolversTypes['AuthData'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  token?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CaseResolvers<ContextType = any, ParentType extends ResolversParentTypes['Case'] = ResolversParentTypes['Case']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  actionTaken?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  additionalAttachments?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  additionalEvidence?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  additionalEvidenceGraphic?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  age?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  causeOfDeath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  circumstances?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  consentAgreed?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  date?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  evidenceDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  gender?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isDigitalForensicsVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isThirdPartyVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  isVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  leftBehind?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  location?: Resolver<Maybe<ResolversTypes['Location']>, ParentType, ContextType>;
  locationName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  newsLinks?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  occupation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  perpetrator?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  portraitPhoto?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proofOfDeath?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  proofOfDeathGraphic?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType>;
  proofOfId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  relationshipToVictim?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  safetyAcknowledged?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  socialMediaLinks?: Resolver<Maybe<Array<Maybe<ResolversTypes['String']>>>, ParentType, ContextType>;
  sourceOfInformation?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  story?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  submittedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  witness_information?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type LocationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Location'] = ResolversParentTypes['Location']> = {
  lat?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lng?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MessageResponseResolvers<ContextType = any, ParentType extends ResolversParentTypes['MessageResponse'] = ResolversParentTypes['MessageResponse']> = {
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createCase?: Resolver<Maybe<ResolversTypes['Case']>, ParentType, ContextType, RequireFields<MutationCreateCaseArgs, 'caseData'>>;
  createUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'email' | 'name' | 'password' | 'passwordConfirm'>>;
  forgotPassword?: Resolver<ResolversTypes['MessageResponse'], ParentType, ContextType, RequireFields<MutationForgotPasswordArgs, 'input'>>;
  login?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationLoginArgs, 'input'>>;
  register?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationRegisterArgs, 'input'>>;
  resetPassword?: Resolver<ResolversTypes['AuthResponse'], ParentType, ContextType, RequireFields<MutationResetPasswordArgs, 'input'>>;
  verifyOTP?: Resolver<ResolversTypes['MessageResponse'], ParentType, ContextType, RequireFields<MutationVerifyOtpArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  case?: Resolver<Maybe<ResolversTypes['Case']>, ParentType, ContextType, RequireFields<QueryCaseArgs, 'id'>>;
  cases?: Resolver<Maybe<Array<Maybe<ResolversTypes['Case']>>>, ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Maybe<Array<Maybe<ResolversTypes['User']>>>, ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  _id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  passwordChangedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  role?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthData?: AuthDataResolvers<ContextType>;
  AuthResponse?: AuthResponseResolvers<ContextType>;
  Case?: CaseResolvers<ContextType>;
  Location?: LocationResolvers<ContextType>;
  MessageResponse?: MessageResponseResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

export type DirectiveResolvers<ContextType = any> = {
  union?: UnionDirectiveResolver<any, any, ContextType>;
  abstractEntity?: AbstractEntityDirectiveResolver<any, any, ContextType>;
  entity?: EntityDirectiveResolver<any, any, ContextType>;
  column?: ColumnDirectiveResolver<any, any, ContextType>;
  id?: IdDirectiveResolver<any, any, ContextType>;
  link?: LinkDirectiveResolver<any, any, ContextType>;
  embedded?: EmbeddedDirectiveResolver<any, any, ContextType>;
  map?: MapDirectiveResolver<any, any, ContextType>;
};

import { ObjectId } from 'mongodb';