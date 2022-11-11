import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Button } from "react-native";
// import { BarCodeScanner } from "expo-barcode-scanner";
import CustomButton from "../../components/CustomButton";

export default function ScanQRScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    // (async () => {
    //   const { status } = await BarCodeScanner.requestPermissionsAsync();
    //   setHasPermission(status === "granted");
    // })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={styles.container}>
      <Text></Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
        height={250}
        width={300}
      />
      {scanned && (
        <CustomButton text={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 1000,
    maxHeight: 200,
    marginBottom: 20,
  },
});