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
import { readData } from "../../../components/DataStorage";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import CustomButton from "../../../components/CustomButton";
import SelectInput from "../../../components/SelectInput/SelectInput";
import MessageListTable from "../../../components/MessageListTable";

const facilityHandleData = {
  tableHead: ["Sender", "Subject", "Body", "Date", "Read", "Edit"],
  widthArr: [130, 180, 180, 120, 80, 80],
  tableData: [
    ["DC PEV", "Test", "Test 3", "10/5/2022", false, ":)"],
    [
      "DC PEV",
      "Test 2",
      "Thank you for all your efforts to completing the settings of the Example IGA. Mojtaba",
      "10/5/2022",
      false,
      ":)",
    ],
    [
      "DC PEV",
      "Wavetech ULT not in the list",
      "Dear Mojtaba, Brand of ULT Freezer named Wavetech is not in the list. Can you please include. Thanks, Maricel",
      "10/5/2022",
      false,
      ":)",
    ],
  ],
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

const DataFormat = async (messages, setData, type) => {
  if (type == "reciever") {
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
        messages[index]["read"],
      ]);
    }
    table.tableData = data_need;
    setData(table);
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
  }
};

const ListMessageScreen = ({ setCurrentTab, setDefaultValueMessage }) => {
  const [checked, setChecked] = useState([]);
  const [type, setType] = useState("sender");
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState(facilityHandleData);
  useEffect(() => {
    if (type == "reciever") {
      readData("messages-reciever").then((value) => {
        if (value != null) {
          let data = JSON.parse(value);
          try {
            setMessages(data);
          } catch (e) {}
        } else {
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
        }
      });
    }
  }, [type]);
  useEffect(() => {
    DataFormat(messages, setData, type);
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
          ></MessageListTable>
        </ScrollView>
      ) : (
        <>
          <ActivityIndicator
            size="large"
            color="black"
            style={{ padding: 20 }}
          />
          <Text style={{ textAlign: "center" }}>the data get from server</Text>
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
      <CustomButton
        onPress={() => console.log("we can do it in future")}
        text={"Read selected"}
      />
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
