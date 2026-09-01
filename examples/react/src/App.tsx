import { useMemo, useState } from "react";
import {
  Autocomplete,
  Badge,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Carousel,
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
  Menu,
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
  VC,
  FileUpload,
  Notification,
  createTheme,
  type BreadcrumbItem,
  type DialogPosition,
  type DropdownModel,
  type MenuItem,
  type SortState,
  type TableColumn,
  type TimelineItem,
  type TreeModel,
} from "@akin2unde/flowui-react";

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
  },
  {
    display: "United Kingdom",
    value: "uk",
    other: { phoneCode: "+44" },
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
                onChange={(model) => setCountry(model.value)}
              />

              <TreeDropdown
                value={location}
                options={tree}
                onChange={(model) => setLocation(model.value)}
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
                renderOption={(option, selected) => (
                  <HC justify="between" width="full">
                    <span>{option.display}</span>
                    <small>
                      {selected ? "Selected" : option.other.phoneCode}
                    </small>
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
