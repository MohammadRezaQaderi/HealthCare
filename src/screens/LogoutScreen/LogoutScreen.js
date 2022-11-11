import { View, StyleSheet, Image, useWindowDimensions } from "react-native";
import React, { useState } from "react";
// Component Import
import CustomButton from "../../components/CustomButton";
// Icon and Image Import
import Logo from "../../../assets/logo.png";
// Functionality Import
import { removeItemValue } from "../../components/DataStorage";

const LogoutScreen = ({ setLoggedIn, setCurrentTab }) => {
  const { height } = useWindowDimensions();
  const onLogoutPressed = () => {
    removeItemValue("token").then(() => console.warn("Log Out"));
    setLoggedIn(false);
    setCurrentTab("Login");
  };
  return (
    <View style={styles.root}>
      <Image
        source={Logo}
        style={[styles.logo, { height: height * 0.3 }]}
        resizeMode="contain"
      />
      <CustomButton onPress={onLogoutPressed} text={"Log Out"} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 35,
  },
  logo: {
    width: "70%",
    maxWidth: 300,
    maxHeight: 200,
    marginBottom: 20,
  },
});
export default LogoutScreen;
