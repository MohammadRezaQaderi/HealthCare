import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { Row, Table } from "react-native-table-component";
import { ActivityIndicator } from "react-native-paper";
import { readData } from "../../../components/DataStorage";
import FacilityListTable from "../../../components/FacilityListTable";
const facilityHandleData = {
  tableHead: [
    "Levels",
    "Level name",
    "Total number of facilities",
    "Total number of sub-facilities",
    "Number of defined sub-level facilities",
  ],
  widthArr: [160, 180, 120, 120, 120],
  tableData: [
    ["EXP0100001", "DC PEV", 1, "PR", 0.1, "2022/10/20"],
    ["EXP0100003", "DS KOUMASSI", 2, "LD", 0.1, "2022/10/19"],
    ["EXP0200007", "DS Port Bouet", 2, "LD", 0.4, "2022/10/19"],
    ["EXP0200001", "DS MARCORY", 2, "LD", 0.2, "2022/10/19"],
    ["EXP0200002", "DS Grd BASSAME", 2, "LD", 0.7, "2022/10/20"],
  ],
};

const DataFormat = async (facility, setData) => {
  let table = {
    tableHead: [
      "Levels",
      "Facility name",
      "Total number of facilities",
      "Code",
      "Type",
      "Last Changed on",
      "Tool Box",
    ],
    widthArr: [80, 180, 180, 180, 180, 180, 250],
    tableData: [],
  };
  let data_need = [];
  for (let index = 0; index < facility.length; index++) {
    data_need.push([
      facility[index]["level"] ? facility[index]["level"] : "N/A",
      facility[index]["name"] ? facility[index]["name"] : "N/A",
      facility[index]["populationnumber"]
        ? facility[index]["populationnumber"]
        : "N/A",
      facility[index]["code"] ? facility[index]["code"] : "N/A",
      facility[index]["type"] ? facility[index]["type"] : "N/A",
      facility[index]["updated_at"]
        ? facility[index]["updated_at"].slice(0, 10)
        : "N/A",
      "True",
    ]);
  }
  table.tableData = data_need;
  setData(table);
};

const ListFacilityScreen = ({ setCurrentTab, setDefaultValueFacility }) => {
  const [data, setData] = useState(facilityHandleData);
  const [facility, setFacility] = useState([]);
  useEffect(() => {
    readData("facilities").then((value) => {
      if (value != null) {
        let data = JSON.parse(value);
        try {
          setFacility(data);
        } catch (e) {}
      } else {
      }
    });
  }, []);
  useEffect(() => {
    DataFormat(facility, setData);
  }, [facility]);
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
            Facilities
          </Text>

          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: "black",
              paddingBottom: 10,
            }}
          >
            Facilities owned separated by levels
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
export default ListFacilityScreen;
