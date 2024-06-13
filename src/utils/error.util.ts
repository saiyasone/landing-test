export const handleGraphqlErrors = (message: string) => {
  switch (message) {
    case "Your subscription has expired. Please renew your subscription.": {
      return message;
    }

    case "Error: EMAIL_ALREADY_IN_USED": {
      return "Email has already been used";
    }

    case "Error: JsonWebTokenError: jwt malformed": {
      return null;
    }

    case "LOGIN_IS_REQUIRED": {
      return "Please log in to continue";
    }

    case "SOCKETSERVER_IS_NOT_INITIALIZED": {
      return "We have troube with Socker server, Please try again later!";
    }

    case "THE_FOLDER_NAME_IS_REPEATED": {
      return "The folder name is repeated";
    }

    case "THE_FILE_NAME_IS_REPEATED": {
      return "The file name is repeated";
    }

    case "ຊື່ໄຟລ": {
      return "File name already exists";
    }

    case "USERNAME_ALREADY_IN_USED": {
      return "Username already in use by another account";
    }

    case "INVALID_EMAIL_FORMAT": {
      return "Please enter a valid email address";
    }

    case "THE_PASSWORDS_DO_NOT_MATCH": {
      return "Passwords do not match";
    }

    case "LINK_RESET_PASSWORD_EXPIRED": {
      return "The link to reset your password has expired";
    }

    case "ERROR_CHANGING_PASSWORD": {
      return "Failed to change password";
    }

    case "INVALID_PASSWORD": {
      return "Please enter a valid password";
    }

    case "CAN'T_NOT_UPDATE_EMAIL_PLEASE_SEND_OTP": {
      return "Unable to update email. Please send OTP for verification";
    }

    case "TOKEN_EXPIRED": {
      return "Your token has expired. Please log in again";
    }

    case "EMAIL_NOT_FOUND": {
      return "Email address not found";
    }

    case "USER_NOT_FOUND": {
      return "User account not found";
    }

    case "LIMITED": {
      return "Filedrop was limited access. Please try again later";
    }

    case "YOUR_ACCOUNT_HAS_BEEN_DISABLED": {
      return "This account has been disabled";
    }

    case "PASSWORD_INCORRECT": {
      return "Invalid password";
    }

    case "PASSWORD_NOT_MATCH": {
      return "Password dot not matched";
    }

    case "YOUR_ACCOUNT_HAS_BEEN_DELETED": {
      return "This account has been deleted";
    }

    case "NOT_FOUND_YOUR_ACCOUNT": {
      return "This account is not found";
    }

    case "PASSWORD_MUST_BE_AT_LEAST_8_CHARACTERS": {
      return "The password must be at least 8 characters";
    }

    case "NOT_UPDATE": {
      return "Update data is not successfully";
    }

    case "FILE_NAME_DOES_NOT_HAVE_AN_EXTENSION": {
      return "The file name missing an extension";
    }

    default: {
      return message;
    }
  }
};
