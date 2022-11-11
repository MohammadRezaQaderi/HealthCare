import { separator as thousandSeparator } from "./separator";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import Input from "../Input/CustomInput";
/**
 * define two constant for numbers input type
 * @param  {number} numericKeys numbers with floating point
 * @param  {number} num1 numbers without floating point
 */
let numericKeys = "0123456789.:";
const num1 = "0123456789";

const FacilityInput = ({ data, title }) => {
  const [state, setState] = useState("");
  /**
   * @constant  {JSON} field filed of input
   * @function  {function} onChangeHandler function for when input is changed
   * @constant {Value} value value of input if in edit mode
   * @constant {seperator} check input has seperator or not
   */
  const [selected, setSelected] = useState([]);
  if (data) {
    data.map((item, index) => {
      // console.log("data: ", item.type == "text");
      if (item.type === "text") {
        return (
          <ScrollView>
            <View>
              <Input
                value={state}
                setValue={setState}
                placeholder={item.name}
              />
            </View>
          </ScrollView>
        );
      }
    });
  }
};

const styles = StyleSheet.create({});

export default FacilityInput;
