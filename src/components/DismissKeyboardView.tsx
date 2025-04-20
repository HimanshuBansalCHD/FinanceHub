import React, { ReactNode } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  ViewStyle,
  StyleProp,
} from "react-native";

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const DismissKeyboardView: React.FC<Props> = ({ children, style }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={[{ flex: 1 }, style]}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {children}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;
