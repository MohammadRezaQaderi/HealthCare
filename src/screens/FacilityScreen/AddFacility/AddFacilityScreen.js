import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Text,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import React, { useEffect, useState } from "react";
import axios from "axios";
import InternetConnection from "../../../components/InternetConnection";

import * as yup from "yup";
import {
  checkConnected,
  readData,
  removeItemValue,
  saveData,
} from "../../../components/DataStorage";
// import plus from "../../../../assets/images/plus.png";
// import minus from "../../../../assets/images/minus.png";
// import DynamicInput from "../../../components/DynamicInput";
import Input from "../../../components/Input/CustomInput";
import SelectInput from "../../../components/SelectInput/SelectInput";
import { Form } from "validate-form-in-expo-style";

import { useQuery } from "react-query";
import FacilitiesService from "../../../services/facilities.service.js";
// import { useHistory, useParams } from "react-router-dom";
import Spinner from "../../../components/Loading/Spinner";
// import Stepper from "@mui/material/Stepper";
// import Step from "@mui/material/Step";
// import StepLabel from "@mui/material/StepLabel";
// import { Form } from "react-bootstrap";
import DynamicInput from "../../../components/DynamicInput/DynamicInput";
import {
  hasValidationError,
  timeValidationError,
} from "../../../helpers/validation-checker";
import {
  isRelatedFieldOk,
  relatedFields,
} from "../../../helpers/related-field";
import { isRelatedFieldOkReq } from "../../../helpers/related-field-req";

// import { Text } from "react-i18next";
import { separator } from "../../../helpers/separator";
// import StepOperations from "../components/StepOperations";
// import { useEffect } from "react";r
import { seperator } from "../../../helpers/seperator";


const parentFacilityField = {
  id: "parent-facility",
  type: "text",
  active: false,
  disabled: true,
  required: true,
  name: "Parent facility",
  stateName: "parentName",
};

/**
 *
 * @returns {JSX} return facility component
 */
