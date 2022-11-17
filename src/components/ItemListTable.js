import axios from "axios";
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { readData } from "./DataStorage";
import InternetConnection from "./InternetConnection";
import SelectInput from "./SelectInput/SelectInput";
export default class ItemListTable extends Component {
  constructor(props) {
    super(props);
    this.state = props.data;
    this.deleteItem = props.deleteItem;
    this.connectionState = false;
  }

  editIndex(index) {
    this.props.setDefaultValueFacility(this.props.items[index]);
    this.props.setCurrentTab("New List");
  }
  deleteIndex(index) {
    InternetConnection().then((res) => {
      this.connectionState = res;
    });
    let url = "";
    let deleted_item = [];
    readData("item-facility").then((x) => {
      deleted_item = JSON.parse(x);
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
              "http://" + url + "/item/delete",
              {
                id: this.props.items[index]["id"],
                delete_reason: this.props.selected[0],
                isDel: true,
              },
              {
                headers: { Authorization: token },
              }
            )
            .then((response) => {
              console.log("response item delete send: ", response);
            })
            .catch((error) => {
              if (deleted_item != null) {
                deleted_item.push(values);
                removeItemValue("deleted-item").then(() => "");
                saveData("deleted-item", deleted_item).then(() => "");
                console.log("errors item sending and save and we have it: ");
              } else {
                deleted_item = [values];
                saveData("deleted-item", deleted_item).then(() => "");
                console.log("errors item sending and save and new one: ");
              }
              console.log("errors item sending: ", error);
            });
        } else {
          console.log("Internet connection is off");
          if (deleted_item != null) {
            deleted_item.push(values);
            removeItemValue("deleted-item").then(() => "");
            saveData("deleted-item", deleted_item).then(() => "");
            console.log("errors item sending and save and we have it: ");
          } else {
            deleted_item = [values];
            saveData("deleted-item", deleted_item).then(() => "");
            console.log("errors item sending and save and new one: ");
          }
        }
      }
    });
  }

  render() {
    console.log("this.props.items: ", this.props.data);
    const state = this.props.data;
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
            data={this.props.data.tableHead}
            style={styles.head}
            textStyle={styles.text}
            widthArr={this.props.data.widthArr}
          />
          {this.props.data.tableData.map((rowData, index) => (
            <TableWrapper key={index} style={styles.rowSection}>
              {rowData.map((cellData, cellIndex) => (
                <Cell
                  key={cellIndex}
                  data={
                    cellIndex === 5
                      ? editToolBox(cellData, index)
                      : cellIndex === 6
                      ? deleteToolBox(cellData, index)
                      : "cellData"
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
