import React, { useState } from "react";
import { Platform, View } from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Badge,
  BottomSheet,
  Box,
  BusyIndicator,
  Button,
  ButtonGroup,
  Card,
  Checkbox,
  Chip,
  Dialog,
  Divider,
  FormField,
  FormGroup,
  HC,
  HStack,
  IconButton,
  Image,
  Input,
  MoneyInput,
  MultiSelect,
  Notification,
  NumberInput,
  OTPInput,
  PasswordInput,
  PhoneInput,
  ProgressBar,
  RadioGroup,
  Rating,
  ScrollContainer,
  SearchInput,
  Section,
  Select,
  Switch,
  Text,
  TextArea,
  VC,
  VCenter,
  VStack,
  useFlowUITheme,
  type SelectOption,
} from "@akin2unde/flowui-react-native";

const countries: SelectOption<{ region: string }>[] = [
  {
    display: "Nigeria",
    value: "NG",
    other: { region: "Africa" },
    group: "Africa",
  },
  {
    display: "Ghana",
    value: "GH",
    other: { region: "Africa" },
    group: "Africa",
  },
  {
    display: "United Kingdom",
    value: "GB",
    other: { region: "Europe" },
    group: "Europe",
  },
  { display: "Unavailable", value: "NA", disabled: true },
];

