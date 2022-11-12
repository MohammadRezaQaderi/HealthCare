import { StyleSheet, View } from "react-native";
import {
  MultipleSelectList,
  SelectList,
} from "react-native-dropdown-select-list";
const SelectInput = ({
  data,
  setSelected,
  placeholder,
  type,
  defaultOption,
}) => {
  console.log("data", data);
  if (type === "single") {
    return (
      <View style={styles.container}>
        <SelectList
          data={data}
          boxStyles={styles.box}
          setSelected={(val) => setSelected(val)}
          dropdownItemStyles={{ marginHorizontal: 10 }}
          dropdownTextStyles={{ color: "black" }}
          placeholder={placeholder}
          maxHeight={100}
          search={false}
          save="value"
          defaultOption={defaultOption}
        />
      </View>
    );
  }
  if (type === "multi") {
    return (
      <View style={styles.container}>
        <MultipleSelectList
          setSelected={(val) => setSelected(val)}
          data={data}
          save="value"
          maxHeight={200}
          // onSelect={() => alert(selected)}
          label="Categories"
          defaultOption={defaultOption}
        />
        {/* <SelectList
          data={data}
          boxStyles={styles.box}
          // setSelected={(val) => setSelected(val)}
          // dropdownItemStyles={{ marginHorizontal: 10 }}
          // dropdownTextStyles={{ color: "black" }}
          // placeholder={placeholder}
          // maxHeight={100}
          search={false}
          save="value"
        /> */}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  box: {
    maxWidth: "100%",
    minWidth: "73%",
  },
});
export default SelectInput;
