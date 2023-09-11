import { createSignal } from "solid-js";

export interface AppData{

}


export const [appData, setData] = createSignal<AppData| undefined>(undefined);