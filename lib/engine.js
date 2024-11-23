// Other Libs
const event = require('events');

// Lib Files
const { AddonLoader } = require("./addon/loader");
const { Parser } = require("./engine/parser");
const { Input } = require("./input/input");
const { Output } = require("./output/output");
const Convert = require("./convert");

// JSON Files
const Config = require("./config.json");

// Built-in Addons
const { DictLoader } = require("./dictionary/loader");
const { MacroLoader } = require("./macro/loader");

// Built-in Macros
const { Emoji } = require("./macro/emoji");
const { System } = require("./macro/system");

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
        this.dictionaries = await this.addons.load(DictLoader, [this, MacroLoader]);
        //this.macros = this.dictionaries.macros;

        //this.macros.load(Emoji, []);
        //this.macros.load(System, []);

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
};

// Fix the async issues
var Kestrel = async () => {
    var inst = new Engine();
    await inst._init()
    return inst;
};
Kestrel.Convert = Convert;
module.exports = Kestrel;