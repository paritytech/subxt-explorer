import type { Component, JSX } from "solid-js";


interface Props{
    children: JSX.Element | JSX.Element[]
}

export const Wrapper : Component<Props> = (props: Props) => {
    return <h1>Hello: These are children: {props.children}</h1>;
}

