import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
} from "react-native";
import MapView from "react-native-maps";
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
import SelectInput from "../../../components/SelectInput/SelectInput";

import React, { useState } from "react";
import { useQuery } from "react-query";
import FacilitiesService from "../services/facilities.service";
import { useHistory, useParams } from "react-router-dom";
import Spinner from "../shared/Spinner";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { Form } from "react-bootstrap";
import DynamicInput from "../components/DynamicInput/DynamicInput";
import {
  hasValidationError,
  timeValidationError,
} from "../helpers/validation-checker";
import { isRelatedFieldOk, relatedFields } from "../helpers/related-field";
import { isRelatedFieldOkReq } from "../helpers/related-field-req";

import Map from "../settings/Map";
import { Trans } from "react-i18next";
import { separator } from "../helpers/separator";
import StepOperations from "../components/StepOperations";
import { useEffect } from "react";
import { seperator } from "../helpers/seperator";

// import {
//   MapContainer,
//   useMap,
//   TileLayer,
//   Marker,
//   Popup,
//   useMapEvents,
// } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";

// const DataFormating = (data, type) => {
//   let obj = [];
//   if (type === "key") {
//     data.map((item) => {
//       obj.push({ value: item.name, key: item.id });
//     });
//   }
//   if (type === "bool") {
//     obj = [
//       { value: "Yes", key: true },
//       { value: "No", key: false },
//     ];
//   }
//   return obj;
// };

// const MyComponent = ({ facilityFeilds, state, setState }) => {
//   const views = [];

//   for (let i = 0; i < facilityFeilds.length; i++) {
//     if (facilityFeilds[i].type === "text") {
//       views.push(
//         <ScrollView>
//           <View>
//             <Input
//               value={state}
//               setValue={setState}
//               placeholder={facilityFeilds[i].name}
//             />
//           </View>
//         </ScrollView>
//       );
//     }
//     if (facilityFeilds[i].type === "select") {
//       views.push(
//         <ScrollView>
//           <View>
//             <SelectInput
//               data={() => DataFormating(facilityFeilds[i]?.params, "key")}
//               setSelected={setState}
//               placeholder={facilityFeilds[i].name}
//               type={"single"}
//             />
//           </View>
//         </ScrollView>
//       );
//     }
//     if (facilityFeilds[i].type === "number") {
//       views.push(
//         <ScrollView>
//           <View>
//             <SelectInput
//               data={() => DataFormating(facilityFeilds[i]?.params, "key")}
//               setSelected={setState}
//               placeholder={facilityFeilds[i].name}
//               type={"single"}
//             />
//           </View>
//         </ScrollView>
//       );
//     }
//     if (facilityFeilds[i].type === "bool") {
//       views.push(
//         <ScrollView>
//           <View>
//             <SelectInput
//               data={() => DataFormating(facilityFeilds[i]?.params, "bool")}
//               setSelected={setState}
//               placeholder={facilityFeilds[i].name}
//               type={"single"}
//             />
//           </View>
//         </ScrollView>
//       );
//     }
//   }
//   return views;
// };

// const MyStepper = ({ topic, facilityFeilds, state, setState }) => {
//   const views = [];
//   for (let i = 0; i < topic?.length; i++) {
//     if (i === 1) {
//       views.push(
//         <StepView title={topic[i]} onNext={() => true}>
//           <MyComponent
//             facilityFeilds={facilityFeilds[topic[i]]}
//             state={state}
//             setState={setState}
//           />
//           {/* <Text> fuck</Text> */}
//         </StepView>
//       );
//     } else {
//       views.push(
//         <StepView title={topic[i]}>
//           <MyComponent
//             facilityFeilds={facilityFeilds[topic[i]]}
//             state={state}
//             setState={setState}
//           />
//           {/* <Text> asdasdsadsadsd</Text> */}
//         </StepView>
//       );
//     }
//   }
//   return views;
// };

