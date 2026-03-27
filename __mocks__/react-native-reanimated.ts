import React from 'react';
const { View, Text, Image, ScrollView, FlatList } = require('react-native');

const mock = {
  default: {
    View,
    Text,
    Image,
    ScrollView,
    FlatList,
    createAnimatedComponent: (component: React.ComponentType) => component,
  },
  useSharedValue: (init: unknown) => ({ value: init }),
  useAnimatedStyle: (fn: () => object) => fn(),
  useAnimatedScrollHandler: () => () => {},
  withTiming: (toValue: unknown) => toValue,
  withSpring: (toValue: unknown) => toValue,
  withSequence: (..._args: unknown[]) => 0,
  withRepeat: (animation: unknown) => animation,
  withDelay: (_delay: unknown, animation: unknown) => animation,
  Easing: { linear: (t: unknown) => t, ease: (t: unknown) => t, inOut: (fn: unknown) => fn },
  cancelAnimation: jest.fn(),
  runOnJS: (fn: (...args: unknown[]) => unknown) => fn,
  runOnUI: (fn: (...args: unknown[]) => unknown) => fn,
  LinearTransition: {
    springify: () => ({ damping: () => ({}) }),
  },
  createAnimatedComponent: (component: React.ComponentType) => component,
};

mock.default = {
  ...mock.default,
  ...mock,
  View,
  Text,
  Image,
  ScrollView,
  FlatList,
};

module.exports = mock;
