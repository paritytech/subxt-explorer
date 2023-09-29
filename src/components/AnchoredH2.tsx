import { JSX } from "solid-js";

export function AnchoredH2({
  title,
  id,
}: {
  title: string;
  id?: string;
}): JSX.Element {
  return (
    <h2 class="mt-12 relative">
      <div class="heading-anchor" id={id ?? title}></div>
      {title}
    </h2>
  );
}
