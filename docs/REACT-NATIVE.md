# FlowUI for React Native, Expo and Web

`@akin2unde/flowui-react-native` renders React Native core primitives. The same screen works on Android, iOS and React Native Web. NativeWind adds Tailwind `className` support; FlowUI also accepts the normal React Native `style` prop.

## Design goals

- One component implementation for native and web.
- No dependency on a navigation library.
- No required icon, date-picker, file-picker or bottom-sheet package.
- Theme defaults plus per-control Tailwind overrides.
- Accessible roles, state and labels.
- Tree-shakeable exports and optional platform adapters for heavy features.

## Install in an Expo application

```bash
npx expo install react react-native react-native-web react-dom
npx expo install react-native-reanimated react-native-worklets
npm install @akin2unde/flowui-react-native nativewind tailwindcss@3
```

`react-native-reanimated` and `react-native-worklets` are NativeWind runtime requirements in an Expo application; FlowUI itself does not use them directly.

## NativeWind configuration

`tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  // Required for predictable utility precedence on React Native Web.
  important: true,
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@akin2unde/flowui-react-native/dist/**/*.{js,mjs}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
        },
      },
    },
  },
};
```

`global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

`babel.config.js`:

```js
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

`metro.config.js`:

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");
const config = getDefaultConfig(projectRoot);

// These two settings are needed by the included monorepo example. An app
// consuming FlowUI from npm can omit them.
config.watchFolders = [workspaceRoot];
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [path.resolve(projectRoot, "node_modules")];

module.exports = withNativeWind(config, {
  input: "./global.css",
});
```

`nativewind-env.d.ts`:

```ts
/// <reference types="nativewind/types" />
```

## App setup

`App.tsx`:

```tsx
import "./global.css";

import React from "react";
import {
  FlowUIProvider,
  createNativeTheme,
} from "@akin2unde/flowui-react-native";
import { HomeScreen } from "./src/screens/HomeScreen";

const theme = createNativeTheme({
  schemes: {
    light: {
      primary: "#7c3aed",
      canvas: "#f8fafc",
    },
    dark: {
      primary: "#a78bfa",
      canvas: "#020617",
    },
  },
  components: {
    buttonHeight: 52,
    inputHeight: 52,
    controlRadius: 14,
  },
});

export default function App() {
  return (
    <FlowUIProvider theme={theme} initialMode="system">
      <HomeScreen />
    </FlowUIProvider>
  );
}
```

## First screen

`src/screens/HomeScreen.tsx`:

```tsx
import React, { useState } from "react";
import { View } from "react-native";
import {
  Button,
  Card,
  FormField,
  FormGroup,
  Input,
  Text,
  useFlowUITheme,
} from "@akin2unde/flowui-react-native";

export function HomeScreen() {
  const { colors } = useFlowUITheme();
  const [name, setName] = useState("");

  return (
    <View
      className="flex-1 items-center justify-center p-5"
      style={{ backgroundColor: colors.canvas }}
    >
      <Card className="w-full max-w-xl gap-4 rounded-3xl p-5" elevated>
        <Text className="text-2xl font-black">New product</Text>

        <FormGroup
          title="Basic information"
          description="Fields required to create a product."
        >
          <FormField
            label="Product name"
            required
            helpText="Use a name customers recognise."
          >
            <Input
              value={name}
              onChangeText={setName}
              placeholder="Premium noodles"
              className="h-14 rounded-2xl border-violet-200 bg-violet-50 px-4 text-base dark:border-violet-800 dark:bg-slate-900"
            />
          </FormField>

          <Button
            fullWidth
            className="h-14 rounded-2xl bg-brand-600"
            textClassName="text-base font-bold text-white"
            onPress={() => console.log(name)}
          >
            Save product
          </Button>
        </FormGroup>
      </Card>
    </View>
  );
}
```

The example is responsive on web because NativeWind understands responsive modifiers such as `sm:max-w-xl`, while React Native ignores browser-only layout assumptions.

## FormGroup

`FormGroup` provides the visual and accessibility boundary for related controls. `FormField` owns one control’s label, required marker, help text and error.

```tsx
<FormGroup title="Account" error={formError}>
  <FormField label="Email" required error={errors.email}>
    <Input
      value={email}
      onChangeText={setEmail}
      keyboardType="email-address"
      autoCapitalize="none"
      invalid={Boolean(errors.email)}
    />
  </FormField>

  <FormField label="Password" required>
    <PasswordInput value={password} onChangeText={setPassword} />
  </FormField>
</FormGroup>
```

FlowUI deliberately does not include a form-state dependency. It works with local state, React Hook Form, Formik or another form library without increasing the base bundle.

## Included controls and examples

### Layout

```tsx
<VStack className="gap-4">
  <HStack className="items-center justify-between">
    <Text>Heading</Text>
    <Badge>New</Badge>
  </HStack>
  <Divider />
  <Card className="p-4">...</Card>
