import React, { useState, useEffect } from "react";
import {
  Image,
  Text,
  View,
  StyleSheet,
  Button,
  ScrollView,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Constants from "expo-constants";
import { Dimensions } from "react-native";
import { Row, Table } from "react-native-table-component";
import { ActivityIndicator } from "react-native-paper";
import { readData } from "../../components/DataStorage";

const { width } = Dimensions.get("window");
const qrSize = width * 0.7;

const DataFormat = async (items, setData, scannedData) => {
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
    if (items[index]["code"] === scannedData) {
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
  }
  table.tableData = data_need;
  setData(table);
};

export default function ScanQRScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [item, setItem] = useState([]);
  const [data, setData] = useState([]);
  useEffect(() => {
    readData("item").then((value) => {
      console.log("value", value);
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
    DataFormat(item, setData, scannedData);
  }, [scannedData]);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  console.log("scanned: ", scanned);
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "flex-end",
        padding: 100,
      }}
    >
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={[StyleSheet.absoluteFillObject, styles.container]}
      ></BarCodeScanner>
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
      {scanned && data.length > 0 ? (
        <View style={styles.containerTable}>
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
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: "#fff",
  },
  rowSection: { height: 60, backgroundColor: "#f1f8ff" },
  head: { height: 50, backgroundColor: "#2888fe" },
  headText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  text: { margin: 6, fontSize: 16, textAlign: "center" },
});

// import React, { useState, useEffect } from "react";
// import { Text, View, StyleSheet, Button } from "react-native";
// import { BarCodeScanner } from "expo-barcode-scanner";

// export default function ScanQRScreen() {
//   const [hasPermission, setHasPermission] = useState(null);
//   const [scanned, setScanned] = useState(false);

//   useEffect(() => {
//     const getBarCodeScannerPermissions = async () => {
//       const { status } = await BarCodeScanner.requestPermissionsAsync();
//       setHasPermission(status === "granted");
//     };

//     getBarCodeScannerPermissions();
//   }, []);

//   const handleBarCodeScanned = ({ type, data }) => {
//     setScanned(true);
//     alert(`Bar code with type ${type} and data ${data} has been scanned!`);
//   };

//   if (hasPermission === null) {
//     return <Text>Requesting for camera permission</Text>;
//   }
//   if (hasPermission === false) {
//     return <Text>No access to camera</Text>;
//   }
//   console.log("hasPermission=====>", hasPermission);
//   return (
//     <>
//       <View style={styles.rectangleContainer}>
//         <View style={styles.rectangle} />
//         <BarCodeScanner
//           onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
//           style={StyleSheet.absoluteFillObject}
//         />
//       </View>
//       {scanned && (
//         <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
//       )}
//     </>
//   );
// }

// const styles = StyleSheet.create({
//   rectangleContainer: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     backgroundColor: "transparent",
//   },

//   rectangle: {
//     height: 250,
//     width: 250,
//     borderWidth: 2,
//     borderColor: "#00FF00",
//     backgroundColor: "transparent",
//   },
// });
