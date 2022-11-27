import { View, StyleSheet, Text } from "react-native";
import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import { ActivityIndicator } from "react-native-paper";

import {
  checkConnected,
  readData,
  removeItemValue,
  saveData,
} from "../../components/DataStorage";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * This function get the Data from server
 * For use in the offline mode :)
 */
const getInfoFromServer = async () => {
  readData("token").then((token) => {
    token = JSON.parse(token);
    token = "Bearer".concat(" ", token);
    if (token != null) {
      readData("URL").then((url) => {
        url = JSON.parse(url);
        axios
          .get("https://" + url + "/facilities/facility-field", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("facility-field").then(() => "");
            saveData("facility-field", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get facility-field: ", error);
          });
        axios
          .get("https://" + url + "/user-data/", {
            headers: { Authorization: token },
          })
          .then((res) => {
            removeItemValue("user").then(() => "");
            removeItemValue("country").then(() => "");

            const country = res.data.Country[0];
            const user = {};
            user.id = res.data.User.pk;
            user.admin = res.data.User.is_superuser;
            user.name = res.data.User.name;
            user.username = res.data.User.username;
            user.idnumber = res.data.User.idnumber;
            user.phone = res.data.User.phone;
            user.facility_name = res.data.facility;
            user.facility_admin = res.data.User.facadmin;
            user.facility_id = res.data.User.facilityid;
            user.reportadmin = res.data.User.reportadmin;
            user.itemadmin = res.data.User.itemadmin;
            user.useradmin = res.data.User.useradmin;
            user.created_at = res.data.User.created_at.split("T")[0];
            user.updated_at = res.data.User.updated_at.split("T")[0];
            saveData("user", user).then(() => "");
            saveData("country", country).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get facility-field: ", error);
          });

        axios
          .get("https://" + url + "/facilities/", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("facilities").then(() => "");
            saveData("facilities", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get facilities: ", error);
          });
        axios
          .get("https://" + url + "/item/itemallFac", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("item").then(() => "");
            saveData("item", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get item: ", error);
          });
        axios
          .get("https://" + url + "/message/helper", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("message-facility-list").then(() => "");
            saveData("message-facility-list", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get message-facility-list: ", error);
          });
        axios
          .get("https://" + url + "/message/", {
            headers: { Authorization: token },
            params: { type: "sender" },
          })
          .then((response) => {
            removeItemValue("messages-sender").then(() => "");
            saveData("messages-sender", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get messages sender: ", error);
          });
        axios
          .get("https://" + url + "/message/", {
            headers: { Authorization: token },
            params: { type: "reciever" },
          })
          .then((response) => {
            removeItemValue("messages-reciever").then(() => "");
            saveData("messages-reciever", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get messages reciever: ", error);
          });
        axios
          .get("https://" + url + "/facilities/delete", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("facility-delete-item").then(() => "");
            saveData("facility-delete-item", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get messages reciever: ", error);
          });
        axios
          .get("https://" + url + "/item/delete", {
            headers: { Authorization: token },
          })
          .then((response) => {
            removeItemValue("item-delete-item").then(() => "");
            saveData("item-delete-item", response?.data).then(() => "");
          })
          .catch((error) => {
            console.log("errors for get messages reciever: ", error);
          });
      });
    }
  });
};
const getAsyncInfo = async ( ) => {
  const t = await AsyncStorage.getItem("token");
  console.log("token: ", t);
  let tx = JSON.parse(t);
  const token = "Bearer".concat(" ", tx);
  const urlx = await AsyncStorage.getItem("URL");
  console.log("urlx", urlx);
  const url = JSON.parse(urlx);
  console.log(url);
  const fields = [];

  const response = await axios.get(
    "https://" + url + "/item/item-field-mobile",
    { headers: { Authorization: token } }
  );
  // console.log("first res",response)
  removeItemValue("parent").then(() => "");
  saveData("parent", response?.data.facility).then(() => "");
  const item_classes = response.data.data;
  removeItemValue("itemClass").then(() => "");
  saveData("itemClass", response?.data.data).then(() => {
    item_classes.map((item_class) => {
      let item_classx = item_class?.item_class;
      const temp_obj = {
        item_class: item_classx,
        item_type: [],
      };
      item_class?.item_type.map((item_type) => {
        const temp_type = {
          id: item_type.id,
          title: item_type.title,
          havepqs: item_type.havepqs,
          fields: item_type.fields,
          pqs: item_type.pqs,
        };

        temp_obj.item_type.push(temp_type);
      });
      console.log("temp_obj", temp_obj);
      fields.push(temp_obj);
      saveData("itemFields", fields).then(() => "");
      saveData("send-facility", []).then(() => "");
      saveData("send-item", []).then(() => "");
      saveData("edited-item", []).then(() => "");
      saveData("edited-facility", []).then(() => "");
     
    });
  });
  // console.log(fields[0].item_type)
};

const SyncScreen = ({}) => {
  const [connectionState, setConnectionState] = useState(true);
  const [loading, setLoading] = useState(false);
  const onPassPressed = () => {
    setLoading(true);
    checkConnected().then((res) => setConnectionState(res));

    let token = "";
    let url = "";
    readData("token").then((token) => {
      token = JSON.parse(token);
      token = "Bearer".concat(" ", token);
      readData("URL").then((url) => {
        url = JSON.parse(url);
        console.log("token: ", token);
        console.log("url: ", url);
        console.log("connectionState", connectionState);
        readData("read-message").then((value) => {
          value = JSON.parse(value);

          if (value != null) {
            if (connectionState) {
              axios
                .post(
                  "https://" + url + "/message/read-message",
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
          value = JSON.parse(value);

          if (value != null) {
            for (let index = 0; index < value.length; index++) {
              let param = value[index];
              if (connectionState) {
                axios
                  .post(
                    "https://" + url + "/message/",
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
          console.log("value", value);
          value=JSON.parse(value)
          if (value != null) {
            for (let index = 0; index < value.length; index++) {
              let param = value[index];
              console.log("param", param);
              if (connectionState) {
                axios
                  .post(
                    "https://" + url + "/facilities/",
                    
                      param,
                    
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
              } else {
                console.log(
                  "we did not have the facility to send to server  neeeeeeeeet"
                );
              }
            }
            removeItemValue("send-facility").then(() => "");
          } else {
            console.log("we did not have the facility to send to server ");
          }
        });

        readData("edited-facility").then((value) => {
          value = JSON.parse(value);

          if (value != null) {
            for (let index = 0; index < value.length; index++) {
              let param = value[index];
              if (connectionState) {
                axios
                  .put(
                    "https://" + url + "/facilities/",
                    {
                      param,
                    },
                    {
                      headers: { Authorization: token },
                    }
                  )
                  .then((response) => {
                    console.log("response edited-facility: ", response);
                  })
                  .catch((error) => {
                    console.log("errors edited-facility: ", error);
                  });
              } else {
                console.log(
                  "we did not have the facility to send to server  neeeeeeeeet"
                );
              }
            }
            removeItemValue("edited-facility").then(() => "");
          } else {
            console.log("we did not have the facility to send to server ");
          }
        });

        readData("deleted-facility").then((value) => {
          value = JSON.parse(value);

          if (value != null) {
            for (let index = 0; index < value.length; index++) {
              let param = value[index];
              if (connectionState) {
                axios
                  .post(
                    "https://" + url + "/facilities/delete",
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
          value = JSON.parse(value);

          if (value != null) {
            for (let index = 0; index < value.length; index++) {
              let param = value[index];
              if (connectionState) {
                axios
                  .post(
                    "https://" + url + "/item/",
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

        readData("edited-item").then((value) => {
          value = JSON.parse(value);

          if (value != null) {
            for (let index = 0; index < value.length; index++) {
              let param = value[index];
              if (connectionState) {
                axios
                  .put(
                    "https://" + url + "/item/",
                    {
                      param,
                    },
                    {
                      headers: { Authorization: token },
                    }
                  )
                  .then((response) => {
                    console.log("response edited-item: ", response);
                  })
                  .catch((error) => {
                    console.log("errors edited-item: ", error);
                  });
              }
            }
            removeItemValue("edited-item").then(() => "");
          } else {
            console.log("we did not have the item to send to server ");
          }
        });
        readData("deleted-item").then((value) => {
          value = JSON.parse(value);

          if (value != null) {
            for (let index = 0; index < value.length; index++) {
              let param = value[index];
              if (connectionState) {
                axios
                  .post(
                    "https://" + url + "/item/delete",
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
        // get new data
        getInfoFromServer();
        getAsyncInfo().then(() => {
          setLoading(false);
        });
        console.warn("Info Synced :)");
      });


    });
    
    

  };
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
export default SyncScreen;
