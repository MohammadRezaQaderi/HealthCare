import Toast from "react-native-toast-message";

const Notification = ({}) => {
  return (
    <>
      <Toast
        position="bottom"
        bottomOffset={20}
        text1={"This is an info message"}
      />
    </>
  );
};
