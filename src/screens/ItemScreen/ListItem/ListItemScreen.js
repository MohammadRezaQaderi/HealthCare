import { ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { readData } from "../../../components/DataStorage";
import SelectInput from "../../../components/SelectInput/SelectInput";
import ItemListTable from "../../../components/ItemListTable";
const itemHandleData = {
  tableHead: [
    "Item Class",
    "Items Category",
    "Code",
    "Manufacturer",
    "Last Changed on",
    "Edit",
    "Delete",
  ],
  widthArr: [160, 180, 120, 120, 120, 80, 80],
  tableData: [
    ["EXP0100001", "DC PEV", 1, "PR", 0.1, "2022/10/20", "True"],
    ["EXP0100003", "DS KOUMASSI", 2, "LD", 0.1, "2022/10/19", "True"],
    ["EXP0200007", "DS Port Bouet", 2, "LD", 0.4, "2022/10/19", "True"],
    ["EXP0200001", "DS MARCORY", 2, "LD", 0.2, "2022/10/19", "True"],
    ["EXP0200002", "DS Grd BASSAME", 2, "LD", 0.7, "2022/10/20", "True"],
  ],
};

const DataFormat = async (items, setData, itemClass) => {
  let table = {
    tableHead: [
      "Item Class",
      "Items Category",
      "Code",
      "Manufacturer",
      "Last Changed on",
      "Edit",
      "Delete",
    ],
    widthArr: [160, 160, 160, 160, 160, 160, 160],
    tableData: [],
  };
  let data_need = [];
  for (let index = 0; index < items.length; index++) {
    let item_class = await itemClass.find(
      (obj) => obj.item_class.id === items[index]["item_class"]
    );
    let item_type = await item_class.item_type.find(
      (obj) => obj.id === items[index]["item_type"]
    );
    data_need.push([
      items[index]["item_class"] ? item_class.item_class.title : "--",
      items[index]["item_type"] ? item_type.title : "--",
      items[index]["code"] ? items[index]["code"] : "--",
      items[index]["Manufacturer"] ? items[index]["Manufacturer"] : "--",
      items[index]["updated_at"]
        ? items[index]["updated_at"].slice(0, 10)
        : "--",
      "True",
      "True",
    ]);
  }
  table.tableData = data_need;
  setData(table);
};

const ListItemScreen = ({ setCurrentTab, setDefaultValueItem, itemParent }) => {
  const [data, setData] = useState(itemHandleData);
  const [item, setItem] = useState([]);
  const [itemClass, setItemClass] = useState([]);
  const [deleteItem, setDeleteItem] = useState([]);
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    readData("item").then((value) => {
      if (value != null) {
        let data = JSON.parse(value);
        if (Object.keys(itemParent).length > 0) {
          try {
            let temp = data.filter((obj) => obj.facility === itemParent.id);
            setItem(temp);
          } catch (e) {}
        } else {
          readData("parent").then((parent) => {
            try {
              parent = JSON.parse(parent);
              let temp = data.filter((obj) => obj.facility === parent.id);
              setItem(temp);
            } catch (e) {}
          });
        }
      }
    });
    readData("item-delete-item").then((value) => {
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
    readData("itemClass").then((x) => {
      let data = JSON.parse(x);
      try {
        setItemClass(data);
      } catch (e) {}
    });
  }, []);
  useEffect(() => {
    DataFormat(item, setData, itemClass);
  }, [item]);
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
          <Text
            style={{
              fontSize: 12,
              color: "black",
              paddingBottom: 10,
            }}
          >
            Set reason for delete item
          </Text>
          <SelectInput
            data={deleteItem}
            setSelected={setSelected}
            type={"single"}
            defaultOption={"Select Reason for Item to Delete"}
          />
          <ScrollView horizontal={true}>
            <ItemListTable
              data={data}
              setCurrentTab={setCurrentTab}
              setDefaultValueItem={setDefaultValueItem}
              items={item}
              deleteItem={deleteItem}
              selected={selected}
              setSelected={setSelected}
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
  text: { margin: 6, fontSize: 16, textAlign: "center" },
});
export default ListItemScreen;
