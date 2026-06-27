/**
 * Web mock for react-native-reanimated
 * Reanimated animations don't work on web, so we provide no-op implementations
 */
const React = require("react");

// Mock Animated components (just return regular React Native Web components)
const Animated = {
  View: "div",
  Text: "span",
  Image: "img",
  ScrollView: "div",
  FlatList: "div",
  createAnimatedComponent: (component) => component,
};

// No-op hooks
const useSharedValue = (initial) => ({ value: initial });
const useDerivedValue = (fn) => ({ value: fn() });
const useAnimatedStyle = () => ({});
const useAnimatedProps = () => ({});
const useAnimatedRef = () => React.useRef(null);
const useAnimatedScrollHandler = () => () => {};
const useAnimatedGestureHandler = () => () => {};
const useAnimatedReaction = () => {};
const useFrameCallback = () => {};
const useAnimatedSensor = () => ({ sensor: { value: null } });

// No-op animation functions
const withTiming = (value) => value;
const withSpring = (value) => value;
const withDecay = (config) => config.velocity || 0;
const withDelay = (delay, animation) => animation;
const withRepeat = (animation) => animation;
const withSequence = (...animations) => animations[animations.length - 1];
const cancelAnimation = () => {};

// No-op utility functions
const runOnUI = (fn) => fn;
const runOnJS = (fn) => fn;
const makeMutable = (value) => ({ value });
const makeShareableCloneRecursive = (value) => value;
const isSharedValue = (value) =>
  value && typeof value === "object" && "value" in value;

// Easing functions (return identity)
const Easing = {
  linear: (t) => t,
  ease: (t) => t,
  quad: (t) => t,
  cubic: (t) => t,
  poly: (n) => (t) => t,
  sin: (t) => t,
  circle: (t) => t,
  exp: (t) => t,
  elastic: (bounciness) => (t) => t,
  back: (s) => (t) => t,
  bounce: (t) => t,
  bezier: (x1, y1, x2, y2) => (t) => t,
  in: (easing) => easing,
  out: (easing) => easing,
  inOut: (easing) => easing,
};

// Interpolation
const interpolate = (value, inputRange, outputRange, options) => {
  return outputRange[0];
};

const interpolateColor = (value, inputRange, outputRange, colorSpace) => {
  return outputRange[0];
};

const Extrapolate = {
  EXTEND: "extend",
  CLAMP: "clamp",
  IDENTITY: "identity",
};

module.exports = {
  // Animated components
  default: Animated,
  Animated,

  // Hooks
  useSharedValue,
  useDerivedValue,
  useAnimatedStyle,
  useAnimatedProps,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useFrameCallback,
  useAnimatedSensor,

  // Animation functions
  withTiming,
  withSpring,
  withDecay,
  withDelay,
  withRepeat,
  withSequence,
  cancelAnimation,

  // Utilities
  runOnUI,
  runOnJS,
  makeMutable,
  makeShareableCloneRecursive,
  isSharedValue,

  // Easing
  Easing,

  // Interpolation
  interpolate,
  interpolateColor,
  Extrapolate,
};
