import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
import editIcon from "../../assets/edit.png";
export default class MessageListTable extends Component {
  constructor(props) {
    super(props);
    this.state = props.data;
    this.setChecked = props.setChecked;
    this.checked = [];
  }

  editIndex(index) {
    this.props.setDefaultValueMessage(this.props.messages[index]);
    this.props.setCurrentTab("Send Message");
    // Alert.alert(`This is row ${index + 1}`);
  }

  render() {
    const state = this.state;
    const element = (data, index) => (
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
    const readButton = (rowData, data, index) =>
      data ? (
        <RadioButton
          value="Readed"
          status="checked"
          // disabled={true}
        ></RadioButton>
      ) : (
        <RadioButton
          value="Readed"
          status="unchecked"
          onPress={() => {
            this.checked.push(rowData[5]);
            this.setChecked(this.checked);
            this.state.tableData[index][4] = false;
          }}
        ></RadioButton>
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
                    cellIndex === 5 && this.props.type === "reciever"
                      ? ""
                      : cellIndex === 4 && this.props.type === "sender"
                      ? this.editIndex(cellData, index)
                      : cellIndex === 4 && this.props.type === "reciever"
                      ? readButton(rowData, cellData, index)
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
  text: { marginHorizontal: 6, fontSize: 16, textAlign: "center" },
  rowSection: {
    flexDirection: "row",
    height: 60,
    backgroundColor: "#f1f8ff",
  },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "black" },
});
