import NotificationDemo from "./NotificationDemo";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  AsyncLabel,
  AsyncLabelProvider,
  Autocomplete,
  Badge,
  Breadcrumb,
  Button,
  ButtonGroup,
  Card,
  Carousel,
  Chart,
  WorkflowStepper,
  type FlowStage,
  Checkbox,
  ColorPicker,
  DateTime,
  Dialog,
  Divider,
  Dropdown,
  DropdownModel,
  FileUpload,
  FlowUIProvider,
  HC,
  Icon,
  Image,
  Input,
  Knob,
  Label,
  LabelResolverContext,
  Listbox,
  Menu,
  MultiSelect,
  OTPInput,
  PasswordInput,
  PhoneInput,
  Popover,
  RadioButton,
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
  TreeModel,
  TreeMultiSelect,
  VC,
  useAsyncLabelStore,
} from "@akin2unde/flowui-react";
import { componentDocs, type Framework } from "../../shared/docs-data";
import "../../shared/docs.css";
import {
  asyncLabelSetup as setupCode,
  themeSetup,
} from "../../shared/docs-setup";
const choices: DropdownModel[] = [
  { value: "active", display: "Active", other: null },
  { value: "low", display: "Low Stock", other: null },
  { value: "out", display: "Out Of Stock", other: null },
];
const tree: TreeModel[] = [
  {
    value: "ng",
    display: "Nigeria",
    other: null,
    children: [
      { value: "lagos", display: "Lagos", other: null },
      { value: "abuja", display: "Abuja", other: null },
    ],
  },
];
const workflow: FlowStage[] = [
  { Id: "truck", Label: "Truck assigned", IsCompleted: true },
  { Id: "oil", Label: "Oil checked", IsCompleted: true },
  { Id: "safety", Label: "Safety passed", IsCompleted: true },
  {
    Id: "repair",
    Label: "Repair",
    IsCurrent: true,
    Actions: [
      { Label: "Start repair", Icon: "fa-solid fa-play" },
      { Label: "Send for inspection", Icon: "fa-solid fa-arrow-right" },
      {
        Label: "Request cancellation",
        Icon: "fa-solid fa-lock",
        IsReadonly: true,
      },
    ],
  },
];

