import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/CustomButton";
import axios from "axios";
import { Field, Formik } from "formik";
import * as yup from "yup";
import Message from "../../../components/Notification/notification";
import {
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
  Box,
  Center,
  NativeBaseProvider,
} from "native-base";
import {
  checkConnected,
  readData,
  removeItemValue,
  saveData,
} from "../../../components/func";
import CustomInputForm from "../../../../CustomInput";
import plus from "../../../../assets/images/plus.png";
import minus from "../../../../assets/images/minus.png";
import Stepper from "react-native-stepper-ui";
import DynamicInput from "../../../components/DynamicInput";

const AddFacilityScreen = ({}) => {
  const [facilityShow, setFacilityShow] = useState(true);
  const [connectionState, setConnectionState] = useState(false);
  const [userShow, setUserShow] = useState(true);
  const [levelShow, setLevelShow] = useState(true);
  const [relateShow, setRelateShow] = useState(true);
  const [dataflag, setDataFlag] = useState(false);
  const [formData, setFormData] = useState({});
  const [levels, setLevels] = useState([]);
  const [topic, setTopics] = useState([]);
  const [ff, setFF] = useState({});
  const [active, setActive] = useState(0);
  let content = [];
  let data = {};
  useEffect(() => {
    readData("facility-field").then((value) => {
      if (value != null) {
        data = JSON.parse(value);
        setFF(data);
        setDataFlag(true);
      }
    });
  }, []);
  useEffect(() => {
    if (dataflag) {
      let topicTemp = [];
      for (let index = 0; index < ff?.related.length; index++) {
        if (!topicTemp.includes(ff?.related[index].topic)) {
          topicTemp.push(ff?.related[index].topic);
        }
      }
      setTopics(topicTemp);
      let levelTemp = [];
      for (let index = 0; index < ff?.levels.length; index++) {
        levelTemp.push({
          id: ff?.levels[index].id,
          name: `${ff?.levels[index].id} - ${ff?.levels[index].name}`,
          order: 1,
          enabled: true,
          paramid: ff?.levels[index].id,
          minpop: ff?.levels[index].minpop,
          maxpop: ff?.levels[index].maxpop,
        });
      }
      setLevels(levelTemp);
      topic.map((item) => {
        console.log("====================================");
        console.log(item);
        console.log("====================================");
        content.push(<MyComponent title={item} />);
      });
    }
  }, [dataflag, ff]);
  const sendFacility = (values) => {
    checkConnected().then((res) => setConnectionState(res));
    let send_facility = [];
    readData("send-facility").then((x) => {
      send_facility = JSON.parse(x);
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
            "http://" + url + "/facilities/",
            {
              values,
            },
            {
              headers: { Authorization: token },
            }
          )
          .then((response) => {
            console.log("response facility send: ", response);
          })
          .catch((error) => {
            if (send_facility != null) {
              send_facility.push(values);
              removeItemValue("send-facility").then(() => "");
              saveData("send-facility", send_facility).then(() => "");
            } else {
              send_facility = [values];
              saveData("send-facility", send_facility).then(() => "");
            }
            console.log("errors facility send: ", error);
          });
      } else {
        console.log("Internet connection is off");
        if (send_facility != null) {
          send_facility.push(values);
          removeItemValue("send-facility").then(() => "");
          saveData("send-facility", send_facility).then(() => "");
        } else {
          send_facility = [values];
          saveData("send-facility", send_facility).then(() => "");
        }
      }
      // return <Message type="success" message="Facility sent." />;
    });
  };
  const signUpValidationSchema = yup.object().shape({
    // subject: yup.string().required("Subjecr is required"),
  });
  const initialValues = {
    subject: "",
    receivers: [],
    body: "",
  };
  return (
    <ScrollView>
      {/* <View style={{ marginVertical: 80 }}>
        <Stepper
          active={active}
          content={content}
          onNext={() => setActive((p) => p + 1)}
          onBack={() => setActive((p) => p - 1)}
          onFinish={() => Alert.alert("Finish")}
        />
      </View> */}
      <View style={styles.root}>
        {/* <Formik
          initialValues={initialValues}
          validationSchema={signUpValidationSchema}
          onSubmit={(values, { resetForm }) => {
            sendFacility(values);
            resetForm({ values: initialValues });
          }}
        >
          {({ handleSubmit, values }) => (
            <>
              <View style={styles.container}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "black",
                    flex: 1,
                  }}
                >
                  Main Info
                </Text>
                <TouchableOpacity
                  onPress={() => setFacilityShow((prev) => !prev)}
                >
                  <Image
                    source={facilityShow ? plus : minus}
                    style={styles.logo}
                  />
                </TouchableOpacity>
              </View>
              {!facilityShow && (
                <>
                  <Field
                    component={CustomInputForm}
                    name="name"
                    placeholder="Facility name"
                  />
                </>
              )}
              <View style={styles.container}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "black",
                    flex: 1,
                  }}
                >
                  User
                </Text>
                <TouchableOpacity onPress={() => setUserShow((prev) => !prev)}>
                  <Image source={userShow ? plus : minus} style={styles.logo} />
                </TouchableOpacity>
              </View>
              {!userShow && (
                <>
                  <Field
                    component={CustomInputForm}
                    name="username"
                    placeholder="Username"
                  />
                </>
              )}
              <View style={styles.container}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "black",
                    flex: 1,
                  }}
                >
                  Level
                </Text>
                <TouchableOpacity onPress={() => setLevelShow((prev) => !prev)}>
                  <Image
                    source={levelShow ? plus : minus}
                    style={styles.logo}
                  />
                </TouchableOpacity>
              </View>
              {!levelShow && (
                <>
                  <Field
                    component={CustomInputForm}
                    name="username"
                    placeholder="Username"
                  />
                  <Field
                    component={CustomInputForm}
                    name="username"
                    placeholder="Username"
                  />
                  <Field
                    component={CustomInputForm}
                    name="username"
                    placeholder="Username"
                  />
                </>
              )}
              <CustomButton onPress={handleSubmit} text={"Send"} />
            </>
          )}
        </Formik> */}
        {/* <Box alignItems="center">
            <Box w="100%" maxWidth="300px">
              <FormControl isRequired>
                <Stack mx="4">
                  <FormControl.Label>Password</FormControl.Label>
                  <Input
                    type="password"
                    defaultValue="12345"
                    placeholder="password"
                  />
                  <FormControl.HelperText>
                    Must be atleast 6 characters.
                  </FormControl.HelperText>
                  <FormControl.ErrorMessage
                    leftIcon={<WarningOutlineIcon size="xs" />}
                  >
                    Atleast 6 characters are required.
                  </FormControl.ErrorMessage>
                </Stack>
              </FormControl>
            </Box>
          </Box> */}
        {ff?.related?.map((field) => {
          return (
            <DynamicInput
              field={field}
              onChangeHandler={() => console.log("the dsadsadasdasdasdasdasds")}
            />
          );
        })}
        <DynamicInput
          field={{
            active: true,
            disabled: true,
            id: 2,
            name: "Facility name",
            params: [],
            required: true,
            stateName: "name",
            topic: "Facility general information",
            type: "text",
            validation: [],
          }}
          onChangeHandler={() => console.log("the dsadsadasdasdasdasdasds")}
        />
      </View>
    </ScrollView>
  );
};

const MyComponent = (props) => {
  return (
    <View>
      <Text>{props.title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 10,
  },
  logo: {
    flex: 1,
    marginTop: 3,
    marginLeft: 100,
    width: 25,
    height: 25,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6 },
});
export default AddFacilityScreen;
