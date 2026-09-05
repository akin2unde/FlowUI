import { useMemo, useState, type ReactNode } from "react";
import {
  Autocomplete,
  Badge,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Chart,
  Checkbox,
  ColorPicker,
  DateTime,
  Dialog,
  Divider,
  Dropdown,
  FlowUIProvider,
  HC,
  Icon,
  Image,
  Input,
  Label,
  Listbox,
  Knob,
  Menu,
  MultiSelect,
  PasswordInput,
  Popover,
  RadioGroup,
  Rating,
  Section,
  Slider,
  Switch,
  Tab,
  Table,
  Tabs,
  TextArea,
  Timeline,
  Tooltip,
  Tree,
  TreeDropdown,
  TreeMultiSelect,
  VC,
  FileUpload,
  Notification,
  OTPInput,
  PhoneInput,
  createTheme,
  type BreadcrumbItem,
  type DialogPosition,
  type DropdownModel,
  type MenuItem,
  type PhoneCountry,
  type PhoneNumberValue,
  type SortState,
  type TableColumn,
  type TimelineItem,
  type TreeModel,
} from "@akin2unde/flowui-react";

function ControlGuide({
  name,
  info,
  code,
  children,
}: {
  name: string;
  info: string;
  code: string;
  children: ReactNode;
}) {
  return (
    <article className="fui-demo-card fui-control-guide">
      <VC gap="sm">
        <Label fontSize="lg" fontWeight="bold">
          {name}
        </Label>
        <Label textColor="textMuted" fontSize="sm">
          {info}
        </Label>
        <div className="fui-control-preview">{children}</div>
        <pre>
          <code>{code}</code>
        </pre>
      </VC>
    </article>
  );
}

const theme = createTheme({
  palette: {
    primary: {
      500: "#7c3aed",
      600: "#6d28d9",
      700: "#5b21b6",
    },
  },
});

const menuItems: MenuItem[] = [
  {
    id: "new",
    label: "New product",
    icon: "fa-solid fa-plus",
  },
  {
    id: "messages",
    label: "Messages",
    icon: "fa-solid fa-envelope",
    badge: 4,
  },
  {
    id: "separator",
    label: "",
    separator: true,
  },
  {
    id: "delete",
    label: "Delete",
    icon: "fa-solid fa-trash",
  },
];

const countries: DropdownModel[] = [
  {
    display: "Nigeria",
    value: "ng",
    other: { phoneCode: "+234" },
    group: "Africa",
  },
  {
    display: "United Kingdom",
    value: "uk",
    other: { phoneCode: "+44" },
    group: "Europe",
  },
  {
    display: "Ghana",
    value: "gh",
    other: { phoneCode: "+233" },
    group: "Africa",
  },
  {
    display: "South Africa",
    value: "za",
    other: { phoneCode: "+27" },
    group: "Africa",
    disabled: true,
  },
];

const tree: TreeModel[] = [
  {
    display: "Nigeria",
    value: "ng",
    other: { type: "country" },
    children: [
      {
        display: "Lagos",
        value: "lagos",
        other: { type: "state" },
      },
      {
        display: "Abuja",
        value: "abuja",
        other: { type: "city" },
      },
    ],
  },
  {
    display: "United Kingdom",
    value: "uk",
    other: { type: "country" },
    children: [
      {
        display: "London",
        value: "london",
        other: { type: "city" },
      },
    ],
  },
];

const products: Record<string, unknown>[] = [
  { name: "Rice", category: "Food", price: 42000 },
  { name: "Vegetable oil", category: "Food", price: 18500 },
  { name: "Detergent", category: "Home", price: 9300 },
];

const columns: TableColumn<Record<string, unknown>>[] = [
  {
    field: "name",
    header: "Product",
    sortable: true,
  },
  {
    field: "category",
    header: "Category",
    sortable: true,
    defaultVisible: false,
  },
  {
    field: "price",
    header: "Price",
    sortable: true,
    align: "right",
    format: (value) => `₦${Number(value).toLocaleString()}`,
  },
];

const timelineItems: TimelineItem[] = [
  {
    id: 1,
    title: "Order created",
    description: "The customer placed an order.",
    date: "09:00",
    icon: "fa-solid fa-cart-plus",
  },
  {
    id: 2,
    title: "Payment confirmed",
    description: "Payment was received successfully.",
    date: "09:10",
    icon: "fa-solid fa-credit-card",
  },
  {
    id: 3,
    title: "Ready to dispatch",
    date: "10:15",
    icon: "fa-solid fa-truck",
  },
];

