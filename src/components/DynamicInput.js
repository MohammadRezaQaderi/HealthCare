// import { Form } from "react-bootstrap";
import {
  FormControl,
  Input,
  Stack,
  WarningOutlineIcon,
  Box,
  Center,
  NativeBaseProvider,
} from "native-base";
import { separator as thousandSeparator } from "./separator";
// import { components } from "react-select";
// import { default as ReactSelect } from "react-select";
// import { Translation, Trans } from "react-i18next";
// import i18n from "../../i18n";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
  //   if (field.type === "select") {
  //     // we need to hard code the other_service becouse just this select is multiple choice
  //     if (field.stateName !== "other_services") {
  //       return (
  //         <FormControl
  //           onChange={(e) => onChangeHandler(e.target.value, field)}
  //           // defaultValue={defaultValue}
  //           className="form-control form-select"
  //           as="select"
  //           disabled={field.active ? !field.active : field.disabled}
  //           id={`field-${field.id}`}
  //         >
  //           <Translation>
  //             {(t, { i18n }) => (
  //               <option i18n value="" selected>
  //                 {t("Please select")}
  //               </option>
  //             )}
  //           </Translation>
  //           {field.params.map((param) => (
  //             <option
  //               disabled={
  //                 param.enabled
  //                   ? !param.enabled
  //                   : param.active
  //                   ? !param.active
  //                   : !param.enable
  //               }
  //               value={param.id}
  //               selected={parseInt(defaultValue) === param.id ? true : false}
  //             >
  //               {param.name || param.describe}
  //             </option>
  //           ))}
  //         </FormControl>
  //       );
  //     } else {
  //       const options = [];
  //       let selecteda = [];
  //       // for other_services we need to set the options and selected values to the format of componenet
  //       for (let i = 0; i < field.params.length; i++) {
  //         let disabled = field.params[i].enabled
  //           ? !field.params[i].enabled
  //           : field.params[i].active
  //           ? !field.params[i].active
  //           : !field.params[i].enable;
  //         let selecteds =
  //           defaultValue !== undefined &&
  //           defaultValue !== null &&
  //           defaultValue.includes(field.params[i].id)
  //             ? true
  //             : false;
  //         if (!disabled) {
  //           options.push({
  //             label: field.params[i].name || field.params[i].describe,
  //             value: field.params[i].id,
  //           });
  //         }
  //         if (selecteds) {
  //           selecteda.push({
  //             label: field.params[i].name || field.params[i].describe,
  //             value: field.params[i].id,
  //           });
  //         }
  //       }

  //       return (
  //         <ReactSelect
  //           options={options}
  //           isMulti
  //           closeMenuOnSelect={false}
  //           hideSelectedOptions={false}
  //           components={{
  //             Option,
  //           }}
  //           // add all others selected options to this option
  //           onChange={(e) => {
  //             let x = [];
  //             let y = "";
  //             if (e !== null) {
  //               for (let i = 0; i < e.length; i++) {
  //                 x.push(e[i].value);
  //                 y += e[i].value;
  //               }
  //               setSelected(e);
  //               selecteda = e;
  //               onChangeHandler(y, field);
  //             } else {
  //               onChangeHandler("", field);
  //               setSelected([]);
  //               selecteda = [];
  //             }
  //           }}
  //           allowSelectAll={true}
  //           value={selected.length > 0 ? selected : selecteda}
  //         />
  //       );
  //     }
  //   }
  // // check for boolean type
  //   if (field.type === "bool") {
  //     return (
  //       <>
  //         <Form.Control
  //           onChange={(e) => onChangeHandler(e.target.value === "true", field)}
  //           // defaultValue={defaultValue}
  //           className="form-control form-select"
  //           as="select"
  //           disabled={field.active ? !field.active : field.disabled}
  //           id={`field-${field.id}`}
  //         >
  //           <Translation>
  //             {(t, { i18n }) => (
  //               <>
  //                 <option
  //                   i18n
  //                   value=""
  //                   selected={
  //                     defaultValue === null || defaultValue === undefined
  //                       ? true
  //                       : false
  //                   }
  //                   disabled
  //                 >
  //                   {t("Please select")}
  //                 </option>
  //                 <option
  //                   selected={
  //                     defaultValue !== null && defaultValue !== undefined
  //                       ? defaultValue
  //                       : false
  //                   }
  //                   value={true}
  //                 >
  //                   {t("Yes")}
  //                 </option>
  //                 <option
  //                   selected={
  //                     defaultValue !== null && defaultValue !== undefined
  //                       ? !defaultValue
  //                       : false
  //                   }
  //                   value={false}
  //                 >
  //                   {t("No")}
  //                 </option>
  //               </>
  //             )}
  //           </Translation>
  //         </Form.Control>
  //       </>
  //     );
  //   }
  //   // change the decimal pointing to selected language
  //   if ((i18n.language != "en") & (i18n.language != "ar")) {
  //     numericKeys = "0123456789,:";
  //   }
  // validation for field if it have data comes from Backend APi
  const validation = field.validation?.[0];
  return (
    <NativeBaseProvider>
      <ScrollView style={styles.container}>
        <FormControl
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
          lang="en-US"
          onChange={(e) => onChangeHandler(e.target.value, field)}
          value={defaultValue}
          className="form-control"
          id={`field-${field.id}`}
          disabled={field.active ? !field.active : field.disabled}
          min={
            validation && validation?.min !== -1 ? validation.min : undefined
          }
          max={
            validation && validation?.max !== -1 ? validation.max : undefined
          }
          step={
            validation && validation?.float
              ? Math.pow(0.1, validation.floating).toFixed(validation.floating)
              : undefined
          }
          maxLength={
            validation && validation?.digits !== -1
              ? validation.digits
              : undefined
          }
          onBlur={(e) => {
            e.persist();
            // check for seperator
            if (separator) {
              const formatted = thousandSeparator(e.target.value);
              onChangeHandler(formatted, field);
            }
          }}
        >
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
      </ScrollView>
    </NativeBaseProvider>
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
    height: 50,
    alignContent: "center",
    backgroundColor: "#ffe0f0",
  },
  TableText: {
    margin: 10,
  },
});

export default DynamicInput;
