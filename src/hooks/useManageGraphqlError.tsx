import { handleGraphqlErrors } from "utils/error.util";

const useManageGraphqlError = () => {
  const handleErrorMessage = (message: string) => {
    /* switch (handleGraphqlErrors(message)) {
      case "Your subscription has expired. Please renew your subscription.": {
        setIsWarningPackage(true);
      }
    } */

    return handleGraphqlErrors(message);
  };
  return {
    handleErrorMessage,
  };
};

export default useManageGraphqlError;
