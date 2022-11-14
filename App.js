import React, { useEffect, useState } from "react";
// Functionality Import
import { readData, saveData, clearAll } from "./src/components/DataStorage";
import ExampleFour from "./src/components/MessageListTable";
import MenuScreen from "./src/screens/MenuScreen/MenuScreen";
import { QueryClient, QueryClientProvider } from "react-query";
import "./i18n";

// import Toast from "react-native-toast-message";
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false, retry: 0 } },
});

export default function App() {
  /**
   * State Management
   */
  const [checkState, setCheckState] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [urlState, setUrlState] = useState(false);
  const [currentTab, setCurrentTab] = useState("Login");
  /**
   * check the Url setted and Login status
   */
  // clearAll();
  useEffect(() => {
    readData("URL").then((url) => {
      if (url != null) {
        setUrlState(true);
      }
    });
    readData("token").then((token) => {
      if (token != null) {
        setLoggedIn(true);
        setCurrentTab("New Facility");
      }
    });
    setCheckState(true);
  }, []);
  return (
    // <Button title="=" onPress={showToast} />
    <QueryClientProvider client={queryClient}>
      <MenuScreen
        checkState={checkState}
        urlState={urlState}
        setUrlState={setUrlState}
        loggedIn={loggedIn}
        setLoggedIn={setLoggedIn}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    </QueryClientProvider>
  );
}
// import React, { Component } from "react";
// import { StyleSheet, Text, ScrollView, TouchableOpacity } from "react-native";
// import TextInput from "react-native-input-validator";

// export default class App extends Component {
//   constructor(props) {
//     super(props);

//     this.textInput = [];

//     this.state = {
//       value: "Example of string",
//       valueRequired: "",
//       valueNumber: 1,
//     };
//   }

//   render() {
//     return (
//       <ScrollView style={styles.container}>
//         <Text style={styles.title}>
//           Example{"\n"}react-native-input-validator
//         </Text>
//         <TextInput
//           onRef={(r) => {
//             this.textInput[0] = r;
//           }}
//           value={this.state.value}
//           style={styles.input}
//           onChangeText={(text) => {
//             this.setState({ value: text });
//           }}
//         >
//           <Text>Default</Text>
//         </TextInput>
//         <TextInput
//           onRef={(r) => {
//             this.textInput[1] = r;
//           }}
//           value={this.state.valueRequired}
//           required={true}
//           style={styles.input}
//           onChangeText={(text) => {
//             this.setState({ valueRequired: text });
//           }}
//         >
//           <Text>Required</Text>
//         </TextInput>
//         <TextInput
//           onRef={(r) => {
//             this.textInput[2] = r;
//           }}
//           value={this.state.value}
//           style={styles.input}
//           type={"email"}
//           onChangeText={(text) => {
//             this.setState({ value: text });
//           }}
//         >
//           <Text>Email</Text>
//         </TextInput>
//         <TextInput
//           onRef={(r) => {
//             this.textInput[3] = r;
//           }}
//           value={this.state.valueNumber}
//           style={styles.input}
//           type={"numeric"}
//           onChangeText={(text) => {
//             this.setState({ valueNumber: text });
//           }}
//         >
//           <Text>Number</Text>
//         </TextInput>
//         <TouchableOpacity
//           style={styles.button}
//           onPress={() => {
//             console.log(this.textInput);
//             this.textInput.map((item, i) => {
//               console.log("TextInput " + i, item.isValid());
//             });
//           }}
//         >
//           <Text>Validate</Text>
//         </TouchableOpacity>
//         <Text>Check validation on console.</Text>
//       </ScrollView>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     padding: 20,
//     paddingTop: 40,
//   },
//   title: {
//     marginBottom: 40,
//     fontSize: 30,
//   },
//   input: {
//     flex: 1,
//     width: "auto",
//     minWidth: 150,
//   },
//   button: {
//     marginTop: 20,
//     alignItems: "center",
//     padding: 20,
//     backgroundColor: "#DDD",
//   },
// });
