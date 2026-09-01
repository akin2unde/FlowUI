import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Button,
  ButtonGroup,
  DateTime,
  FlowUIProvider,
  HC,
  Listbox,
  Timeline,
  Table,
} from "./index";

describe("FlowUI React", () => {
  it("renders components and default responsive classes", () => {
    const html = renderToStaticMarkup(
      <FlowUIProvider>
        <HC width={{ default: "full", md: 600 }}>
          <Button>Save</Button>
        </HC>
      </FlowUIProvider>,
    );
    expect(html).toContain("fui-r-width-default");
    expect(html).toContain("Save");
  });

  it("renders the 0.1.1 controls and selection state", () => {
    const html = renderToStaticMarkup(
      <FlowUIProvider>
        <DateTime value="2026-09-01T09:30" />
        <ButtonGroup selectable value="week">
          <Button value="day">Day</Button>
          <Button value="week">Week</Button>
        </ButtonGroup>
        <Listbox
          options={[{ display: "Nigeria", value: "ng", other: null }]}
          value="ng"
        />
        <Timeline items={[{ id: 1, title: "Created" }]} />
        <Table
          data={[{ name: "Rice", price: 10 }]}
          columns={[
            { field: "name", header: "Product" },
            { field: "price", header: "Price" },
          ]}
          visibleColumnFields={["name"]}
          columnsConfigurable
          exportable
        />
      </FlowUIProvider>,
    );
    expect(html).toContain("2026-09-01");
    expect(html).toContain('title="Today"');
    expect(html).toContain('title="Start of day"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("Nigeria");
    expect(html).toContain("Created");
    expect(html).toContain('data-alternate-rows="true"');
    expect(html).toContain("Excel");
    expect(html).not.toContain("<th>Price</th>");
  });
});