// const AddFacilityScreen = ({ setDefaultValueFacility }) => {
//   const [facilityShow, setFacilityShow] = useState(true);
//   const [connectionState, setConnectionState] = useState(false);
//   const [userShow, setUserShow] = useState(true);
//   const [levelShow, setLevelShow] = useState(true);
//   const [relateShow, setRelateShow] = useState(true);
//   const [dataflag, setDataFlag] = useState(false);
//   const [formData, setFormData] = useState({});
//   const [levels, setLevels] = useState([]);
//   const [topic, setTopics] = useState([]);
//   const [ff, setFF] = useState({});
//   const [content, setContent] = useState([]);
//   const [state, setState] = useState("");
//   const [facilityFeilds, setFacilityFeilds] = useState({});
//   const [active, setActive] = useState(0);
//   let data = {};
//   useEffect(() => {
//     readData("facility-field").then((value) => {
//       if (value != null) {
//         data = JSON.parse(value);
//         setFF(data);
//         setDataFlag(true);
//       }
//     });
//   }, []);
//   useEffect(() => {
//     if (dataflag) {
//       let topicTemp = [];
//       let facilityFeildsTemp = {};
//       for (let index = 0; index < ff?.related.length; index++) {
//         if (!topicTemp.includes(ff?.related[index].topic)) {
//           topicTemp.push(ff?.related[index].topic);
//         }
//       }
//       for (let index = 0; index < topicTemp.length; index++) {
//         facilityFeildsTemp[topicTemp[index]] = [];
//       }
//       for (let index = 0; index < ff?.related.length; index++) {
//         let temp = facilityFeildsTemp[ff?.related[index].topic];
//         temp.push(ff?.related[index]);
//         facilityFeildsTemp[ff?.related[index].topic] = temp;
//       }
//       setTopics(topicTemp);
//       setFacilityFeilds(facilityFeildsTemp);
//       let levelTemp = [];
//       for (let index = 0; index < ff?.levels.length; index++) {
//         levelTemp.push({
//           id: ff?.levels[index].id,
//           name: `${ff?.levels[index].id} - ${ff?.levels[index].name}`,
//           order: 1,
//           enabled: true,
//           paramid: ff?.levels[index].id,
//           minpop: ff?.levels[index].minpop,
//           maxpop: ff?.levels[index].maxpop,
//         });
//       }
//       setLevels(levelTemp);
//     }
//   }, [dataflag, ff]);
//   const sendFacility = (values) => {
//     checkConnected().then((res) => setConnectionState(res));
//     let send_facility = [];
//     readData("send-facility").then((x) => {
//       send_facility = JSON.parse(x);
//     });
//     let url = "";
//     readData("URL").then((x) => {
//       url = JSON.parse(x);
//     });
//     readData("token").then((token) => {
//       token = JSON.parse(token);
//       token = "Bearer".concat(" ", token);
//       if (connectionState) {
//         axios
//           .post(
//             "http://" + url + "/facilities/",
//             {
//               values,
//             },
//             {
//               headers: { Authorization: token },
//             }
//           )
//           .then((response) => {
//             console.log("response facility send: ", response);
//           })
//           .catch((error) => {
//             if (send_facility != null) {
//               send_facility.push(values);
//               removeItemValue("send-facility").then(() => "");
//               saveData("send-facility", send_facility).then(() => "");
//             } else {
//               send_facility = [values];
//               saveData("send-facility", send_facility).then(() => "");
//             }
//             console.log("errors facility send: ", error);
//           });
//       } else {
//         console.log("Internet connection is off");
//         if (send_facility != null) {
//           send_facility.push(values);
//           removeItemValue("send-facility").then(() => "");
//           saveData("send-facility", send_facility).then(() => "");
//         } else {
//           send_facility = [values];
//           saveData("send-facility", send_facility).then(() => "");
//         }
//       }
//     });
//   };

