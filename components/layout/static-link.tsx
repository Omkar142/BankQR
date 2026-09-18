import type { ComponentProps } from "react";
import { withBasePath } from "@/lib/base-path";
// Ordinary document navigation avoids RSC prefetch requests on the static payment surface.
export default function StaticLink(props: ComponentProps<"a">) {
  const href = typeof props.href === "string" ? withBasePath(props.href) : props.href;
  return <a {...props} href={href} />;
}
