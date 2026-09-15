import {
  ActivityIndicator as RNActivityIndicator,
  Image as RNImage,
  KeyboardAvoidingView as RNKeyboardAvoidingView,
  Pressable as RNPressable,
  ScrollView as RNScrollView,
  Switch as RNSwitch,
  Text as RNText,
  TextInput as RNTextInput,
  View as RNView,
} from "react-native";
import { cssInterop } from "nativewind";

const mapping = { className: "style" } as const;

// FlowUI is distributed as compiled JavaScript, so the consuming app's Babel
// transform cannot rewrite these internal primitives. Always render the
// components returned by cssInterop; merely calling cssInterop is not enough.
export const View = cssInterop(RNView, mapping);
export const Text = cssInterop(RNText, mapping);
export const Pressable = cssInterop(RNPressable, mapping);
export const TextInput = cssInterop(RNTextInput, mapping);
export const ScrollView = cssInterop(RNScrollView, mapping);
export const Image = cssInterop(RNImage, mapping);
export const Switch = cssInterop(RNSwitch, mapping);
export const ActivityIndicator = cssInterop(RNActivityIndicator, mapping);
export const KeyboardAvoidingView = cssInterop(RNKeyboardAvoidingView, mapping);
