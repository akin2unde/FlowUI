import { Component } from "@angular/core";
import {
  FlowButtonComponent,
  FlowNotificationComponent,
} from "@akin2unde/flowui-angular";
import type { NotificationType } from "@akin2unde/flowui-core";

@Component({
  selector: "app-notification-demo",
  standalone: true,
  imports: [FlowButtonComponent, FlowNotificationComponent],
  template: `
    <div class="flex flex-wrap gap-2">
      @for (example of examples; track example.label) {
        <fui-button variant="outline" (pressed)="active = example">{{
          example.label
        }}</fui-button>
      }
    </div>
    <ng-template #conflict
      ><p>
        Conflict detected. The ticket changed after this edit was opened.
      </p></ng-template
    >
    @for (example of active ? [active] : []; track example.label) {
      <fui-notification
        [type]="example.type"
        [title]="example.title"
        [details]="example.type === 'error' ? conflict : undefined"
        [accept]="
          example.type === 'decision'
            ? example.label === 'Decision'
              ? reassign
              : review
            : undefined
        "
        [cancel]="example.label === 'Decision' ? cancel : undefined"
        (closed)="active = undefined"
      >
        @if (example.label === "Decision") {
          <strong>Ticket #1042</strong>
        }
        <p>{{ example.body }}</p>
      </fui-notification>
    }
    <p role="status">{{ result }}</p>
  `,
})
export class NotificationDemoComponent {
  readonly examples = [
    {
      label: "Success",
      type: "success",
      title: "Saved successfully",
      body: "Your changes have been saved.",
    },
    {
      label: "Info",
      type: "info",
      title: "Update available",
      body: "A new version is ready.",
    },
    {
      label: "Warning",
      type: "warning",
      title: "Check required fields",
      body: "Two fields need your attention.",
    },
    {
      label: "Long error",
      type: "error",
      title: "Could not save changes",
      body: "Ticket #1042 changed while you were editing. Reload it and apply your changes again.",
    },
    {
      label: "Decision",
      type: "decision",
      title: "Reassign ticket?",
      body: "Support → Development",
    },
    {
      label: "Accept only",
      type: "decision",
      title: "Review required",
      body: "Read the handoff notes before continuing.",
    },
  ] as const satisfies readonly {
    label: string;
    type: NotificationType;
    title: string;
    body: string;
  }[];
  active?: (typeof this.examples)[number];
  result = "";
  readonly reassign = {
    label: "Reassign",
    onClick: () => {
      this.result = "Ticket reassigned.";
    },
  };
  readonly review = {
    label: "Open handoff notes",
    onClick: () => {
      this.result = "Handoff notes opened.";
    },
  };
  readonly cancel = {
    label: "Cancel",
    onClick: () => {
      this.result = "Reassignment cancelled.";
    },
  };
}
