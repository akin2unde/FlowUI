import React from "react";
import { Text, View, type ViewProps } from "react-native";
import Svg, { Path, Rect, Text as SvgText } from "react-native-svg";
import {
  buildChart,
  type ChartProps as CoreChartProps,
} from "@akin2unde/flowui-core";

export interface ChartProps
  extends
    Pick<
      CoreChartProps,
      "type" | "data" | "height" | "showLegend" | "showValues"
    >,
    ViewProps {}

export const Chart = ({
  type = "bar",
  data,
  height = 260,
  showLegend = true,
  showValues = false,
  ...props
}: ChartProps) => {
  const chart = buildChart(data, type, height, showValues);
  return (
    <View
      {...props}
      accessible
      accessibilityRole="image"
      accessibilityLabel={props.accessibilityLabel ?? `${type} chart`}
    >
      <Svg
        width="100%"
        height={height}
        viewBox={`0 0 ${chart.width} ${chart.height}`}
      >
        {chart.marks.map((mark, index) =>
          mark.path ? (
            <Path
              key={index}
              d={mark.path}
              fill={mark.fill}
              fillOpacity={mark.opacity}
              stroke={mark.stroke}
              strokeWidth={2.5}
            />
          ) : (
            <Rect
              key={index}
              x={mark.x}
              y={mark.y}
              width={mark.width}
              height={mark.height}
              rx={3}
              fill={mark.fill}
            />
          ),
        )}
        {chart.labels.map((label, index) => (
          <SvgText
            key={index}
            x={label.x}
            y={label.y}
            textAnchor={label.anchor}
            fontSize={13}
            fill="#475569"
          >
            {label.text}
          </SvgText>
        ))}
      </Svg>
      {showLegend && (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {chart.legend.map((item, index) => (
            <View
              key={index}
              style={{ flexDirection: "row", gap: 5, alignItems: "center" }}
            >
              <View
                style={{
                  backgroundColor: item.color,
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                }}
              />
              <Text>{item.label}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
