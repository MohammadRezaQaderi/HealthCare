import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

export const checkConnected = () => {
  return NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      return true;
    } else {
      return false;
    }
  });
};

const readData = async (key) => {
  try {
    let allKeys = await AsyncStorage.getAllKeys();
    if (allKeys.includes(key)) {
      var value = await AsyncStorage.getItem(key);
      return value;
    } else {
      return null;
    }
  } catch (e) {
    return null;
  }
};

const saveData = async (key, value ) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    alert("Failed to save the data to the storage");
  }
};

const removeItemValue = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};

const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    alert("Failed to clear :)");
  }
};

export { readData, saveData, clearAll, removeItemValue };