const breadcrumbs: BreadcrumbItem[] = [
  { id: 1, text: "Home", icon: "fa-solid fa-house" },
  {
    id: 2,
    text: "Products",
    image: "https://picsum.photos/40/40?category",
  },
  { id: 3, text: "Rice" },
];

const phoneCountries: PhoneCountry[] = [
  { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
  { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
  { code: "GH", name: "Ghana", dialCode: "+233", flag: "🇬🇭" },
];

const salesChart = {
  labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
  series: [
    {
      name: "Sales",
      data: [18, 32, 27, 46, 39],
      color: "primary.600" as const,
    },
    { name: "Orders", data: [12, 20, 16, 30, 25], color: "info.500" as const },
  ],
};

const componentCatalog = [
  ["Layout", "HC", "Arranges children horizontally.", `<HC gap="sm">...</HC>`],
  ["Layout", "VC", "Arranges children vertically.", `<VC gap="sm">...</VC>`],
  [
    "Layout",
    "Divider",
    "Separates content horizontally or vertically.",
    `<Divider orientation="horizontal" />`,
  ],
  [
    "Layout",
    "Card",
    "Groups related content with optional header and footer.",
    `<Card header={header}>...</Card>`,
  ],
  [
    "Display",
    "Label",
    "Displays styled or form-associated text.",
    `<Label htmlFor="name">Name</Label>`,
  ],
  [
    "Display",
    "Badge",
    "Shows compact status or count information.",
    `<Badge color="success">Ready</Badge>`,
  ],
  [
    "Display",
    "Icon",
    "Renders a Font Awesome icon.",
    `<Icon icon="fa-solid fa-check" />`,
  ],
  [
    "Display",
    "Image",
    "Displays an image with fit, lazy load, and fallback.",
    `<Image src={url} alt="Product" />`,
  ],
  [
    "Display",
    "Tooltip",
    "Shows short guidance around a trigger.",
    `<Tooltip text="Save" location="top">...</Tooltip>`,
  ],
  [
    "Display",
    "Carousel",
    "Moves through templated slides.",
    `<Carousel>{slides}</Carousel>`,
  ],
  [
    "Display",
    "Breadcrumb",
    "Shows image, icon, or text navigation ancestry.",
    `<Breadcrumb items={items} />`,
  ],
  [
    "Display",
    "Chart",
    "Paints bar, line, pie, or doughnut series.",
    `<Chart type="bar" data={data} />`,
  ],
  [
    "Actions",
    "Button",
    "Triggers an action with variants, icons, and badges.",
    `<Button icon="fa-solid fa-save">Save</Button>`,
  ],
  [
    "Actions",
    "ButtonGroup",
    "Provides segmented single selection.",
    `<ButtonGroup selectable value={value}>...</ButtonGroup>`,
  ],
  [
    "Actions",
    "Popover",
    "Shows templated floating content.",
    `<Popover trigger={<Button>Open</Button>}>...</Popover>`,
  ],
  [
    "Actions",
    "Notification",
    "Shows positioned success, error, warning, or info feedback.",
    `<Notification open type="success">Saved</Notification>`,
  ],
  [
    "Forms",
    "Input",
    "Accepts text, integer, decimal, money, or alphabet values.",
    `<Input inputMode="money" currencySymbol="₦" />`,
  ],
  [
    "Forms",
    "PasswordInput",
    "Accepts passwords with an optional visibility toggle.",
    `<PasswordInput value={password} />`,
  ],
  [
    "Forms",
    "OTPInput",
    "Captures an OTP using auto-advancing cells.",
    `<OTPInput length={6} value={otp} />`,
  ],
  [
    "Forms",
    "PhoneInput",
    "Captures country code, dial code, and phone number.",
    `<PhoneInput countries={countries} value={phone} />`,
  ],
  [
    "Forms",
    "DateTime",
    "Captures a local date, time, or both without UTC shifting.",
    `<DateTime mode="datetime" value={date} />`,
  ],
  [
    "Forms",
    "Autocomplete",
    "Searches options while the user types.",
    `<Autocomplete options={options} />`,
  ],
  ["Forms", "TextArea", "Captures multiline text.", `<TextArea rows={4} />`],
  [
    "Forms",
    "Checkbox",
    "Toggles an independent boolean value.",
    `<Checkbox label="Active" checked={active} />`,
  ],
  [
    "Forms",
    "RadioButton",
    "Selects one native radio choice.",
    `<RadioButton name="status" value="active" />`,
  ],
  [
    "Forms",
    "RadioGroup",
    "Selects one choice from several radio options.",
    `<RadioGroup name="status" options={options} />`,
  ],
  [
    "Forms",
    "ColorPicker",
    "Selects a browser-supported colour.",
    `<ColorPicker value={color} />`,
  ],
  [
    "Forms",
    "Slider",
    "Selects a numeric value along a linear range.",
    `<Slider value={volume} />`,
  ],
  [
    "Forms",
    "Switch",
    "Toggles a boolean setting.",
    `<Switch label="Enabled" checked={enabled} />`,
  ],
  [
    "Forms",
    "Knob",
    "Selects a numeric value on a circular range.",
    `<Knob value={capacity} valueSuffix="%" />`,
  ],
  [
    "Forms",
    "Rating",
    "Captures whole or half-step ratings.",
    `<Rating value={4} maximum={5} />`,
  ],
  [
    "Forms",
    "Listbox",
    "Shows a templatable single or multi-selection list.",
    `<Listbox options={options} multiple />`,
  ],
  [
    "Forms",
    "FileUpload",
    "Selects files and optionally previews them.",
    `<FileUpload accept="image/*" preview />`,
  ],
  [
    "Navigation",
    "Menu",
    "Displays actions with icons, badges, and separators.",
    `<Menu items={items} />`,
  ],
  [
    "Navigation",
    "Dropdown",
    "Provides searchable grouped single selection.",
    `<Dropdown options={options} searchable />`,
  ],
  [
    "Navigation",
    "MultiSelect",
    "Selects multiple options using checkboxes and chips.",
    `<MultiSelect options={options} value={values} />`,
  ],
  [
    "Navigation",
    "TreeDropdown",
    "Selects one nested value without chips.",
    `<TreeDropdown options={tree} searchable />`,
  ],
  [
    "Navigation",
    "TreeMultiSelect",
    "Selects nested values with cascading checkboxes.",
    `<TreeMultiSelect nodes={tree} searchable />`,
  ],
  [
    "Navigation",
    "Tree",
    "Displays expandable hierarchical content.",
    `<Tree nodes={tree} />`,
  ],
  [
    "Navigation",
    "Tabs / Tab",
    "Switches between named content panels.",
    `<Tabs><Tab id="one" label="One">...</Tab></Tabs>`,
  ],
  [
    "Navigation",
    "Section",
    "Expands and collapses accordion content.",
    `<Section title="Settings">...</Section>`,
  ],
  [
    "Data",
    "Table",
    "Sorts, selects, configures, and exports tabular data.",
    `<Table data={rows} columns={columns} />`,
  ],
  [
    "Overlay",
    "Dialog",
    "Shows a positioned modal with templatable regions.",
    `<Dialog open position="right" onClose={close} />`,
  ],
] as const;

export function App() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState("");
  const [checked, setChecked] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [volume, setVolume] = useState(40);
  const [status, setStatus] = useState("active");
  const [color, setColor] = useState("#6d28d9");
  const [country, setCountry] = useState<string | number>("ng");
  const [location, setLocation] = useState<string | number>("lagos");
  const [selectedCountries, setSelectedCountries] = useState<
    Array<string | number>
  >(["ng", "gh"]);
  const [selectedTreeValues, setSelectedTreeValues] = useState<
    Array<string | number>
  >(["lagos", "london"]);
  const [expandedTreeValues, setExpandedTreeValues] = useState<
    Array<string | number>
  >(["ng", "uk"]);
  const [treeValue, setTreeValue] = useState<string | number>("lagos");
  const [sort, setSort] = useState<SortState>({
    field: "name",
    direction: "asc",
  });
  const [dialog, setDialog] = useState<DialogPosition | null>(null);
  const [period, setPeriod] = useState<string | number>("week");
  const [dateTime, setDateTime] = useState("2026-09-01T09:30");
  const [autocomplete, setAutocomplete] = useState<string | number>("ng");
  const [rating, setRating] = useState(4);
  const [listboxValues, setListboxValues] = useState<DropdownModel[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<
    Record<string, unknown> | undefined
  >();
  // Save this array in the user's preferences and restore it at login.
  const [visibleProductColumns, setVisibleProductColumns] = useState([
    "name",
    "price",
  ]);
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [knob, setKnob] = useState(68);
  const [otp, setOtp] = useState("");
  const [phone, setPhone] = useState<PhoneNumberValue>({
    countryCode: "NG",
    dialCode: "+234",
    number: "",
  });

  const sorted = useMemo(() => {
    return [...products].sort((first, second) => {
      if (!sort.direction) return 0;

      const result = String(first[sort.field]).localeCompare(
        String(second[sort.field]),
        undefined,
        { numeric: true },
      );

      return sort.direction === "asc" ? result : -result;
    });
  }, [sort]);

  return (
    <FlowUIProvider theme={theme} mode="system">
      <main className="fui-page">
        <VC
          maxWidth="80rem"
          marginX="auto"
          padding={{ default: "md", md: "xl" }}
          gap="lg"
        >
          <VC gap="xs">
            <Label fontSize="3xl" fontWeight="bold">
              FlowUI React Gallery
            </Label>
            <Label textColor="textMuted">
              Every FlowUI component in one working example.
            </Label>
          </VC>

          <section>
            <VC gap="sm">
              <Label fontSize="2xl" fontWeight="bold">
                Component guide
              </Label>
              <Label textColor="textMuted">
                Each FlowUI control has its own named card, purpose, and
                smallest useful code sample.
              </Label>
              <div className="fui-component-catalog">
                {componentCatalog.map(([category, control, info, code]) => (
                  <article
                    className="fui-demo-card fui-catalog-card"
                    key={control}
                  >
                    <small>{category}</small>
                    <strong>{control}</strong>
                    <p>{info}</p>
                    <pre>
                      <code>{code}</code>
                    </pre>
                  </article>
                ))}
              </div>
            </VC>
          </section>

          <Card
            variant="elevated"
            header={
              <Label fontSize="xl" fontWeight="bold">
                Card, layout, label, icon, badge and image
              </Label>
            }
            footer={<Label textColor="textMuted">Reusable card footer</Label>}
          >
            <HC
              direction={{ default: "column", md: "row" }}
              align="center"
              gap="lg"
            >
              <Image
                src="https://picsum.photos/320/180"
                alt="Sample landscape"
                width={{ default: "full", md: 320 }}
                height={180}
                cornerRadius="lg"
              />

              <VC gap="sm" flex={1}>
                <HC gap="sm" align="center">
                  <Icon
                    icon="fa-solid fa-layer-group"
                    textColor="primary.600"
                  />
                  <Label>Horizontal container</Label>
                  <Badge icon="fa-solid fa-check">Ready</Badge>
                </HC>

                <Label lines={1}>
                  This deliberately long label demonstrates single-line
                  truncation when its available width becomes limited.
                </Label>

                <Divider label="or" />

                <HC height={30} gap="md">
                  <span>Left</span>
                  <Divider orientation="vertical" />
                  <span>Right</span>
                </HC>
              </VC>
            </HC>
          </Card>

          <section className="fui-demo-card">
            <VC gap="md">
              <Label fontSize="xl" fontWeight="bold">
                Buttons, groups and tooltips
              </Label>

              <HC wrap="wrap" gap="sm">
                <Button icon="fa-solid fa-floppy-disk">Save</Button>
                <Button
                  variant="outline"
                  color="secondary"
                  icon="fa-solid fa-arrow-right"
                  iconPosition="right"
                >
                  Continue
                </Button>
                <Button variant="soft" color="success" badge={3}>
                  Approved
                </Button>
                <Button
                  variant="ghost"
                  color="danger"
                  icon="fa-solid fa-trash"
                  iconPosition="center"
                  ariaLabel="Delete"
                />
              </HC>

              <ButtonGroup selectable value={period} onChange={setPeriod}>
                <Button value="day">Day</Button>
                <Button value="week" variant="outline">
                  Week
                </Button>
                <Button value="month" variant="outline">
                  Month
                </Button>
              </ButtonGroup>

              <HC wrap="wrap" gap="lg">
                {(["top", "right", "bottom", "left"] as const).map(
                  (locationValue) => (
                    <Tooltip
                      key={locationValue}
                      text={`Shown on ${locationValue}`}
                      location={locationValue}
                    >
                      <Button variant="outline">{locationValue}</Button>
                    </Tooltip>
                  ),
                )}
              </HC>
            </VC>
          </section>

          <section className="fui-guide-grid">
            <ControlGuide
              name="Input — integer"
              info="Accepts whole numbers only; use inputMode='decimal', 'money', or 'alphabet' for other validation modes."
              code={`<Input inputMode="integer" onValueChange={setQuantity} />`}
            >
              <Input inputMode="integer" placeholder="Quantity" />
            </ControlGuide>

            <ControlGuide
              name="Input — money"
              info="Accepts decimal money values and displays a configurable currency symbol."
              code={`<Input inputMode="money" currencySymbol="₦" />`}
            >
              <Input inputMode="money" currencySymbol="₦" placeholder="0.00" />
            </ControlGuide>

            <ControlGuide
              name="Knob"
              info="A compact range input for percentages, capacity, volume, and similar values."
              code={`<Knob value={knob} onChange={setKnob} valueSuffix="%" />`}
            >
              <Knob value={knob} onChange={setKnob} valueSuffix="%" />
            </ControlGuide>

            <ControlGuide
              name="OTPInput"
              info="Moves focus automatically, supports paste, numeric-only values, masking, and completion events."
              code={`<OTPInput value={otp} length={6} onChange={setOtp} />`}
            >
              <OTPInput value={otp} length={6} onChange={setOtp} />
            </ControlGuide>

            <ControlGuide
              name="PhoneInput"
              info="Binds the selected ISO country code, dial code, and subscriber number as one value."
              code={`<PhoneInput countries={phoneCountries} value={phone} onChange={setPhone} />`}
            >
              <PhoneInput
                countries={phoneCountries}
                value={phone}
                onChange={setPhone}
              />
            </ControlGuide>

            <ControlGuide
              name="Chart"
              info="Paints bar, line, pie, or doughnut charts directly from labels and data series."
              code={`<Chart type="bar" data={salesChart} showValues />`}
            >
              <Chart type="bar" data={salesChart} showValues height={220} />
            </ControlGuide>
          </section>

          <section className="fui-demo-card">
            <VC gap="md">
              <Label fontSize="xl" fontWeight="bold">
                Form controls
              </Label>

              <Label htmlFor="product-name" required>
                Product name
              </Label>
              <Input
                id="product-name"
                value={name}
                placeholder="Enter product name"
                onChange={(event) => setName(event.target.value)}
              />
              <PasswordInput
                value={password}
                placeholder="Enter password"
                onChange={(event) => setPassword(event.target.value)}
              />
              <TextArea
                value={notes}
                placeholder="Notes"
                onChange={(event) => setNotes(event.target.value)}
              />

              <HC wrap="wrap" gap="lg">
                <Checkbox
                  label="Available for sale"
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                />
                <Switch
                  label="Enable notifications"
                  checked={notifications}
                  onChange={setNotifications}
                />
                <ColorPicker
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
              </HC>

              <RadioGroup
                name="status"
                value={status}
                orientation="horizontal"
                options={[
                  { label: "Active", value: "active" },
                  { label: "Inactive", value: "inactive" },
                ]}
                onChange={setStatus}
              />

              <Slider value={volume} onChange={setVolume} />

              <Dropdown
                value={country}
                options={countries}
                searchable
                grouped
                hasMore
                loadMoreText="Load more countries"
                onChange={(model) => setCountry(model.value)}
                onLoadMore={() => console.info("Load the next country page")}
              />

              <MultiSelect
                value={selectedCountries}
                options={countries}
                searchable
                grouped
                chipTextColor="primary.700"
                chipBackgroundColor="primary.100"
                chipCloseIconColor="textInverse"
                onChange={setSelectedCountries}
              />

              <TreeDropdown
                value={location}
                options={tree}
                onChange={(model) => setLocation(model.value)}
              />

              <TreeMultiSelect
                nodes={tree}
                value={selectedTreeValues}
                expandedValues={expandedTreeValues}
                searchable
                cascadeSelection
                onChange={setSelectedTreeValues}
                onExpandedValuesChange={setExpandedTreeValues}
                renderNode={(node) => (
                  <span>
                    {node.display} — {node.other.type}
                  </span>
                )}
              />
            </VC>
          </section>

          <section className="fui-demo-card">
            <VC gap="lg">
              <Label fontSize="xl" fontWeight="bold">
                Advanced controls
              </Label>

              <DateTime
                value={dateTime}
                mode="datetime"
                onChange={setDateTime}
              />

              <Autocomplete
                options={countries}
                value={autocomplete}
                placeholder="Search for a country"
                onChange={(option) => setAutocomplete(option.value)}
              />

              <Rating value={rating} onChange={setRating} />

              <Listbox
                options={countries}
                values={listboxValues.map((option) => option.value)}
                multiple
                onValuesChange={setListboxValues}
                renderOption={(option) => (
                  <HC justify="between" width="full">
                    <span>{option.display}</span>
                    <small>{option.other.phoneCode}</small>
                  </HC>
                )}
              />

              <Timeline items={timelineItems} orientation="vertical" />
              <Timeline items={timelineItems} orientation="horizontal" />

              <Popover
                trigger={<Button variant="outline">Open popover</Button>}
                placement="right"
              >
                <VC gap="sm">
                  <strong>Templated content</strong>
                  <Input placeholder="Popover input" />
                </VC>
              </Popover>

              <FileUpload accept="image/*,.pdf" multiple preview />

              <Carousel>
                {[1, 2, 3].map((slide) => (
                  <Image
                    key={slide}
                    src={`https://picsum.photos/900/360?slide=${slide}`}
                    alt={`Carousel slide ${slide}`}
                    width="full"
                    height={300}
                  />
                ))}
              </Carousel>

              <Breadcrumb items={breadcrumbs} />

              <Button color="success" onClick={() => setNoticeOpen(true)}>
                Show notification
              </Button>
              <Notification
                open={noticeOpen}
                title="Product saved"
                type="success"
                horizontal="center"
                vertical="top"
                onClose={() => setNoticeOpen(false)}
              >
                <p>The product was saved successfully.</p>
              </Notification>
            </VC>
          </section>

          <section className="fui-demo-card">
            <VC gap="md">
              <Label fontSize="xl" fontWeight="bold">
                Menu, tabs, section and tree
              </Label>

              <HC
                direction={{ default: "column", md: "row" }}
                align="start"
                gap="lg"
              >
                <Menu
                  items={menuItems}
                  onSelect={(item) => alert(item.label)}
                />

                <VC flex={1} gap="md">
                  <Tabs>
                    <Tab
                      id="details"
                      label="Details"
                      icon="fa-solid fa-circle-info"
                    >
                      <p>Product details appear here.</p>
                    </Tab>
                    <Tab
                      id="history"
                      label="History"
                      icon="fa-solid fa-clock-rotate-left"
                    >
                      <p>Change history appears here.</p>
                    </Tab>
                  </Tabs>

                  <Section title="Advanced settings" defaultOpen>
                    <p>Accordion content can contain any React component.</p>
                  </Section>

                  <Tree
                    nodes={tree}
                    value={treeValue}
                    defaultExpanded
                    onSelect={(model) => setTreeValue(model.value)}
                  />
                </VC>
              </HC>
            </VC>
          </section>

          <section className="fui-demo-card">
            <VC gap="md">
              <Label fontSize="xl" fontWeight="bold">
                Sortable table
              </Label>
              <Table
                data={sorted}
                columns={columns}
                sort={sort}
                onSortChange={setSort}
                alternateRows
                columnsConfigurable
                visibleColumnFields={visibleProductColumns}
                onVisibleColumnsChange={setVisibleProductColumns}
                exportable
                exportFileName="products"
                selectionEnabled
                selectedRow={selectedProduct}
                onSelectionChange={setSelectedProduct}
              />
            </VC>
          </section>

          <section className="fui-demo-card">
            <VC gap="md">
              <Label fontSize="xl" fontWeight="bold">
                Dialog positions
              </Label>
              <HC wrap="wrap" gap="sm">
                {(
                  [
                    "center",
                    "left",
                    "top",
                    "bottom",
                    "right",
                  ] as DialogPosition[]
                ).map((position) => (
                  <Button
                    key={position}
                    variant="outline"
                    onClick={() => setDialog(position)}
                  >
                    {position}
                  </Button>
                ))}
              </HC>
            </VC>
          </section>

          <Dialog
            open={dialog !== null}
            position={dialog ?? "center"}
            header={
              <Label fontSize="lg" fontWeight="bold">
                {dialog} dialog
              </Label>
            }
            body={
              <VC gap="md">
                <p>
                  The header, body and footer are React components. The body
                  becomes scrollable when necessary.
                </p>
                <Input placeholder="Dialog input" />
              </VC>
            }
            footer={
              <HC justify="end" gap="sm" width="full">
                <Button variant="ghost" onClick={() => setDialog(null)}>
                  Cancel
                </Button>
                <Button onClick={() => setDialog(null)}>Confirm</Button>
              </HC>
            }
            onOpen={() => console.log("Dialog opened")}
            onClose={() => setDialog(null)}
          />
        </VC>
      </main>
    </FlowUIProvider>
  );
}
