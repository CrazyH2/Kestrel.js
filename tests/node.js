
import { GlobalKeyboardListener } from "node-global-key-listener";

import { Kestrel } from "../dist/kestrel.js";
import Dictionary from "../assets/dict.json" assert { type: 'json' };;

const app = await Kestrel();

var gkl = new GlobalKeyboardListener();
gkl.addListener((e, down) => {
    if (!e.name.includes("MOUSE")) app.input.fromQwerty(e.state == 'DOWN', e.name);
});

await app.output.onData((data) => {
    console.log(data);
});

await app.dictionaries.load(Dictionary);
