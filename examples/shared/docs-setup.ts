import type { Framework } from "./docs-data";
export const asyncLabelSetup: Record<Framework, string> = {
  react: `const lookups = {\n  customerName: {\n    resolve: (codes, { signal }) =>\n      customerApi.resolveNames(codes, signal)\n  }\n};\n\n<AsyncLabelProvider scopeKey={tenantCode} lookups={lookups}>\n  <App />\n</AsyncLabelProvider>`,
  angular: `provideAsyncLabels(() => {\n  const api = inject(CustomerApi);\n  return {\n    scopeKey: 'default',\n    lookups: {\n      customerName: { resolve: codes => api.resolveNames(codes) }\n    }\n  };\n})\n\n// On account/tenant changes:\nlabels.setScope(tenantCode);`,
  native: `import { AsyncLabelProvider, AsyncLabel }\n  from '@akin2unde/flowui-react-native';\n\nconst lookups = {\n  customerName: { resolve: codes => customerApi.resolveNames(codes) }\n};\n\n<AsyncLabelProvider scopeKey={tenantCode} lookups={lookups}>\n  <App />\n</AsyncLabelProvider>`,
};

export const themeSetup: Record<Framework, string> = {
  react: '<FlowUIProvider mode="light">\n  <App />\n</FlowUIProvider>',
  angular: 'provideFlowUI({mode: "light"})',
  native: '<FlowUIProvider initialMode="light">\n  <App />\n</FlowUIProvider>',
};
