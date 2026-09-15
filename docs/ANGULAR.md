# FlowUI for Angular

The Angular package contains standalone browser components and ships compiled CSS. Tailwind is optional in the Angular application.

## Install

```bash
npm install @akin2unde/flowui-angular @fortawesome/fontawesome-free
```

Add styles in `angular.json`:

```json
{
  "styles": [
    "@fortawesome/fontawesome-free/css/all.min.css",
    "@akin2unde/flowui-angular/styles.css",
    "src/styles.css"
  ]
}
```

## Application entry

`src/main.ts`:

```ts
import { bootstrapApplication } from "@angular/platform-browser";
import { provideFlowUI } from "@akin2unde/flowui-angular";
import { AppComponent } from "./app/app.component";

bootstrapApplication(AppComponent, {
  providers: [provideFlowUI({ mode: "system" })],
}).catch(console.error);
```

## App and first screen

`src/app/app.component.ts`:

```ts
import { Component } from "@angular/core";
import {
  FlowButtonComponent,
  FlowCardComponent,
  FlowInputComponent,
  FlowVCComponent,
} from "@akin2unde/flowui-angular";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    FlowButtonComponent,
    FlowCardComponent,
    FlowInputComponent,
    FlowVCComponent,
  ],
  templateUrl: "./app.component.html",
})
export class AppComponent {
  productName = "";

  save(): void {
    console.log(this.productName);
  }
}
```

`src/app/app.component.html`:

```html
<fui-vc gap="md" padding="lg" [maxWidth]="640" marginX="auto">
  <fui-card>
    <h1>FlowUI Angular</h1>

    <fui-input
      placeholder="Product name"
      [value]="productName"
      (valueChange)="productName = $event"
    />

    <fui-button (pressed)="save()"> Save product </fui-button>
  </fui-card>
</fui-vc>
```

Import only the standalone controls a screen uses so Angular can remove unused code from the final bundle.

See [Component API](COMPONENT-API.md) for the complete browser component reference.
