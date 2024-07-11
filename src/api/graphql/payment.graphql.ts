import { gql } from "@apollo/client";

export const MUTATION_CREATE_PAYMENT = gql`
  mutation CreatePayment($input: CreatePaymentInput!) {
    createPayment(input: $input) {
      _id
      paymentId
      packageId {
        packageId
      }
      paymentMethod
      amount
      description
      status
      createdAt
      updatedAt
      orderedAt
    }
  }
`;

export const MUTATION_CREATE_TWO_CHECKOUT = gql`
  mutation TwoCheckoutSubscription($packageId: String!) {
    twoCheckoutSubscription(packageId: $packageId)
  }
`;

export const QUERY_PAYMENT = gql`
  query GetPayments(
    $where: PaymentWhereInput
    $orderBy: OrderByInput
    $skip: Int
    $limit: Int
    $noLimit: Boolean
  ) {
    getPayments(
      where: $where
      orderBy: $orderBy
      skip: $skip
      limit: $limit
      noLimit: $noLimit
    ) {
      data {
        _id
        paymentId
        packageId {
          _id
          packageId
          name
          category
          annualPrice
          monthlyPrice
          currencyId {
            _id
          }
          discount
          description
          storage
          ads
          captcha
          fileDrop
          multipleUpload
          numberOfFileUpload
          uploadPerDay
          fileUploadPerDay
          maxUploadSize
          multipleDownload
          downLoadOption
          support
          batchDownload
          unlimitedDownload
          customExpiredLink
          downloadFolder
          remoteUpload
          iosApplication
          androidApplication
          sort
          totalUsed
          textColor
          bgColor
          status
          createdAt
          updatedAt
          createdBy {
            firstName
            lastName
          }
        }
        category
        paymentMethod
        amount
        description
        countPurchase
        status
        createdAt
        updatedAt
        orderedAt
        expiredAt
      }
    }
  }
`;

export const MUTATION_CREATE_QR_AND_SUBSCRIPTION = gql`
  mutation CreateQrAndSubscribeForPayment($data: PaymentInput!) {
    createQrAndSubscribeForPayment(data: $data) {
      qrCode
      transactionId
    }
  }
`;

export const MUTATION_CREATE_CANCELLED_SUBSCRIPTION = gql`
  mutation CancelledBcelOneSubscriptionQr {
    cancelledBcelOneSubscriptionQr {
      message
      transactionId
    }
  }
`;

export const MUTATION_CREATE_TEST_SUBSCRIPTION = gql`
  mutation TestSubscribeBcelOneSubscriptionQr($transactionId: String) {
    testSubscribeBcelOneSubscriptionQr(transactionId: $transactionId) {
      message
      transactionId
    }
  }
`;

export const SUBSCRIPTION_BCEL_ONE_SUBSCRIPTION = gql`
  subscription Subscription($transactionId: String) {
    subscribeBcelOneSubscriptionQr(transactionId: $transactionId) {
      message
      transactionId
    }
  }
`;
