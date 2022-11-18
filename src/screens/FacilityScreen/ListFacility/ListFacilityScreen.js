import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { readData } from "../../../components/DataStorage";
import FacilityListTable from "../../../components/FacilityListTable";
import SelectInput from "../../../components/SelectInput/SelectInput";
const facilityHandleData = {
  tableHead: [
    "Levels",
    "Level name",
    "Total number of facilities",
    "Total number of sub-facilities",
    "Number of defined sub-level facilities",
  ],
  widthArr: [160, 160, 160, 160, 160, 160, 160, 160, 80, 80, 80],
  tableData: [
    ["EXC0100001ACCWCR002", "DC PEV", 1, "PR", 0.1, "2022/10/20"],
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
      "Number of lower level facilities served by this facility",
      "Code",
      "Type",
      "Last Changed on",
      "Edit",
      "Delete",
      "Add Sub-Facility",
      "Add Item",
      "Item-List",
    ],
    widthArr: [160, 160, 160, 160, 160, 160, 80, 80, 80, 80, 80],
    tableData: [],
  };
  let data_need = [];
  for (let index = 0; index < facility.length; index++) {
    data_need.push([
      facility[index]["level"] ? facility[index]["level"] : "--",
      facility[index]["name"] ? facility[index]["name"] : "--",
      facility[index]["loverlevelfac"]
        ? facility[index]["loverlevelfac"]
        : "--",
      facility[index]["code"] ? facility[index]["code"] : "--",
      facility[index]["type"] ? facility[index]["type"] : "--",
      facility[index]["updated_at"]
        ? facility[index]["updated_at"].slice(0, 10)
        : "--",
      "True",
      "True",
      "True",
      "True",
      "True",
    ]);
  }
  table.tableData = data_need;
  setData(table);
};

const ListFacilityScreen = ({
  setCurrentTab,
  setDefaultValueFacility,
  facilityParent,
  setFacilityParent,
  itemParent,
  setItemParent,
}) => {
  const [data, setData] = useState(facilityHandleData);
  const [facility, setFacility] = useState([]);
  const [deleteItem, setDeleteItem] = useState([]);
  const [selected, setSelected] = useState([]);
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
    readData("facility-delete-item").then((value) => {
      if (value != null) {
        let data = JSON.parse(value);
        try {
          let temp = [];
          for (let index = 0; index < data?.length; index++) {
            let temp1 = {};
            temp1["value"] = data[index]["name"];
            temp1["key"] = data[index]["id"];
            temp.push(temp1);
          }
          setDeleteItem(temp);
        } catch (e) {}
      } else {
        setDeleteItem([]);
      }
    });
  }, []);
  useEffect(() => {
    DataFormat(facility, setData);
  }, [facility]);
  return (
    <ScrollView>
      {data?.tableData?.length > 0 && deleteItem.length > 0 ? (
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

          <Text
            style={{
              fontSize: 12,
              color: "black",
              paddingBottom: 10,
            }}
          >
            Set reason for delete facility
          </Text>
          <SelectInput
            data={deleteItem}
            setSelected={setSelected}
            type={"single"}
            defaultOption={"Select Reason for Facility to Delete"}
          />
          <ScrollView horizontal={true}>
            <FacilityListTable
              data={data}
              setCurrentTab={setCurrentTab}
              setDefaultValueFacility={setDefaultValueFacility}
              facility={facility}
              deleteItem={deleteItem}
              selected={selected}
              setSelected={setSelected}
              facilityParent={facilityParent}
              setFacilityParent={setFacilityParent}
              itemParent={itemParent}
              setItemParent={setItemParent}
            />
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
  text: { fontSize: 16, textAlign: "center" },
});
export default ListFacilityScreen;
