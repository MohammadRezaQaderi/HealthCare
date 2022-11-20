import {
  StyleSheet,
  ScrollView,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import {
  readData,
  removeItemValue,
  saveData,
} from "../../../components/DataStorage";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import CustomButton from "../../../components/CustomButton";
import SelectInput from "../../../components/SelectInput/SelectInput";
import MessageListTable from "../../../components/MessageListTable";
import InternetConnection from "../../../components/InternetConnection";

const facilityHandleData = {
  tableHead: ["Subject", "Body", "Date", "Option"],
  widthArr: [180, 180, 120, 80],
  tableData: [],
};

const typeData = [
  {
    key: "sender",
    value: "sender",
  },
  { key: "reciever", value: "reciever" },
];

const goToSendMessage = (setCurrentTab) => {
  setCurrentTab("Send Message");
};

const DataFormat = async (messages, setData, type, setLoading) => {
  if (type == "reciever") {
    let table = {
      tableHead: ["Subject", "Body", "Date", "Option"],
      widthArr: [180, 180, 120, 80],
      tableData: [],
    };
    let data_need = [];
    for (let index = 0; index < messages.length; index++) {
      data_need.push([
        messages[index]["subject"],
        messages[index]["body"].slice(0, 25),
        messages[index]["updated_at"].slice(0, 10),
        messages[index]["read"],
        messages[index]["id"],
      ]);
    }
    table.tableData = data_need;
    setData(table);
    setLoading(false);
  }
  if (type == "sender") {
    let table = {
      tableHead: ["Sender", "Subject", "Body", "Date", "Option"],
      widthArr: [130, 180, 180, 120, 80],
      tableData: [],
    };
    let data_need = [];
    for (let index = 0; index < messages.length; index++) {
      data_need.push([
        messages[index]["sender"]["name"],
        messages[index]["subject"],
        messages[index]["body"].slice(0, 20),
        messages[index]["updated_at"].slice(0, 10),
        "true",
      ]);
    }
    table.tableData = data_need;
    setData(table);
    setLoading(false);
  }
};

const ListMessageScreen = ({ setCurrentTab, setDefaultValueMessage }) => {
  const [checked, setChecked] = useState([]);
  const [type, setType] = useState("sender");
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState(facilityHandleData);
  const [connectionState, setConnectionState] = useState(false);
  const [loading, setLoading] = useState(true);
  const sendReadMessage = async (checked) => {
    InternetConnection().then((res) => setConnectionState(res));
    let url = "";
    readData("URL").then((x) => {
      url = JSON.parse(x);
    });
    let read_message = [];
    readData("read-message").then((x) => {
      read_message = JSON.parse(x);
    });
    readData("token").then((token) => {
      token = JSON.parse(token);
      token = "Bearer".concat(" ", token);
      if (connectionState) {
        axios
          .post(
            "https://" + url + "/message/read-message",
            {
              checked,
            },
            {
              headers: { Authorization: token },
            }
          )
          .then((response) => {
            console.log("response read message send: ", response);
          })
          .catch((error) => {
            if (read_message != null) {
              checked.map((x) => {
                read_message.push(x);
              });
              removeItemValue("read-message").then(() => "");
              saveData("read-message", read_message).then(() => "");
              console.log("errors message sending and save and we have it: ");
            } else {
              read_message = checked;
              saveData("read-message", read_message).then(() => "");
              console.log("errors message sending and save and new one: ");
            }
            console.log("errors message sending: ", error);
          });
      } else {
        console.log("Internet connection is off", read_message);
        if (read_message != null) {
          checked.map((x) => {
            read_message.push(x);
          });
          removeItemValue("read-message").then(() => "");
          saveData("read-message", read_message).then(() => "");
          console.log("connection errors and save and we have it: ");
        } else {
          read_message = checked;
          saveData("read-message", read_message).then(() => "");
          console.log("connection error and save and new one: ");
        }
        console.log("connection errors : ", error);
      }
    });
  };
  useEffect(() => {
    if (type == "reciever") {
      readData("messages-reciever").then((value) => {
        if (value != null) {
          let data = JSON.parse(value);
          try {
            setMessages(data);
            setLoading(false);
          } catch (e) {}
        } else {
          setMessages([]);
        }
      });
    }
    if (type == "sender") {
      readData("messages-sender").then((value) => {
        if (value != null) {
          let data = JSON.parse(value);
          try {
            setMessages(data);
          } catch (e) {}
        } else {
          setMessages([]);
        }
      });
    }
  }, [type]);
  useEffect(() => {
    setData({});
    DataFormat(messages, setData, type, setLoading);
  }, [messages]);
  return (
    <ScrollView>
      <SelectInput
        data={typeData}
        setSelected={setType}
        type={"single"}
        defaultOption={type}
      />
      {data?.tableData?.length > 0 ? (
        <ScrollView horizontal={true}>
          <MessageListTable
            data={data}
            setCurrentTab={setCurrentTab}
            setDefaultValueMessage={setDefaultValueMessage}
            type={type}
            messages={messages}
            setChecked={setChecked}
          ></MessageListTable>
        </ScrollView>
      ) : loading ? (
        <>
          <ActivityIndicator
            size="large"
            color="black"
            style={{ padding: 20 }}
          />
          <Text style={{ textAlign: "center" }}>{"The Data are Loading"}</Text>
        </>
      ) : (
        <>
          <Text
            style={{ textAlign: "center" }}
          >{`The Data For ${type} Message is Empty`}</Text>
        </>
      )}
      <View style={styles.viewContainer}>
        <Pressable
          onPress={() => goToSendMessage(setCurrentTab)}
          style={styles.buttonContainer}
        >
          <Text style={styles.buttonText}>{"Send Message"}</Text>
        </Pressable>
      </View>
      {checked.length > 0 && (
        <CustomButton
          onPress={() => sendReadMessage(checked)}
          text={"Read selected"}
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  viewContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  buttonContainer: {
    backgroundColor: "#2888fe",
    width: "100%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  rowSection: { height: 60, backgroundColor: "#f1f8ff" },
  head: { height: 50, backgroundColor: "#2888fe" },
  headText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
  text: { margin: 6, fontSize: 16, textAlign: "center" },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" },
});
export default ListMessageScreen;
