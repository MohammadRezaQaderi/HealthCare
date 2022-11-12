import { View, StyleSheet, TextInput } from "react-native";
import React from "react";

const Input = ({
  value,
  setValue,
  placeholder,
  secureTextEntry = false,
  type = "Nothing",
  disabled = true,
}) => {
  return (
    <View style={styles.container}>
      {type == "message" ? (
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          style={styles.input1}
          selectTextOnFocus={disabled}
          editable={disabled}
        />
      ) : (
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          style={styles.input}
          selectTextOnFocus={disabled}
          editable={disabled}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  input: {
    borderColor: "gray",
    width: "100%",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
  input1: {
    borderColor: "gray",
    width: "100%",
    height: 150,
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
  },
});

export default Input;