export function HomeScreen() {
  const { colors, mode, setMode } = useFlowUITheme();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [quantity, setQuantity] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [enabled, setEnabled] = useState(true);
  const [payment, setPayment] = useState<string | number>("cash");
  const [country, setCountry] = useState<string | number>();
  const [markets, setMarkets] = useState<Array<string | number>>([]);
  const [otp, setOtp] = useState("");
  const [callingCode, setCallingCode] = useState("+234");
  const [phone, setPhone] = useState("");
  const [rating, setRating] = useState(4);
  const [dialog, setDialog] = useState(false);
  const [sheet, setSheet] = useState(false);
  const [busy, setBusy] = useState(false);
  const [chipVisible, setChipVisible] = useState(true);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.canvas }}>
      <ScrollContainer contentContainerClassName="mx-auto w-full max-w-3xl gap-5 p-4 pb-16 pt-12">
        <VStack className="gap-2">
          <HStack className="items-center justify-between gap-3">
            <Text className="text-3xl font-black">FlowUI Native</Text>
            <Badge tone="success">{Platform.OS}</Badge>
          </HStack>
          <Text muted>Expo, Android, iOS and web from the same controls.</Text>
          <ButtonGroup
            value={mode}
            onValueChange={(value) =>
              setMode(value as "light" | "dark" | "system")
            }
            options={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
              { label: "System", value: "system" },
            ]}
          />
        </VStack>

        <Card className="gap-4">
          <Section
            title="Layout, media and actions"
            description="Box, HC/VC stacks, centering, image, avatar, chip and icon controls."
          >
            <VC className="gap-3">
              <Box className="rounded-2xl bg-violet-50 p-3 dark:bg-slate-900">
                <HC className="items-center justify-between gap-3">
                  <Avatar fallback="Flow UI" />
                  <Image
                    source={{ uri: "https://picsum.photos/160/96" }}
                    accessibilityLabel="Example product"
                    className="h-16 w-28 rounded-xl"
                  />
                  <IconButton
                    label="Add item"
                    icon={<Text className="text-lg font-black">+</Text>}
                    variant="outline"
                  />
                </HC>
              </Box>
              <VCenter className="min-h-16 rounded-2xl border border-dashed border-violet-300">
                <ActivityIndicator />
                <Text muted>VCenter</Text>
              </VCenter>
              {chipVisible ? (
                <Chip selected onRemove={() => setChipVisible(false)}>
                  Removable chip
                </Chip>
              ) : (
                <Button variant="ghost" onPress={() => setChipVisible(true)}>
                  Restore chip
                </Button>
              )}
            </VC>
          </Section>
        </Card>

        <Card elevated className="gap-4 rounded-3xl p-5">
          <Section
            title="FormGroup"
            description="Groups related controls, labels, help and errors."
          >
            <FormGroup
              title="Product"
              description="Average Tailwind-styled form example."
            >
              <FormField
                label="Product name"
                required
                helpText="Use the name customers recognise."
              >
                <Input
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Premium noodles"
                  className="h-14 rounded-2xl border-violet-200 bg-violet-50 px-4 text-base dark:border-violet-800 dark:bg-slate-900"
                />
              </FormField>
              <FormField label="Password">
                <PasswordInput value={password} onChangeText={setPassword} />
              </FormField>
              <FormField label="Description">
                <TextArea
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Description"
                />
              </FormField>
              <HStack className="gap-3">
                <FormField label="Quantity" className="flex-1">
                  <NumberInput value={quantity} onValueChange={setQuantity} />
                </FormField>
                <FormField label="Amount" className="flex-1">
                  <MoneyInput value={amount} onValueChange={setAmount} />
                </FormField>
              </HStack>
              <FormField label="Country">
                <Select
                  items={countries}
                  value={country}
                  onValueChange={setCountry}
                  searchable
                />
              </FormField>
              <FormField label="Markets">
                <MultiSelect
                  items={countries}
                  value={markets}
                  onValueChange={setMarkets}
                  searchable
                />
              </FormField>
              <Checkbox
                checked={accepted}
                onCheckedChange={setAccepted}
                label="I confirm the details"
              />
              <RadioGroup
                horizontal
                value={payment}
                onValueChange={setPayment}
                options={[
                  { label: "Cash", value: "cash" },
                  { label: "Transfer", value: "transfer" },
                ]}
              />
              <Switch
                value={enabled}
                onValueChange={setEnabled}
                label="Product active"
              />
              <Button
                fullWidth
                onPress={() => {
                  setBusy(true);
                  setTimeout(() => setBusy(false), 1200);
                }}
                className="rounded-2xl bg-violet-600"
              >
                Save product
              </Button>
            </FormGroup>
          </Section>
        </Card>

        <Card className="gap-4">
          <Section
            title="Special inputs"
            description="Search, OTP and phone controls."
          >
            <SearchInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search products"
            />
            <OTPInput value={otp} onValueChange={setOtp} />
            <PhoneInput
              countryCode={callingCode}
              number={phone}
              onCountryCodeChange={setCallingCode}
              onNumberChange={setPhone}
            />
            <Rating value={rating} onValueChange={setRating} />
          </Section>
        </Card>

        <Card className="gap-4">
          <Section
            title="Feedback and overlays"
            description="Progress, alerts, dialog and bottom sheet."
          >
            <ProgressBar value={68} />
            <Notification
              type="success"
              title="Saved"
              message="The product was saved successfully."
            />
            <Divider />
            <HStack className="flex-wrap gap-3">
              <Button variant="outline" onPress={() => setDialog(true)}>
                Open dialog
              </Button>
              <Button variant="secondary" onPress={() => setSheet(true)}>
                Open sheet
              </Button>
            </HStack>
          </Section>
        </Card>
      </ScrollContainer>

      <Dialog
        visible={dialog}
        onClose={() => setDialog(false)}
        header={<Text className="text-lg font-bold">Responsive dialog</Text>}
        footer={<Button onPress={() => setDialog(false)}>Close</Button>}
      >
        <Text>
          This is rendered by React Native Modal on mobile and React Native Web
          in the browser.
        </Text>
      </Dialog>

      <BottomSheet
        visible={sheet}
        onClose={() => setSheet(false)}
        title="Actions"
      >
        <VStack className="gap-3">
          <Button onPress={() => setSheet(false)}>Continue</Button>
          <Button variant="ghost" onPress={() => setSheet(false)}>
            Cancel
          </Button>
        </VStack>
      </BottomSheet>

      <BusyIndicator visible={busy} message="Saving product..." />
    </View>
  );
}
