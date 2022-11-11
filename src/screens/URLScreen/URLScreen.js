import { View, StyleSheet, Text, Button } from "react-native";
import React from "react";
import { Formik, Field } from "formik";
import * as yup from "yup";
import axios from "axios";
// Component Import
import CustomButton from "../../components/CustomButton";
import CustomInput from "../../components/CustomInput";
// Functionality Import
import { saveData } from "../../components/DataStorage";

const URLScreen = ({ setUrlState }) => {
  const onPassPressed = (values) => {
    let url = "http://" + values.url + "/auth/urlCheck/";
    axios
      .get(url)
      .then((response) => {
        saveData("URL", values.url).then(() => "");
        setUrlState(true);
        console.warn("Url Setted :)");
      })
      .catch((error) => {
        console.log("errors for setted url is not correct: ", error);
      });
  };
  const signUpValidationSchema = yup.object().shape({
    url: yup.string().required("Url is required"),
  });
  const initialValues = {
    url: "",
  };
  return (
    <View style={styles.root}>
      <Text style={styles.primaryText}>{"Set Server URL"}</Text>
      <Text style={styles.secondaryText}>
        {"sorry you should first add the server Url to start the App:)"}
      </Text>
      <Formik
        initialValues={initialValues}
        validationSchema={signUpValidationSchema}
        onSubmit={(values, { resetForm }) => {
          onPassPressed(values);
          resetForm({ values: initialValues });
          // showToast();
        }}
      >
        {({ handleSubmit, values }) => (
          <>
            <Field component={CustomInput} name="url" placeholder="URL" />
            <CustomButton onPress={handleSubmit} text={"Save URL"} />
          </>
        )}
      </Formik>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 20,
    marginTop: 180,
    marginLeft: 25,
    marginRight: 25,
    borderRadius: 2,
    backgroundColor: "white",
    justifyContent: "center",
    blurRadius: 90,
    borderRadius: 3,
  },
  primaryText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    paddingTop: 10,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
    paddingTop: 20,
    textAlign: "center",
  },
});
export default URLScreen;
