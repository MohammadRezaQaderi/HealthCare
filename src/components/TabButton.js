import { Image, Text, TouchableOpacity, View } from "react-native";
import left from "../../assets/left.png";
import down from "../../assets/down.png";
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
  setDefaultValueFacility,
  setDefaultValueItem,
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
          setDefaultValueFacility({})
          setDefaultValueItem({})
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
            setDefaultValueFacility({});
            setDefaultValueItem({});
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

export { TabButton };
