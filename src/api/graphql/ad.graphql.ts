import { gql } from "@apollo/client";

export const QUERY_SEO = gql`
  query Data($where: SEOWhereInput) {
    getPublicSEO(where: $where) {
      data {
        _id
        title
        description
        keywords
        pageId {
          _id
        }
      }
    }
  }
`;

export const CREATE_DETAIL_ADVERTISEMENT = gql`
  mutation CreateDetailadvertisements($data: DetailadvertisementsInput!) {
    createDetailadvertisements(data: $data) {
      _id
    }
  }
`;

export const QUERY_ADVERTISEMENT = gql`
  query Data($where: AdvertisementWhereInput) {
    getAdvertisement(where: $where) {
      data {
        _id
        url
        amountClick
      }
    }
  }
`;

export const QUERY_GENERAL_BUTTON_DOWNLOAD = gql`
  query Data($where: General_settingsWhereInput) {
    general_settings(where: $where) {
      data {
        action
      }
    }
  }
`;

export const QUERY_MANAGE_LINK_DETAIL = gql`
  query GetManageLinkDetails($where: ManageLinkWhereInput) {
    getManageLinkDetails(where: $where) {
      data {
        _id
        fileId
        folderId
        type
      }
      total
    }
  }
`;
