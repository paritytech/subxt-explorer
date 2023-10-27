import { JSX } from "solid-js";

export function AnchoredH2({
  title,
  id,
  children,
}: {
  title: string;
  id?: string;
  children?: JSX.Element;
}): JSX.Element {
  return (
    <h2 class="mt-12 relative">
      <div class="heading-anchor" id={id ?? title}></div>
      {title}
      {children}
    </h2>
  );
}
