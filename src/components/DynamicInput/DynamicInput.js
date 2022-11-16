// import { Form } from "react-bootstrap";
import { separator as thousandSeparator } from "../../helpers/separator";
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Dimensions,
  PixelRatio
} from "react-native";
import SelectDropdown from "react-native-select-dropdown";
import constants from "expo-constants";

// import { components } from "react-select";
// import { default as ReactSelect } from "react-select";
import { Picker } from "@react-native-picker/picker";
// import { Translation, Trans } from "react-i18next";
// import i18n from "../../i18n";
import {  InputText } from "validate-form-in-expo-style";
import { FontAwesome, Feather } from "@expo/vector-icons";
import { useState } from "react";
import React from "react";
/**
 * define two constant for numbers input type
 * @param  {number} numericKeys numbers with floating point
 * @param  {number} num1 numbers without floating point
 */
let numericKeys = "0123456789.:";
const num1 = "0123456789";
/**
 * @param  {options} props
 * @param  {string} props.label label of option input
 * @param  {string} props.isSelected if true, the option is selected
 * @param  {string} props opyions of selectt
 * component for multi select options 
 */
const hp = (heightPercent) => {
  const elemHeight =
    typeof heightPercent === "number"
      ? heightPercent
      : parseFloat(heightPercent);

  return PixelRatio.roundToNearestPixel((Dimensions.screenHeight * elemHeight) / 100);
};
const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>
          <Trans>{props.label}</Trans>
        </label>
      </components.Option>
    </div>
  );
};
/**
 * @param  {props} props some props for the component writeen in below
 * component for handle inputs in facility and item fields
 * look field type get from backedn then set the input type
 * 
 */
