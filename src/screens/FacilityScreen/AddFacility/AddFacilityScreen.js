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
import {
  checkConnected,
  readData,
  removeItemValue,
  saveData,
} from "../../../components/DataStorage";
import CustomInput from "../../../components/CustomInput";
// import plus from "../../../../assets/images/plus.png";
// import minus from "../../../../assets/images/minus.png";
import Stepper from "react-native-stepper-ui";
import DynamicInput from "../../../components/DynamicInput";
import FacilityInput from "../../../components/FacilityInput /FacilityInput ";
import { StepperContainer, StepView } from "@material.ui/react-native-stepper";
import Input from "../../../components/Input/CustomInput";

const MyComponent = ({ facilityFeilds, state, setState }) => {
  const views = [];
  for (let i = 0; i < facilityFeilds.length; i++) {
    views.push(
      <ScrollView>
        <View>
          <Input
            value={state}
            setValue={setState}
            placeholder={facilityFeilds[i].name}
          />
        </View>
      </ScrollView>
    );
  }
  return views;
};

const MyStepper = ({ topic, facilityFeilds, state, setState }) => {
  const views = [];
  for (let i = 0; i < topic?.length; i++) {
    if (i === 1) {
      views.push(
        <StepView title={topic[i]} onNext={() => true}>
          <MyComponent
            facilityFeilds={facilityFeilds[topic[i]]}
            state={state}
            setState={setState}
          />
          {/* <Text> fuck</Text> */}
        </StepView>
      );
    } else {
      views.push(
        <StepView title={topic[i]}>
          <MyComponent
            facilityFeilds={facilityFeilds[topic[i]]}
            state={state}
            setState={setState}
          />
          {/* <Text> asdasdsadsadsd</Text> */}
        </StepView>
      );
    }
  }
  console.log("viies", views);
  return views;
};

const AddFacilityScreen = ({ setDefaultValueFacility }) => {
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
  const [content, setContent] = useState([]);
  const [state, setState] = useState("");
  const [facilityFeilds, setFacilityFeilds] = useState({});
  const [active, setActive] = useState(0);
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
      let facilityFeildsTemp = {};
      for (let index = 0; index < ff?.related.length; index++) {
        if (!topicTemp.includes(ff?.related[index].topic)) {
          topicTemp.push(ff?.related[index].topic);
        }
      }
      for (let index = 0; index < topicTemp.length; index++) {
        facilityFeildsTemp[topicTemp[index]] = [];
      }
      for (let index = 0; index < ff?.related.length; index++) {
        let temp = facilityFeildsTemp[ff?.related[index].topic];
        temp.push(ff?.related[index]);
        facilityFeildsTemp[ff?.related[index].topic] = temp;
      }
      setTopics(topicTemp);
      setFacilityFeilds(facilityFeildsTemp);
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
      {Object.keys(ff).length !== 0 ? (
        <StepperContainer>
          {
            <MyStepper
              topic={topic}
              facilityFeilds={facilityFeilds}
              state={state}
              setState={setState}
            />
          }
        </StepperContainer>
      ) : (
        <></>
      )}
    </ScrollView>
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
