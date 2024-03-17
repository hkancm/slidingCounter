import React, { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, StatusBar } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import {
  GestureHandlerRootView,
  PanGestureHandler,
} from "react-native-gesture-handler";

const ICON_SIZE = 20;

const clamp = (value, min, max) => {
  "worklet";
  return Math.min(Math.max(value, min), max);
};

const BUTTON_WIDTH = 180;
const MAX_SLIDE_OFFSET = BUTTON_WIDTH * 0.3;

const SlidingCounter = () => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const [counter, setCounter] = useState(0);

  const increment = useCallback(() => {
    setCounter((currentCount) => currentCount + 1);
  }, []);

  const decrement = useCallback(() => {
    setCounter((currentCount) => currentCount - 1);
  }, []);

  const resetCounter = useCallback(() => {
    setCounter((currentCount) => 0);
  }, []);

  const incrementMore = useCallback(() => {
    setCounter((currentCount) => currentCount + 10);
  }, []);

  const onPangestureEvent = useAnimatedGestureHandler({
    onStart: () => {},
    onActive: (event) => {
      translateX.value = clamp(
        event.translationX,
        -MAX_SLIDE_OFFSET,
        MAX_SLIDE_OFFSET,
      );
      translateY.value = clamp(
        event.translationY,
        -MAX_SLIDE_OFFSET,
        MAX_SLIDE_OFFSET,
      );
    },
    onEnd: () => {
      if (translateX.value === MAX_SLIDE_OFFSET) {
        runOnJS(increment)();
      } else if (translateX.value === -MAX_SLIDE_OFFSET) {
        runOnJS(decrement)();
      } else if (translateY.value === MAX_SLIDE_OFFSET) {
        runOnJS(resetCounter)();
      } else if (translateY.value === -MAX_SLIDE_OFFSET) {
        runOnJS(incrementMore)();
      }

      translateX.value = withSpring(0);
      translateY.value = withSpring(0);
    },
  });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
    };
  }, []);

  const rPlusMinusIconStyle = useAnimatedStyle(() => {
    const opacityX = interpolate(
      translateX.value,
      [-MAX_SLIDE_OFFSET, 0, MAX_SLIDE_OFFSET],
      [0.1, 0.8, 0.1],
    );
    const opacityY = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET],
      [1, 0],
    );
    return {
      opacity: opacityX * opacityY,
    };
  }, []);

  const rCloseIconStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [0, MAX_SLIDE_OFFSET],
      [0, 0.8],
    );
    return {
      opacity,
    };
  }, []);

  const rButtonStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value * 0.1 },
        { translateY: translateY.value * 0.1 },
      ],
    };
  }, []);

  return (
    <Animated.View style={[styles.button, rButtonStyle]}>
      <StatusBar hidden />
      <Animated.View style={rPlusMinusIconStyle}>
        <AntDesign name="minus" size={ICON_SIZE} color="white" />
      </Animated.View>
      <Animated.View style={rCloseIconStyle}>
        <AntDesign name="close" size={ICON_SIZE} color="white" />
      </Animated.View>
      <Animated.View style={rPlusMinusIconStyle}>
        <AntDesign name="plus" size={ICON_SIZE} color="white" />
      </Animated.View>
      <GestureHandlerRootView
        style={{
          ...StyleSheet.absoluteFillObject,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <PanGestureHandler onGestureEvent={onPangestureEvent}>
          <Animated.View style={[styles.circle, rStyle]}>
            <Text style={styles.counter}>{counter}</Text>
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 70,
    width: BUTTON_WIDTH,
    backgroundColor: "#101010",
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  circle: {
    height: 50,
    width: 50,
    borderRadius: 25,
    backgroundColor: "#225252",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  counter: {
    fontSize: 25,
    color: "white",
  },
});

export default SlidingCounter;
