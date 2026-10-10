import type { LabelLookup, LabelResults } from "@akin2unde/flowui-core";

function resultsFor(codes: readonly string[], value: unknown): LabelResults {
  if (!value || typeof value !== "object" || Array.isArray(value))
    throw new Error("Invalid lookup response");
  return Object.fromEntries(
    codes.map((code) => {
      const label = (value as Record<string, unknown>)[code];
      if (
        !Object.hasOwn(value, code) ||
        (label !== null && typeof label !== "string")
      )
        throw new Error(`Missing or invalid label for ${code}`);
      return [code, label as string | null];
    }),
  );
}

/** Application-owned adapter: the authenticated server decides the tenant scope. */
export const batchCustomerNames: LabelLookup = {
  async resolve(codes, { signal }) {
    const response = await fetch("/api/customer-names/resolve", {
      method: "POST",
      credentials: "same-origin",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ codes }),
    });
    if (!response.ok)
      throw new Error(`Customer lookup failed: ${response.status}`);
    return resultsFor(codes, await response.json());
  },
};

/** Alternative for an app with only a per-customer endpoint.
 * Use options.maxConcurrentBatches = 1 for an overall limit of four HTTP calls.
 * FlowUI still supplies unique codes, so repeated labels do not duplicate calls.
 */
export const individualCustomerNames: LabelLookup = {
  async resolve(codes, { signal }) {
    const results: Record<string, string | null> = Object.create(null);
    let next = 0;
    await Promise.all(
      Array.from({ length: Math.min(4, codes.length) }, async () => {
        while (next < codes.length) {
          if (signal.aborted) throw signal.reason;
          const code = codes[next++];
          const response = await fetch(
            `/api/customers/${encodeURIComponent(code)}/name`,
            { signal, credentials: "same-origin" },
          );
          if (response.status === 404) {
            results[code] = null;
            continue;
          }
          if (!response.ok)
            throw new Error(`Customer lookup failed: ${response.status}`);
          const value: unknown = await response.json();
          if (
            !value ||
            typeof value !== "object" ||
            !Object.hasOwn(value, "name")
          )
            throw new Error(`Invalid name for ${code}`);
          const name = (value as { name: unknown }).name;
          if (name !== null && typeof name !== "string")
            throw new Error(`Invalid name for ${code}`);
          results[code] = name;
        }
      }),
    );
    return results;
  },
};