//   const signUpValidationSchema = yup.object().shape({
//     // subject: yup.string().required("Subjecr is required"),
//   });
//   const initialValues = {
//     subject: "",
//     receivers: [],
//     body: "",
//   };
//   console.log("levels: ", levels);
//   return (
//     <ScrollView>
//       {Object.keys(levels).length > 0 ? (
//         <View>
//           <Input
//             value={"Add Facility"}
//             setValue={setState}
//             placeholder={"Facility Name"}
//             disabled={false}
//           />
//           <Input
//             value={state}
//             setValue={setState}
//             placeholder={"Facility Name"}
//           />
//           <SelectInput
//             data={() => DataFormating(levels, "key")}
//             setSelected={setState}
//             placeholder={"Select Levels"}
//             type={"single"}
//           />
//         </View>
//       ) : (
//         <></>
//       )}
//       {Object.keys(ff).length !== 0 ? (
//         <StepperContainer>
//           {
//             <MyStepper
//               topic={topic}
//               facilityFeilds={facilityFeilds}
//               state={state}
//               setState={setState}
//             />
//           }
//         </StepperContainer>
//       ) : (
//         <></>
//       )}
//       {/* <StepperContainer>
//         <StepView title="Intro" subTitle="The intro details">
//           <Text>Step 1 Contents</Text>
//         </StepView>
//         <StepView
//           title="Second"
//           onNext={() => true}
//           subTitle="Name and other details"
//         >
//           <Text>Step 2 Contents</Text>
//         </StepView>
//         <StepView title="Third Step" subTitle="Some lines">
//           <Text>Step 3 Contents …!</Text>
//         </StepView>
//         <StepView title="Last Step" subTitle="Finishing lines">
//           <Text>Step 4 Contents …!</Text>
//         </StepView>
//       </StepperContainer> */}
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     alignItems: "center",
//     padding: 10,
//   },
//   logo: {
//     flex: 1,
//     marginTop: 3,
//     marginLeft: 100,
//     width: 25,
//     height: 25,
//   },
//   container: {
//     flex: 1,
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 10,
//     paddingTop: 30,
//     backgroundColor: "#fff",
//   },
//   head: { height: 40, backgroundColor: "#f1f8ff" },
//   text: { margin: 6 },
// });

const parentFacilityField = {
  id: "parent-facility",
  type: "text",
  active: false,
  disabled: true,
  stateName: "parentName",
};
const center = [52.22977, 21.01178];
// delete L.Icon.Default.prototype._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
//   iconUrl: require("leaflet/dist/images/marker-icon.png"),
//   shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
// });
// /**
//  * @compoenent location marker compnent
//  * @return {JSX} marker tag
//  */
// function LocationMarker() {
//   const [position, setPosition] = useState(null);
//   const map = useMapEvents({
//     click() {
//       map.locate();
//       map.invalidateSize();
//     },
//     locationfound(e) {
//       setPosition(e.latlng);
//       map.flyTo(e.latlng, map.getZoom());
//     },
//   });

//   return position === null ? null : (
//     <Marker position={position}>
//       <Popup>You are here</Popup>
//     </Marker>
//   );
// }
// /**
//  *
//  * @param {*} props
//  * @returns {JSX} get user cordinates from gps
//  */
// const GetCoordinates = (props) => {
//   const map = useMap();
//   const handleClick = (e) => {
//     window.handleMapClick(e);
//   };

//   useEffect(() => {
//     if (!map) return;
//     const info = L.DomUtil.create("div", "legend");

//     const positon = L.Control.extend({
//       options: {
//         position: "bottomleft",
//       },

//       onAdd: function () {
//         info.textContent = "Click on map too add location";
//         return info;
//       },
//     });
//     map.on("load", (e) => {
//       console.log("salam");
//     });
//     map.on("click", (e) => {
//       info.textContent = e.latlng;
//       handleClick(e);
//     });

//     map.addControl(new positon());
//   }, [map]);

