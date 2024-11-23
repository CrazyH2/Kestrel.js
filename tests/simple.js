const { GlobalKeyboardListener } = require("node-global-key-listener");

const Kestrel = require("../lib/engine");
const Dictionary = require("../assets/dict.json");

(async () => {
    const app = await Kestrel();

    var gkl = new GlobalKeyboardListener();
    gkl.addListener((e, down) => {
        if(!e.name.includes("MOUSE")) app.input.fromQwerty(e.state == 'DOWN', e.name);
    });

    await app.output.onData((data) => {
        console.log(data);
    });

    await app.dictionaries.load(Dictionary);
})();