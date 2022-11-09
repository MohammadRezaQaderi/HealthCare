import {
  View,
  StyleSheet,
  Image,
  useWindowDimensions,
  ActivityIndicator,
  Text,
} from "react-native";
import React, { useState } from "react";
import Logo from "../../../assets/images/logo.png";
import CustomInput from "../../components/CustomInput";
import CustomButton from "../../components/CustomButton";
import axios from "axios";
import { saveData, readData, removeItemValue } from "../../components/func";
import { Formik, Field } from "formik";
import * as yup from "yup";
import CustomInputForm from "../../../CustomInput";
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
            removeItemValue("facility-field").then(()=>"");
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
            removeItemValue("facilities").then(()=>"");
            saveData("facilities", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get facilities: ", error);
          });
        axios
          .get("http://" + url + "/message/helper", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("message-facility-list").then(()=>"");
            saveData("message-facility-list", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get message-facility-list: ", error);
          });
        axios
          .get("http://" + url + "/message/", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("messages").then(()=>"");
            saveData("messages", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get messages: ", error);
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
                  component={CustomInputForm}
                  name="username"
                  placeholder="Username"
                />
                <Field
                  component={CustomInputForm}
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
