import {
  Animated,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import SignInScreen from "./src/screens/SignInScreen";
import LogoutScreen from "./src/screens/LogoutScreen";
import AddFacility from "./src/screens/FacilityScreen/AddFacility";
import ListFacility from "./src/screens/FacilityScreen/ListFacility";
import AddMessage from "./src/screens/MessageScreen/AddMessage";
import ListMessage from "./src/screens/MessageScreen/ListMessage";
import ScanQRScreen from "./src/screens/ScanQRScreen";
import URLScreen from "./src/screens/URLScreen";
import SyncScreen from "./src/screens/SettingScreens/SyncScreen";
import home from "./assets/images/home.png";
import search from "./assets/images/search.png";
import ScanQR from "./assets/images/qrcode.png";
import settings from "./assets/images/settings.png";
import logout from "./assets/images/logout.png";
import login from "./assets/images/login.png";
import menu from "./assets/images/menu.png";
import close from "./assets/images/close.png";
import sync from "./assets/images/sync.png";
import message from "./assets/images/message.png";
import addFacility from "./assets/images/add-facility.png";
import listFacility from "./assets/images/list-facility.png";
import sendMessage from "./assets/images/send-message.png";
import listMessage from "./assets/images/list-message.png";
import left from "./assets/images/left.png";
import down from "./assets/images/down.png";
import { readData, saveData, clearAll } from "./src/components/func";

export default function App() {
  // menu sub menu checked
  const [checkState, setCheckState] = useState(false);
  const [facilitySelect, setFacilitySelect] = useState(false);
  const [itemSelect, setItemSelect] = useState(false);
  const [messageSelect, setMessageSelect] = useState(false);

  // Login or Logout
  const [loggedIn, setLoggedIn] = useState(false);
  const [urlState, setUrlState] = useState(false);
  const [currentTab, setCurrentTab] = useState("Login");
  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);

  // Animated Properties...

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
  // clearAll();
  useEffect(() => {
    readData("URL").then((value) => {
      if (value != null) {
        setUrlState(true);
      }
    });
    readData("token").then((value) => {
      if (value != null) {
        setLoggedIn(true);
        setCurrentTab("Send Message");
      }
    });
    setCheckState(true);
  }, []);

  if (checkState) {
    return (
      <SafeAreaView style={styles.container}>
        {!urlState && (
          <>
            <SafeAreaView>
              <View>
                <URLScreen setUrlState={setUrlState} />
              </View>
            </SafeAreaView>
          </>
        )}
        {urlState && (
          <>
            <View style={{ justifyContent: "flex-start", padding: 15 }}>
              <View style={{ flexGrow: 1, marginTop: 50 }}>
                {
                  // Tab Bar Buttons....
                }
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Facility",
                  home,
                  false,
                  facilitySelect,
                  [setFacilitySelect, setItemSelect, setMessageSelect],
                  true
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "New Facility",
                  addFacility,
                  true,
                  facilitySelect,
                  "no",
                  false
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Facility List",
                  listFacility,
                  true,
                  facilitySelect,
                  "no",
                  false
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Items",
                  search,
                  false,
                  itemSelect,
                  [setItemSelect, setFacilitySelect, setMessageSelect],
                  true
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Message",
                  message,
                  false,
                  messageSelect,
                  [setMessageSelect, setFacilitySelect, setItemSelect],
                  true
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Send Message",
                  sendMessage,
                  true,
                  messageSelect,
                  "no",
                  false
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Message List",
                  listMessage,
                  true,
                  messageSelect,
                  "no",
                  false
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Scan QR",
                  ScanQR,
                  false,
                  itemSelect,
                  "no",
                  false
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Sync",
                  sync,
                  false,
                  messageSelect,
                  "no",
                  false
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Settings",
                  settings,
                  false,
                  messageSelect,
                  "no",
                  false
                )}
              </View>

              <View>
                {loggedIn
                  ? TabButton(
                      currentTab,
                      setCurrentTab,
                      "Logout",
                      logout,
                      false,
                      messageSelect,
                      "no",
                      false
                    )
                  : TabButton(
                      currentTab,
                      setCurrentTab,
                      "Login",
                      login,
                      false,
                      messageSelect,
                      "no",
                      false
                    )}
              </View>
            </View>

            {
              // Over lay View...
            }

            <Animated.View
              style={{
                flexGrow: 1,
                backgroundColor: "white",
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: 15,
                paddingVertical: 20,
                borderRadius: showMenu ? 15 : 0,
                // Transforming View...
                transform: [{ scale: scaleValue }, { translateX: offsetValue }],
              }}
            >
              {
                // Menu Button...
              }

              <Animated.View
                style={{
                  transform: [
                    {
                      translateY: closeButtonOffset,
                    },
                  ],
                }}
              >
                <TouchableOpacity
                  onPress={() => {
                    // Do Actions Here....
                    // Scaling the view...
                    Animated.timing(scaleValue, {
                      toValue: showMenu ? 1 : 0.88,
                      duration: 300,
                      useNativeDriver: true,
                    }).start();

                    Animated.timing(offsetValue, {
                      // YOur Random Value...
                      toValue: showMenu ? 0 : 230,
                      duration: 300,
                      useNativeDriver: true,
                    }).start();

                    Animated.timing(closeButtonOffset, {
                      // YOur Random Value...
                      toValue: !showMenu ? -30 : 0,
                      duration: 300,
                      useNativeDriver: true,
                    }).start();

                    setShowMenu(!showMenu);
                  }}
                >
                  <Image
                    source={showMenu ? close : menu}
                    style={{
                      width: 20,
                      height: 20,
                      tintColor: "black",
                      marginTop: 40,
                    }}
                  ></Image>
                </TouchableOpacity>

                <Text style={styles.primaryText}>{currentTab}</Text>
                {currentTab == "Login" ? (
                  <SignInScreen
                    setLoggedIn={setLoggedIn}
                    setCurrentTab={setCurrentTab}
                  />
                ) : currentTab == "Logout" ? (
                  <LogoutScreen
                    setLoggedIn={setLoggedIn}
                    setCurrentTab={setCurrentTab}
                  />
                ) : currentTab == "New Facility" ? (
                  <AddFacility />
                ) : currentTab == "Facility List" ? (
                  <ListFacility />
                ) : currentTab == "Send Message" ? (
                  <AddMessage />
                ) : currentTab == "Message List" ? (
                  <ListMessage setCurrentTab={setCurrentTab} />
                ) : currentTab == "Scan QR" ? (
                  <ScanQRScreen />
                ) : currentTab == "Sync" ? (
                  <SyncScreen />
                ) : (
                  <></>
                )}
              </Animated.View>
            </Animated.View>
          </>
        )}
      </SafeAreaView>
    );
  }
}

