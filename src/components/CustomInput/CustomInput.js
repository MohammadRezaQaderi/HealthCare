import React from "react";
import { Text, TextInput, StyleSheet, View } from "react-native";

const CustomInput = (props) => {
  const {
    field: { name, onBlur, onChange, value },
    form: { errors, touched, setFieldTouched },
    ...inputProps
  } = props;
  const hasError = errors[name] && touched[name];
  return (
    <>
      <View style={styles.container}>
        <TextInput
          style={[styles.textInput, hasError && styles.errorInput]}
          value={value}
          onChangeText={(text) => onChange(name)(text)}
          onBlur={() => {
            setFieldTouched(name);
            onBlur(name);
          }}
          {...inputProps}
        />
        {hasError && <Text style={styles.errorText}>{errors[name]}</Text>}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  textInput: {
    borderColor: "gray",
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    height: 40,
    width: "100%",
    backgroundColor: "white",
    borderColor: "gray",
  },
  errorText: {
    fontSize: 10,
    color: "red",
  },
  errorInput: {
    borderColor: "red",
  },
});

export default CustomInput;
