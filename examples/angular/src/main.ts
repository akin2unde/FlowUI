import { provideZonelessChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideFlowUI, provideAsyncLabels } from "@akin2unde/flowui-angular";
import { DocsComponent } from "./app/docs.component";
import { demoLookups } from "./app/lookup-demo";
bootstrapApplication(DocsComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideFlowUI({ mode: "light" }),
    provideAsyncLabels({
      scopeKey: "documentation-demo",
      lookups: demoLookups,
    }),
  ],
}).catch(console.error);
