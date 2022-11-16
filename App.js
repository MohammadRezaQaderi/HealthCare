import React, { useEffect, useState } from "react";
// Functionality Import
import { readData, saveData, clearAll } from "./src/components/DataStorage";
import ExampleFour from "./src/components/MessageListTable";
import MenuScreen from "./src/screens/MenuScreen/MenuScreen";
import { QueryClient, QueryClientProvider } from "react-query";
import Toast from "react-native-toast-message";
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import "./i18n";

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
   
    <GestureHandlerRootView style={{ flex: 1 }}>
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
        <Toast />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
}