const DynamicInput = (props) => {
  /**
   * @constant  {JSON} field filed of input
   * @function  {function} onChangeHandler function for when input is changed
   * @constant {Value} value value of input if in edit mode
   * @constant {seperator} check input has seperator or not 
   */
  const { field, onChangeHandler, defaultValue, separator } = props;
  const [selected, setSelected] = useState([]);
  // check if type of fieled is select
  // for better undrstading of this code, look at the backend response
  if (field.type === "select") {
    // we need to hard code the other_service becouse just this select is multiple choice
    if (field.stateName !== "other_services") {
      const data=[];
      field.params.map((param) => {
            const disabled=param.enabled
                  ? !param.enabled
                  : param.active
                  ? !param.active
                  : !param.enable
                if(!disabled){
                  data.push({ value: param.name, key: param.id });
                }
      });


    
      return (
        <SelectDropdown
          data={data}
          defaultButtonText={field.name}
          onSelect={(selectedItem, index) => {
            onChangeHandler(selectedItem.key.toString(), field);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem.value;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item.value;
          }}
        />
      );
//         
    } else {
      const options = [];
      let selecteda = [];
      // console.log(selecteda);
      // for other_services we need to set the options and selected values to the format of componenet
      for (let i = 0; i < field.params.length; i++) {
        let disabled = field.params[i].enabled
          ? !field.params[i].enabled
          : field.params[i].active
          ? !field.params[i].active
          : !field.params[i].enable;
        let selecteds =
          defaultValue !== undefined &&
          defaultValue !== null &&
          defaultValue.includes(field.params[i].id)
            ? true
            : false;
        if (!disabled) {
          options.push({
            name: field.params[i].name || field.params[i].describe,
            id: field.params[i].id,
          });
        }
        if (selecteds) {
          selecteda.push({
            name: field.params[i].name || field.params[i].describe,
            id: field.params[i].id,
          });
        }
      }

      return (
        <MultiSelect
          hideTags
          items={options}
          uniqueKey="id"
          onSelectedItemsChange={(e) => {
            // console.log(e);
            let x = [];
            let y = "";
            if (e !== null) {
              for (let i = 0; i < e.length; i++) {
                x.push(e[i].id);
                y += e[i].id;
              }
              setSelected(e);
              selecteda = e;
              onChangeHandler(y, field);
            } else {
              onChangeHandler("", field);
              setSelected([]);
              selecteda = [];
            }
          }}
          selectedItems={selecteda}
          selectText="Pick Items"
          searchInputPlaceholderText="Search Items..."
          // onChangeInput={(text) => console.log(text)}
          altFontFamily="ProximaNova-Light"
          tagRemoveIconColor="#CCC"
          tagBorderColor="#CCC"
          tagTextColor="#CCC"
          key={field.id}
          selectedItemTextColor="#CCC"
          selectedItemIconColor="#CCC"
          itemTextColor="#000"
          displayKey="name"
          searchInputStyle={{ color: "#CCC" }}
          submitButtonColor="#CCC"
          submitButtonText="Submit"
        />
        // <ReactSelect
        //   options={options}
        //   isMulti
        //   closeMenuOnSelect={false}
        //   hideSelectedOptions={false}
        //   components={{
        //     Option,
        //   }}
        //   // add all others selected options to this option
        //   onChange={(e) => {
        //     console.log(e);
        //     let x = [];
        //     let y = "";
        //     if (e !== null) {
        //       for (let i = 0; i < e.length; i++) {
        //         x.push(e[i].value);
        //         y += e[i].value;
        //       }
        //       setSelected(e);
        //       selecteda = e;
        //       onChangeHandler(y, field);
        //     } else {
        //       onChangeHandler("", field);
        //       setSelected([]);
        //       selecteda = [];
        //     }
        //   }}
        //   allowSelectAll={true}
        //   value={selected.length > 0 ? selected : selecteda}
        // />
      );
    }
  }
// check for boolean type
  if (field.type === "bool") {
    const data =[]
    data.push({ value: "Please select", key: "" });
    data.push({ value: "Yes", key: true });
    data.push({ value: "No", key: false });

    return (
      <>
        <SelectDropdown
          data={data}
          defaultButtonText={field.name}
          onSelect={(selectedItem, index) => {
            onChangeHandler(selectedItem.key.toString(), field);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem.value;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item.value;
          }}
        />
        {/* <Picker
          selectedValue={defaultValue}
          enabled={field.active ? field.active : !field.disabled}
          id={`field-${field.id}`}
          onValueChange={(itemValue, itemIndex) => {
            onChangeHandler(itemValue === "true", field);
          }}
        >
          <Picker.Item label="Please select" value="" />
          <Picker.Item label="Yes" value={true} key="xx" />
          <Picker.Item label="No" value={false} key="xy" />
        </Picker> */}
      </>
    );
  }
  // change the decimal pointing to selected language
  // if ((i18n.language != "en") & (i18n.language != "ar")) {
  //   numericKeys = "0123456789,:";
  // }
  // validation for field if it have data comes from Backend APi
  const validation = field.validation?.[0];
  if (field.type === "number") {
    const validateNames = [];
    const texts=[];
    let keyboardType ="";
    
    if(validation.float){
      validateNames.push("isFloat");
      texts.push("Please enter a valid Float number");
      keyboardType = "decimal-pad";
    }
    else{
      texts.push("Please enter a valid number");
      validateNames.push("isNumber");
      keyboardType = "number-pad";
    }
    if (validation.min !==-1) {
      validateNames.push("minNumber:"+validation.min);
      texts.push("Please enter a number greater than or equal to "+validation.min);
    }
    if (validation.max !== -1) {
      validateNames.push("maxNumber:" + validation.max);
      texts.push("Please enter a number less than or equal to "+validation.max);
    }
    if (field.required) {
      validateNames.push("required");
      texts.push("This field is required");
    }
   


    return (
      <InputText
        name={field.name}
        label={field.name}
        key={field.id}
        onKeyPress={(e) => {
          e.persist();
          if (field.type === "number") {
            if (validation && validation?.float) {
              // if field is number and have float validation
              // just allow numbers and decimal point come from language
              if (numericKeys.indexOf(e.key) === -1) {
                e.preventDefault();
                return;
              }
            } else if (validation && validation?.float === false) {
              // if field is number and have not float validation
              if (num1.indexOf(e.key) === -1) {
                e.preventDefault();
                return;
              }
            }
          }
          // change the decimal pointing to selected language
          onChangeHandler(e.target.value, field);
        }}
        keyboardType="numeric"
        placeholder={field.name}
        validateNames={validateNames}
        errorMessages={texts}
        value={defaultValue}
        type="text"
        editable={field.active ? field.active : !field.disabled}
        id={`field-${field.id}`}
        leftIcon={<FontAwesome name="user-o" color="#0A3055" size={20} />}
        invalidIcon={<Feather name="alert-circle" color="red" size={20} />}
        validIcon={<Feather name="check-circle" color="green" size={20} />}
        labelStyle={styles.labelStyle}
        style={[styles.inputStyle]}
        containerStyle={styles.inputContainerStyle}
        floatingTopValue={hp("1%")}
        floatingFontSize={hp("0.5%")}
        onChange={(e, target, text) => onChangeHandler(text, field)}
        onBlur={(e) => {
          e.persist();
          // check for seperator
          if (separator) {
            const formatted = thousandSeparator(e.target.value);
            onChangeHandler(formatted, field);
          }
        }}
      />
    );
  }
  return (
    <InputText
      name={field.name}
      label={field.name}

      onKeyPress={(e) => {
        e.persist();
        if (field.type === "number") {
          if (validation && validation?.float) {
            // if field is number and have float validation
            // just allow numbers and decimal point come from language
            if (numericKeys.indexOf(e.key) === -1) {
              e.preventDefault();
              return;
            }
          } else if (validation && validation?.float === false) {
            // if field is number and have not float validation
            if (num1.indexOf(e.key) === -1) {
              e.preventDefault();
              return;
            }
          }
        }
        // change the decimal pointing to selected language
        onChangeHandler(e.target.value, field);
      }}
      placeholder={field.name}
      validateNames={field.required ? ["required"] : []}
      errorMessages={
        field.required ? ["required"] : []      }
      value={defaultValue}
      type="text"
      editable={field.active ? field.active : !field.disabled}
      id={`field-${field.id}`}
      leftIcon={<FontAwesome name="user-o" color="#0A3055" size={20} />}
      invalidIcon={<Feather name="alert-circle" color="red" size={20} />}
      validIcon={<Feather name="check-circle" color="green" size={20} />}
      labelStyle={styles.labelStyle}
      style={[styles.inputStyle]}
      containerStyle={styles.inputContainerStyle}
      floatingTopValue={hp("1%")}
      floatingFontSize={hp("0.5%")}
      onChange={(e, target, text) => onChangeHandler(text, field)}
      onBlur={(e) => {
        e.persist();
        // check for seperator
        if (separator) {
          const formatted = thousandSeparator(e.target.value);
          onChangeHandler(formatted, field);
        }
      }}
    />
    // <Form.Control
    //   onKeyPress={(e) => {
    //     e.persist();
    //     if (field.type === "number") {
    //       if (validation && validation?.float) {
    //         // if field is number and have float validation
    //         // just allow numbers and decimal point come from language
    //         if (numericKeys.indexOf(e.key) === -1) {
    //           e.preventDefault();
    //           return;
    //         }
    //       } else if (validation && validation?.float === false) {
    //         // if field is number and have not float validation
    //         if (num1.indexOf(e.key) === -1) {
    //           e.preventDefault();
    //           return;
    //         }
    //       }
    //     }
    //     // change the decimal pointing to selected language
    //     onChangeHandler(e.target.value, field);
    //   }}
    //   lang="en-US"
    //   onChange={(e,target,text) => onChangeHandler(text, field)}
    //   value={defaultValue}
    //   className="form-control"
    //   id={`field-${field.id}`}
    //   disabled={field.active ? !field.active : field.disabled}
    //   min={validation && validation?.min !== -1 ? validation.min : undefined}
    //   max={validation && validation?.max !== -1 ? validation.max : undefined}
    //   step={
    //     validation && validation?.float
    //       ? Math.pow(0.1, validation.floating).toFixed(validation.floating)
    //       : undefined
    //   }
    //   maxLength={
    //     validation && validation?.digits !== -1 ? validation.digits : undefined
    //   }
    //   onBlur={(e) => {
    //     e.persist();
    //     // check for seperator
    //     if (separator) {
    //       const formatted = thousandSeparator(e.target.value);
    //       onChangeHandler(formatted, field);
    //     }
    //   }}
    // />
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: "#ffffff",
  },
  HeadStyle: {
    height: 150,
    alignContent: "center",
    backgroundColor: "#ffe0f0",
  },
  TableText: {
    margin: 10,
  },
  inputStyle: {
    color: constants.white,
    paddingTop: 5,
  },
  inputContainerStyle: {
    paddingBottom: 5,
    paddingTop: 5,
    borderWidth: 2,
    borderBottomWidth: 2,
    // borderColor: "#333333",
    // borderBottomColor: "#333333",
    borderColor: constants.primaryColor,
    borderBottomColor: constants.primaryColor,
    borderRadius: 15,
  },
  inputIconStyle: {
    marginHorizontal: 10,
    fontSize: hp("2.3%"),
    backgroundColor: "#333333",
    borderRadius: 5,
    alignSelf: "center",
    paddingHorizontal: hp("0.2%"),
    paddingVertical: hp("0.1%"),
  },
});

export default DynamicInput;
