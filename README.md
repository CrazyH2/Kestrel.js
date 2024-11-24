> **NOTE**
>
> This is just a steno engine library and it does NOT work on its own. Please use something else such as Plover or wait for my full steno engine. Huge thanks to the openstenoproject for all their amazing work!

<div align="center">
  <a href="https://github.com/crazyh2">
	 <img src="assets/banner.png" alt="Logo" width="2800" />
  </a>
</div>

<!--<h3 align="center">Kestrel.js</h3>-->
<h4 align="center">A stenography library that anyone can use and contribute to! It's only 7KB as of writing and took 4 days to complete first version. <br>Made By <a href="https://github.com/crazyh2/">CrazyH2</a></h4>
<h4 align="center">Take a look at plover as this wouldn't be possible without them!<br><a href="http://openstenoproject.org/plover/">Plover</a>  |  <a href="https://www.openstenoproject.org/ploverpad/ploverpad.html">Ploverpad</a></h4>

<h2 align="left">Docs</h2>
<a href="">Go to the auto generated docs.. Ask if you're confused as the docs are very basic!</a>

<h2 align="left">Installation</h2>

- Download src code from the repo or go to Releases tab for all the versions.
- Install packages and dependencies.
```sh
npm install
```
- Reference in your code and Kestrel.js will do all the steno engine stuff for you.

<h2 align="left">Production Bundling</h2>
<h3>Just run the code below after installation:</h3>

```sh
npm run build
```

<b>The code should appear in <code>/dist</code> when bundled!</b>

<h2 align="left">Usage</h2>

<h3>NODE:</h3>

```js
const { GlobalKeyboardListener } = require("node-global-key-listener");

const { Kestrel } = require("../lib/engine");
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
```

<h3>WEB:</h3>

```html
<script type="module">
  import { Kestrel } from "../dist/kestrel.js";

  const app = await Kestrel();

  document.addEventListener("keydown", (ev) => {
    app.input.fromQwerty(true, ev.name);
  });

  document.addEventListener("keyup", (ev) => {
    app.input.fromQwerty(false, ev.name);
  });

  await app.output.onData((data) => {
    console.log(data);
    document.querySelector("#content").innerHTML = data;
  });

  var dict = await (await fetch("../assets/dict.json")).json();

  await app.dictionaries.load(dict);
</script>
```

<br>

<h2 align="left">Contributing</h2>
All contributions will be looked at and most likely accepted when I have time to look at them. Please make sure what you contribute actually applies to the project, and if not see if it would work elsewhere. For example <a href="http://openstenoproject.org/plover/">Plover</a>.

<h2 align="left">Dictionaries</h2>
We support most dictionaries that will work with <a href="http://openstenoproject.org/plover/">Plover</a> and other steno engines, so just import one you used to or learn one. Just make sure the file is in the format <a href="https://en.wikipedia.org/wiki/JSON">JSON</a> otherwise the dictionary won't work with Kestrel.js. I personally recommend <a href="http://lapwing.aerick.ca">lapwing thory</a> which you can learn online for free.

<h2 align="left">Making Addons</h2>
Ask for help or look at the source code when your stuck!

Example:
```js
class AddonExample {
    constructor(convert) {
        this.isAddon = true;
        this.convert = convert;
    };

    onLoad() {

    };

    onUnload() {

    };

    onKeyDown(key) {

    };

    onKeyUp(key) {

    };

    async onChord(chord, output, next) {
        return next(); // Skip this addon
    };
};

module.exports = { AddonExample };
```

<h2 align="left">Macros</h2>
Just ask if the code confuses you!

Example:
```js
const MacroExample = {
  name: "base",

  "CAPS-LOCK:ON": () => {
    return "Hello, world!"
  }
}

module.exports = { MacroExample };
```

<br>

<h2 align="left">License</h2>
Distributed under a Custom License. See `LICENSE` for more information.

<h2 align="left">Credits</h2>
<b>- Huge thanks to Openstenoproject an the steno community for allowing this project to exist.<br></b>
<b>- Ploverpad was a huge help in parsing CTE/RTF for steno!</b>
<b>- Main Dev: CrazyH2</b>

<div align="center">
  <a href="https://github.com/crazyh2">
	 <img src="assets/footer.png" alt="Logo" width="2800" />
  </a>
</div>