</VStack>
```

Exports: `Box`, `HC`, `HStack`, `VC`, `VStack`, `VCenter`, `Card`, `Text`, `Image`, `Avatar`, `Divider`, `ScrollContainer`, `Section`.

### Buttons and indicators

```tsx
<Button loading={saving} onPress={save}>Save</Button>
<Button variant="outline">Cancel</Button>
<ButtonGroup options={views} value={view} onValueChange={setView} />
<ProgressBar value={70} />
<BusyIndicator visible={saving} message="Saving..." />
```

Exports: `Button`, `IconButton`, `ButtonGroup`, `Chip`, `Badge`, `ActivityIndicator`, `ProgressBar`, `BusyIndicator`, `Notification`.

### Text inputs

```tsx
<Input value={name} onChangeText={setName} />
<PasswordInput value={password} onChangeText={setPassword} />
<SearchInput value={search} onChangeText={setSearch} />
<TextArea value={notes} onChangeText={setNotes} />
<NumberInput value={quantity} onValueChange={setQuantity} />
<MoneyInput value={amount} onValueChange={setAmount} />
<OTPInput value={otp} onValueChange={setOtp} />
<PhoneInput countryCode={code} number={phone} onNumberChange={setPhone} />
```

### Choice controls

```tsx
<Checkbox checked={accepted} onCheckedChange={setAccepted} label="I agree" />
<Switch value={active} onValueChange={setActive} label="Active" />
<RadioGroup options={payments} value={payment} onValueChange={setPayment} />
<Rating value={rating} onValueChange={setRating} />
```

### Select and MultiSelect

```tsx
const countries = [
  { display: "Nigeria", value: "NG", other: { region: "Africa" } },
  { display: "Ghana", value: "GH", disabled: true },
];

<Select
  items={countries}
  value={country}
  onValueChange={setCountry}
  searchable
/>

<MultiSelect
  items={countries}
  value={markets}
  onValueChange={setMarkets}
  searchable
/>
```

Both controls use a responsive modal presentation, close on the backdrop and Android back button, and work on React Native Web.

### Dialog and BottomSheet

```tsx
<Dialog
  visible={open}
  onClose={() => setOpen(false)}
  header={<Text className="text-lg font-bold">Edit product</Text>}
  footer={<Button onPress={save}>Save</Button>}
>
  <ProductForm />
</Dialog>

<BottomSheet
  visible={actionsOpen}
  onClose={() => setActionsOpen(false)}
  title="Product actions"
>
  <Button>Edit</Button>
</BottomSheet>
```

## Running the included example

From the FlowUI workspace:

```bash
npm install
npm run setup:react-native-example
npm run dev:react-native
```

The setup and development commands build the local React Native package before
Expo starts. This creates `packages/react-native/dist/index.js`, which is the
entry point used by the example's local package dependency.

Press `a` for Android, `i` for iOS or `w` for web. To launch web directly:

```bash
npm run dev:react-native:web
```

### Missing `dist/index.js`

If Expo was started from an older checkout before the package was built, stop
Metro and run this from the FlowUI workspace root:

```bash
npm run build:react-native
cd examples/react-native
npx expo start --web --clear
```

The name of the directory containing FlowUI does not control the npm package
version. For example, a folder named `FlowUI-0.1.0` can still contain version
`0.2.0`; the version comes from `package.json`.

### Expo opens but the page is blank

The included Expo 54 example pins React and React Native to Expo-compatible
versions. Its Metro configuration also disables hierarchical dependency lookup
so the linked FlowUI package and the app cannot load different React copies.

After replacing an older copy, refresh the dependencies and Metro cache:

```bash
cd examples/react-native
npm install --workspaces=false
npx expo start --web --clear
```

## Bare React Native

The component package itself does not depend on Expo. In a bare React Native application, configure NativeWind using its React Native instructions and wrap the root component with `FlowUIProvider`. The controls use only React Native core APIs.

## Optional native features

Image picking, document picking, camera access and native date/time pickers are intentionally not imported by the base package. They should be implemented through optional adapters so installing a Button never installs camera or media permissions.

Recommended optional integrations:

- Expo Image Picker for image selection.
- Expo Document Picker for files.
- Community DateTimePicker for a native date/time surface.
- React Native SVG for charts and advanced graphics.

These adapters belong in separate entry points and are not part of the base bundle.

## Accessibility

- Buttons and selection controls publish their roles and selected/disabled states.
- Dialogs respond to the Android back button.
- Chip removal has an explicit accessibility label.
- Inputs retain the underlying React Native input props.
- Add `accessibilityLabel` when visible content does not clearly describe an icon-only action.
