import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { MUTATION_CREATE_QR_AND_SUBSCRIPTION } from "api/graphql/payment.graphql";
import { clientMockup } from "main";
import { useSelector } from "react-redux";
import { paymentState } from "stores/features/paymentSlice";

const useBcelSubscirption = () => {
  const paymentSelector = useSelector(paymentState);
  const [createQrAndSubscription] = useMutation(
    MUTATION_CREATE_QR_AND_SUBSCRIPTION,
    {
      client: clientMockup,
    },
  );

  const [qrCode, setQrCode] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [transactionId, setTransactionId] = useState<string>("");

  const [platform, setPlatform] = useState("ANDROID");
  const userAgent = navigator.userAgent;

  useEffect(() => {
    if (userAgent.match(/iPhone|iPad|iPod/i)) {
      setPlatform("IOS");
    }
  }, [userAgent]);

  useEffect(() => {
    createQrAndSubscription({
      variables: {
        data: {
          amount: 1,
          card: "BCEL",
          category: "package",
          description: "test",
          packageId: paymentSelector.packageIdData.packageId,
          paymentMethod: "bcelone",
          service: "BCELONE_PAY",
          status: "success",
          type:
            paymentSelector.paymentTypeSummary === "monthly"
              ? "monthly"
              : "annual",
          platform,
        },
      },
    }).then((res) => {
      const { qrCode, transactionId } =
        res.data.createQrAndSubscribeForPayment || {};
      setTransactionId(`${transactionId}`);
      setQrCode(`${qrCode}`);
      setLink(`onepay://qr/${qrCode}`);
    });
  }, [paymentSelector.paymentTypeSummary]);

  return {
    qrCode,
    link,
    transactionId,
  };
};

export default useBcelSubscirption;
