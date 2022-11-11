import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { Table, TableWrapper, Row, Cell } from "react-native-table-component";
export default class FacilityListTable extends Component {
  constructor(props) {
    super(props);
    this.state = props.data;
    this.checked = [];
  }

  _alertIndex(index) {
    this.props.setDefaultValueMessage(this.props.messages[index]);
    this.props.setCurrentTab("Send Message");
    // Alert.alert(`This is row ${index + 1}`);
  }

  render() {
    const state = this.state;
    const element = (data, index) => (
      <TouchableOpacity onPress={() => this._alertIndex(index)}>
        <View style={styles.btn}>
          <Text style={styles.btnText}>Edit</Text>
        </View>
      </TouchableOpacity>
    );
    const readButton = (data, index) =>
      data ? (
        <View>
          <RadioButton value="Readed" status="checked"></RadioButton>
        </View>
      ) : (
        <View>
          <RadioButton
            value="Readed"
            status="unchecked"
            onPress={() => {}}
          ></RadioButton>
        </View>
      );

    return (
      // <View style={styles.container}>
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
                  // cellIndex === 4 && this.props.type === "sender"
                  //   ? element(cellData, index)
                  //   : cellIndex === 4 && this.props.type === "reciever"
                  //   ? readButton(cellData, index)
                  //   :
                  cellData
                }
                // widthArr={state.widthArr}
                textStyle={(styles.text, { min: state?.widthArr[index] })}
              />
            ))}
          </TableWrapper>
        ))}
      </Table>
      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 50, backgroundColor: "#2888fe" },
  text: { margin: 6, fontSize: 16, textAlign: "center" },
  rowSection: {
    flex: 2,
    flexDirection: "row",
    height: 60,
    backgroundColor: "#f1f8ff",
  },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "black" },
});
