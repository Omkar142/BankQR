import type { ComponentProps } from "react";
// Ordinary document navigation avoids RSC prefetch requests on the static payment surface.
export default function StaticLink(props: ComponentProps<"a">) {
  return <a {...props} />;
}
