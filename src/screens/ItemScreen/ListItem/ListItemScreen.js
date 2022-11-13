import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Row, Table } from "react-native-table-component";
import { ActivityIndicator } from "react-native-paper";
import { readData } from "../../../components/DataStorage";
// import ItemListTable from "../../../components/ItemListTable";
const itemHandleData = {
  tableHead: [
    "Item Class",
    "Items Category",
    "Code",
    "Manufacturer",
    "Last Changed on",
    "Tool Box",
  ],
  widthArr: [160, 180, 120, 120, 120, 120],
  tableData: [
    ["EXP0100001", "DC PEV", 1, "PR", 0.1, "2022/10/20", "True"],
    ["EXP0100003", "DS KOUMASSI", 2, "LD", 0.1, "2022/10/19", "True"],
    ["EXP0200007", "DS Port Bouet", 2, "LD", 0.4, "2022/10/19", "True"],
    ["EXP0200001", "DS MARCORY", 2, "LD", 0.2, "2022/10/19", "True"],
    ["EXP0200002", "DS Grd BASSAME", 2, "LD", 0.7, "2022/10/20", "True"],
  ],
};

const DataFormat = async (items, setData) => {
  let table = {
    tableHead: [
      "Item Class",
      "Items Category",
      "Code",
      "Manufacturer",
      "Last Changed on",
      "Tool Box",
    ],
    widthArr: [160, 180, 120, 120, 120, 120],
    tableData: [],
  };
  let data_need = [];
  for (let index = 0; index < items.length; index++) {
    data_need.push([
      items[index]["item_class"] ? items[index]["item_class"] : "N/A",
      items[index]["item_type"] ? items[index]["item_type"] : "N/A",
      items[index]["code"] ? items[index]["code"] : "N/A",
      items[index]["Manufacturer"] ? items[index]["Manufacturer"] : "N/A",
      items[index]["updated_at"]
        ? items[index]["updated_at"].slice(0, 10)
        : "N/A",
      "True",
    ]);
  }
  table.tableData = data_need;
  setData(table);
};

const ListItemScreen = ({ setCurrentTab, setDefaultValueItem }) => {
  const [data, setData] = useState(itemHandleData);
  const [item, setItem] = useState([]);
  useEffect(() => {
    readData("item").then((value) => {
      if (value != null) {
        let data = JSON.parse(value);
        try {
          setItem(data);
        } catch (e) {}
      } else {
      }
    });
  }, []);
  useEffect(() => {
    DataFormat(item, setData);
  }, [item]);
  return (
    <ScrollView>
      {data?.tableData?.length > 0 ? (
        <View style={styles.container}>
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: "black",
              paddingBottom: 20,
            }}
          >
            Items
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "black",
              paddingBottom: 10,
            }}
          >
            Items owned separated by levels
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
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  rowSection: { height: 60, backgroundColor: "#f1f8ff" },
  head: { height: 50, backgroundColor: "#2888fe" },
  headText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  text: { margin: 6, fontSize: 16, textAlign: "center" },
});
export default ListItemScreen;
