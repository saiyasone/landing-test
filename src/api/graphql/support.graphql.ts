import { gql } from "@apollo/client";

export const MUTATION_FEEDBACK = gql`
  mutation CreateFeedback($input: FeedbackInput!) {
    createFeedback(input: $input) {
      _id
    }
  }
`;

export const MUTATION_CONTACT = gql`
  mutation CreateContact($body: ContactInput!) {
    createContact(body: $body) {
      _id
    }
  }
`;

export const QUERY_ALL_FAQ = gql`
  query Data($where: FaqWhereInput) {
    faqs(where: $where) {
      total
      data {
        _id
        answer
        createdAt
        createdBy {
          email
          _id
        }
        display
        question
        updatedAt
        updatedBy {
          _id
          email
        }
      }
    }
  }
`;

export const QUERY_ALL_MAIN_FEATURES = gql`
  query Query($where: FeaturesWhereInput, $limit: Int) {
    features(where: $where, limit: $limit) {
      total
      data {
        Content1
        image
        title
      }
    }
  }
`;

export const QUERY_ALL_SUB_FEATURES = gql`
  query Query($where: FeaturesWhereInput, $limit: Int) {
    features(where: $where, limit: $limit) {
      total
      data {
        Content1
        image
        title
      }
    }
  }
`;

export const QUERY_ANNOUNCEMENTS = gql`
  query Data(
    $where: AnnouncementWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
  ) {
    getAnnouncements(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
    ) {
      total
      data {
        _id
        createdAt
        createdBy {
          _id
          email
        }
        image
        status
        title
        updatedAt
        notificationTo
        startDate
        content
        endDate
        notificationStatus
      }
    }
  }
`;
