import axios from "axios";
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { readData } from "./DataStorage";
import InternetConnection from "./InternetConnection";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
export default class ItemListTable extends Component {
  constructor(props) {
    super(props);
    this.state = props.data;
    this.deleteItem = props.deleteItem;
    this.connectionState = false;
  }

  editIndex(index) {
    this.props.setDefaultValueItem(this.props.items[index]);
    this.props.setCurrentTab("Add Item");
  }
  deleteIndex(index) {
    InternetConnection().then((res) => {
      this.connectionState = res;
    });
    let url = "";
    let deleted_item = [];
    readData("deleted-item").then((x) => {
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
    const state = this.props.data;
    const editToolBox = (data, index) => (
      <View style={{ marginHorizontal: 30 }}>
        <TouchableOpacity onPress={() => this.editIndex(index)}>
          <Image
            source={editIcon}
            style={{
              width: 20,
              height: 20,
              tintColor: "black",
            }}
          ></Image>
        </TouchableOpacity>
      </View>
    );
    const deleteToolBox = (data, index) => (
      <View style={{ marginHorizontal: 30 }}>
        <TouchableOpacity onPress={() => this.deleteIndex(index)}>
          <Image
            source={deleteIcon}
            style={{
              width: 20,
              height: 20,
              tintColor: "black",
            }}
          ></Image>
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
                  style={{ width: state.widthArr[cellIndex] }}
                  data={
                    cellIndex === 5
                      ? editToolBox(cellData, index)
                      : cellIndex === 6
                      ? deleteToolBox(cellData, index)
                      : cellData
                  }
                  textStyle={styles.text}
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
  container: {},
  head: { height: 50, backgroundColor: "#2888fe" },
  text: {
    marginHorizontal: 6,
    fontSize: 16,
    textAlign: "center",
    alignItems: "center",
  },
  rowSection: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#f1f8ff",
  },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "black" },
});