const Show = (items) => {
  for (x in items) {
    if (x == 0) {
      items[x](true);
    } else {
      items[x](false);
    }
  }
};

// For multiple Buttons...
const TabButton = (
  currentTab,
  setCurrentTab,
  title,
  image,
  isSub,
  showed,
  setShowed,
  haveSub
) => {
  if (!isSub) {
    return (
      <TouchableOpacity
        onPress={() => {
          setCurrentTab(title);
          if (setShowed != "no") {
            Show(setShowed);
          }
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 8,
            backgroundColor: currentTab == title ? "white" : "transparent",
            paddingLeft: 13,
            paddingRight: 13,
            borderRadius: 8,
            marginTop: 15,
          }}
        >
          <Image
            source={image}
            style={{
              width: 25,
              height: 25,
              tintColor: currentTab == title ? "#5359D1" : "white",
            }}
          ></Image>

          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              paddingLeft: 15,
              color: currentTab == title ? "#5359D1" : "white",
            }}
          >
            {title}
          </Text>

          {haveSub ? (
            !showed ? (
              <>
                <Image source={left}></Image>
              </>
            ) : (
              <>
                <Image source={down}></Image>
              </>
            )
          ) : (
            <></>
          )}
        </View>
      </TouchableOpacity>
    );
  } else {
    if (showed) {
      return (
        <TouchableOpacity
          onPress={() => {
            setCurrentTab(title);
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 8,
              backgroundColor: currentTab == title ? "white" : "transparent",
              paddingLeft: 13,
              paddingRight: 13,
              borderRadius: 8,
              marginTop: 15,
              marginLeft: 25,
            }}
          >
            <Image
              source={image}
              style={{
                width: 25,
                height: 25,
                tintColor: currentTab == title ? "#5359D1" : "white",
              }}
            ></Image>

            <Text
              style={{
                fontSize: 15,
                fontWeight: "bold",
                paddingLeft: 15,
                color: currentTab == title ? "#5359D1" : "white",
              }}
            >
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#5359D1",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  root: {
    flexGrow: 1,
    marginTop: 50,
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#fff",
  },
  primaryText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
    paddingTop: 10,
  },
  secondaryText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "gray",
    paddingTop: 20,
    textAlign: "center",
  },
  thirdText: {
    fontSize: 15,
    color: "black",
    paddingTop: 10,
  },
});
