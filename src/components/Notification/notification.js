import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

const Message = (props) => {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start(() => {
      "";
    });
  }, []);

  return (
    <Animated.View
      style={{
        opacity,
        transform: [
          {
            translateY: opacity.interpolate({
              inputRange: [0, 1],
              outputRange: [-20, 0],
            }),
          },
        ],
        margin: 10,
        marginBottom: 5,
        padding: 10,
        borderRadius: 4,
        backgroundColor:
          props.type == "success"
            ? "green"
            : props.type == "warn"
            ? "yellow"
            : props.type == "danger"
            ? "red"
            : "white",
        shadowColor: "black",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
      }}
    >
      <Text style={{ color: "white" }}>{props.message}</Text>
    </Animated.View>
  );
};

export default ({ type, message }) => {
  return (
    <>
      <View
        style={{
          position: "absolute",
          top: 45,
          left: 0,
          right: 0,
        }}
      >
        <Message key={1} message={message} type={type} />
      </View>
    </>
  );
};
