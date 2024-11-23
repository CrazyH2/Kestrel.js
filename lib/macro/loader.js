const event = require('events');

class MacroLoader extends event.EventEmitter {
    constructor(convert, root) {
        super()
        
        // Private
        this.isAddon = true;
        this._root = root;
        this._macros = {};
        this._conert = convert;

        // Public
        this.macros = (() => {
            return Object.values(this._macros);
        })();

        // Aliases
        this.reload = this.load;
        this.remove = this.unload;
        this.add = this.load;
    };

    async onChordValue(macroName, output) {
        Object.values(this._macros).forEach(macro => macro.handlers[macroName](output));
    };

    reloadAll() {
        if (this._macros.length < 1) {
            this.emit("reloadAllFailed");
            this._root.emit("macrosReloadFailed");
            return false;
        };

        Object.values(this._macros).forEach(macro => this.load(macro.handlers));
        this.emit("reloadAll", this._macros);
        this._root.emit("macrosReload");
        return true;
    };

    load(macro) {
        if (macro.ismacro != true || typeof macro !== 'object') return false;

        this._macros[macro.name] = {
            handlers: macro
        };

        if (macro.name in this._macros) {
            this.emit("load", this._macros[macro.name]);
            this._root.emit("macroLoad", this._macros[macro.name]);

            this.emit("reload", this._macros[macro.name]);
            this._root.emit("macroReload", this._macros[macro.name]);

            return macro;
        } else {
            this.emit("loadFailed", macro);
            this._root.emit("macroLoadFailed", macro);

            this.emit("reloadFailed", macro);
            this._root.emit("macroReloadFailed", macro);

            return false;
        };
    };

    unload(macro) {
        if (macro.name in this._macros) {
            delete this._macros[macro.name];
            return true;
        } else {
            return false;
        };
    };
};

module.exports = { MacroLoader };