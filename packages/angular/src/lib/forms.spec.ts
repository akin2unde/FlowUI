// @vitest-environment jsdom
import "@angular/compiler";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";
import { afterAll, beforeAll, expect, it } from "vitest";
import {
  FlowInputComponent,
  FlowPasswordInputComponent,
  FlowDropdownComponent,
} from "./forms";
import { FlowButtonComponent } from "./actions";
import { FlowLabelComponent } from "./primitives";

@Component({
  imports: [FlowInputComponent, FlowPasswordInputComponent, FlowLabelComponent],
  template: `
    <fui-label htmlFor="email">Email</fui-label>
    <fui-input id="email" type="email" autoComplete="username" />
    <fui-label htmlFor="password">Password</fui-label>
    <fui-password-input id="password" autoComplete="current-password" />
  `,
})
class LoginFieldsComponent {}

beforeAll(() => {
  TestBed.initTestEnvironment(BrowserTestingModule, platformBrowserTesting());
});

afterAll(() => {
  TestBed.resetTestEnvironment();
});

it("binds labels and autocomplete to the native login inputs", () => {
  TestBed.configureTestingModule({
    providers: [provideZonelessChangeDetection()],
  });
  const fixture = TestBed.createComponent(LoginFieldsComponent);
  fixture.detectChanges();

  const host: HTMLElement = fixture.nativeElement;
  for (const [id, hint] of [
    ["email", "username"],
    ["password", "current-password"],
  ]) {
    const input = host.querySelector<HTMLInputElement>(`input#${id}`);
    const label = host.querySelector<HTMLLabelElement>(`label[for="${id}"]`);
    expect(host.querySelectorAll(`#${id}`)).toHaveLength(1);
    expect(input?.getAttribute("autocomplete")).toBe(hint);
    expect(label?.control).toBe(input);
  }

  const toggle = host.querySelector<HTMLButtonElement>(
    "fui-password-input button",
  );
  toggle?.click();
  fixture.detectChanges();
  expect(host.querySelector("input#password")?.getAttribute("type")).toBe(
    "text",
  );
  expect(toggle?.getAttribute("aria-label")).toBe("Hide password");
});

@Component({
  imports: [FlowInputComponent, FlowPasswordInputComponent],
  template: `<fui-input
      id="quantity"
      type="number"
      [min]="1"
      [max]="10"
      [step]="2"
      [maxLength]="5"
      ariaLabel="Quantity"
      [nativeAttributes]="{ 'data-owner': 'finance' }"
    />
    <fui-password-input
      id="secret"
      [minLength]="4"
      [maxLength]="30"
      ariaLabel="Secret"
    />`,
})
class EnhancedFieldsComponent {}

it("applies numeric bounds, text constraints and native attributes to Angular fields", async () => {
  const fixture = TestBed.createComponent(EnhancedFieldsComponent);
  fixture.detectChanges();
  await fixture.whenStable();
  const input = fixture.nativeElement.querySelector(
    "input#quantity",
  ) as HTMLInputElement;
  expect(input.min).toBe("1");
  expect(input.max).toBe("10");
  expect(input.step).toBe("2");
  expect(input.getAttribute("aria-label")).toBe("Quantity");
  expect(input.getAttribute("data-owner")).toBe("finance");
  const secret = fixture.nativeElement.querySelector(
    "input#secret",
  ) as HTMLInputElement;
  expect(secret.minLength).toBe(4);
  expect(secret.maxLength).toBe(30);
  expect(secret.getAttribute("aria-label")).toBe("Secret");
  fixture.destroy();
});

@Component({
  imports: [FlowDropdownComponent, FlowButtonComponent],
  template: `<fui-button text="Save changes" /><fui-dropdown
      id="department"
      name="department"
      [required]="true"
      [options]="options"
      [nativeAttributes]="{ 'aria-label': 'Department' }"
    />`,
})
class SelectionFieldsComponent {
  options = [
    { value: "disabled", display: "Disabled", disabled: true },
    { value: "SUP", display: "Support" },
  ];
}

it("renders Angular button text and focuses/selects enabled dropdown options using the keyboard", async () => {
  const fixture = TestBed.createComponent(SelectionFieldsComponent);
  document.body.append(fixture.nativeElement);
  fixture.detectChanges();
  await fixture.whenStable();
  const host = fixture.nativeElement as HTMLElement;
  expect(host.querySelector("fui-button button")?.textContent).toContain(
    "Save changes",
  );
  const trigger = host.querySelector<HTMLButtonElement>(".fui-select-trigger")!;
  expect(host.querySelectorAll("#department")).toHaveLength(1);
  expect(trigger.getAttribute("aria-label")).toBe("Department");
  const select = host.querySelector("select")!;
  expect(select.required).toBe(true);
  expect(select.checkValidity()).toBe(false);
  trigger.focus();
  trigger.dispatchEvent(
    new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true }),
  );
  fixture.detectChanges();
  await new Promise((resolve) => setTimeout(resolve, 0));
  const option = document.activeElement as HTMLButtonElement;
  expect(option.textContent).toContain("Support");
  option.click();
  fixture.detectChanges();
  expect(trigger.textContent).toContain("Support");
  expect(document.activeElement).toBe(trigger);
  fixture.destroy();
  host.remove();
});
