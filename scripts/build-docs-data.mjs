import ts from "typescript";
import { format } from "prettier";
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const parse = (path) =>
  ts.createSourceFile(
    path,
    readFileSync(resolve(root, path), "utf8"),
    ts.ScriptTarget.Latest,
    true,
  );
function catalog(path) {
  let expression;
  function walk(node) {
    if (
      (ts.isVariableDeclaration(node) || ts.isPropertyDeclaration(node)) &&
      node.name?.getText() === "componentCatalog"
    )
      expression = node.initializer.getText();
    ts.forEachChild(node, walk);
  }
  walk(parse(path));
  const output = ts.transpile(`const data = ${expression}; data`, {
    target: ts.ScriptTarget.ES2022,
  });
  return Function(`${output.replace(/;?\s*data;?\s*$/, "")}\nreturn data;`)();
}
const react = catalog("examples/react/src/App.tsx");
const angular = new Map(
  catalog("examples/angular/src/app/app.component.ts").map((row) => [
    row[1],
    row[3],
  ]),
);
const interfaces = new Map();
const classes = new Map();
for (const folder of [
  "packages/core/src",
  "packages/react/src",
  "packages/angular/src/lib",
  "packages/react-native/src",
]) {
  for (const file of readdirSync(resolve(root, folder)).filter((file) =>
    /\.tsx?$/.test(file),
  )) {
    const source = parse(`${folder}/${file}`);
    const imports = new Map();
    source.statements.forEach((node) => {
      if (
        ts.isImportDeclaration(node) &&
        node.moduleSpecifier.getText().includes("flowui-core")
      ) {
        node.importClause?.namedBindings?.elements?.forEach((item) =>
          imports.set(
            item.name.text,
            item.propertyName?.text ?? item.name.text,
          ),
        );
      }
    });
    source.statements.forEach((node) => {
      const framework = folder.includes("react-native")
        ? "native"
        : folder.includes("angular")
          ? "angular"
          : folder.includes("react")
            ? "react"
            : "core";
      if (ts.isInterfaceDeclaration(node))
        interfaces.set(`${framework}:${node.name.text}`, {
          node,
          imports,
          framework,
        });
      if (ts.isClassDeclaration(node) && node.name)
        classes.set(node.name.text, node);
    });
  }
}
function properties(name, framework, seen = new Set()) {
  if (seen.has(`${framework}:${name}`)) return [];
  const item =
    interfaces.get(`${framework}:${name}`) ?? interfaces.get(`core:${name}`);
  if (!item) return [];
  seen.add(`${framework}:${name}`);
  const result = [];
  for (const clause of item.node.heritageClauses ?? []) {
    for (const type of clause.types) {
      let parent = type.expression.getText();
      if (parent === "PropsWithChildren")
        parent = type.typeArguments?.[0]?.getText() ?? "";
      const coreName = item.imports.get(parent);
      result.push(
        ...properties(
          coreName ?? parent,
          coreName ? "core" : item.framework,
          seen,
        ),
      );
    }
  }
  for (const member of item.node.members) {
    if (!ts.isPropertySignature(member) || !member.name) continue;
    result.push({
      name: member.name.getText(),
      type: member.type?.getText().replace(/\s+/g, " ") ?? "unknown",
      optional: !!member.questionToken,
    });
  }
  return [...new Map(result.map((item) => [item.name, item])).values()];
}
function angularProperties(name) {
  const node = classes.get(`Flow${name}Component`);
  if (!node) return [];
  const members = [
    ...(classes.get("FlowComponentBase")?.members ?? []),
    ...node.members,
  ];
  return members
    .filter(
      (member) =>
        ts.isPropertyDeclaration(member) &&
        ts
          .getDecorators(member)
          ?.some((decorator) => /^@(Input|Output)\(/.test(decorator.getText())),
    )
    .map((member) => ({
      name: member.name.getText(),
      type:
        member.type?.getText() ??
        (member.initializer?.getText().startsWith('"')
          ? "string"
          : member.initializer?.getText().match(/^(true|false)$/)
            ? "boolean"
            : "See component source"),
      optional: !ts
        .getDecorators(member)
        ?.some((decorator) => /required:\s*true/.test(decorator.getText())),
    }));
}
const nativeExamples = {
  DateTime:
    '<DateTime mode="datetime" value={date} onChange={setDate} backgroundColor="#faf5ff" textColor="#3b1760" iconColor="#8a16d1" />',
  Tooltip:
    '<Tooltip text="Save your changes" location="bottom"><Text>Long press for help</Text></Tooltip>',
  Breadcrumb: '<Breadcrumb items={crumbs} separator="/" onSelect={navigate} />',
  Autocomplete:
    "<Autocomplete items={products} value={query} onChangeText={setQuery} />",
  "Tabs / Tab":
    "<Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />",
  Table:
    "<Table data={rows} columns={columns} columnsConfigurable exportable totalCount={total} onLoadMore={fetchNextPage} />",
  Divider: "<Divider />",
  ButtonGroup:
    "<ButtonGroup options={periods} value={period} onValueChange={setPeriod} />",
  RadioGroup:
    "<RadioGroup options={options} value={value} onValueChange={setValue} />",
  Rating: "<Rating value={rating} onValueChange={setRating} />",
  Section: '<Section title="Advanced settings"><Text>Content</Text></Section>',
  Notification:
    '<Notification title="Saved" message="Customer updated" type="success" />',
  Menu: "<Menu trigger={props => <Button {...props}>Actions</Button>}><MenuItem onPress={openDetails}><MenuItemLabel>Details</MenuItemLabel></MenuItem></Menu>",
  OTPInput: "<OTPInput value={otp} onValueChange={setOtp} />",
  PhoneInput:
    "<PhoneInput countryCode={countryCode} number={number}\n  onCountryCodeChange={setCountryCode} onNumberChange={setNumber} />",
  HC: "<HC><Text>First</Text><Text>Second</Text></HC>",
  VC: "<VC><Text>First</Text><Text>Second</Text></VC>",
  Label: "<Text>Customer name</Text>",
  Card: "<Card><Text>Content</Text></Card>",
  Badge: "<Badge>Ready</Badge>",
  Button: '<Button text="Save" onPress={save} />',
  Input:
    '<Input value={value} onChangeText={setValue} min={1} max={100} keyboardType="numeric" onValidationChange={(valid, message) => setError(message)} />',
  PasswordInput:
    "<PasswordInput value={password} onChangeText={setPassword} />",
  TextArea: "<TextArea value={notes} onChangeText={setNotes} />",
  Dropdown:
    "<Select items={options} value={code} clearable\n  onClear={() => setCode(undefined)} onValueChange={setCode} />",
  MultiSelect:
    "<MultiSelect items={options} value={codes} clearable\n  onValueChange={setCodes} />",
  Checkbox: "<Checkbox checked={checked} onCheckedChange={setChecked} />",
  Switch: "<Switch value={enabled} onValueChange={setEnabled} />",
  Dialog:
    "<Dialog visible={open} onClose={close}><Text>Details</Text></Dialog>",
  Image: "<Image source={{ uri: imageUrl }} />",
};
const simpleReactExamples = {
  Button: `import { Button } from "@akin2unde/flowui-react";

export function ButtonExample() {
  return <Button text="Save changes" onClick={() => alert("Saved")} />;
}`,
  Input: `import { useState } from "react";
import { Input, Label, VStack } from "@akin2unde/flowui-react";

export function InputExample() {
  const [quantity, setQuantity] = useState("2");
  return (
    <VStack gap={8}>
      <Label htmlFor="quantity">Quantity</Label>
      <Input id="quantity" type="number" min={1} max={100} step={1}
        value={quantity} onValueChange={setQuantity} />
    </VStack>
  );
}`,
  DateTime: `import { useState } from "react";
import { DateTime } from "@akin2unde/flowui-react";

export function DateTimeExample() {
  const [value, setValue] = useState("2026-10-10T09:30");
  return <DateTime value={value} onChange={setValue}
    min="2026-01-01T00:00" max="2026-12-31T23:59"
    backgroundColor="#faf5ff" textColor="#3b1760" iconColor="#8a16d1" />;
}`,
  Dropdown: `import { useState } from "react";
import { Dropdown, Label, VStack } from "@akin2unde/flowui-react";

const options = [
  { value: "open", display: "Open", other: null },
  { value: "closed", display: "Closed", other: null },
];

export function DropdownExample() {
  const [status, setStatus] = useState("open");
  return <VStack gap={8}>
    <Label htmlFor="status">Status</Label>
    <Dropdown id="status" name="status" options={options}
      value={status} onChange={option => setStatus(String(option.value))}
      placeholder="Choose a status" backgroundColor="#faf5ff"
      textColor="#3b1760" iconColor="#8a16d1" />
  </VStack>;
}`,
  Table: `import { Button, Table } from "@akin2unde/flowui-react";

const rows = [{ Code: "TKT-001", Title: "Unable to load" }];

export function TableExample() {
  return <Table data={rows} rowKey="Code" columns={[
    { field: "Title", header: "Ticket" },
    { field: "Code", header: "Action", renderCell: (_, ticket) => (
      <Button text="View" onClick={() => alert(ticket.Code)} />
    ) },
  ]} />;
}`,
};
function reactExample(name, code) {
  if (simpleReactExamples[name]) return simpleReactExamples[name];
  const names = [
    ...new Set(
      [...code.matchAll(/<([A-Z][A-Za-z0-9]*)\b/g)].map((match) => match[1]),
    ),
  ];
  return names.length
    ? `import { ${names.join(", ")} } from "@akin2unde/flowui-react";\n\n${code}`
    : code;
}
const rows = react.map(([group, name, description, code]) => {
  const interfaceName =
    name === "HC"
      ? "Stack"
      : name === "VC"
        ? "VStack"
        : name === "Tabs / Tab"
          ? "Tabs"
          : name;
  const nativeName =
    {
      HC: "Box",
      VC: "Box",
      Label: "FlowText",
      Image: "FlowImage",
      Dropdown: "Select",
    }[name] ?? name;
  return {
    group,
    name,
    description,
    code: {
      react: reactExample(name, code),
      angular:
        name === "Button"
          ? '<fui-button text="Save changes" (pressed)="save()" />'
          : name === "DateTime"
            ? '<fui-date-time [value]="date" (valueChange)="date = $event" min="2026-01-01T00:00" max="2026-12-31T23:59" backgroundColor="#faf5ff" textColor="#3b1760" iconColor="#8a16d1" />'
            : name === "Input"
              ? '<fui-input type="number" [min]="1" [max]="100" [step]="1" [value]="quantity" (valueChange)="quantity = $event" />'
              : (angular.get(name) ?? ""),
      native: nativeExamples[name] ?? "",
    },
    props: {
      react: properties(`${interfaceName}Props`, "react"),
      angular: angularProperties(
        { HC: "HStack", VC: "VStack" }[name] ?? interfaceName,
      ),
      native: properties(`${nativeName}Props`, "native"),
    },
  };
});
rows.splice(
  rows.findIndex((row) => row.group === "Display"),
  0,
  {
    group: "Display",
    name: "AsyncLabel",
    description:
      "Resolve a code into readable text with a small inline loader, shared batches and a bounded cache.",
    code: {
      react:
        '<AsyncLabel\n  lookup="customerName"\n  code={sale.CustomerCode}\n  fallback={sale.CustomerCode}\n/>',
      angular:
        '<fui-async-label\n  lookup="customerName"\n  [code]="sale.CustomerCode"\n  [fallback]="sale.CustomerCode"\n/>',
      native:
        '<AsyncLabel\n  lookup="customerName"\n  code={sale.CustomerCode}\n  fallback={sale.CustomerCode}\n/>',
    },
    props: {
      react: properties("AsyncLabelProps", "react"),
      angular: angularProperties("AsyncLabel"),
      native: properties("AsyncLabelProps", "native"),
    },
  },
);
writeFileSync(
  resolve(root, "examples/shared/docs-data.ts"),
  await format(
    `// Generated by npm run docs:data from component contracts and existing examples.\nexport type Framework = "react" | "angular" | "native";\nexport interface DocProperty { name: string; type: string; optional: boolean }\nexport interface ComponentDoc { group: string; name: string; description: string; code: Record<Framework,string>; props: Record<Framework,DocProperty[]> }\nexport const componentDocs: ComponentDoc[] = ${JSON.stringify(rows, null, 2)};\n`,
    { parser: "typescript" },
  ),
);
