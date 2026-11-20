using System.Globalization;
using Microsoft.AspNetCore.Components;

namespace FlowUI.Blazor.DataDisplay;

public sealed record FlowChartSeries(string Name, IReadOnlyList<double> Data, string? Color = null, string? Type = null);

public partial class FlowChart
{
    [Parameter] public string Type { get; set; } = "bar";
    [Parameter] public IReadOnlyList<string> Labels { get; set; } = [];
    [Parameter] public IReadOnlyList<FlowChartSeries> Series { get; set; } = [];
    [Parameter] public int ChartHeight { get; set; } = 260;
    [Parameter] public bool ShowValues { get; set; }
    [Parameter] public bool ShowLegend { get; set; } = true;

    private sealed record Mark(string Fill, string? Path = null, string? Stroke = null, string? Opacity = null,
        double X = 0, double Y = 0, double Width = 0, double Height = 0);
    private sealed record Caption(double X, double Y, string Text, string Anchor = "middle");
    private sealed record Key(string Label, string Color);
    private sealed record ChartGeometry(List<Mark> Marks, List<Caption> Labels, List<Key> Legend);
    private ChartGeometry Geometry { get; set; } = new([], [], []);
    private static readonly string[] Palette = ["#3b82c4", "#f59429", "#8cba39", "#ed74a7", "#8762c8"];
    private static string Number(double value) => value.ToString("0.####", CultureInfo.InvariantCulture);
    private static string Point(double x, double y) => $"{Number(x)},{Number(y)}";
    private static string Color(int index) => Palette[index % Palette.Length];

    protected override void OnParametersSet() => Geometry = BuildChart();
    private ChartGeometry BuildChart()
    {
        var marks = new List<Mark>();
        var labels = new List<Caption>();
        var legend = Series.Select((series, index) => new Key(series.Name, series.Color ?? Color(index))).ToList();
        if (Type is "pie" or "doughnut")
        {
            var pie = Series.FirstOrDefault()?.Data.Select(value => Math.Max(0, value)).ToArray() ?? [];
            legend = pie.Select((_, index) => new Key(index < Labels.Count ? Labels[index] : (index + 1).ToString(), Color(index))).ToList();
            var radius = ChartHeight * .38;
            var centerY = ChartHeight / 2d;
            var start = -Math.PI / 2;
            var total = pie.Sum();
            string At(double r, double angle) => Point(320 + r * Math.Cos(angle), centerY + r * Math.Sin(angle));
            for (var index = 0; index < pie.Length; index++)
            {
                var value = pie[index];
                if (value <= 0) continue;
                var sweep = 2 * Math.PI * value / total;
                var end = start + Math.Min(sweep, 2 * Math.PI - .0001);
                var inner = Type == "doughnut" ? radius * .55 : 0;
                var large = sweep > Math.PI ? 1 : 0;
                var tail = inner == 0 ? $"L {Point(320, centerY)}"
                    : $"L {At(inner, end)} A {Point(inner, inner)} 0 {large} 0 {At(inner, start)}";
                marks.Add(new(Color(index), $"M {At(radius, start)} A {Point(radius, radius)} 0 {large} 1 {At(radius, end)} {tail} Z", "white"));
                var mid = (start + end) / 2;
                if (ShowValues) labels.Add(new(320 + radius * .75 * Math.Cos(mid), centerY + radius * .75 * Math.Sin(mid), Number(value)));
                start += sweep;
            }
            return new(marks, labels, legend);
        }

        var horizontal = Type == "horizontal-bar";
        var left = horizontal ? 120d : 48d;
        const double right = 612, top = 24;
        var bottom = ChartHeight - 34d;
        var values = Series.SelectMany(series => series.Data).Append(0).ToArray();
        var min = values.Min();
        var max = Math.Max(1, values.Max());
        var count = Math.Max(1, Math.Max(Labels.Count, Series.Select(series => series.Data.Count).DefaultIfEmpty().Max()));
        var groupWidth = (right - left) / count;
        var groupHeight = (bottom - top) / count;
        double X(int index) => left + groupWidth * (index + .5);
        double Y(double value) => bottom - (value - min) / (max - min) * (bottom - top);
        double ScaleX(double value) => left + (value - min) / (max - min) * (right - left);
        bool IsLine(int index) => Type is "line" or "area" || Type == "combo" &&
            (Series[index].Type ?? (index == Series.Count - 1 ? "line" : "column")) == "line";
        marks.Add(new("none", horizontal
            ? $"M {Point(left, top)} V {Number(bottom)} H {Number(right)} M {Point(ScaleX(0), top)} V {Number(bottom)}"
            : $"M {Point(left, top)} V {Number(Y(0))} H {Number(right)}", "#cbd5e1"));
        for (var index = 0; index < Labels.Count; index++)
        {
            labels.Add(horizontal ? new(left - 10, top + groupHeight * (index + .5) + 4, Labels[index], "end")
                : new(X(index), ChartHeight - 10, Labels[index]));
        }

        var columns = Enumerable.Range(0, Series.Count).Where(index => !IsLine(index)).ToList();
        foreach (var index in columns)
        {
            var series = Series[index];
            var size = (horizontal ? groupHeight : groupWidth) * .68 / columns.Count;
            var offset = (columns.IndexOf(index) - columns.Count / 2d) * size;
            for (var i = 0; i < series.Data.Count; i++)
            {
                var value = series.Data[i];
                var fill = series.Color ?? (columns.Count > 1 ? legend[index].Color : Color(i));
                var rowY = top + groupHeight * (i + .5) + offset;
                marks.Add(horizontal
                    ? new(fill, X: Math.Min(ScaleX(0), ScaleX(value)), Y: rowY, Width: Math.Abs(ScaleX(value) - ScaleX(0)), Height: Math.Max(1, size - 3))
                    : new(fill, X: X(i) + offset, Y: Math.Min(Y(0), Y(value)), Width: Math.Max(1, size - 3), Height: Math.Abs(Y(value) - Y(0))));
                if (ShowValues) labels.Add(horizontal
                    ? new(ScaleX(value) + (value < 0 ? -4 : 4), rowY + size / 2 + 4, Number(value), value < 0 ? "end" : "start")
                    : new(X(i) + offset + size / 2, Y(value) - 6, Number(value)));
            }
        }
        for (var index = 0; index < Series.Count; index++)
        {
            var series = Series[index];
            if (!IsLine(index) || series.Data.Count == 0) continue;
            var trace = "M " + string.Join(" L ", series.Data.Select((value, i) => Point(X(i), Y(value))));
            if (Type == "area") marks.Add(new(legend[index].Color, $"{trace} L {Point(X(series.Data.Count - 1), Y(0))} L {Point(X(0), Y(0))} Z", Opacity: ".28"));
            marks.Add(new("none", trace, legend[index].Color));
            if (ShowValues) labels.AddRange(series.Data.Select((value, i) => new Caption(X(i), Y(value) - 8, Number(value))));
        }
        return new(marks, labels, legend);
    }
}
