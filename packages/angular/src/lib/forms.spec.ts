// @vitest-environment jsdom
import "@angular/compiler";
import { Component, provideZonelessChangeDetection } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from "@angular/platform-browser/testing";
import { afterAll, beforeAll, expect, it } from "vitest";
import { FlowInputComponent, FlowPasswordInputComponent } from "./forms";
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
