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
import AsyncStorage from "@react-native-async-storage/async-storage";

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
const getInfoFromServer = async (setCurrentTab) => {
  readData("token").then((token) => {
    token = JSON.parse(token);
    token = "Bearer".concat(" ", token);
    if (token != null) {
      readData("URL").then((url) => {
        url = JSON.parse(url);
        axios
          .get("https://" + url + "/facilities/facility-field", {
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
          .get("https://" + url + "/user-data/", {
            headers: { Authorization: token },
          })
          .then((res) => {
            removeItemValue("user").then(() => "");
            removeItemValue("country").then(() => "");

            const country = res.data.Country[0];
            const user = {};
            user.id = res.data.User.pk;
            user.admin = res.data.User.is_superuser;
            user.name = res.data.User.name;
            user.username = res.data.User.username;
            user.idnumber = res.data.User.idnumber;
            user.phone = res.data.User.phone;
            user.facility_name = res.data.facility;
            user.facility_admin = res.data.User.facadmin;
            user.facility_id = res.data.User.facilityid;
            user.reportadmin = res.data.User.reportadmin;
            user.itemadmin = res.data.User.itemadmin;
            user.useradmin = res.data.User.useradmin;
            user.created_at = res.data.User.created_at.split("T")[0];
            user.updated_at = res.data.User.updated_at.split("T")[0];
            saveData("user", user).then(() => "");
            saveData("country", country).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get facility-field: ", error);
          });

        axios
          .get("https://" + url + "/facilities/", {
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
          .get("https://" + url + "/item/itemallFac", {
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
          .get("https://" + url + "/message/helper", {
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
          .get("https://" + url + "/message/", {
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
          .get("https://" + url + "/message/", {
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
        axios
          .get("https://" + url + "/facilities/delete", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("facility-delete-item").then(() => "");
            saveData("facility-delete-item", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get messages reciever: ", error);
          });
        axios
          .get("https://" + url + "/item/delete", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("item-delete-item").then(() => "");
            saveData("item-delete-item", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get messages reciever: ", error);
          });
        
      });
    }
  });
}
const getAsyncInfo = async (setLoading,setCurrentTab) => {

  const t = await AsyncStorage.getItem("token");
  console.log("token: ", t);
  let tx = JSON.parse(t);
  const token = "Bearer".concat(" ", tx);
  const urlx = await AsyncStorage.getItem("URL");
  console.log("urlx",urlx)
  const url = JSON.parse(urlx);
  console.log(url)
  const fields = [];

  const  response  = await axios
    .get("https://" + url + "/item/item-field-mobile", {headers: { Authorization: token }})
    // console.log("first res",response)
      removeItemValue("parent").then(() => "");
      saveData("parent", response?.data.facility).then(() => "");
      const item_classes = response.data.data;
      removeItemValue("itemClass").then(() => "");
      saveData("itemClass", response?.data.data).then(() => {
        item_classes.map((item_class) => {
          let item_classx = item_class?.item_class;
          const temp_obj = {
            item_class: item_classx,
            item_type: [],
          };
          item_class?.item_type.map((item_type) => {
            const temp_type = {
              id: item_type.id,
              title: item_type.title,
              havepqs: item_type.havepqs,
              fields: item_type.fields,
              pqs: item_type.pqs,
            };

            temp_obj.item_type.push(temp_type);
          });
          console.log("temp_obj", temp_obj);
          fields.push(temp_obj);
          saveData("itemFields", fields).then(() => "");
          saveData("send-facility",JSON.stringify([])).then(() => "");
          saveData("send-item", JSON.stringify([])).then(() => "");
          saveData("edited-item", JSON.stringify([])).then(() => "");
          saveData("edited-facility", JSON.stringify([])).then(() => "");
          setLoading(false);
          setCurrentTab("Logout");
        });
      });
        // console.log(fields[0].item_type)
       
  


};

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
        .post("https://" + url + "/auth/login/", { username, password })
        .then((response) => {
          setLoggedIn(true);
          saveData("token", response?.data?.access).then(() => "");
          getAsyncInfo(setLoading, setCurrentTab);
          getInfoFromServer(setCurrentTab);
          
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
