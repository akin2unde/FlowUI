import type { BaseUIProps } from "./types";

export interface FlowTextStyle {
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: "normal" | "bold" | "400" | "500" | "600" | "700";
  lineHeight?: number;
  textAlign?: "left" | "center" | "right";
}

export interface FlowIconStyle {
  color?: string;
  size?: number;
}

export interface FlowAction {
  Label: string;
  Icon?: string;
  IsReadonly?: boolean;
  TextStyle?: FlowTextStyle;
  IconStyle?: FlowIconStyle;
}

export interface FlowStage {
  Id: string;
  Label: string;
  IsCurrent?: boolean;
  IsCompleted?: boolean;
  IsDisabled?: boolean;
  Actions?: readonly FlowAction[];
  SelectedAction?: FlowAction;
  TextStyle?: FlowTextStyle;
}

export interface FlowStageStyle {
  backgroundColor?: string;
  icon?: string;
  iconStyle?: FlowIconStyle;
  textStyle?: FlowTextStyle;
}

export interface FlowActionItemStyle {
  backgroundColor?: string;
  textStyle?: FlowTextStyle;
  iconStyle?: FlowIconStyle;
}

export interface WorkflowStepperProps extends BaseUIProps {
  stages: readonly FlowStage[];
  direction?: "horizontal" | "vertical";
  labelPosition?: "above" | "below" | "beside";
  lineColor?: string;
  stageTextStyle?: FlowTextStyle;
  completedStyle?: FlowStageStyle;
  currentStyle?: FlowStageStyle;
  disabledStyle?: FlowStageStyle;
  actionMenuStyle?: {
    backgroundColor?: string;
    borderColor?: string;
    borderRadius?: number;
    boxShadow?: string;
  };
  actionItemStyle?: FlowActionItemStyle & {
    hover?: FlowActionItemStyle;
    selected?: FlowActionItemStyle;
    readonly?: FlowActionItemStyle;
  };
  checkmarkStyle?: FlowIconStyle;
  chevronStyle?: FlowIconStyle;
}