//   return null;
// };
// /**
//  *
//  * @returns {JSX} return facility component
//  */
function AddFacilityScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [fieldsValue, setFieldValue] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [levels, setLevels] = useState([]);

  const { id } = useParams();
  const history = useHistory();
  const params = new URLSearchParams(history.location.search);
  const pid = params.get("pid");
  const [map, setMap] = useState(null);
  const [Current, sercurrent] = useState([]);
  const [x1, setx1] = useState(null);
  const [x2, setx2] = useState(null);

  const { isLoading: isFacilityDefaultLoading } = useQuery(
    ["facility-default-value", id],
    async () => {
      const defaultData = {
        code: "Unique code generated by system",
        updated_at: new Date().toISOString().split("T")[0],
      };

      if (id === "new") {
        if (!navigator.geolocation) {
          toast.error("cannot get location");
        }

        setx1(
          JSON.parse(localStorage.getItem("country")) === null
            ? 35
            : JSON.parse(localStorage.getItem("country"))["mainlocation"] ===
              undefined
            ? 35
            : JSON.parse(localStorage.getItem("country"))
                ["mainlocation"]?.split("(")[1]
                ?.split(",")[0]
        );
        setx2(
          JSON.parse(localStorage.getItem("country")) === null
            ? 51
            : JSON.parse(localStorage.getItem("country"))["mainlocation"] ===
              undefined
            ? 51
            : JSON.parse(localStorage.getItem("country"))
                ["mainlocation"]?.split(",")[1]
                ?.split(")")[0]
        );

        return defaultData;
      }
      const params = {
        id: id,
      };
      const res = await FacilitiesService.getFacilities(params);
      const result = { ...res.data, defaultData };
      result["populationnumber"] = separator(result["populationnumber"]);
      result["loverlevelfac"] = separator(result["loverlevelfac"]);
      result["childrennumber"] = separator(result["childrennumber"]);
      const gps = result["gpsCordinate"];
      if (gps) {
        let x11 = gps.split("(")[1]?.split(",")[0];
        let x22 = gps.split(",")[1]?.split(")")[0];
        setx1(x11);
        setx2(x22);
        setMap([x11, x22]);
      } else {
        setx1(
          JSON.parse(localStorage.getItem("country")) === null
            ? 35
            : JSON.parse(localStorage.getItem("country"))["mainlocation"] ===
              undefined
            ? 35
            : JSON.parse(localStorage.getItem("country"))
                ["mainlocation"]?.split("(")[1]
                ?.split(",")[0]
        );
        setx2(
          JSON.parse(localStorage.getItem("country")) === null
            ? 51
            : JSON.parse(localStorage.getItem("country"))["mainlocation"] ===
              undefined
            ? 51
            : JSON.parse(localStorage.getItem("country"))
                ["mainlocation"]?.split(",")[1]
                ?.split(")")[0]
        );
      }
      for (const key in result) {
        if (typeof result[key] === "number") {
          if (result[key] % 1 !== 0) {
            result[key] = result[key]
              .toFixed(2)
              .toString()
              .replace(".", seperator());
          }
        }
      }
      return result;
    },
    {
      refetchOnMount: true,
      onSuccess(data) {
        setFieldValue(data);
      },
    }
  );

  const { data: facilityFields, isLoading: isFacilitiesFields } = useQuery(
    ["facility-fields"],
    async () => {
      const params = {};
      params["id"] = id;
      if (pid) {
        params["parent"] = pid;
      }
      const res = await FacilitiesService.getFacilityFields(params);
      const result = {};
      if (res.data) {
        for (const field of res.data.related) {
          if (field.stateName === "name") {
            continue;
          }
          const fieldTopicInResult = result[field.topic] ?? [];
          fieldTopicInResult.push(field);
          result[field.topic] = fieldTopicInResult;
        }
        const firstTopic = Object.keys(result)[0];
        //static fields
        setLevels(
          res.data.levels.map((level) => ({
            id: level.id,
            name: `${level.id} - ${level.name}`,
            order: 1,
            enabled: true,
            paramid: level.id,
            minpop: level.minpop,
            maxpop: level.maxpop,
          }))
        );

        result[firstTopic].unshift({
          id: "code",
          name: "Facility code:",
          topic: firstTopic,
          type: "text",
          active: false,
          disabled: true,
          required: false,
          stateName: "code",
          params: [],
        });

        setFieldValue((perFieldsValue) => ({
          ...perFieldsValue,
          completerstaffname:
            perFieldsValue?.completerstaffname ?? res.data.user.username,
          parentName: res.data.facility.name,
        }));
      }
      return result;
    },
    {
      refetchOnMount: true,
    }
  );

  if (isFacilityDefaultLoading || isFacilitiesFields) {
    return <Spinner />;
  }

  const facilityNameField = {
    id: "name",
    type: "text",
    active: activeStep === 0,
    required: true,
    disabled: activeStep !== 0,
    stateName: "name",
  };

  const levelField = {
    id: "level",
    type: "select",
    active: activeStep === 0 && id === "new",
    required: true,
    disabled: activeStep !== 0 || id != "new",
    stateName: "level",
    params: levels,
  };

  const hasRequiredErrors = () => {
    const _fieldErrors = { ...fieldErrors };
    const currentStepFields = [...Object.values(facilityFields)[activeStep]];
    if (activeStep === 0) {
      currentStepFields.push(levelField);
      currentStepFields.push(facilityNameField);
    }
    currentStepFields.forEach((field) => {
      console.log(fieldsValue[field.stateName]);
      if (
        field.required &&
        !fieldsValue[field.stateName] &&
        !isRelatedFieldOkReq(field.stateName, fieldsValue) &&
        fieldsValue[field.stateName] !== 0
      ) {
        if (field.type === "bool") {
          if (
            fieldsValue[field.stateName] === undefined ||
            fieldsValue[field.stateName] === null
          ) {
            _fieldErrors[field.stateName] = "this field is required!";
          }
        } else {
          _fieldErrors[field.stateName] = "this field is required!";
        }
      }
    });
    for (const key in relatedFields) {
      const fields = relatedFields[key];
      console.log(typeof fieldsValue[key]);
      if (key === "is_suitable") {
        if (fieldsValue[key] === true) {
          fields.forEach((field) => {
            console.log(field);
            delete _fieldErrors[field];
          });
        }
      } else {
        if (fieldsValue[key] === false) {
          fields.forEach((field) => {
            console.log(field);
            delete _fieldErrors[field];
          });
        }
      }
    }
    setFieldErrors(_fieldErrors);
    return Object.keys(_fieldErrors).length > 0;
  };

  const handleNext = () => {
    if (!hasRequiredErrors()) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setFieldErrors({});
  };

  const onChangeHandler = (value, field) => {
    const validation = field.validation?.[0];
    if (
      JSON.parse(localStorage.getItem("country"))["poptarget"] ===
        "General population" &&
      field.stateName === "populationnumber"
    ) {
      validation.min = +selectedLevel?.minpop;
      validation.max = +selectedLevel?.maxpop;
    }
    if (
      JSON.parse(localStorage.getItem("country"))["poptarget"] ===
        "Under-1 Population" &&
      field.stateName === "childrennumber"
    ) {
      validation.min = +selectedLevel?.minpop;
      validation.max = +selectedLevel?.maxpop;
    }

    let validationErr;
    if (field.name?.includes("hh:mm")) {
      validationErr = timeValidationError(value);
    } else {
      validationErr = hasValidationError(value, validation);
    }
    const cloneFieldsValue = { ...fieldsValue };
    cloneFieldsValue[field.stateName] = value;
    if (field.stateName === "level") {
      cloneFieldsValue[field.stateName] = parseInt(value);
    }
    setFieldValue(cloneFieldsValue);
    //check validation and required
    const _fieldErrors = { ...fieldErrors };
    if (validationErr) {
      _fieldErrors[field.stateName] = validationErr;
    } else {
      delete _fieldErrors[field.stateName];
    }
    for (const key in relatedFields) {
      const fields = relatedFields[key];
      if (fieldsValue[key] === true) {
        fields.forEach((field) => {
          delete _fieldErrors[field];
        });
      }
    }
    setFieldErrors(_fieldErrors);
  };

  const onSaveHandler = async (e) => {
    e.preventDefault();

    if (hasRequiredErrors()) {
      return;
    }
    const _fieldsValue = { ...fieldsValue };
    for (const key in relatedFields) {
      const fields = relatedFields[key];
      if (key === "is_suitable") {
        if (fieldsValue[key] === true) {
          fields.forEach((field) => {
            delete _fieldsValue[field];
          });
        }
      } else {
        if (fieldsValue[key] === false) {
          fields.forEach((field) => {
            delete _fieldsValue[field];
          });
        }
      }
    }
    if (_fieldsValue["childrennumber"]) {
      const _value = _fieldsValue["childrennumber"].replaceAll(" ", "");
      _fieldsValue["childrennumber"] = +_value;
    }
    if (_fieldsValue["populationnumber"]) {
      const _value = _fieldsValue["populationnumber"].replaceAll(" ", "");
      _fieldsValue["populationnumber"] = +_value;
    }
    if (_fieldsValue["loverlevelfac"]) {
      const _value = _fieldsValue["loverlevelfac"].replaceAll(" ", "");
      _fieldsValue["loverlevelfac"] = +_value;
    }
    // for in _fieldsValue
    for (const key in _fieldsValue) {
      const field = Object.values(facilityFields)
        .flat()
        .find((field) => field.stateName === key);
      if (field === undefined) {
        continue;
      }
      if (_fieldsValue[key] === "") {
        delete _fieldsValue[key];
      }
      if (typeof _fieldsValue[key] === "string") {
        // find this field

        if (field.type === "number") {
          _fieldsValue[key] = parseFloat(_fieldsValue[key].replace(",", "."));
        }
      }
    }
    const page = window.event.submitter.name === "saveNew" ? "new" : "edit";

    const res = await (id === "new"
      ? FacilitiesService.postFacility(_fieldsValue)
      : FacilitiesService.putFacility(_fieldsValue));
    if (page === "new") {
      window.location.reload();
    } else {
      history.push(`/facilities/list`);
    }
  };

  const handleMapClick = async (e) => {
    setMap(e.latlng);
    const cloneFieldsValue = { ...fieldsValue };
    let str = "LatLng(" + e.latlng.lat + "," + e.latlng.lng + ")";
    cloneFieldsValue["gpsCordinate"] = str;
    setFieldValue(cloneFieldsValue);
  };
  window.handleMapClick = handleMapClick;

  const selectedLevel = levels.find((level) => level.id === fieldsValue.level);
  return (
    <form onSubmit={onSaveHandler}>
      <h3 className="page-title mb-3">
        <Trans>Facility information</Trans>
      </h3>
      <div className="mt-3">
        <div className="card">
          <div className="card-body pb-3">
            <div className="row pb-4" style={{ overflow: "auto" }}>
              <Stepper activeStep={activeStep}>
                {Object.keys(facilityFields).map((topic, index) => {
                  return (
                    <Step key={topic}>
                      <StepLabel style={{ width: "max-content" }}>
                        <Trans>{topic}</Trans>
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
            </div>
            <StepOperations
              handleBack={handleBack}
              handleNext={handleNext}
              activeStep={activeStep}
              id={id}
              stepsLength={Object.keys(facilityFields).length - 1}
              isNextDisabled={Object.keys(fieldErrors).length > 0}
            />
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="card">
          <div className="card-body pb-3">
            <div className="row ">
              <Form.Group className="row mb-0">
                <label
                  className={`col-sm-4 text-right`}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    lineHeight: "1.4",
                    textAlign: "right",
                  }}
                >
                  <Trans>Parent facility</Trans>:
                </label>
                <div className={"col-sm-8"}>
                  <DynamicInput
                    field={parentFacilityField}
                    defaultValue={fieldsValue["parentName"]}
                  />
                </div>
              </Form.Group>
            </div>
            <div className="row">
              <Form.Group className="row mb-0 mt-3">
                <label
                  className={`col-sm-4 text-right control-label`}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    lineHeight: "1.4",
                    textAlign: "right",
                  }}
                >
                  <Trans>Facility Name</Trans>:
                </label>
                <div className={"col-sm-8"}>
                  <DynamicInput
                    field={facilityNameField}
                    defaultValue={fieldsValue["name"]}
                    onChangeHandler={onChangeHandler}
                  />
                </div>
                {fieldErrors["name"] && (
                  <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-8">
                      <p className="my-1 ml-2 text-danger">
                        {fieldErrors["name"]}
                      </p>
                    </div>
                  </div>
                )}
              </Form.Group>
            </div>

            <div className="row mt-3">
              <Form.Group className="row mb-0">
                <label
                  className={`col-sm-4 text-right control-label`}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    lineHeight: "1.4",
                    textAlign: "right",
                  }}
                >
                  <Trans>Levels</Trans>:
                </label>
                <div className={"col-sm-8"}>
                  <DynamicInput
                    field={levelField}
                    defaultValue={fieldsValue["level"]}
                    onChangeHandler={onChangeHandler}
                  />
                </div>
                {fieldErrors["level"] && (
                  <div className="row">
                    <div className="col-sm-4"></div>
                    <div className="col-sm-8">
                      <p className="my-1 ml-2 text-danger">
                        {fieldErrors["level"]}
                      </p>
                    </div>
                  </div>
                )}
              </Form.Group>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3">
        <div className="card">
          <div className="card-body">
            {Object.values(facilityFields)[activeStep]?.map((field) => {
              if (!isRelatedFieldOk(field.stateName, fieldsValue)) {
                return null;
              }

              const hasRequiredError = !!fieldErrors[field.stateName];
              return (
                <Form.Group className="row mb-0" key={field.name}>
                  <label
                    className={`col-sm-4  ${
                      field.required ? "control-label" : ""
                    }`}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      alignItems: "center",
                      lineHeight: "1.4",
                      textAlign: "right",
                    }}
                  >
                    {field.name}
                  </label>
                  <div className="col-sm-8">
                    {field.stateName === "gpsCordinate" ? (
                      <div className="map  ">
                        <div className="mb-2">
                          <Form.Control
                            type="text"
                            disabled
                            value={fieldsValue[field.stateName]}
                          />
                        </div>
                        <div className="map">
                          {Current !== null && x1 && x2 && (
                            // <MapContainer
                            //   center={[x1, x2]}
                            //   zoom={10}
                            //   scrollWheelZoom={true}
                            //   style={{
                            //     width: "100%",
                            //     height: "450px",
                            //     zIndex: "1",
                            //   }}

                            //   //   onClick={this.handlemapclick}
                            // >
                            //   <TileLayer
                            //     {...{
                            //       url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                            //       width: 500,
                            //     }}
                            //   />

                            //   <GetCoordinates
                            //     change={handleMapClick}
                            //     fields={fieldsValue}
                            //     setFields={setFieldValue}
                            //     map={map}
                            //     setMap={setMap}
                            //   />
                            //   <>
                            //     {map && (
                            //       <Marker position={map} draggable={true}>
                            //         <Popup position={map}>
                            //           Current location:{" "}
                            //           <pre>{JSON.stringify(map, null, 2)}</pre>
                            //         </Popup>
                            //       </Marker>
                            //     )}
                            //   </>
                            //   <LocationMarker />
                            // </MapContainer>
                            <MapView
                              initialRegion={{
                                latitude: 37.78825,
                                longitude: -122.4324,
                                latitudeDelta: 0.0922,
                                longitudeDelta: 0.0421,
                              }}
                            />
                          )}
                        </div>
                        <button
                          className="btn btn-primary mt-2 w-50"
                          onClick={(e) => {
                            e.preventDefault();
                            navigator.geolocation.getCurrentPosition(
                              (pos) => {
                                const { latitude, longitude } = pos.coords;
                                console.log(pos);
                                const data = {
                                  latlng: {
                                    lat: latitude,
                                    lng: longitude,
                                  },
                                };
                                setMap(data.latlng);
                                handleMapClick(data);
                              },
                              () => {},
                              { enableHighAccuracy: true }
                            );
                          }}
                        >
                          Get current location
                        </button>
                      </div>
                    ) : (
                      <DynamicInput
                        field={field}
                        onChangeHandler={onChangeHandler}
                        defaultValue={fieldsValue[field.stateName]}
                        separator={
                          field.stateName === "childrennumber" ||
                          field.stateName === "loverlevelfac" ||
                          field.stateName === "populationnumber"
                        }
                      />
                    )}
                    <br />
                    {JSON.parse(localStorage.getItem("country"))[
                      "poptarget"
                    ] === "General population" &&
                      field.stateName === "populationnumber" &&
                      selectedLevel && (
                        <p>
                          range: {separator(selectedLevel?.minpop)} -{" "}
                          {separator(selectedLevel?.maxpop)}
                        </p>
                      )}
                    {JSON.parse(localStorage.getItem("country"))[
                      "poptarget"
                    ] === "Under-1 Population" &&
                      field.stateName === "childrennumber" &&
                      selectedLevel && (
                        <p>
                          range: {separator(selectedLevel?.minpop)} -{" "}
                          {separator(selectedLevel?.maxpop)}
                        </p>
                      )}
                  </div>
                  {hasRequiredError && (
                    <div className="row">
                      <div className="col-sm-4"></div>
                      <div className="col-sm-8">
                        <p className="my-1 ml-2 text-danger">
                          <Trans>{fieldErrors[field.stateName]}</Trans>
                        </p>
                      </div>
                    </div>
                  )}
                  <hr className="my-3" />
                </Form.Group>
              );
            })}
          </div>
        </div>
      </div>
      <div className="mt-3 mb-3">
        <div className="card">
          <div className="card-body py-2">
            <StepOperations
              handleBack={handleBack}
              handleNext={handleNext}
              activeStep={activeStep}
              id={id}
              stepsLength={Object.keys(facilityFields).length - 1}
              isNextDisabled={Object.keys(fieldErrors).length > 0}
            />
          </div>
        </div>
      </div>
    </form>
  );
}

export default AddFacilityScreen;
