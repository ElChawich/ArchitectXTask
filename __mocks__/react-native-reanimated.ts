import React from 'react';
const { View, Text, Image, ScrollView, FlatList } = require('react-native');

export const useSharedValue = (init: unknown) => ({ value: init });
export const useAnimatedStyle = (fn: () => object) => fn();
export const useAnimatedScrollHandler = () => () => {};
export const withTiming = (toValue: unknown) => toValue;
export const withSpring = (toValue: unknown) => toValue;
export const withSequence = (..._args: unknown[]) => 0;
export const withRepeat = (animation: unknown) => animation;
export const withDelay = (_delay: unknown, animation: unknown) => animation;
export const cancelAnimation = jest.fn();
export const runOnJS = (fn: (...args: unknown[]) => unknown) => fn;
export const runOnUI = (fn: (...args: unknown[]) => unknown) => fn;
export const Easing = {
  linear: (t: unknown) => t,
  ease: (t: unknown) => t,
  inOut: (fn: unknown) => fn,
};
export const LinearTransition = {
  springify: () => ({ damping: () => ({}) }),
};
export const createAnimatedComponent = (component: React.ComponentType) => component;

const Animated = {
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
  createAnimatedComponent,
};

export default Animated;
