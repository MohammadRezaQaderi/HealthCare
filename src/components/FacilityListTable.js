import axios from "axios";
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { readData } from "./DataStorage";
import InternetConnection from "./InternetConnection";
import SelectInput from "./SelectInput/SelectInput";
export default class FacilityListTable extends Component {
  constructor(props) {
    super(props);
    this.state = props.data;
    this.deleteItem = props.deleteItem;
    this.connectionState = false;
  }

  editIndex(index) {
    this.props.setDefaultValueFacility(this.props.facility[index]);
    this.props.setCurrentTab("New Facility");
  }
  deleteIndex(index) {
    InternetConnection().then((res) => {
      this.connectionState = res;
    });
    let url = "";
    let deleted_facility = [];
    readData("deleted-facility").then((x) => {
      deleted_facility = JSON.parse(x);
    });
    readData("URL").then((x) => {
      url = JSON.parse(x);
    });
    readData("token").then((token) => {
      token = JSON.parse(token);
      token = "Bearer".concat(" ", token);
      if (this.props.selected[0] == null) {
        alert("Please select a reason for deleting");
      } else {
        if (this.connectionState) {
          axios
            .post(
              "http://" + url + "/facilities/delete",
              {
                id: this.props.facility[index]["id"],
                delete_reason: this.props.selected[0],
                is_deleted: true,
              },
              {
                headers: { Authorization: token },
              }
            )
            .then((response) => {
              console.log("response facility delete send: ", response);
            })
            .catch((error) => {
              if (deleted_facility != null) {
                deleted_facility.push(values);
                removeItemValue("deleted-facility").then(() => "");
                saveData("deleted-facility", deleted_facility).then(() => "");
                console.log("errors message sending and save and we have it: ");
              } else {
                deleted_facility = [values];
                saveData("deleted-facility", deleted_facility).then(() => "");
                console.log("errors message sending and save and new one: ");
              }
              console.log("errors message sending: ", error);
            });
        } else {
          console.log("Internet connection is off");
          if (deleted_facility != null) {
            deleted_facility.push(values);
            removeItemValue("deleted-facility").then(() => "");
            saveData("deleted-facility", deleted_facility).then(() => "");
            console.log("errors message sending and save and we have it: ");
          } else {
            deleted_facility = [values];
            saveData("deleted-facility", deleted_facility).then(() => "");
            console.log("errors message sending and save and new one: ");
          }
        }
      }
    });
  }

  render() {
    const state = this.state;
    const editToolBox = (data, index) => (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TouchableOpacity onPress={() => this.editIndex(index)}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Edit</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
    const deleteToolBox = (data, index) => (
      <View style={{ flex: 1, flexDirection: "column" }}>
        <TouchableOpacity onPress={() => this.deleteIndex(index)}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Delete</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
    return (
      <View style={styles.container}>
        <Table borderStyle={{}}>
          <Row
            data={state.tableHead}
            style={styles.head}
            textStyle={styles.text}
            widthArr={state.widthArr}
          />
          {state.tableData.map((rowData, index) => (
            <TableWrapper key={index} style={styles.rowSection}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={
                    cellIndex === 6
                      ? editToolBox(cellData, index)
                      : cellIndex === 7
                      ? deleteToolBox(cellData, index)
                      : cellData
                  }
                  widthArr={state.widthArr}
                  textStyle={
                    (styles.text, { minWidth: state?.widthArr[index] })
                  }
                />
              ))}
            </TableWrapper>
          ))}
        </Table>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 50, backgroundColor: "#2888fe" },
  text: { margin: 6, fontSize: 16, textAlign: "center", alignItems: "center" },
  rowSection: {
    flex: 2,
    flexDirection: "row",
    height: 60,
    backgroundColor: "#f1f8ff",
  },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "black" },
});
