import { JSX } from "solid-js";
import { Code } from "./Code";

const CODE_EXAMPLE = `use std::mem::transmute;
pub fn main() {
    let i = transmute::<u32,u64>(4);
}
`;

export const DebugComponent = (): JSX.Element => {
  return <></>;
};
