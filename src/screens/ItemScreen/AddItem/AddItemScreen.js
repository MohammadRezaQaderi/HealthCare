import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Text,
} from "react-native";
import React, { useState, useEffect } from "react";
import {
  readData,
  removeItemValue,
  saveData,
} from "../../../components/DataStorage";
import InternetConnection from "../../../components/InternetConnection";
import SelectInput from "../../../components/SelectInput/SelectInput";
import CustomInput from "../../../components/CustomInput";

import axios from "axios";
import { Formik, Field } from "formik";
import * as yup from "yup";
import CustomButton from "../../../components/CustomButton";

const AddItemScreen = ({ defaultValueMessage }) => {
  const [connectionState, setConnectionState] = useState(false);
  const [mfl, setMFL] = useState([]);
  const [select, setSelected] = useState([]);
  useEffect(() => {
    readData("message-facility-list").then((value) => {
      if (value != null) {
        let data = JSON.parse(value);
        try {
          for (let i = 0; i < data.length; i++) {
            let obj = data[i];
            obj["value"] = obj["name"];
            obj["key"] = obj["id"];
            delete obj["name"];
            delete obj["id"];
            data[i] = obj;
          }
          setMFL(data);
        } catch (error) {}
      } else {
      }
    });
  }, []);
  const sendMessage = (values) => {
    console.log("values", values);
    InternetConnection().then((res) => setConnectionState(res));
    let send_message = [];
    if (!defaultValueMessage) {
      readData("send-message").then((x) => {
        send_message = JSON.parse(x);
      });
    } else {
      readData("send-message-edit").then((x) => {
        send_message = JSON.parse(x);
      });
    }
    let url = "";
    readData("URL").then((x) => {
      url = JSON.parse(x);
    });
    readData("token").then((token) => {
      token = JSON.parse(token);
      token = "Bearer".concat(" ", token);
      if (connectionState) {
        if (!defaultValueMessage) {
          axios
            .post(
              "http://" + url + "/message/",
              {
                values,
              },
              {
                headers: { Authorization: token },
              }
            )
            .then((response) => {
              console.log("response message send: ", response);
            })
            .catch((error) => {
              if (send_message != null) {
                send_message.push(values);
                removeItemValue("send-message").then(() => "");
                saveData("send-message", send_message).then(() => "");
                console.log("errors message sending and save and we have it: ");
              } else {
                send_message = [values];
                saveData("send-message", send_message).then(() => "");
                console.log("errors message sending and save and new one: ");
              }
              console.log("errors message sending: ", error);
            });
        } else {
          defaultValueMessage.subject = values.subject;
          defaultValueMessage.reciever = values.receivers;
          defaultValueMessage.body = values.body;
          axios
            .put(
              "http://" + url + "/message/",
              {
                defaultValueMessage,
              },
              {
                headers: { Authorization: token },
              }
            )
            .then((response) => {
              console.log("response edit message send: ", response);
            })
            .catch((error) => {
              if (send_message != null) {
                send_message.push(defaultValueMessage);
                removeItemValue("send-message-esit").then(() => "");
                saveData("send-message-edit", send_message).then(() => "");
                console.log(
                  "errors edit message sending and save and we have it: "
                );
              } else {
                send_message = [defaultValueMessage];
                saveData("send-message-edit", send_message).then(() => "");
                console.log(
                  "errors edit message sending and save and new one: "
                );
              }
              console.log("errors edit message sending: ", error);
            });
        }
      } else {
        console.log("Internet connection is off", send_message);
        if (!defaultValueMessage) {
          if (send_message != null) {
            send_message.push(values);
            removeItemValue("send-message").then(() => "");
            saveData("send-message", send_message).then(() => "");
            console.log("connection error and save and we have it: ");
          } else {
            send_message = [values];
            saveData("send-message", send_message).then(() => "");
            console.log("connection error and save and we have it: ");
          }
        } else {
          if (send_message != null) {
            defaultValueMessage.subject = values.subject;
            defaultValueMessage.reciever = values.receivers;
            defaultValueMessage.body = values.body;
            send_message.push(defaultValueMessage);
            removeItemValue("send-message-edit").then(() => "");
            saveData("send-message-edit", send_message).then(() => "");
            console.log("connection error and edit save and we have it: ");
          } else {
            send_message = [defaultValueMessage];
            saveData("send-message-edit", send_message).then(() => "");
            console.log("connection error and edit save and we have it: ");
          }
        }
      }
    });
  };
  const signUpValidationSchema = yup.object().shape({
    subject: yup.string().required("Subjecr is required"),
    // receivers: yup.array().required("Receivers is required"),
  });
  let initialValues = {};
  if (!defaultValueMessage) {
    initialValues = {
      subject: "",
      receivers: select,
      body: "",
    };
  } else {
    initialValues = {
      subject: defaultValueMessage.subject,
      receivers: [defaultValueMessage.reciever],
      body: defaultValueMessage.body,
    };
  }
  if (mfl.length > 0) {
    return (
      <ScrollView>
        <View style={styles.root}>
          <Formik
            initialValues={initialValues}
            validationSchema={signUpValidationSchema}
            onSubmit={(values, { resetForm }) => {
              values.receivers = [select];
              sendMessage(values);
              resetForm({ values: initialValues });
            }}
          >
            {({ handleSubmit, values }) => (
              <>
                <SelectInput
                  data={mfl}
                  setSelected={setSelected}
                  name="receivers"
                  // placeholder={"receivers"}
                  type={"single"}
                  defaultOption={"recivers ID"}
                />
                <Field
                  component={CustomInput}
                  name="subject"
                  placeholder="Subject"
                />
                <Field
                  component={CustomInput}
                  name="body"
                  placeholder="Message body"
                  style={{
                    borderColor: "gray",
                    width: "100%",
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 10,
                    height: 150,
                    width: "100%",
                    backgroundColor: "white",
                    borderColor: "gray",
                  }}
                />
                <CustomButton onPress={handleSubmit} text={"Send"} />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    );
  } else {
    return (
      <>
        <ActivityIndicator size="large" color="black" style={{ padding: 20 }} />
        <Text style={{ textAlign: "center" }}>the data get from server</Text>
      </>
    );
  }
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 30,
  },
});
export default AddItemScreen;
