import { View, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import {
  checkConnected,
  readData,
  removeItemValue,
} from "../../components/DataStorage";

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
    readData("read-message").then((value) => {
      if (value != null) {
        if (connectionState) {
          axios
            .post(
              "http://" + url + "/message/read-message",
              {
                value,
              },
              {
                headers: { Authorization: token },
              }
            )
            .then((response) => {
              removeItemValue("read-message").then(() => "");
              console.log("response read-message: ", response);
            })
            .catch((error) => {
              console.log("errors read-message: ", error);
            });
        }
      } else {
        console.log("we did not have the message to send to server ");
      }
    });
    readData("send-message").then((value) => {
      if (value != null) {
        for (let index = 0; index < value.length; index++) {
          let param = value[index];
          if (connectionState) {
            axios
              .post(
                "http://" + url + "/message/",
                {
                  param,
                },
                {
                  headers: { Authorization: token },
                }
              )
              .then((response) => {
                console.log("response send-message: ", response);
              })
              .catch((error) => {
                console.log("errors send-message: ", error);
              });
          }
        }
        removeItemValue("send-message").then(() => "");
      } else {
        console.log("we did not have the message to send to server ");
      }
    });
    readData("send-facility").then((value) => {
      if (value != null) {
        for (let index = 0; index < value.length; index++) {
          let param = value[index];
          if (connectionState) {
            axios
              .post(
                "http://" + url + "/facilities/",
                {
                  param,
                },
                {
                  headers: { Authorization: token },
                }
              )
              .then((response) => {
                console.log("response send-facility: ", response);
              })
              .catch((error) => {
                console.log("errors send-facility: ", error);
              });
          }
        }
        removeItemValue("send-facility").then(() => "");
      } else {
        console.log("we did not have the facility to send to server ");
      }
    });
    readData("deleted-facility").then((value) => {
      if (value != null) {
        for (let index = 0; index < value.length; index++) {
          let param = value[index];
          if (connectionState) {
            axios
              .post(
                "http://" + url + "/facilities/delete",
                {
                  param,
                },
                {
                  headers: { Authorization: token },
                }
              )
              .then((response) => {
                console.log("response delete facility: ", response);
              })
              .catch((error) => {
                console.log("errors delete facility: ", error);
              });
          }
        }
        removeItemValue("deleted-facility").then(() => "");
      } else {
        console.log("we did not have the facility to send to server ");
      }
    });
    readData("send-item").then((value) => {
      if (value != null) {
        for (let index = 0; index < value.length; index++) {
          let param = value[index];
          if (connectionState) {
            axios
              .post(
                "http://" + url + "/item/",
                {
                  param,
                },
                {
                  headers: { Authorization: token },
                }
              )
              .then((response) => {
                console.log("response send-item: ", response);
              })
              .catch((error) => {
                console.log("errors send-item: ", error);
              });
          }
        }
        removeItemValue("send-item").then(() => "");
      } else {
        console.log("we did not have the item to send to server ");
      }
    });

    readData("deleted-item").then((value) => {
      if (value != null) {
        for (let index = 0; index < value.length; index++) {
          let param = value[index];
          if (connectionState) {
            axios
              .post(
                "http://" + url + "/item/delete",
                {
                  param,
                },
                {
                  headers: { Authorization: token },
                }
              )
              .then((response) => {
                console.log("response delete item: ", response);
              })
              .catch((error) => {
                console.log("errors delete item: ", error);
              });
          }
        }
        removeItemValue("deleted-item").then(() => "");
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
