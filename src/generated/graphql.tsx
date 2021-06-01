import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `DateTime` scalar represents a date and time following the ISO 8601 standard */
  DateTime: any;
};

export type Article = Document & {
  __typename?: 'Article';
  id: Scalars['ID'];
  type?: Maybe<DocumentType>;
  title?: Maybe<Scalars['String']>;
  pageStart?: Maybe<Scalars['String']>;
  pageEnd?: Maybe<Scalars['String']>;
  abstract?: Maybe<Scalars['String']>;
  author?: Maybe<Entity>;
  keywords?: Maybe<Array<Maybe<Scalars['String']>>>;
  journal?: Maybe<Journal>;
};

export type AutomaticKeywordGroup = Group & {
  __typename?: 'AutomaticKeywordGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  children: Array<Group>;
  parent?: Maybe<Group>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  documents: Array<Document>;
  field: Scalars['String'];
  keywordDelimiter: Scalars['String'];
  keywordHierarchicalDelimiter: Scalars['String'];
};

export type AutomaticKeywordGroupDetails = {
  field: Scalars['String'];
  keywordDelimiter: Scalars['String'];
  keywordHierarchicalDelimiter: Scalars['String'];
};

export type AutomaticPersonsGroup = Group & {
  __typename?: 'AutomaticPersonsGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  children: Array<Group>;
  parent?: Maybe<Group>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  documents: Array<Document>;
  field: Scalars['String'];
};

export type AutomaticPersonsGroupDetails = {
  field: Scalars['String'];
};


export type Document = {
  id: Scalars['ID'];
  type?: Maybe<DocumentType>;
  title?: Maybe<Scalars['String']>;
};

export type DocumentRaw = {
  __typename?: 'DocumentRaw';
  id: Scalars['ID'];
  type: Scalars['String'];
  citationKey?: Maybe<Scalars['String']>;
  lastModified?: Maybe<Scalars['DateTime']>;
  added?: Maybe<Scalars['DateTime']>;
  fields: Array<FieldValueTuple>;
};

export type DocumentRawInput = {
  type: Scalars['String'];
  citationKey?: Maybe<Scalars['String']>;
  lastModified?: Maybe<Scalars['DateTime']>;
  added?: Maybe<Scalars['DateTime']>;
  fields?: Maybe<Array<FieldValueTupleInput>>;
};

export type DocumentRawUpdateInput = {
  id: Scalars['ID'];
  type?: Maybe<Scalars['String']>;
  citationKey?: Maybe<Scalars['String']>;
  lastModified?: Maybe<Scalars['DateTime']>;
  added?: Maybe<Scalars['DateTime']>;
  fields?: Maybe<Array<FieldValueTupleInput>>;
};

export enum DocumentType {
  Article = 'ARTICLE'
}

export type Entity = Person | Organization;

export type ExplicitGroup = Group & {
  __typename?: 'ExplicitGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  children: Array<Group>;
  parent?: Maybe<Group>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  documents: Array<Document>;
  keywordDelimiter: Scalars['String'];
};

export type ExplicitGroupDetails = {
  keywordDelimiter: Scalars['String'];
  documentIds: Array<Scalars['ID']>;
};

export type FieldValueTuple = {
  __typename?: 'FieldValueTuple';
  field: Scalars['String'];
  value: Scalars['String'];
};

export type FieldValueTupleInput = {
  field: Scalars['String'];
  value: Scalars['String'];
};

