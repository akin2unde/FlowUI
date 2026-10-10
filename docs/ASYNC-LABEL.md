# AsyncLabel

AsyncLabel displays a read-only property obtained from a stored code. It works in
tables, cards and form summaries. It is independent of form field labels. Dropdowns
already receive `{value, display, other}` data and do not need AsyncLabel.

## Resolver contract

The application registers named lookups. FlowUI sends unique string codes to each
lookup; the application decides whether to call a batch endpoint or individual
endpoints. Different lookups never mix, even if the same code appears in both.

```ts
import type { LabelLookup } from "@akin2unde/flowui-core";
const customerNames: LabelLookup = {
  resolve: async (codes, { scopeKey, signal }) => {
    // scopeKey identifies the provider's cache scope. The server must still
    // derive and authorize the tenant from the authenticated request.
    const response = await fetch("/api/customer-names/resolve", {
      method: "POST",
      signal,
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes }),
    });
    if (!response.ok) throw new Error(`Lookup failed: ${response.status}`);
    return response.json();
  },
};
const lookups = { customerName: customerNames };
```

For input `['CUS001','CUS002','CUS003']`, return:

```json
{ "CUS001": "Akintunde", "CUS002": "Mary", "CUS003": null }
```

`null` means confirmed missing. An omitted key or invalid value is an error and
is not cached. `""` is a valid resolved label. Numeric codes become strings; string
codes preserve leading zeroes. Blank, null and undefined codes make no request.
Errors display the configured fallback (the code by default). Use the hook/service
to inspect error states or show a retry action; the component does not silently
schedule infinite retries. See the validated fetch adapters in
[customer-api.ts](../examples/shared/customer-api.ts).

## React

Keep `lookups` and `options` stable: declare them outside rendering or memoize
when they depend on application state. Recreating them replaces the provider's
store and cache.

```tsx
import {
  AsyncLabelProvider,
  AsyncLabel,
  useAsyncLabelStore,
} from "@akin2unde/flowui-react";
import { batchCustomerNames } from "./customer-api";
const lookups = { customerName: batchCustomerNames };

function Root({ tenantCode }: { tenantCode: string }) {
  return (
    <AsyncLabelProvider lookups={lookups} scopeKey={tenantCode}>
      <Sales />
    </AsyncLabelProvider>
  );
}
function Sales() {
  return (
    <>
      <AsyncLabel lookup="customerName" code="CUS001" />
      <AsyncLabel lookup="customerName" code="CUS001" />
      <AsyncLabel
        lookup="customerName"
        code="CUS002"
        fallback="Unknown customer"
      />
    </>
  );
}
```

Both `CUS001` instances share one result and one in-flight request. The component
shows a 14px inline spinner and `Resolving…`, with `aria-busy`, while loading. Set
`loadingText`, `fallback`, or `showLoader={false}` to customize it. Standard FlowUI
styling props apply. Import the package stylesheet as usual.

`useAsyncLabel(lookup, code)` returns `idle | loading | ready | missing | error`
state; ready includes `label`, error includes `error`. `useAsyncLabelStore()`
exposes `invalidate`, `prime`, `clear` and `setScope`. Scope changes via the provider
prop replace the store. React StrictMode effect replay is supported. Server
rendering emits a stable loading placeholder; client subscriptions perform the
lookup, so no user cache is global on the server.

## Angular

```ts
import { inject } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import {
  provideAsyncLabels,
  AsyncLabelService,
  FlowAsyncLabelComponent,
} from "@akin2unde/flowui-angular";

bootstrapApplication(AppComponent, {
  providers: [
    provideAsyncLabels(() => {
      const api = inject(CustomerApi); // Your application's API service.
      return {
        scopeKey: "default",
        lookups: {
          customerName: {
            resolve: (codes, context) =>
              api.resolveNames(codes, context.signal),
          },
        },
      };
    }),
  ],
});
// Include FlowAsyncLabelComponent in the standalone component imports.
```

```html
<fui-async-label
  lookup="customerName"
  [code]="sale.CustomerCode"
  [fallback]="sale.CustomerCode"
  loadingText="Resolving…"
/>
```

The app service returns a Promise of the code-to-label object. For HttpClient,
convert its observable to a Promise in the app resolver and wire cancellation
if required. The core always discards obsolete replies even if an app transport
ignores `signal`. The factory runs in an Angular injection context. Signals update
the inline loader and text in zoneless applications.

```ts
const labels = inject(AsyncLabelService);
labels.setScope(tenantCode); // Before rendering data for the new account/tenant.
labels.invalidate("customerName", customer.Code);
labels.prime("customerName", customer.Code, customer.Name);
```

The injector owns the store and disposes it on destruction. Provide at an app or
feature boundary, not separately on every label. Server applications must create
providers per request.

## React Native

```tsx
import { AsyncLabelProvider, AsyncLabel } from "@akin2unde/flowui-react-native";
const lookups = {
  customerName: {
    resolve: (codes, { signal }) => customerApi.resolveNames(codes, signal),
  },
};

<AsyncLabelProvider lookups={lookups} scopeKey={tenantCode}>
  <AsyncLabel
    lookup="customerName"
    code={sale.CustomerCode}
    textStyle={{ fontSize: 14 }}
  />
</AsyncLabelProvider>;
```

