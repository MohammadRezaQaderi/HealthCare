import axios from "axios";
// import toast from "react-hot-toast";
import { responseMessages } from "../constants/response-messages";
import { Translation, Trans } from "react-i18next";
import Toast from "react-native-toast-message";
const ApiManager = axios.create({});

ApiManager.interceptors.response.use(
  (response) => {
    if (response.config.method !== "get") {
      const message =
        responseMessages[response.status]?.fa || responseMessages.success.fa;
        Toast.show({
          type: "success",
          text1: "success",
          text2: { message },
        });
      // toast.success(<Trans>{message}</Trans>);
    }
    return response;
  },
  (error) => {
    const { response } = error;
    if (response?.status === 403) {
      window.location.href = `/error-pages/error-403`;
    }
      if (response?.status === 409) {
        window.location.href = `/error-pages/error-409`;
      }
    if (response?.status === 401) {
      localStorage.removeItem("user");
      localStorage.removeItem("country");
      window.location.href = `/login`;
    }
    const message =
      responseMessages[response.status]?.fa || responseMessages.failed.fa;
 Toast.show({
   type: "error",
   text1: "error",
   text2: { message },
 });
    // toast.error(<Trans>{message}</Trans>);

    return Promise.reject(error);
  }
);

export default ApiManager;
