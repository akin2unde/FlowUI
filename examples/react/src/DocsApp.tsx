import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as F from "@akin2unde/flowui-react";
import { componentDocs, type Framework } from "../../shared/docs-data";
import "../../shared/docs.css";
import {
  asyncLabelSetup as setupCode,
  themeSetup,
} from "../../shared/docs-setup";
const choices: F.DropdownModel[] = [
  { value: "active", display: "Active", other: null },
  { value: "low", display: "Low Stock", other: null },
  { value: "out", display: "Out Of Stock", other: null },
];
const tree: F.TreeModel[] = [
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
  const store = F.useAsyncLabelStore();
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
                <F.AsyncLabel
                  lookup="customerName"
                  code={code}
                  fallback={code}
                />
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
        <F.Button
          variant="outline"
          onClick={() => store.invalidate("customerName")}
        >
          Resolve again
        </F.Button>
        <F.Button
          variant="ghost"
          onClick={() =>
            store.prime("customerName", "CUS001", "Akintunde (updated)")
          }
        >
          Simulate customer edit
        </F.Button>
      </div>
    </div>
  );
}
function ComponentPreview({ name }: { name: string }) {
  const [text, setText] = useState("");
  const [value, setValue] = useState<string | number>("active");
  const [values, setValues] = useState<Array<string | number>>(["active"]);
  const [checked, setChecked] = useState(true);
  const [number, setNumber] = useState(40);
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
        <F.HC gap="sm" wrap="wrap">
          <F.Button onClick={() => setChecked(!checked)}>
            {checked ? "Save" : "Saved"}
          </F.Button>
          <F.Button variant="outline">Outline</F.Button>
          <F.Button variant="ghost">Ghost</F.Button>
          <F.Button disabled>Disabled</F.Button>
        </F.HC>
      );
      break;
    case "ButtonGroup":
      preview = (
        <F.ButtonGroup selectable value={value} onChange={setValue}>
          <F.Button value="active">Active</F.Button>
          <F.Button value="low">Low stock</F.Button>
        </F.ButtonGroup>
      );
      break;
    case "Input":
      preview = (
        <F.VC gap="md">
          <F.Input
            value={text}
            placeholder="Customer name"
            onValueChange={setText}
          />
          <F.Input inputMode="money" currencySymbol="₦" placeholder="Amount" />
        </F.VC>
      );
      break;
    case "PasswordInput":
      preview = (
        <F.PasswordInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Password"
        />
      );
      break;
    case "TextArea":
      preview = (
        <F.TextArea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Notes"
        />
      );
      break;
    case "Dropdown":
      preview = (
        <>
          <F.Label required>Status</F.Label>
          <F.Dropdown
            value={value}
            options={choices}
            searchable
            onChange={(option) => setValue(option.value)}
          />
          <p className="docs-muted">
            Saved value: <code>{value}</code>. Selected and hovered rows use
            different colours.
          </p>
        </>
      );
      break;
    case "MultiSelect":
      preview = (
        <F.MultiSelect
          options={choices}
          value={values}
          searchable
          onChange={setValues}
        />
      );
      break;
    case "TreeDropdown":
      preview = (
        <F.TreeDropdown
          options={tree}
          value={value}
          searchable
          onChange={(option) => setValue(option.value)}
        />
      );
      break;
    case "TreeMultiSelect":
      preview = (
        <F.TreeMultiSelect
          nodes={tree}
          value={values}
          searchable
          onChange={setValues}
        />
      );
      break;
    case "Tree":
      preview = (
        <F.Tree
          nodes={tree}
          value={value}
          defaultExpanded
          onSelect={(option) => setValue(option.value)}
        />
      );
      break;
    case "Checkbox":
      preview = (
        <F.Checkbox
          checked={checked}
          label="Send receipt"
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
      break;
    case "RadioButton":
      preview = (
        <F.RadioButton
          checked={checked}
          label="Active"
          onChange={(e) => setChecked(e.target.checked)}
        />
      );
      break;
    case "RadioGroup":
      preview = (
        <F.RadioGroup
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
        <F.Switch
          checked={checked}
          label="Notifications"
          onChange={setChecked}
        />
      );
      break;
    case "Slider":
      preview = <F.Slider value={number} onChange={setNumber} showValue />;
      break;
    case "Knob":
      preview = <F.Knob value={number} onChange={setNumber} valueSuffix="%" />;
      break;
    case "Rating":
      preview = <F.Rating value={(number % 5) + 1} onChange={setNumber} />;
      break;
    case "ColorPicker":
      preview = (
        <F.ColorPicker
          value={text || "#2563eb"}
          onChange={(e) => setText(e.target.value)}
        />
      );
      break;
    case "DateTime":
      preview = (
        <F.DateTime value={text || "2026-10-10T09:30"} onChange={setText} />
      );
      break;
    case "OTPInput":
      preview = <F.OTPInput value={text} length={6} onChange={setText} />;
      break;
    case "PhoneInput":
      preview = (
        <F.PhoneInput
          countries={[
            { code: "NG", name: "Nigeria", dialCode: "+234", flag: "🇳🇬" },
            { code: "GB", name: "United Kingdom", dialCode: "+44", flag: "🇬🇧" },
          ]}
        />
      );
      break;
    case "Autocomplete":
      preview = (
        <F.Autocomplete
          options={choices}
          value={value}
          onChange={(item) => setValue(item.value)}
        />
      );
      break;
    case "Listbox":
      preview = (
        <F.Listbox
          options={choices}
          value={value}
          onChange={(item) => setValue(item.value)}
        />
      );
      break;
    case "FileUpload":
      preview = <F.FileUpload accept="image/*" preview />;
      break;
    case "HC":
      preview = (
        <F.HC gap="md" wrap="wrap">
          {block("First")}
          {block("Second")}
          {block("Third")}
        </F.HC>
      );
      break;
    case "VC":
      preview = (
        <F.VC gap="sm">
          {block("First")}
          {block("Second")}
          {block("Third")}
        </F.VC>
      );
      break;
    case "Divider":
      preview = (
        <F.VC gap="md">
          <span>First section</span>
          <F.Divider label="or" />
          <span>Second section</span>
        </F.VC>
      );
      break;
    case "Card":
      preview = (
        <F.Card
          header={<strong>Customer details</strong>}
          footer="Updated just now"
        >
          <p>Cards group related content.</p>
        </F.Card>
      );
      break;
    case "Label":
      preview = (
        <F.VC gap="sm">
          <F.Label htmlFor="docs-name" required>
            Customer name
          </F.Label>
          <F.Input id="docs-name" placeholder="Enter a name" />
        </F.VC>
      );
      break;
    case "Badge":
      preview = (
        <F.HC gap="sm">
          <F.Badge color="success">Active</F.Badge>
          <F.Badge color="warning">Low stock</F.Badge>
          <F.Badge color="danger">Out of stock</F.Badge>
        </F.HC>
      );
      break;
    case "Icon":
      preview = (
        <F.HC gap="lg">
          <F.Icon icon="fa-solid fa-check" label="Success" />
          <F.Icon icon="fa-solid fa-house" label="Home" />
          <F.Icon icon="fa-solid fa-spinner" spin label="Loading" />
        </F.HC>
      );
      break;
    case "Image":
      preview = (
        <F.Image
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='160'%3E%3Crect width='320' height='160' fill='%23eff6ff'/%3E%3Ctext x='100' y='88' fill='%232563eb' font-size='28'%3EFlowUI%3C/text%3E%3C/svg%3E"
          alt="FlowUI sample"
          width={320}
          height={160}
        />
      );
      break;
    case "Tooltip":
      preview = (
        <F.Tooltip text="Save your changes" location="top">
          <F.Button>Hover or focus</F.Button>
        </F.Tooltip>
      );
      break;
    case "Carousel":
      preview = (
        <F.Carousel>
          {block("Slide one")}
          {block("Slide two")}
          {block("Slide three")}
        </F.Carousel>
      );
      break;
    case "Breadcrumb":
      preview = (
        <F.Breadcrumb
          items={[
            { id: 1, text: "Home" },
            { id: 2, text: "Customers" },
            { id: 3, text: "Akintunde" },
          ]}
        />
      );
      break;
    case "Chart":
      preview = (
        <F.Chart
          type="bar"
          data={{
            labels: ["Mon", "Tue", "Wed"],
            series: [
              { name: "Sales", data: [20, 35, 28], color: "primary.600" },
            ],
          }}
        />
      );
      break;
    case "Timeline":
      preview = (
        <F.Timeline
          items={[
            { id: 1, title: "Created", description: "Sale recorded" },
            { id: 2, title: "Completed", description: "Receipt sent" },
          ]}
        />
      );
      break;
    case "Menu":
      preview = (
        <F.Menu
          items={[
            { id: "new", label: "New sale", icon: "fa-solid fa-plus" },
            { id: "reports", label: "Reports", icon: "fa-solid fa-chart-line" },
          ]}
        />
      );
      break;
    case "Tabs / Tab":
      preview = (
        <F.Tabs>
          <F.Tab id="overview" label="Overview">
            Overview content
          </F.Tab>
          <F.Tab id="history" label="History">
            History content
          </F.Tab>
        </F.Tabs>
      );
      break;
    case "Section":
      preview = (
        <F.Section title="Advanced settings" defaultOpen>
          Expand or collapse this content.
        </F.Section>
      );
      break;
    case "Table":
      preview = (
        <F.Table
          data={[
            { name: "Rice", price: 24500 },
            { name: "Beans", price: 18000 },
          ]}
          columns={[
            { field: "name", header: "Product" },
            { field: "price", header: "Price" },
          ]}
          alternateRows
          columnsConfigurable
          exportable
        />
      );
      break;
    case "Dialog":
      preview = (
        <>
          <F.Button onClick={() => setOpen(true)}>Open details</F.Button>
          <F.Dialog
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
        <F.Popover trigger={<F.Button>Open popover</F.Button>}>
          More information
        </F.Popover>
      );
      break;
    case "Notification":
      preview = (
        <>
          <F.Button onClick={() => setOpen(true)}>Show notification</F.Button>
          <F.Notification
            open={open}
            type="success"
            onClose={() => setOpen(false)}
          >
            Saved successfully
          </F.Notification>
        </>
      );
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
          { signal }: F.LabelResolverContext,
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
    <F.FlowUIProvider mode={dark ? "dark" : "light"}>
      <F.AsyncLabelProvider lookups={lookups} scopeKey="documentation-demo">
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
              v0.3.0 <a href="#gallery">Original gallery</a>
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
      </F.AsyncLabelProvider>
    </F.FlowUIProvider>
  );
}
