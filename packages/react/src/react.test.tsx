import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, FlowUIProvider, HC } from "./index";

describe("FlowUI React", () => {
  it("renders components and default responsive classes", () => {
    const html = renderToStaticMarkup(
      <FlowUIProvider>
        <HC width={{ default: "full", md: 600 }}>
          <Button>Save</Button>
        </HC>
      </FlowUIProvider>,
    );
    expect(html).toContain("fui-r-width-default");
    expect(html).toContain("Save");
  });
});
