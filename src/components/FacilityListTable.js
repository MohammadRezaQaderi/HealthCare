import axios from "axios";
import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import { readData } from "./DataStorage";
import InternetConnection from "./InternetConnection";
import addFacility from "../../assets/add-facility.png";
import addItem from "../../assets/add-list.png";
import listItem from "../../assets/list-item.png";
import editIcon from "../../assets/edit.png";
import deleteIcon from "../../assets/delete.png";
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
  addFacilityIndex(index) {
    this.props.setFacilityParent({
      id: this.props.facility[index]["id"],
      name: this.props.facility[index]["name"],
    });
    this.props.setCurrentTab("New Facility");
  }
  addItemIndex(index) {
    this.props.setItemParent({
      id: this.props.facility[index]["id"],
      name: this.props.facility[index]["name"],
    });
    this.props.setCurrentTab("Add Item");
  }
  listItemIndex(index) {
    let config = {
      id: this.props.facility[index]["id"],
      name: this.props.facility[index]["name"],
    };
    this.props.setItemParent(config);
    this.props.setCurrentTab("Item List");
  }
  render() {
    const state = this.state;
    const editToolBox = (data, index, width) => (
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
    const deleteToolBox = (data, index, width) => (
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
    const addFacilityToolBox = (data, index, width) => (
      <View style={{ marginHorizontal: 30 }}>
        <TouchableOpacity onPress={() => this.addFacilityIndex(index)}>
          <Image
            source={addFacility}
            style={{
              width: 20,
              height: 20,
              tintColor: "black",
            }}
          ></Image>
        </TouchableOpacity>
      </View>
    );
    const addItemToolBox = (data, index, width) => (
      <View style={{ marginHorizontal: 30 }}>
        <TouchableOpacity onPress={() => this.addItemIndex(index)}>
          <Image
            source={addItem}
            style={{
              width: 20,
              height: 20,
              tintColor: "black",
            }}
          ></Image>
        </TouchableOpacity>
      </View>
    );
    const listItemToolBox = (data, index, width) => (
      <View style={{ marginHorizontal: 30 }}>
        <TouchableOpacity onPress={() => this.listItemIndex(index)}>
          <Image
            source={listItem}
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
                  style={{ width: state.widthArr[cellIndex] }}
                  data={
                    cellIndex === 6
                      ? editToolBox(cellData, index, state.widthArr[cellIndex])
                      : cellIndex === 7
                      ? deleteToolBox(
                          cellData,
                          index,
                          state.widthArr[cellIndex]
                        )
                      : cellIndex === 8
                      ? addFacilityToolBox(
                          cellData,
                          index,
                          state.widthArr[cellIndex]
                        )
                      : cellIndex === 9
                      ? addItemToolBox(
                          cellData,
                          index,
                          state.widthArr[cellIndex]
                        )
                      : cellIndex === 10
                      ? listItemToolBox(
                          cellData,
                          index,
                          state.widthArr[cellIndex]
                        )
                      : cellData
                  }
                  textStyle={[styles.text]}
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
  btnText: { textAlign: "center", color: "white" },
});
