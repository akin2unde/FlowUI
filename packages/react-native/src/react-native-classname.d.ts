import "react-native";

declare module "react-native" {
  interface ViewProps {
    className?: string;
  }

  interface TextProps {
    className?: string;
  }

  interface TextInputProps {
    className?: string;
  }

  interface ImagePropsBase {
    className?: string;
  }

  interface ScrollViewProps {
    className?: string;
    contentContainerClassName?: string;
  }

  interface SwitchProps {
    className?: string;
  }

  interface ActivityIndicatorProps {
    className?: string;
  }
}
