import { StyleSheet, Text, Pressable, View } from "react-native";
import React from "react";

const CustomButton = ({ onPress, text }) => {
  return (
    <View style={styles.viewContainer}>
      <Pressable onPress={onPress} style={styles.container}>
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  viewContainer:{
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  container: {
    backgroundColor: "#2888fe",
    width: "100%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  text: {
    fontWeight: "bold",
    color: "white",
  },
});

export default CustomButton;