const frameworkNames = {
  react: "React",
  angular: "Angular",
  native: "React Native",
};
function route() {
  const parts = window.location.hash.slice(2).split("/");
  return {
    framework: (["react", "angular", "native"].includes(parts[0])
      ? parts[0]
      : "react") as Framework,
    selected: parts[1] ? decodeURIComponent(parts[1]) : "AsyncLabel",
  };
}
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    setCopied(false);
    setError(false);
  }, [code]);
  return (
    <div className="docs-code">
      <button
        type="button"
        aria-label="Copy code"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setError(false);
          } catch {
            setError(true);
          }
        }}
      >
        {copied ? "Copied" : error ? "Select code to copy" : "Copy"}
      </button>
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
function AsyncPreview() {
  const store = useAsyncLabelStore();
  return (
    <div>
      <table className="docs-demo-table">
        <thead>
          <tr>
            <th>Sale</th>
            <th>Customer</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["SAL001", "CUS001", "₦24,500"],
            ["SAL002", "CUS001", "₦18,000"],
            ["SAL003", "CUS002", "₦9,500"],
            ["SAL004", "CUS003", "₦12,000"],
          ].map(([sale, code, total]) => (
            <tr key={sale}>
              <td>{sale}</td>
              <td>
                <AsyncLabel lookup="customerName" code={code} fallback={code} />
              </td>
              <td>{total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="docs-note">
        Repeated codes share one lookup. This preview uses a simulated app
        resolver.
      </div>
      <div className="docs-demo-actions">
        <Button
          variant="outline"
          onClick={() => store.invalidate("customerName")}
        >
          Resolve again
        </Button>
        <Button
          variant="ghost"
          onClick={() =>
            store.prime("customerName", "CUS001", "Akintunde (updated)")
          }
        >
          Simulate customer edit
        </Button>
      </div>
    </div>
  );
}
function ComponentPreview({ name }: { name: string }) {
  const [text, setText] = useState("");
  const [value, setValue] = useState<string | number>("active");
  const [dropdownValue, setDropdownValue] = useState<
    string | number | undefined
  >("active");
  const [dateMode, setDateMode] = useState<"date" | "time" | "datetime">(
    "datetime",
  );
  const [dateValues, setDateValues] = useState({
    date: "2026-10-10",
    time: "09:30",
    datetime: "2026-10-10T09:30",
  });
  const [placement, setPlacement] = useState<
    "top" | "right" | "bottom" | "left"
  >("top");
  const [breadcrumbDepth, setBreadcrumbDepth] = useState(3);
  const [tab, setTab] = useState("overview");
  const [tabStyle, setTabStyle] = useState<"underline" | "fill">("underline");
  const [report, setReport] = useState(false);
  const [loaded, setLoaded] = useState(2);
  const [values, setValues] = useState<Array<string | number>>(["active"]);
  const [checked, setChecked] = useState(true);
  const [number, setNumber] = useState(40);
  const [rating, setRating] = useState(2);
  const [stageDetails, setStageDetails] = useState<FlowStage>();
  const [open, setOpen] = useState(false);
  const block = (label: string) => (
    <div className="docs-layout-item">{label}</div>
  );
  let preview: ReactNode;
  switch (name) {
    case "AsyncLabel":
      return <AsyncPreview />;
    case "Button":
      preview = (
        <HC gap="sm" wrap="wrap">
          <Button onClick={() => setChecked(!checked)}>
            {checked ? "Save" : "Saved"}
          </Button>
          <Button variant="outline" text="Outline" />
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </HC>
      );
      break;
    case "ButtonGroup":
      preview = (
        <ButtonGroup selectable value={value} onChange={setValue}>
          <Button value="active">Active</Button>
          <Button value="low">Low stock</Button>
        </ButtonGroup>
      );
      break;
    case "Input":
      preview = (
        <VC gap="md">
          <Input
            value={text}
            placeholder="Customer name"
            onValueChange={setText}
          />
          <Input inputMode="money" currencySymbol="₦" placeholder="Amount" />
        </VC>
      );
      break;
    case "PasswordInput":
      preview = (
        <PasswordInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Password"
        />
      );
      break;
    case "TextArea":
      preview = (
        <TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Notes"
        />
      );
      break;
    case "Dropdown":
      preview = (
        <>
          <Label required>Status</Label>
          <Dropdown
            value={dropdownValue}
            options={choices}
            searchable
            clearable
            onClear={() => setDropdownValue(undefined)}
            onChange={(option) => setDropdownValue(option.value)}
          />
          <p className="docs-muted">
            Saved value: <code>{dropdownValue ?? "None"}</code>. Selected and
            hovered rows use different colours.
          </p>
        </>
      );
      break;
    case "MultiSelect":
      preview = (
        <MultiSelect
          options={choices}
          value={values}
          searchable
          onChange={setValues}
        />
      );
      break;
    case "TreeDropdown":
      preview = (
        <TreeDropdown
          options={tree}
          value={value}
          searchable
          onChange={(option) => setValue(option.value)}
        />
      );
      break;
    case "TreeMultiSelect":
      preview = (
        <TreeMultiSelect
          nodes={tree}
          value={values}
          searchable
          onChange={setValues}
        />
      );
      break;
    case "Tree":
      preview = (
        <Tree
          nodes={tree.map((node) => ({
            ...node,
            icon: "fa-solid fa-folder",
            children: node.children?.map((child) => ({
              ...child,
              icon: "fa-solid fa-location-dot",
            })),
          }))}
          value={value}
          showCheckboxes
          defaultExpanded
          onSelect={(option) => setValue(option.value)}
        />
      );
      break;
    case "Checkbox":
      preview = (
        <Checkbox
          checked={checked}
          label="Send receipt"
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
      break;
    case "RadioButton":
      preview = (
        <RadioButton
          checked={checked}
          label="Active"
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
      break;
    case "RadioGroup":
      preview = (
        <RadioGroup
          name="docs-status"
          options={choices.map((c) => ({
            value: String(c.value),
            label: String(c.display),
          }))}
          value={String(value)}
          onChange={setValue}
        />
      );
      break;
    case "Switch":
      preview = (
        <Switch checked={checked} label="Notifications" onChange={setChecked} />
      );
      break;
    case "Slider":
      preview = <Slider value={number} onChange={setNumber} showValue />;
      break;
    case "Knob":
      preview = <Knob value={number} onChange={setNumber} valueSuffix="%" />;
      break;
    case "Rating":
      preview = <Rating value={rating} onChange={setRating} />;
      break;
    case "ColorPicker":
      preview = (
        <ColorPicker
          value={text || "#2563eb"}
          onChange={(e) => setText(e.target.value)}
        />
      );
      break;
    case "DateTime":
      preview = (
        <VC gap="sm">
          <label>
            Mode{" "}
            <select
              value={dateMode}
              onChange={(event) =>
                setDateMode(event.target.value as typeof dateMode)
              }
            >
              <option value="datetime">Date and time</option>
              <option value="date">Date only</option>
              <option value="time">Time only</option>
            </select>
          </label>
          <DateTime
            mode={dateMode}
            value={dateValues[dateMode]}
            onChange={(next) =>
              setDateValues((previous) => ({ ...previous, [dateMode]: next }))
            }
          />
        </VC>
      );
      break;
    case "OTPInput":
      preview = <OTPInput value={text} length={6} onChange={setText} />;
      break;
    case "PhoneInput":
      preview = (
        <PhoneInput
          countries={[
            { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
            { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
          ]}
        />
      );
      break;
    case "Autocomplete":
      preview = (
        <Autocomplete
          options={choices}
          value={value}
          onChange={(item) => setValue(item.value)}
        />
      );
      break;
    case "Listbox":
      preview = (
        <Listbox
          options={choices}
          value={value}
          onChange={(item) => setValue(item.value)}
        />
      );
      break;
    case "FileUpload":
      preview = <FileUpload accept="image/*" preview />;
      break;
    case "HC":
      preview = (
        <HC gap="md" wrap="wrap">
          {block("First")}
          {block("Second")}
          {block("Third")}
        </HC>
      );
      break;
    case "VC":
      preview = (
        <VC gap="sm">
          {block("First")}
          {block("Second")}
          {block("Third")}
        </VC>
      );
      break;
    case "Divider":
      preview = (
        <VC gap="md">
          <span>First section</span>
          <Divider label="or" />
          <span>Second section</span>
        </VC>
      );
      break;
    case "Card":
      preview = (
        <Card
          header={<strong>Customer details</strong>}
          footer="Updated just now"
        >
          <p>Cards group related content.</p>
        </Card>
      );
      break;
    case "Label":
      preview = (
        <VC gap="sm">
          <Label htmlFor="docs-name" required>
            Customer name
          </Label>
          <Input id="docs-name" placeholder="Enter a name" />
        </VC>
      );
      break;
    case "Badge":
      preview = (
        <HC gap="sm">
          <Badge color="success">Active</Badge>
          <Badge color="warning">Low stock</Badge>
          <Badge color="danger">Out of stock</Badge>
        </HC>
      );
      break;
    case "Icon":
      preview = (
        <HC gap="lg">
          <Icon icon="fa-solid fa-check" label="Success" />
          <Icon icon="fa-solid fa-house" label="Home" />
          <Icon icon="fa-solid fa-spinner" spin label="Loading" />
        </HC>
      );
      break;
    case "Image":
      preview = (
        <Image
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='160'%3E%3Crect width='320' height='160' fill='%23eff6ff'/%3E%3Ctext x='100' y='88' fill='%232563eb' font-size='28'%3EFlowUI%3C/text%3E%3C/svg%3E"
          alt="FlowUI sample"
          width={320}
          height={160}
        />
      );
      break;
    case "Tooltip":
      preview = (
        <VC gap="md">
          <label>
            Placement{" "}
            <select
              value={placement}
              onChange={(event) =>
                setPlacement(event.target.value as typeof placement)
              }
            >
              {["top", "right", "bottom", "left"].map((side) => (
                <option key={side}>{side}</option>
              ))}
            </select>
          </label>
          <div>
            <Tooltip text="Save your changes" location={placement}>
              <Button>Hover or focus</Button>
            </Tooltip>
          </div>
        </VC>
      );
      break;
    case "Carousel":
      preview = (
        <Carousel>
          {block("Slide one")}
          {block("Slide two")}
          {block("Slide three")}
        </Carousel>
      );
      break;
    case "Breadcrumb":
      preview = (
        <Breadcrumb
          items={[
            { id: 1, text: "Home" },
            { id: 2, text: "Customers" },
            { id: 3, text: "Akintunde" },
          ].slice(0, breadcrumbDepth)}
          separator="/"
          onSelect={(item) => setBreadcrumbDepth(Number(item.id))}
        />
      );
      break;
    case "WorkflowStepper":
      preview = (
        <>
          <WorkflowStepper stages={workflow} onStageClick={setStageDetails} />
          {stageDetails && (
            <div role="status" className="docs-stage-details">
              <strong>{stageDetails.Label}</strong>
              {stageDetails.Id === "oil" && <p>Oil level · Normal</p>}
              <Button onClick={() => setStageDetails(undefined)}>Close</Button>
            </div>
          )}
        </>
      );
      break;
    case "Chart":
      preview = (
        <div className="docs-chart-gallery">
          {(
            [
              ["column", "Column"],
              ["pie", "Pie"],
              ["line", "Line"],
              ["horizontal-bar", "Bar"],
              ["area", "Area"],
              ["combo", "Column and line"],
            ] as const
          ).map(([type, title]) => (
            <section key={type}>
              <h3>{title}</h3>
              <Chart
                type={type}
                height={230}
                data={{
                  labels: ["Mon", "Tue", "Wed", "Thu"],
                  series: [
                    { name: "Sales", data: [20, 34, 27, 41] },
                    ...(["line", "area", "combo"].includes(type)
                      ? [{ name: "Target", data: [30, 23, 37, 31] }]
                      : []),
                  ],
                }}
              />
            </section>
          ))}
        </div>
      );
      break;
    case "Timeline":
      preview = (
        <Timeline
          items={[
            { id: 1, title: "Created", description: "Sale recorded" },
            { id: 2, title: "Completed", description: "Receipt sent" },
          ]}
        />
      );
      break;
    case "Menu":
      preview = (
        <Menu
          items={[
            { id: "new", label: "New sale", icon: "fa-solid fa-plus" },
            { id: "reports", label: "Reports", icon: "fa-solid fa-chart-line" },
          ]}
        />
      );
      break;
    case "Tabs / Tab":
      preview = (
        <VC gap="sm">
          <HC gap="sm">
            <Button
              variant="outline"
              onClick={() => {
                setReport(!report);
                setTab(report ? "overview" : "report");
              }}
            >
              {report ? "Remove report tab" : "Add report tab"}
            </Button>
            <label>
              Selected style{" "}
              <select
                value={tabStyle}
                onChange={(event) =>
                  setTabStyle(event.target.value as typeof tabStyle)
                }
              >
                <option value="underline">Underline</option>
                <option value="fill">Fill</option>
              </select>
            </label>
          </HC>
          <Tabs value={tab} onChange={setTab} selectedStyle={tabStyle}>
            <Tab id="overview" label="Overview" icon="fa-solid fa-chart-line">
              Overview content
            </Tab>
            <Tab id="history" label="History">
              History content
            </Tab>
            {report && (
              <Tab id="report" label="Report" icon="fa-solid fa-file">
                Report content
              </Tab>
            )}
          </Tabs>
        </VC>
      );
      break;
    case "Section":
      preview = (
        <Section title="Advanced settings" defaultOpen>
          Expand or collapse this content.
        </Section>
      );
      break;
    case "Table":
      preview = (
        <Table
          data={[
            { name: "Rice", price: 24500 },
            { name: "Beans", price: 18000 },
            { name: 'Oil, "Premium"', price: 18500 },
            { name: "Detergent", price: 9300 },
          ].slice(0, loaded)}
          columns={[
            { field: "name", header: "Product" },
            {
              field: "price",
              header: "Price",
              format: (price) => `NGN ${Number(price).toLocaleString()}`,
            },
          ]}
          alternateRows
          columnsConfigurable
          exportable
          totalCount={4}
          onLoadMore={() => setLoaded((count) => Math.min(count + 2, 4))}
          renderLoadMore={({ loadedCount, hasMore, loading, loadMore }) => (
            <footer className="docs-table-footer">
              <span role="status">{loadedCount} records loaded</span>
              {hasMore && (
                <button type="button" disabled={loading} onClick={loadMore}>
                  {loading ? "Loading…" : "Load more"}
                </button>
              )}
            </footer>
          )}
        />
      );
      break;
    case "Dialog":
      preview = (
        <>
          <Button onClick={() => setOpen(true)}>Open details</Button>
          <Dialog
            open={open}
            position="right"
            header="Sale details"
            body={<p>Dialog content goes here.</p>}
            onClose={() => setOpen(false)}
          />
        </>
      );
      break;
    case "Popover":
      preview = (
        <Popover trigger={<Button>Open popover</Button>}>
          More information
        </Popover>
      );
      break;
    case "Notification":
      preview = <NotificationDemo />;
      break;
    default:
      preview = <p>See the usage and property reference below.</p>;
  }
  return <div className="docs-component-preview">{preview}</div>;
}
export function DocsApp() {
  const [location, setLocation] = useState(route);
  const [search, setSearch] = useState("");
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const [stats, setStats] = useState({ calls: 0, codes: [] as string[] });
  const searchRef = useRef<HTMLInputElement>(null);
  const lookups = useMemo(
    () => ({
      customerName: {
        resolve: async (
          codes: readonly string[],
          { signal }: LabelResolverContext,
        ) => {
          setStats((previous) => ({
            calls: previous.calls + 1,
            codes: [...codes],
          }));
          await new Promise<void>((resolve, reject) => {
            const timer = setTimeout(resolve, 650);
            signal.addEventListener(
              "abort",
              () => {
                clearTimeout(timer);
                reject(signal.reason);
              },
              { once: true },
            );
          });
          return Object.fromEntries(
            codes.map((code) => [
              code,
              (
                { CUS001: "Akintunde", CUS002: "Mary" } as Record<
                  string,
                  string
                >
              )[code] ?? null,
            ]),
          );
        },
      },
    }),
    [],
  );
  useEffect(() => {
    const changed = () => {
      setLocation(route());
      setMenu(false);
      window.scrollTo(0, 0);
    };
    const keyboard = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === "k") {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape") setMenu(false);
    };
    window.addEventListener("hashchange", changed);
    window.addEventListener("keydown", keyboard);
    return () => {
      window.removeEventListener("hashchange", changed);
      window.removeEventListener("keydown", keyboard);
    };
  }, []);
  const selected = componentDocs.find((doc) => doc.name === location.selected);
  const groups = [...new Set(componentDocs.map((doc) => doc.group))];
  const link = (name: string, framework = location.framework) =>
    `#/${framework}/${encodeURIComponent(name)}`;
  const gettingStarted = ["Introduction", "Installation", "Theming"];
  return (
    <FlowUIProvider mode={dark ? "dark" : "light"}>
      <AsyncLabelProvider lookups={lookups} scopeKey="documentation-demo">
        <div className="docs-shell">
          <a
            className="docs-skip"
            href="#docs-content"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("docs-content")?.focus();
            }}
          >
            Skip to content
          </a>
          <header className="docs-header">
            <button
              className="docs-mobile-toggle"
              aria-label="Toggle documentation navigation"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              ☰
            </button>
            <a className="docs-brand" href={link("Introduction")}>
              <span>F</span>FlowUI
            </a>
            <span className="docs-header-label">Documentation</span>
            <label className="docs-search">
              <i className="fa-solid fa-magnifying-glass" aria-hidden="true" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (window.innerWidth < 760) setMenu(true);
                }}
                placeholder="Search components…"
                aria-label="Search components"
              />
              <kbd>⌘ K</kbd>
            </label>
            <a
              href="https://github.com/akin2unde/FlowUI"
              aria-label="FlowUI GitHub repository"
            >
              <i className="fa-brands fa-github" />
            </a>
            <button
              aria-label={dark ? "Use light theme" : "Use dark theme"}
              onClick={() => setDark(!dark)}
            >
              <i className={`fa-solid fa-${dark ? "sun" : "moon"}`} />
            </button>
          </header>
          {menu && (
            <button
              className="docs-backdrop"
              aria-label="Close navigation"
              onClick={() => setMenu(false)}
            />
          )}
          <aside className={`docs-sidebar ${menu ? "docs-sidebar-open" : ""}`}>
            <nav aria-label="Documentation components">
              <h2>Getting started</h2>
              {gettingStarted
                .filter((name) =>
                  name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((name) => (
                  <a
                    key={name}
                    href={link(name)}
                    aria-current={
                      location.selected === name ? "page" : undefined
                    }
                  >
                    {name}
                  </a>
                ))}
              {groups.map((group) => {
                const docs = componentDocs.filter(
                  (doc) =>
                    doc.group === group &&
                    `${doc.name} ${doc.description}`
                      .toLowerCase()
                      .includes(search.toLowerCase()),
                );
                return docs.length ? (
                  <div key={group}>
                    <h2>{group}</h2>
                    {docs.map((doc) => (
                      <a
                        key={doc.name}
                        href={link(doc.name)}
                        aria-current={
                          location.selected === doc.name ? "page" : undefined
                        }
                      >
                        {doc.name}
                        {doc.name === "AsyncLabel" && <small>New</small>}
                      </a>
                    ))}
                  </div>
                ) : null;
              })}
              {search &&
                !componentDocs.some((doc) =>
                  `${doc.name} ${doc.description}`
                    .toLowerCase()
                    .includes(search.toLowerCase()),
                ) && <p className="docs-muted">No matching components.</p>}
            </nav>
            <footer>
              v1.0.4 <a href="#gallery">Original gallery</a>
            </footer>
          </aside>
          <main className="docs-content" id="docs-content" tabIndex={-1}>
            <div className="docs-breadcrumb">
              {selected ? "Components" : "Getting started"}
              <span>/</span>
              {selected?.name ?? location.selected}
            </div>
            <h1>{selected?.name ?? location.selected}</h1>
            <p className="docs-lead">
              {selected?.description ??
                "A shared design language for React, Angular and React Native."}
            </p>
            <div
              className="docs-frameworks"
              role="tablist"
              aria-label="Framework"
            >
              {(["react", "angular", "native"] as Framework[]).map(
                (framework) => (
                  <a
                    key={framework}
                    role="tab"
                    aria-selected={location.framework === framework}
                    href={link(location.selected, framework)}
                  >
                    {frameworkNames[framework]}
                  </a>
                ),
              )}
              <button disabled>Blazor · Planned</button>
            </div>
            {selected ? (
              <>
                <section className="docs-card" id="preview">
                  <h2>
                    Live preview <small>React browser component</small>
                  </h2>
                  <ComponentPreview key={selected.name} name={selected.name} />
                  {selected.name === "AsyncLabel" && (
                    <p className="docs-muted" aria-live="polite">
                      Resolver calls: {stats.calls} · Last unique codes:{" "}
                      {stats.codes.join(", ") || "None"}
                    </p>
                  )}
                </section>
                <section className="docs-card" id="usage">
                  <h2>
                    Usage <small>{frameworkNames[location.framework]}</small>
                  </h2>
                  {selected.code[location.framework] ? (
                    <CodeBlock code={selected.code[location.framework]} />
                  ) : (
                    <p>
                      No React Native usage example is available for this
                      component. Check the native guide for supported controls.
                      The browser preview demonstrates the web component.
                    </p>
                  )}
                </section>
                {selected.name === "AsyncLabel" && (
                  <section className="docs-card" id="provider">
                    <h2>Provider setup</h2>
                    <p>
                      Register a stable app resolver once. Return a
                      code-to-label object, with null for missing codes.
                    </p>
                    <CodeBlock code={setupCode[location.framework]} />
                    <CodeBlock
                      code={
                        '{ "CUS001": "Akintunde", "CUS002": "Mary", "CUS003": null }'
                      }
                    />
                  </section>
                )}
                <section className="docs-card" id="props">
                  <h2>
                    {location.framework === "angular"
                      ? "Inputs & outputs"
                      : "Props"}
                  </h2>
                  <div className="docs-table-scroll">
                    <table className="docs-props">
                      <thead>
                        <tr>
                          <th>Property</th>
                          <th>Type</th>
                          <th>Required</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selected.props[location.framework].map((prop) => (
                          <tr key={prop.name}>
                            <td>
                              <code>{prop.name}</code>
                            </td>
                            <td>
                              <code>{prop.type}</code>
                            </td>
                            <td>
                              {prop.optional ? "No" : "Yes / see defaults"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="docs-muted">
                    Component-specific contracts are generated from source.
                    Browser controls also accept FlowUI base styling props;
                    native controls accept their documented native styles.
                  </p>
                </section>
                {selected.name === "AsyncLabel" && (
                  <section className="docs-card" id="cache">
                    <h2>Cache & batching</h2>
                    <p>
                      Unique codes are collected for 10 ms, then passed to your
                      app resolver in batches of up to 100. Up to four batches
                      can run at once. Completed results use a bounded in-memory
                      cache: 1,000 entries, five-minute label expiry and
                      30-second missing-value expiry.
                    </p>
                    <p>
                      Failed or incomplete responses are retryable. Refresh
                      active labels with invalidate, or publish a saved name
                      with prime. Switch the scope after tenant/account changes.
                    </p>
                    <CodeBlock
                      code={
                        'store.invalidate("customerName", code);\nstore.prime("customerName", code, customer.Name);\n// React/Native: useAsyncLabelStore()\n// Angular: inject(AsyncLabelService).store'
                      }
                    />
                  </section>
                )}
              </>
            ) : (
              <section className="docs-card">
                {location.selected === "Installation" ? (
                  <>
                    <h2>Install</h2>
                    <CodeBlock
                      code={`npm install @akin2unde/flowui-${location.framework === "native" ? "react-native" : location.framework}`}
                    />
                    <p>
                      Browser adapters ship compiled CSS. Import the adapter
                      stylesheet and Font Awesome CSS. React Native uses its own
                      renderer and NativeWind.
                    </p>
                  </>
                ) : location.selected === "Theming" ? (
                  <>
                    <h2>Theme configuration</h2>
                    <p>
                      Use FlowUIProvider on React and React Native, or
                      provideFlowUI in Angular. The theme toggle above previews
                      light and dark modes.
                    </p>
                    <CodeBlock code={themeSetup[location.framework]} />
                  </>
                ) : (
                  <>
                    <h2>Choose a component</h2>
                    <p>
                      Use the sidebar to open a working preview,
                      framework-specific usage and property reference. Search
                      finds components by name and purpose.
                    </p>
                    <p>
                      AsyncLabel resolves read-only values. Dropdowns use the
                      value and display supplied by their datasource.
                    </p>
                    <a className="docs-primary-link" href={link("AsyncLabel")}>
                      Explore AsyncLabel →
                    </a>
                  </>
                )}
              </section>
            )}
            <footer className="docs-content-footer">
              FlowUI · Component documentation
            </footer>
          </main>
          <aside className="docs-on-page">
            <strong>On this page</strong>
            {[
              "preview",
              "usage",
              ...(selected?.name === "AsyncLabel" ? ["provider"] : []),
              "props",
              ...(selected?.name === "AsyncLabel" ? ["cache"] : []),
            ].map((id) => (
              <button
                key={id}
                onClick={() =>
                  document
                    .getElementById(id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                {
                  (
                    {
                      preview: "Preview",
                      usage: "Usage",
                      provider: "Provider setup",
                      props: "Properties",
                      cache: "Cache & batching",
                    } as Record<string, string>
                  )[id]
                }
              </button>
            ))}
          </aside>
        </div>
      </AsyncLabelProvider>
    </FlowUIProvider>
  );
}
