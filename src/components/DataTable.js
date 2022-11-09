import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { DataTable } from "react-native-paper";
import { Row, Rows, Table } from "react-native-table-component";

const TableExample = ({ tableHead, tableData }) => {
  return (
    // <DataTable style={styles.container}>
    //   <DataTable.Header style={styles.tableHeader}>
    //     {tableHead.map((x, i) => {
    //       <>
    //         <DataTable.Title>{tableHead[i]}</DataTable.Title>
    //       </>;
    //     })}
    //     {/* <DataTable.Title style={styles.secondCell}>Code</DataTable.Title> */}
    //   </DataTable.Header>
    //   {tableData.map((x, i) => (
    //     <DataTable.Row key={i}>
    //       <DataTable.Cell>{x[0]}</DataTable.Cell>
    //       <DataTable.Cell style={styles.secondCell}>{x[1]}</DataTable.Cell>
    //     </DataTable.Row>
    //   ))}
    // </DataTable>
    <View style={styles.container}>
      {/* <ScrollView horizontal={true}> */}
        <Table borderStyle={{ borderWidth: 1, borderColor: "#ffa1d2" }}>
          <Row
            data={tableHead}
            style={styles.HeadStyle}
            textStyle={styles.TableText}
          />
          <Rows data={tableData} textStyle={styles.TableText} />
        </Table>
      {/* </ScrollView> */}
    </View>
  );
};

export default TableExample;

// const styles = StyleSheet.create({
//   container: {
//     padding: 15,
//   },
//   tableHeader: {
//     backgroundColor: "#fff",
//   },
//   title: {
//     color: "black",
//   },
//   secondCell: {
//     flex: 1,
//     justifyContent: "flex-end",
//   },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    paddingTop: 35,
    backgroundColor: "#ffffff",
  },
  HeadStyle: {
    height: 50,
    alignContent: "center",
    backgroundColor: "#ffe0f0",
  },
  TableText: {
    margin: 10,
  },
});
