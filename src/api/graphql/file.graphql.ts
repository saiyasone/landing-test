import { gql } from "@apollo/client";

export const CREATE_FILE_PUBLIC = gql`
  mutation CreateFilesPublic($data: FilesInput!) {
    createFilesPublic(data: $data) {
      _id
      urlAll
      newFilename
    }
  }
`;

export const CREATE_FILE_PUBLIC_DROP = gql`
  mutation CreatePublicFileDrop($data: CreatePublicFileDropInput!) {
    createPublicFileDrop(data: $data) {
      _id
      urlAll
      newFilename
    }
  }
`;

export const QUERY_FILE_PUBLIC = gql`
  query FilesPublic(
    $where: FilesWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    filesPublic(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        filePassword
        filename
        newFilename
        passwordUrlAll
        expired
        size
        path
        newPath
        url
        urlAll
        status
      }
    }
  }
`;

export const QUERY_FILE_PUBLIC_LINK = gql`
  query QueryFileGetLinks($where: FilesWhereInput) {
    queryFileGetLinks(where: $where) {
      data {
        _id
        filename
        filePassword
        newFilename
        passwordUrlAll
        checkFile
        expired
        size
        status
        path
        newPath
        url
        urlAll
        createdBy {
          _id
          newName
        }
      }
      total
    }
  }
`;
