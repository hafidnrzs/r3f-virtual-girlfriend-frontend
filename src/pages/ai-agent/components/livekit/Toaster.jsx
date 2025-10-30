import React from "react";
import { Toaster as Sonner } from "sonner";
import { WarningIcon } from "@phosphor-icons/react/dist/ssr";

export function Toaster(props) {
  const theme = props.theme || "system";

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-center"
      icons={{
        warning: <WarningIcon weight="bold" />,
      }}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      }}
      {...props}
    />
  );
}
