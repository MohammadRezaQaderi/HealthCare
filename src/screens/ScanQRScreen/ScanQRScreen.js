import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Constants from "expo-constants";
import { Dimensions } from "react-native";
import { readData } from "../../components/DataStorage";
import SelectInput from "../../components/SelectInput/SelectInput";
import { Row, Table } from "react-native-table-component";

const { width } = Dimensions.get("window");
const qrSize = width * 0.7;

const DataFormat = async (items, setData, itemClass, scannedData) => {
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
    // if (items[index]["code"] === scannedData) {
    if (items[index]["code"] === "EXC0100001ACCWCR002") {
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
  }
  table.tableData = data_need;
  setData(table);
};

export default function ScanQRScreen({ setCurrentTab, setDefaultValueItem }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [itemClass, setItemClass] = useState([]);
  const [deleteItem, setDeleteItem] = useState([]);
  const [selected, setSelected] = useState([]);
  const [item, setItem] = useState([]);
  const [data, setData] = useState([]);
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
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setScannedData(data);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };
  useEffect(() => {
    DataFormat(item, setData, itemClass, scannedData);
  }, [scanned]);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flexDirection: "column", padding: 20 }}>
      {scanned && data?.tableData?.length > 0 && deleteItem.length > 0 ? (
        <>
          <View>
            <Pressable
              onPress={() => setScanned(false)}
              style={styles.buttonContainer}
            >
              <Text>{"Scan Again"}</Text>
            </Pressable>
          </View>
          <View>
            <SelectInput
              data={deleteItem}
              setSelected={setSelected}
              type={"single"}
              defaultOption={"Select Reason for Item to Delete"}
            />
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
        </>
      ) : (
        <View
          style={{
            flex: 2,
            padding: 100,
          }}
        >
          <BarCodeScanner
            onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Constants.statusBarHeight,
    backgroundColor: "#ecf0f1",
    padding: 100,
    marginBottom: 25,
  },
  qr: {
    marginTop: "20%",
    marginBottom: "20%",
    width: qrSize,
    height: qrSize,
  },
  description: {
    fontSize: width * 0.09,
    marginTop: "10%",
    textAlign: "center",
    width: "70%",
    color: "white",
  },
  cancel: {
    fontSize: width * 0.05,
    textAlign: "center",
    width: "70%",
    color: "white",
  },
  containerTable: {
    // flex: 4,
    // padding: 16,
    // paddingTop: 30,
    // backgroundColor: "#fff",
  },
  rowSection: { height: 60, backgroundColor: "#f1f8ff" },
  head: { height: 50, backgroundColor: "#2888fe" },
  headText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  text: { margin: 6, fontSize: 16, textAlign: "center" },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: "black",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  buttonContainer: {
    backgroundColor: "#2888fe",
    width: "100%",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginVertical: 5,
  },
  buttonText: {
    fontWeight: "bold",
    color: "white",
  },
});