This uses a native ActivityIndicator beside native Text. It imports no DOM or
browser stylesheet. The hooks and cache contract match React. `style` styles the
container, `textStyle` styles text; `className`, `testID`, `showLoader`, `loadingText`
and `fallback` are available. Use an absolute API URL in a native app.

## Batching and cache

| Option               | Default | Purpose                                                  |
| -------------------- | ------- | -------------------------------------------------------- |
| batchWindowMs        | 10      | Collect nearby subscriptions before calling the resolver |
| maxBatchSize         | 100     | Limit unique codes passed to each resolver call          |
| maxConcurrentBatches | 4       | Bound simultaneous resolver calls across named lookups   |
| requestTimeoutMs     | 30000   | Release stalled batches and abort their signal           |
| cacheTtlMs           | 300000  | Cache successful labels for five minutes                 |
| missingTtlMs         | 30000   | Cache confirmed missing codes briefly                    |
| maxCacheEntries      | 1000    | Maximum completed results across the store               |

Options are provided alongside `lookups`. A lookup can override `cacheTtlMs`.
Set `cacheTtlMs:0` or `maxCacheEntries:0` to disable completed-result caching;
in-flight requests still deduplicate. Oversized requests split into batches.
Only codes collected in the same batching window can share one initial batch;
a later label with a different code may cause another call. A later label with
the same pending code attaches to the existing request.

The cache is an in-memory Map owned by the provider/injector, not localStorage,
IndexedDB, a database or a permanent global singleton. It uses bounded LRU
retention. Cache lookups are keyed by lookup and exact code within the current
scope. Switching scope aborts old work, clears entries and prevents old replies
from populating the new account. Provider unmount/injector destruction releases
the store. Label and missing-value expiry is checked on the next subscription;
a mounted resolved label stays stable until explicitly refreshed.

Active subscribers and queued/in-flight entries are separate from the completed
cache. Their memory is proportional to the visible UI and pending workload, so
the cache limit does not discard mounted label state. Use virtualization for very
large tables as with other UI controls.

```ts
store.invalidate("customerName", code); // Evict and refetch active occurrences.
store.invalidate("customerName"); // Refresh this lookup.
store.prime("customerName", code, name); // Publish the authoritative save result.
store.clear(); // Clear all caches and refetch active labels.
```

Old requests cannot overwrite `prime`, invalidation, or a scope switch. Unmounting
one repeated label does not cancel the request used by another instance.

## No batch endpoint

Use `individualCustomerNames` in the supplied fetch adapters and configure
`maxConcurrentBatches:1`. It receives unique codes and runs up to four individual
HTTP requests at once. You may change that application-level limit. The server
must distinguish a confirmed 404/missing name from a temporary error; temporary
errors should throw, not return null.

## FlowORM-backed backend example

FlowUI does not depend on FlowORM. The backend endpoint receives codes, deduplicates
and validates them, runs your app's tenant-filtered FlowORM query once (an `IN`
filter over customer codes), and returns only the requested code-to-name pairs.
The query should project Code and Name rather than full customer records.

The latest FlowUI archive contains no FlowORM API source. The repository interface
below is the deliberate integration boundary: implement it using your installed
FlowORM version's query API. No unverified FlowORM fluent methods are assumed.
This is an ASP.NET endpoint reference, not an included deployed backend:

```csharp
public record ResolveCustomerNamesRequest(string[] Codes);
public record CustomerNameRow(string Code, string Name);
public interface ICustomerNameRepository {
    // Implement with FlowORM: filter by the authorized tenant and Codes IN codes,
    // then project Code and Name in one database query.
    Task<IReadOnlyList<CustomerNameRow>> FindNamesAsync(
        string tenantCode, IReadOnlyList<string> codes, CancellationToken ct);
}

app.MapPost("/api/customer-names/resolve", async Task<IResult> (
    ResolveCustomerNamesRequest request,
    ICustomerNameRepository customers,
    HttpContext http,
    CancellationToken ct) => {
    if (request.Codes is null || request.Codes.Length > 100 ||
        request.Codes.Any(code => string.IsNullOrWhiteSpace(code)))
        return Results.BadRequest();
    var tenant = http.User.FindFirst("tenant_code")?.Value;
    if (tenant is null) return Results.Forbid();
    var codes = request.Codes.Distinct(StringComparer.Ordinal).ToArray();
    var rows = await customers.FindNamesAsync(tenant, codes, ct);
    var result = codes.ToDictionary(code => code, _ => (string?)null,
        StringComparer.Ordinal);
    foreach (var row in rows)
        if (result.ContainsKey(row.Code)) result[row.Code] = row.Name;
    return Results.Ok(result);
}).RequireAuthorization();
```

Retain the endpoint's authorization and tenant filtering in the FlowORM repository.
Do not convert a database failure into a missing result. The frontend resolver
receives the returned object unchanged after validation.

## Documentation and Blazor

Run `npm run dev:react` or `npm run dev:angular` for sidebar documentation. Selecting
a control displays its own preview, framework usage and source-generated properties.
The host site's preview is identified as React or Angular; switching framework
tabs changes the usage reference rather than mounting another framework runtime.
The AsyncLabel preview has a 650ms simulated app resolver, live call counts,
repeated codes, missing values, refresh and saved-name updates. The original full
galleries remain accessible. The Expo example includes the native AsyncLabel demo.

Blazor is planned and has no exported component in this release. It can adopt the
same resolver/result contract using a .NET-scoped batch coordinator and cancellation;
it cannot reuse the TypeScript runtime directly without a JS interop boundary.
