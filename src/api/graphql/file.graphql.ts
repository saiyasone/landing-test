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
        filename
        newFilename
        filePassword
        passwordUrlAll
        fileType
        size
        newPath
        totalDownload
        status
        isPublic
        checkFile
        path
        detail
        urlAll
        url
        permissionSharePublic
        aproveDownloadPublic
        ip
        folder_id {
          _id
          path
          folder_name
        }
        shortUrl
        favorite
        actionStatus
        expired
        createdAt
        updatedAt
        actionDate
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