function AddFacilityScreen({
  defaultValueFacility,
  setCurrentTab,
  setDefaultValueFacility,
  facilityParent,
}) {
  const [fieldsValue, setFieldValue] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [levels, setLevels] = useState([]);
  const [country, setCountry] = useState({});
  // const { id } = useParams();
  // const history = useHistory();
  // const params = new URLSearchParams(history.location.search);
  // const pid = params.get("pid");
  const [map, setMap] = useState(null);
  const [Current, sercurrent] = useState([]);
  const [x1, setx1] = useState(null);
  const [x2, setx2] = useState(null);
  const [facilityFields, setFacilityFields] = useState([]);

  const { isLoading: isFacilityDefaultLoading } = useQuery(
    ["facility-default-value"],
    async () => {
      const defaultData = {
        code: "Unique code generated by system",
        updated_at: new Date().toISOString().split("T")[0],
      };
      let size = Object.keys(defaultValueFacility).length;
      if (size === 0) {
        readData("country").then((country) => {
          setCountry(country);
          let x11 =
            JSON.parse(country) === null
              ? 35.0
              : JSON.parse(country)["mainlocation"] === undefined
              ? 35.0
              : JSON.parse(country)
                  ["mainlocation"]?.split("(")[1]
                  ?.split(",")[0];
          let x22 =
            JSON.parse(country) === null
              ? 51.0
              : JSON.parse(country)["mainlocation"] === undefined
              ? 51.0
              : JSON.parse(country)
                  ["mainlocation"]?.split(",")[1]
                  ?.split(")")[0];
          setx1(x11);
          setx2(x22);
          setMap({
            latitude: x11,
            longitude: x22,
          });
        });

        return defaultData;
      }

      const result = { ...defaultValueFacility, defaultData };
      result["populationnumber"] = separator(result["populationnumber"]);
      result["loverlevelfac"] = separator(result["loverlevelfac"]);
      result["childrennumber"] = separator(result["childrennumber"]);
      const gps = result["gpsCordinate"];
      if (gps) {
        let x11 = gps.split("(")[1]?.split(",")[0];
        let x22 = gps.split(",")[1]?.split(")")[0];
        setx1(x11);
        setx2(x22);
        setMap({
          latitude: x11,
          longitude: x22,
        });
      } else {
        console.log("mire injar");
        readData("country").then((country) => {
          console.log(country);
          setCountry(country);
          let x11 =
            JSON.parse(country) === null
              ? 35.0
              : JSON.parse(country)["mainlocation"] === undefined
              ? 35.0
              : JSON.parse(country)
                  ["mainlocation"]?.split("(")[1]
                  ?.split(",")[0];
          let x22 =
            JSON.parse(country) === null
              ? 51.0
              : JSON.parse(country)["mainlocation"] === undefined
              ? 51.0
              : JSON.parse(country)
                  ["mainlocation"]?.split(",")[1]
                  ?.split(")")[0];
          setx1(x11);
          setx2(x22);
          setMap({
            latitude: x11,
            longitude: x22,
          });
        });
      }
      // for (const key in result) {
      //   if (typeof result[key] === "number") {
      //     if (result[key] % 1 !== 0) {
      //       result[key] = result[key]
      //         .toFixed(2)
      //         .toString()
      //         .replace(".", seperator());
      //     }
      //   }
      // }
      return result;
    },
    {
      refetchOnMount: true,
      onSuccess(data) {
        console.log(data);
        setFieldValue(data);
      },
    }
  );

  const { data: xx, isLoading: isFacilitiesFields } = useQuery(
    ["facility-fields"],
    async () => {
      const params = {};
      // params["id"] = id;
      // if (pid) {
      //   params["parent"] = pid;
      // }
      // InternetConnection().then((res) => console.log(res));
      let token = "";
      const result = [];
      readData("country").then((country) => {
        setCountry(country);
      });
      readData("facility-field").then((x) => {
        if (x) {
          const res = JSON.parse(x);
          setLevels(
            res.levels.map((level) => ({
              id: level.id,
              name: `${level.id} - ${level.name}`,
              order: 1,
              enabled: true,
              paramid: level.id,
              minpop: level.minpop,
              maxpop: level.maxpop,
            }))
          );

          result.unshift({
            id: "code",
            name: "Facility code:",
            type: "text",
            active: false,
            disabled: true,
            required: false,
            stateName: "code",
            params: [],
          });
          for (const field of res.related) {
            if (field.stateName === "name") {
              continue;
            }
            result.push(field);
          }
          if (Object.keys(facilityParent).length === 0) {

            setFieldValue((perFieldsValue) => ({
              ...perFieldsValue,
              completerstaffname:
                perFieldsValue?.completerstaffname ?? res.user.username,
              parentName: facilityParent.name,
            }));
          }
          else{
          setFieldValue((perFieldsValue) => ({
            ...perFieldsValue,
            completerstaffname:
              perFieldsValue?.completerstaffname ?? res.user.username,
            parentName: res.facility.name,
          }));
        }
          setFacilityFields(result);
        } else {
          console.log("error");
        }
      });
    },
    {
      refetchOnMount: true,
    }
  );

  const facilityNameField = {
    id: "name",
    type: "text",
    active: true,
    required: true,
    name: "Facility name",
    disabled: false,
    stateName: "name",
  };

  const levelField = {
    id: "level",
    type: "select",
    active: true,
    required: true,
    name: "Levels",
    disabled: false,
    stateName: "level",
    params: levels,
  };

  const hasRequiredErrors = () => {
    const _fieldErrors = { ...fieldErrors };
    const currentStepFields = [...Object.values(facilityFields)];

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

  const onChangeHandler = (value, field) => {
    const validation = field.validation?.[0];
    if (
      JSON.parse(country)["poptarget"] === "General population" &&
      field.stateName === "populationnumber"
    ) {
      validation.min = +selectedLevel?.minpop;
      validation.max = +selectedLevel?.maxpop;
    }
    if (
      JSON.parse(country)["poptarget"] === "Under-1 Population" &&
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
    // console.log("cloneFieldsValue", cloneFieldsValue);
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
    console.log(fieldsValue);

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
      // check for statName type
      if (field.stateName === "type") {
        const type_id =field.params.find((type) => (_fieldsValue[key] === (type.id).toString() || _fieldsValue[key] === type.name )).id;
        _fieldsValue[key] = type_id;
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
    // const page = window.event.submitter.name === "saveNew" ? "new" : "edit";

    if(Object.keys(defaultValueFacility).length === 0){
      readData("send-facility").then((data) => {
        console.log("data",data);
        if(data === null){
          const temp = []
          temp.push(_fieldsValue);
          console.log("temp", temp);
          removeItemValue("send-facility");
          saveData("send-facility", temp);
          setCurrentTab("Facility List");
        }
        else{
          const temp =JSON.parse(data);
          temp.push(_fieldsValue);
          console.log("temp",temp);
          removeItemValue("send-facility");
          saveData("send-facility", temp);
      setCurrentTab("Facility List");
        }

      });

    }
    else{
      readData("edited-facility").then((data) => {
        if (data === null) {
          const temp = []
          temp.push(_fieldsValue);
          removeItemValue("edited-facility");
          saveData("edited-facility", temp);
          setCurrentTab("Facility List");
        
        }
        else{
          const temp = JSON.parse(data);
          temp.push(_fieldsValue);
          removeItemValue("edited-facility");
          saveData("edited-facility", temp);
          setCurrentTab("Facility List");
        }

      });
    }
    // const res = await (id === "new"
    //   ? FacilitiesService.postFacility(_fieldsValue)
    //   : FacilitiesService.putFacility(_fieldsValue));
   
      // if (page === "new") {
    //   window.location.reload();
    // } else {
    //   history.push(`/facilities/list`);
    // }
  };

  const handleMapClick = async (e) => {
    const cor = e.nativeEvent.coordinate;
    setMap(cor);
    const cloneFieldsValue = { ...fieldsValue };
    let str = "LatLng(" + cor.latitude + "," + cor.longitude + ")";
    cloneFieldsValue["gpsCordinate"] = str;
    setFieldValue(cloneFieldsValue);
  };
  window.handleMapClick = handleMapClick;

  const selectedLevel = levels.find((level) => level.id === fieldsValue.level);
  if (isFacilityDefaultLoading || isFacilitiesFields) {
    return (
      <ScrollView>
        <View>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </ScrollView>
    );
  } else {
    return (
      <>
      <ScrollView style={styles.newfac}>
        <View>
          <Form onSubmit={onSaveHandler}>
            
            <View>
              <DynamicInput
                field={parentFacilityField}
                defaultValue={fieldsValue["parentName"]}
              />
              <DynamicInput
                field={facilityNameField}
                defaultValue={fieldsValue["name"]}
                onChangeHandler={onChangeHandler}
              />
              <DynamicInput
                field={levelField}
                defaultValue={fieldsValue["level"]}
                onChangeHandler={onChangeHandler}
              />
              {fieldErrors["level"] && <Text>{fieldErrors["level"]}</Text>}
            </View>
            <View>
              {facilityFields !== undefined &&
                Object.values(facilityFields)?.map((field) => {
                  if (!isRelatedFieldOk(field.stateName, fieldsValue)) {
                    return null;
                  }

                  const hasRequiredError = !!fieldErrors[field.stateName];
                  return (
                    <View key={field.stateName}>
                      {field.stateName === "gpsCordinate" ? (
                        <View>
                          {Current !== null && x1 && x2 ? (
                            <View>
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
                              <View style={styles.container}>
                                <MapView
                                  style={styles.map}
                                  onPress={handleMapClick}
                                >
                                  {console.log(map)}
                                  {map && (
                                    <Marker
                                      coordinate={map}
                                      title={"Facility Cordinates"}
                                      description={
                                        "latitude: " +
                                        map.latitude.toString() +
                                        "  longitude: " +
                                        map.longitude.toString()
                                      }
                                    />
                                  )}
                                </MapView>
                              </View>
                            </View>
                          ) : null}
                        </View>
                      ) : (
                        <View>
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
                        </View>
                      )}
                      {JSON.parse(country)["poptarget"] ===
                        "General population" &&
                      field.stateName === "populationnumber" &&
                      selectedLevel ? (
                        <Text style={styles.rangeStyle}>
                          range: {separator(selectedLevel?.minpop)} -{" "}
                          {separator(selectedLevel?.maxpop)}
                        </Text>
                      ) : null}
                      {JSON.parse(country)["poptarget"] ===
                        "Under-1 Population" &&
                      field.stateName === "childrennumber" &&
                      selectedLevel ? (
                        <Text style={styles.rangeStyle}>
                          range: {separator(selectedLevel?.minpop)} -{" "}
                          {separator(selectedLevel?.maxpop)}
                        </Text>
                      ) : null}
                      {hasRequiredError ? (
                        <View>
                          <Text style={styles.error}>
                            {" "}
                            {fieldErrors[field.stateName]}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  );
                })}
            </View>
            
          </Form>
        </View>
      </ScrollView>
      
      <TouchableOpacity
              activeOpacity={0.8}
              onPress={onSaveHandler}
              style={styles.appButtonContainer}
            >
              <Text style={styles.appButtonText}>Save all</Text>
            </TouchableOpacity>
      </>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: (Dimensions.get("window").width)/100*85,
    height: (Dimensions.get("window").height)/100*40,
    marginBottom: 20,
  },
  appButtonContainer: {
    elevation: 8,
    backgroundColor: "#009688",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    position: "absolute",
    bottom: 0,
    left: "34%",
    marginTop: 10,
    marginBottom: 10,
  },
  appButtonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    alignSelf: "center",
    textTransform: "uppercase",
  },
  newfac: {
    padding: 2,
    height: "85%",
  },
  error: {
    color: "red",
    fontSize: 12,
  },
  rangeStyle: {
    color: "red",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 10,
  },
});
export default AddFacilityScreen;
