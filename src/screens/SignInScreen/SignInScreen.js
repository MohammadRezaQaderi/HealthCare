import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import React, { useState } from "react";
import { Formik, Field } from "formik";
import * as yup from "yup";
import axios from "axios";
// Component Import
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
// Icon and Image Import
import Logo from "../../../assets/logo.png";
// Functionality Import
import {
  saveData,
  readData,
  removeItemValue,
  إ,
} from "../../components/DataStorage";

/**
 * This function is for the Loding format
 * @returns
 */
const getContent = () => {
  return (
    <>
      <ActivityIndicator size="large" color="black" />
      <Text style={{ textAlign: "center" }}>the data get from server</Text>
    </>
  );
};

/**
 * This function get the Data from server
 * For use in the offline mode :)
 */
function getInfoFromServer() {
  readData("token").then((token) => {
    token = JSON.parse(token);
    token = "Bearer".concat(" ", token);
    if (token != null) {
      readData("URL").then((url) => {
        url = JSON.parse(url);
        axios
          .get("http://" + url + "/facilities/facility-field", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("facility-field").then(() => "");
            saveData("facility-field", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get facility-field: ", error);
          });
        axios
          .get("http://" + url + "/facilities/", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("facilities").then(() => "");
            saveData("facilities", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get facilities: ", error);
          });
        axios
          .get("http://" + url + "/item/", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("item").then(() => "");
            saveData("item", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get item: ", error);
          });
        axios
          .get("http://" + url + "/message/helper", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("message-facility-list").then(() => "");
            saveData("message-facility-list", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get message-facility-list: ", error);
          });
        axios
          .get("http://" + url + "/message/", {
            headers: { Authorization: token },
            params: { type: "sender" },
          })
          .then((response) => {
            removeItemValue("messages-sender").then(() => "");
            saveData("messages-sender", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get messages sender: ", error);
          });
        axios
          .get("http://" + url + "/message/", {
            headers: { Authorization: token },
            params: { type: "reciever" },
          })
          .then((response) => {
            removeItemValue("messages-reciever").then(() => "");
            saveData("messages-reciever", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get messages reciever: ", error);
          });
      });
    }
  });
}

const SignInScreen = ({ setLoggedIn, setCurrentTab }) => {
  const [loading, setLoading] = useState(false);
  const { height } = useWindowDimensions();

  const onSignInPressed = (values) => {
    setLoading(true);
    let username = values["username"];
    let password = values["password"];
    readData("URL").then((url) => {
      url = JSON.parse(url);
      axios
        .post("http://" + url + "/auth/login/", { username, password })
        .then((response) => {
          setLoggedIn(true);
          setCurrentTab("Logout");
          saveData("token", response?.data?.access).then(() => "");
          getInfoFromServer();
          setLoading(false);
        })
        .catch((error) => {
          console.log("errors to login: ", error);
        });
      setLoading(false);
    });
  };
  const signUpValidationSchema = yup.object().shape({
    username: yup.string().required("username is required"),
    password: yup.string().required("passwor is required"),
  });
  const initialValues = {
    username: "",
    password: "",
  };
  return (
    <View style={styles.root}>
      {!loading && (
        <>
          <Image
            source={Logo}
            style={[styles.logo, { height: height * 0.3 }]}
            resizeMode="contain"
          />
          <Formik
            initialValues={initialValues}
            validationSchema={signUpValidationSchema}
            onSubmit={(values, { resetForm }) => {
              onSignInPressed(values);
              resetForm({ values: initialValues });
            }}
          >
            {({ handleSubmit, values }) => (
              <>
                <Field
                  component={CustomInput}
                  name="username"
                  placeholder="Username"
                />
                <Field
                  component={CustomInput}
                  name="password"
                  placeholder="Password"
                  secureTextEntry
                />
                <CustomButton onPress={handleSubmit} text={"Sign In"} />
              </>
            )}
          </Formik>
        </>
      )}
      {loading && getContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 35,
  },
  logo: {
    width: "70%",
    maxWidth: 300,
    maxHeight: 200,
    marginBottom: 20,
  },
});
export default SignInScreen;
