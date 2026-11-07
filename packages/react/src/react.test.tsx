import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Button,
  ButtonGroup,
  DateTime,
  FlowUIProvider,
  HC,
  Listbox,
  MultiSelect,
  Timeline,
  Table,
  TreeMultiSelect,
  Input,
  Label,
  PasswordInput,
  TextArea,
} from "./index";

describe("FlowUI React", () => {
  it("keeps optional text controls controlled from their first render", () => {
    const html = renderToStaticMarkup(
      <FlowUIProvider>
        <Input value={undefined} />
        <PasswordInput value={undefined} />
        <TextArea value={undefined} />
      </FlowUIProvider>,
    );
    expect(html).toContain('value=""');
  });
  it("puts login labels and autocomplete hints on the native inputs", () => {
    const html = renderToStaticMarkup(
      <FlowUIProvider>
        <Label htmlFor="login-email">Email</Label>
        <Input id="login-email" type="email" autoComplete="username" />
        <Label htmlFor="login-password">Password</Label>
        <PasswordInput id="login-password" autoComplete="current-password" />
      </FlowUIProvider>,
    );
    expect(html).toContain('for="login-email"');
    expect(html).toContain('for="login-password"');
    const inputs = html.match(/<input\b[^>]*>/g) ?? [];
    expect(inputs[0]).toContain('id="login-email"');
    expect(inputs[0]).toContain('autoComplete="username"');
    expect(inputs[1]).toContain('id="login-password"');
    expect(inputs[1]).toContain('autoComplete="current-password"');
    expect(html.match(/id="login-password"/g)).toHaveLength(1);
    expect(html).toContain('aria-label="Show password"');
  });

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

  it("renders advanced controls and selection state", () => {
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
        <MultiSelect
          options={[
            { display: "Nigeria", value: "ng", other: null },
            { display: "Ghana", value: "gh", other: null },
          ]}
          value={["ng"]}
          searchable
        />
        <TreeMultiSelect
          nodes={[
            {
              display: "Food",
              value: "food",
              other: null,
              children: [{ display: "Noodles", value: "noodles", other: null }],
            },
          ]}
          value={["noodles"]}
        />
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
    expect(html).toContain('aria-label="Choose date"');
    expect(html).toContain('aria-label="Choose time"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("Nigeria");
    expect(html).toContain("Created");
    expect(html).toContain("Remove Nigeria");
    expect(html).toContain("Remove Noodles");
    expect(html).toContain('data-alternate-rows="true"');
    expect(html).toContain("Excel");
    expect(html).not.toContain("<th>Price</th>");
  });
});
