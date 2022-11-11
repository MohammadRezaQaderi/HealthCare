import NetInfo from "@react-native-community/netinfo";

const InternetConnection = async () => {
  return NetInfo.fetch().then((state) => {
    if (state.isConnected) {
      return true;
    } else {
      return false;
    }
  });
};
export default InternetConnection;
