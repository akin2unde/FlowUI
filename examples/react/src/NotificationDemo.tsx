import { useState } from "react";
import { Button, Notification } from "@akin2unde/flowui-react";

const messages = [
  {
    type: "success",
    title: "Saved successfully",
    body: "Your changes have been saved.",
  },
  { type: "info", title: "Update available", body: "A new version is ready." },
  {
    type: "warning",
    title: "Check required fields",
    body: "Two fields need your attention.",
  },
  {
    type: "error",
    title: "Could not save changes",
    body: "Ticket #1042 changed while you were editing. Reload it and apply your changes again.",
  },
  {
    type: "decision",
    title: "Reassign ticket?",
    body: "Support → Development",
  },
  {
    type: "decision",
    title: "Review required",
    body: "Read the handoff notes before continuing.",
  },
] as const;

export default function NotificationDemo() {
  const [active, setActive] = useState<number | null>(null);
  const [result, setResult] = useState("");
  const message = active === null ? null : messages[active];

  return (
    <>
      <div className="flex flex-wrap gap-2">
        {[
          "Success",
          "Info",
          "Warning",
          "Long error",
          "Decision",
          "Accept only",
        ].map((label, index) => (
          <Button
            key={label}
            variant="outline"
            onClick={() => {
              setActive(index);
              setResult("");
            }}
          >
            {label}
          </Button>
        ))}
      </div>
      {message && (
        <Notification
          key={active}
          title={message.title}
          type={message.type}
          details={
            active === 3 ? (
              <p>
                Conflict detected. The ticket changed after this edit was
                opened.
              </p>
            ) : undefined
          }
          accept={
            message.type === "decision"
              ? {
                  label: active === 4 ? "Reassign" : "Open handoff notes",
                  onClick: async () => {
                    setResult(
                      active === 4
                        ? "Ticket reassigned."
                        : "Handoff notes opened.",
                    );
                  },
                }
              : undefined
          }
          cancel={
            active === 4
              ? {
                  label: "Cancel",
                  onClick: () => setResult("Reassignment cancelled."),
                }
              : undefined
          }
          onClose={() => setActive(null)}
        >
          {active === 4 && <strong>Ticket #1042</strong>}
          <p>{message.body}</p>
        </Notification>
      )}
      <p role="status">{result}</p>
    </>
  );
}
