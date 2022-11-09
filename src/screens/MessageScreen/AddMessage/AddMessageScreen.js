import { View, StyleSheet, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import CustomInputForm from "../../../../CustomInput";
import CustomButton from "../../../components/CustomButton";
import Message from "../../../components/Notification/notification";
import {
  checkConnected,
  readData,
  removeItemValue,
  saveData,
} from "../../../components/func";
import axios from "axios";
import { Formik, Field } from "formik";
import * as yup from "yup";
import {
  Select,
  Box,
  CheckIcon,
  Center,
  NativeBaseProvider,
} from "native-base";
import Icon from "react-native-vector-icons/MaterialIcons";
import SectionedMultiSelect from "react-native-sectioned-multi-select";
import MultiselectInput from "../../../components/MultiselectInput";
import Picker from "react-native-picker-select";

const AddMessageScreen = ({}) => {
  const [connectionState, setConnectionState] = useState(false);
  const [selectedValue, setSelectedValue] = useState("java");
  const [mfl, setMFL] = useState([]);
  useEffect(() => {
    readData("message-facility-list").then((value) => {
      if (value != null) {
        let data = JSON.parse(value);
        try {
          setMFL(data);
        } catch (error) {}
        return <Message type="success" message="::::))))" />;
      } else {
        return (
          <Message type="warn" message="we didn`t have message-facility-list" />
        );
      }
    });
  }, []);
  const sendMessage = (values) => {
    checkConnected().then((res) => setConnectionState(res));
    let send_message = [];
    readData("send-message").then((x) => {
      send_message = JSON.parse(x);
    });
    let url = "";
    readData("URL").then((x) => {
      url = JSON.parse(x);
    });
    readData("token").then((token) => {
      token = JSON.parse(token);
      token = "Bearer".concat(" ", token);
      if (connectionState) {
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
            } else {
              send_message = [values];
              saveData("send-message", send_message).then(() => "");
            }
            console.log("errors message sending: ", error);
          });
      } else {
        console.log("Internet connection is off");
        if (send_message != null) {
          send_message.push(values);
          removeItemValue("send-message").then(() => "");
          saveData("send-message", send_message).then(() => "");
        } else {
          send_message = [values];
          saveData("send-message", send_message).then(() => "");
        }
      }
      return <Message type="success" message="Messeage sent." />;
    });
  };
  // const signUpValidationSchema = yup.object().shape({
  //   subject: yup.string().required("Subjecr is required"),
  // });
  // const initialValues = {
  //   subject: "",
  //   receivers: [],
  //   body: "",
  // };
  return (
    // <ScrollView>
    //   <View style={styles.root}>
    //     <Formik
    //       initialValues={initialValues}
    //       validationSchema={signUpValidationSchema}
    //       onSubmit={(values, { resetForm }) => {
    //         sendMessage(values);
    //         resetForm({ values: initialValues });
    //       }}
    //     >
    //       {({ handleSubmit, values }) => (
    <>
      <View>
        {/* <NativeBaseProvider>
                <Center flex={1} px="3">
                    <Box maxW="300">
                      <Select
                        selectedValue={service}
                        // minWidth="200"
                        accessibilityLabel={"Choose Service"}
                        placeholder={"Choose Service"}
                        _selectedItem={{
                          bg: "teal.600",
                          endIcon: <CheckIcon size="5" />,
                        }}
                        mt={1}
                        onValueChange={(itemValue) => setService(itemValue)}
                      >
                        <Select.Item label={"UX Research"} value={"ux"} />
                        <Select.Item label={"Web Development"} value={"web"} />
                      </Select>
                    </Box>
                </Center>
              </NativeBaseProvider> */}
        <Picker
          selectedValue={selectedValue}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
        >
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
      </View>
      {/* <SectionedMultiSelect
                items={items}
                icons={Icon}
                uniqueKey="id"
                subKey="name"
                selectText="Choose some things..."
                showDropDowns={true}
                readOnlyHeadings={true}
                onSelectedItemsChange={(x) => console.log(x)}
                selectedItems={receivers}
              /> */}
      {/* <Field name="subject" placeholder="Subject" as="select">
                <option value={"S"}>red</option>
                <option value={"F"}>red</option>
              </Field> */}
      {/* <Field
                component={CustomInputForm}
                name="subject"
                placeholder="Subject"
              />
              <Field
                component={CustomInputForm}
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
              <CustomButton onPress={handleSubmit} text={"Send"} /> */}
    </>
  );
};
{
  /* </Formik> */
}
{
  /* <MultiselectInput></MultiselectInput> */
}
{
  /* </View> */
}
{
  /* </ScrollView> */
}

const styleSheet = StyleSheet.create({
  MainContainer: {
    flex: 1,
    padding: 12,
    backgroundColor: "white",
  },

  text: {
    padding: 12,
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    color: "black",
  },
});

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 30,
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
  input: {
    height: 60,
  },
});
export default AddMessageScreen;
