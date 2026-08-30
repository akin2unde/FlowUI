import { provideZonelessChangeDetection } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import { provideFlowUI } from "@akin2unde/flowui-angular";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection(),
    provideFlowUI({
      mode: "system",
      theme: {
        palette: {
          primary: { 500: "#7c3aed", 600: "#6d28d9", 700: "#5b21b6" },
        },
      },
    }),
  ],
}).catch(console.error);
