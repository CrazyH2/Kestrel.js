// Other Libs
import event from './events/events.js';

// Lib Files
import { AddonLoader } from './addon/loader.js';

import { Parser } from './engine/parser.js';
import { Input } from './input/input.js';
import { Output } from './output/output.js';
import Convert from './convert.js';

// JSON Files
import Config from './config.json' with { type: "json" };

// Built-in Addons
import { DictLoader } from './dictionary/loader.js';
import { MacroLoader } from './macro/loader.js';

class Engine extends event.EventEmitter {
    constructor() {
        super();
    };

    async _init() {
        // Private

        // Public
        this.config = Config;

        this.exited = false;

        this.parser = new Parser(this)
        this.input = new Input(this);
        this.output = new Output(this);

        this.addons = new AddonLoader(this);
        this.dictionaries = null;

        // Aliases
        this.quit = this.exit;
        this.holt = this.pause;
        this.continue = this.resume;

        // Init
        this.macros = new MacroLoader(Convert, this);
        this.dictionaries = await this.addons.load(DictLoader, [this, this.macros]);

        return this;
    };

    exit() {
        this.emit("exit");
        this.exited = true;
        
        delete this.input;
        delete this.output;
        delete this.dictionaries;
        delete this.addons;
    };

    pause() {
        this.config.paused = true;
        this.emit("pause");
    };

    resume() {
        this.config.paused = false;
        this.emit("resume");
    };
}

// Fix the async issues
var Kestrel = async () => {
    var inst = new Engine();
    await inst._init()
    return inst;
};
Kestrel.Convert = Convert;
export { Kestrel };