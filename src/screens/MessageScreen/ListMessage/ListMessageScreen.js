import { StyleSheet, ScrollView, Text, View, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
// import CustomButton from "../../../components/CustomButton";
import Message from "../../../components/Notification/notification";
import TableExample from "../../../components/DataTable";
import { ActivityIndicator } from "react-native-paper";
import { readData } from "../../../components/func";
import { Row, Table } from "react-native-table-component";
import CustomButton from "../../../components/CustomButton";

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

const goToSendMessage = (setCurrentTab) => {
  setCurrentTab("Send Message");
};

const DataFormat = async (messages, setData) => {
  let data_need = [];
  console.log("start message config");
  await messages.map((message, i) => {
    data_need.push([
      message["id"],
      message["subject"],
      message["body"].slice(0, 20),
    ]);
  });
  setData(data_need);
};

const ListMessageScreen = ({ setCurrentTab }) => {
  // const [status, setStatus] = useState(false);
  const [messages, setMessages] = useState([]);
  const [data, setData] = useState(facilityHandleData);
  // setData(facilityHandleData)
  useEffect(() => {
    readData("messages").then((value) => {
      if (value != null) {
        let data = JSON.parse(value);
        try {
          setMessages(data);
        } catch (e) {}
        return (
          <>
            <Message type="success" message="::::))))" />
          </>
        );
      } else {
        return (
          <Message type="warn" message="we didn`t have message-facility-list" />
        );
      }
    });
  }, []);
  // useEffect(() => {
  //   DataFormat(messages, setData);
  //   setData(facilityHandleData)
  // }, [messages]);
  return (
    <ScrollView>
      {data?.tableData.length > 0 ? (
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "black",
              paddingBottom: 10,
            }}
          >
            Received or sent messages
          </Text>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{}}>
                <Row
                  data={data?.tableHead}
                  widthArr={data?.widthArr}
                  style={styles.head}
                  textStyle={styles.headText}
                />
              </Table>
              <ScrollView>
                <Table borderStyle={{}}>
                  {data?.tableData.map((rowData, index) => (
                    <Row
                      key={index}
                      data={rowData}
                      widthArr={data?.widthArr}
                      style={styles.rowSection}
                      textStyle={styles.text}
                    />
                  ))}
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
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
});
export default ListMessageScreen;
