import { gql } from "@apollo/client";

export const QUERY_FOLDER = gql`
  query Data(
    $where: FoldersWhereInput
    $orderBy: OrderByInput
    $limit: Int
    $skip: Int
    $noLimit: Boolean
  ) {
    folders(
      where: $where
      orderBy: $orderBy
      limit: $limit
      skip: $skip
      noLimit: $noLimit
    ) {
      total
      data {
        _id
        folder_name
        total_size
        folder_type
        checkFolder
        newFolder_name
        access_password
        shortUrl
        url
        path
        newPath
        pin
        createdBy {
          _id
          email
          username
          newName
        }
        file_id {
          _id
          filename
          size
          status
        }
        parentkey {
          _id
        }
        updatedAt
      }
    }
  }
`;

export const QUERY_FOLDER_PUBLIC = gql`
  query QueryFolderPublic($where: FoldersWhereInput) {
    queryFolderPublic(where: $where) {
      total
      data {
        _id
        folder_type
        folder_name
        newFolder_name
        total_size
        newPath
        is_public
        checkFolder
        restore
        access_password
        show_download_link
        status
        path
        url
        expired
        file_id {
          _id
          filename
          size
        }
        permissionSharePublic
        aproveDownloadPublic
        pin
        createdAt
        updatedAt
      }
      total
    }
  }
`;

export const QUERY_FOLDER_PUBLIC_LINK = gql`
  query QueryfoldersGetLinks($where: FoldersWhereInput) {
    queryfoldersGetLinks(where: $where) {
      total
      data {
        _id
        folder_name
        total_size
        access_password
        folder_type
        checkFolder
        newFolder_name
        url
        status
        path
        newPath
        pin
        createdBy {
          _id
          email
          username
          newName
        }
        updatedAt
      }
    }
  }
`;
