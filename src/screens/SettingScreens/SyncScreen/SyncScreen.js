import { View, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../../components/CustomButton";
import {
  checkConnected,
  readData,
  removeItemValue,
} from "../../../components/func";

const SyncScreen = ({}) => {
  const [connectionState, setConnectionState] = useState(false);
  const onPassPressed = () => {
    let token = "";
    let url = "";
    readData("token").then((token) => {
      token = JSON.parse(token);
      token = "Bearer".concat(" ", token);
    });
    readData("URL").then((url) => {
      url = JSON.parse(url);
    });
    checkConnected().then((res) => setConnectionState(res));
    readData("send-message").then((value) => {
      if (value != null) {
        if (connectionState) {
          axios
            .post(
              "http://" + url + "/message/",
              {
                value,
              },
              {
                headers: { Authorization: token },
              }
            )
            .then((response) => {
              removeItemValue("send-message").then(() => "");
              console.log("response send-message: ", response);
            })
            .catch((error) => {
              console.log("errors send-message: ", error);
            });
        }
      } else {
        console.log("we did not have the message to send to server ");
      }
    });
    readData("send-facility").then((value) => {
      if (value != null) {
        if (connectionState) {
          axios
            .post(
              "http://" + url + "/facilities/",
              {
                value,
              },
              {
                headers: { Authorization: token },
              }
            )
            .then((response) => {
              removeItemValue("send-facility").then(() => "");
              console.log("response send-facility: ", response);
            })
            .catch((error) => {
              console.log("errors send-facility: ", error);
            });
        }
      } else {
        console.log("we did not have the facility to send to server ");
      }
    });
    console.warn("Info Synced :)");
  };
  return (
    <View style={styles.root}>
      <Text style={styles.secondaryText}>
        For Sync The Info With Server Press Button
      </Text>
      <CustomButton onPress={onPassPressed} text={"Sync Info"} />
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    padding: 35,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
    paddingTop: 20,
    textAlign: "center",
  },
});
export default SyncScreen;