export type Group = {
  id: Scalars['ID'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  children: Array<Group>;
  parent?: Maybe<Group>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  documents: Array<Document>;
};

export enum GroupHierarchyType {
  /** The group's content is independent of its hierarchical position. */
  Independent = 'INDEPENDENT',
  /** The group's content is the intersection of its own content with its supergroups' content. */
  Intersection = 'INTERSECTION',
  /** The group's content is the union of its own content with its subgroups' content. */
  Union = 'UNION'
}

export type GroupInput = {
  name: Scalars['String'];
  displayName?: Maybe<Scalars['String']>;
  children: Array<GroupInput>;
  parentId?: Maybe<Scalars['ID']>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  automaticKeywordGroup?: Maybe<AutomaticKeywordGroupDetails>;
  automaticPersonsGroup?: Maybe<AutomaticPersonsGroupDetails>;
  explicitGroup?: Maybe<ExplicitGroupDetails>;
  lastNameGroup?: Maybe<LastNameGroupDetails>;
  wordKeywordGroup?: Maybe<WordKeywordGroupDetails>;
  regexKeywordGroup?: Maybe<RegexKeywordGroupDetails>;
  searchGroup?: Maybe<SearchGroupDetails>;
  texGroup?: Maybe<TexGroupDetails>;
};

export type GroupUpdate = {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  children: Array<GroupUpdate>;
  parentId?: Maybe<Scalars['ID']>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  automaticKeywordGroup?: Maybe<AutomaticKeywordGroupDetails>;
  automaticPersonsGroup?: Maybe<AutomaticPersonsGroupDetails>;
  explicitGroup?: Maybe<ExplicitGroupDetails>;
  lastNameGroup?: Maybe<LastNameGroupDetails>;
  wordKeywordGroup?: Maybe<WordKeywordGroupDetails>;
  regexKeywordGroup?: Maybe<RegexKeywordGroupDetails>;
  searchGroup?: Maybe<SearchGroupDetails>;
  texGroup?: Maybe<TexGroupDetails>;
};

export type Journal = {
  __typename?: 'Journal';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type LastNameGroup = Group & {
  __typename?: 'LastNameGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  children: Array<Group>;
  parent?: Maybe<Group>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  documents: Array<Document>;
  field: Scalars['String'];
  authorLastName: Scalars['String'];
};

export type LastNameGroupDetails = {
  field: Scalars['String'];
  authorLastName: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUserDocumentRaw?: Maybe<DocumentRaw>;
  updateUserDocumentRaw?: Maybe<DocumentRaw>;
  createGroup?: Maybe<Group>;
  updateGroup?: Maybe<Group>;
  _empty?: Maybe<Scalars['String']>;
  logout?: Maybe<Scalars['Boolean']>;
  login?: Maybe<User>;
  signup?: Maybe<User>;
};


export type MutationAddUserDocumentRawArgs = {
  document: DocumentRawInput;
};


export type MutationUpdateUserDocumentRawArgs = {
  document: DocumentRawUpdateInput;
};


export type MutationCreateGroupArgs = {
  group: GroupInput;
};


export type MutationUpdateGroupArgs = {
  group: GroupUpdate;
};


export type MutationLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationSignupArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Organization = {
  __typename?: 'Organization';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Person = {
  __typename?: 'Person';
  id: Scalars['ID'];
  name: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  getUserDocumentRaw?: Maybe<DocumentRaw>;
  /** Get the group by id. */
  group?: Maybe<Group>;
  _empty?: Maybe<Scalars['String']>;
  /** Get user by id. */
  user?: Maybe<User>;
  /** Get the current user. */
  me?: Maybe<User>;
};


export type QueryGetUserDocumentRawArgs = {
  id: Scalars['ID'];
};


export type QueryGroupArgs = {
  id: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};

export type RegexKeywordGroup = Group & {
  __typename?: 'RegexKeywordGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  children: Array<Group>;
  parent?: Maybe<Group>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  documents: Array<Document>;
  field: Scalars['String'];
  searchExpression: Scalars['String'];
  caseSensitive: Scalars['Boolean'];
};

export type RegexKeywordGroupDetails = {
  field: Scalars['String'];
  searchExpression: Scalars['String'];
  caseSensitive: Scalars['Boolean'];
};

export type SearchGroup = Group & {
  __typename?: 'SearchGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  children: Array<Group>;
  parent?: Maybe<Group>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  documents: Array<Document>;
  searchExpression: Scalars['String'];
  caseSensitive: Scalars['Boolean'];
  isRegEx: Scalars['Boolean'];
};

export type SearchGroupDetails = {
  searchExpression: Scalars['String'];
  caseSensitive: Scalars['Boolean'];
  isRegEx: Scalars['Boolean'];
};

export type TexGroup = Group & {
  __typename?: 'TexGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  children: Array<Group>;
  parent?: Maybe<Group>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  documents: Array<Document>;
  paths: Array<TexGroupDevicePathPair>;
};

export type TexGroupDetails = {
  paths: Array<TexGroupDevicePathPairInput>;
};

export type TexGroupDevicePathPair = {
  __typename?: 'TexGroupDevicePathPair';
  deviceName: Scalars['String'];
  filePath: Scalars['String'];
};

export type TexGroupDevicePathPairInput = {
  deviceName: Scalars['String'];
  filePath: Scalars['String'];
};

export type Unknown = Document & {
  __typename?: 'Unknown';
  id: Scalars['ID'];
  type?: Maybe<DocumentType>;
  title?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  id: Scalars['ID'];
  email: Scalars['String'];
  documentsRaw: Array<DocumentRaw>;
  documents: Array<Document>;
  groups: Array<Group>;
};

export type WordKeywordGroup = Group & {
  __typename?: 'WordKeywordGroup';
  id: Scalars['ID'];
  name: Scalars['String'];
  displayName: Scalars['String'];
  children: Array<Group>;
  parent?: Maybe<Group>;
  hierarchyType?: Maybe<GroupHierarchyType>;
  color?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  isExpanded?: Maybe<Scalars['Boolean']>;
  documents: Array<Document>;
  field: Scalars['String'];
  searchExpression: Scalars['String'];
  caseSensitive: Scalars['Boolean'];
  keywordDelimiter: Scalars['String'];
  onlySplitWordsAtDelimiter: Scalars['Boolean'];
};

export type WordKeywordGroupDetails = {
  field: Scalars['String'];
  searchExpression: Scalars['String'];
  caseSensitive: Scalars['Boolean'];
  keywordDelimiter: Scalars['String'];
  onlySplitWordsAtDelimiter: Scalars['Boolean'];
};

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'email' | 'id'>
  )> }
);


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    email
    id
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;