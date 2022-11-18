import { useRef, useState } from "react";
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  View,
} from "react-native";
import { TabButton } from "../../components/TabButton";
// Screen Import
import URLScreen from "../URLScreen/URLScreen";
import SignInScreen from "../SignInScreen/SignInScreen";
import LogoutScreen from "../LogoutScreen";
import SyncScreen from "../SyncScreen/SyncScreen";
import ScanQRScreen from "../ScanQRScreen/ScanQRScreen";
import AddMessageScreen from "../MessageScreen/AddMessage/AddMessageScreen";
import ListMessageScreen from "../MessageScreen/ListMessage/ListMessageScreen";
import AddFacilityScreen from "../FacilityScreen/AddFacility/AddFacilityScreen";
import ListFacilityScreen from "../FacilityScreen/ListFacility/ListFacilityScreen";
import AddItemScreen from "../ItemScreen/AddItem/AddItemScreen";
import ListItemScreen from "../ItemScreen/ListItem/ListItemScreen";

// Icon and Image Import
import home from "../../../assets/home.png";
import search from "../../../assets/search.png";
import ScanQR from "../../../assets/qrcode.png";
import settings from "../../../assets/settings.png";
import logout from "../../../assets/logout.png";
import login from "../../../assets/login.png";
import menu from "../../../assets/menu.png";
import close from "../../../assets/close.png";
import sync from "../../../assets/sync.png";
import message from "../../../assets/message.png";
import addFacility from "../../../assets/add-facility.png";
import listFacility from "../../../assets/list-facility.png";
import sendMessage from "../../../assets/send-message.png";
import listMessage from "../../../assets/list-message.png";
import addItem from "../../../assets/add-list.png";
import listItem from "../../../assets/list-item.png";
const MenuScreen = ({
  checkState,
  urlState,
  setUrlState,
  loggedIn,
  setLoggedIn,
  currentTab,
  setCurrentTab,
}) => {
  /**
   * state management
   */
  const [facilitySelect, setFacilitySelect] = useState(false);
  const [itemSelect, setItemSelect] = useState(false);
  const [messageSelect, setMessageSelect] = useState(false);
  const [defaultValueMessage, setDefaultValueMessage] = useState({});
  const [defaultValueFacility, setDefaultValueFacility] = useState({});
  const [defaultValueItem, setDefaultValueItem] = useState({});
  const [facilityParent, setFacilityParent] = useState({});
  const [itemParent, setItemParent] = useState({});
  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);
  // Animated Properties...
  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;
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
                  "Add Item",
                  addItem,
                  true,
                  itemSelect,
                  "no",
                  false
                )}
                {TabButton(
                  currentTab,
                  setCurrentTab,
                  "Item List",
                  listItem,
                  true,
                  itemSelect,
                  "no",
                  false
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
                ) : currentTab == "Sync" ? (
                  <SyncScreen />
                ) : currentTab == "Scan QR" ? (
                  <ScanQRScreen
                    setCurrentTab={setCurrentTab}
                    setDefaultValueItem={setDefaultValueItem}
                  />
                ) : currentTab == "Send Message" ? (
                  <AddMessageScreen defaultValueMessage={defaultValueMessage} />
                ) : currentTab == "Message List" ? (
                  <ListMessageScreen
                    setCurrentTab={setCurrentTab}
                    setDefaultValueMessage={setDefaultValueMessage}
                  />
                ) : currentTab == "Facility List" ? (
                  <ListFacilityScreen
                    setCurrentTab={setCurrentTab}
                    setDefaultValueFacility={setDefaultValueFacility}
                    facilityParent={facilityParent}
                    setFacilityParent={setFacilityParent}
                    itemParent={itemParent}
                  />
                ) : currentTab == "New Facility" ? (
                  <AddFacilityScreen
                    defaultValueFacility={defaultValueFacility}
                    setDefaultValueFacility={setDefaultValueFacility}
                    facilityParent={facilityParent}
                    setFacilityParent={setFacilityParent}
                  />
                ) : currentTab == "Item List" ? (
                  <ListItemScreen
                    setCurrentTab={setCurrentTab}
                    setDefaultValueItem={setDefaultValueItem}
                    itemParent={itemParent}
                  />
                ) : currentTab == "Add Item" ? (
                  <AddItemScreen
                    setCurrentTab={setCurrentTab}
                    setDefaultValueItem={setDefaultValueItem}
                    defaultValueItem={defaultValueItem}
                    itemParent={itemParent}

                  />
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

export default MenuScreen;
