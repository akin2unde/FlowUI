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
  if (name === "BaseUIProps" || seen.has(`${framework}:${name}`)) return [];
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
  return node.members
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
  Button: "<Button onPress={save}>Save</Button>",
  Input: "<Input value={value} onChangeText={setValue} />",
  PasswordInput:
    "<PasswordInput value={password} onChangeText={setPassword} />",
  TextArea: "<TextArea value={notes} onChangeText={setNotes} />",
  Dropdown:
    "<Select items={options} value={code}\n  onValueChange={(value) => setCode(value)} />",
  MultiSelect:
    "<MultiSelect items={options} value={codes}\n  onValueChange={(values) => setCodes(values)} />",
  Checkbox: "<Checkbox checked={checked} onCheckedChange={setChecked} />",
  Switch: "<Switch value={enabled} onValueChange={setEnabled} />",
  Dialog:
    "<Dialog visible={open} onClose={close}><Text>Details</Text></Dialog>",
  Image: "<Image source={{ uri: imageUrl }} />",
};
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
      react: code,
      angular: angular.get(name) ?? "",
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
