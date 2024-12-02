import event from '../events/events.js';

class MacroLoader extends event.EventEmitter {
    constructor(convert, root) {
        super()
        
        // Private
        this._root = root;
        this._macros = {};
        this._convert = convert;

        // Public
        this.macros = [];

        // Aliases
        this.reload = this.load;
        this.remove = this.unload;
        this.add = this.load;
    };

    checkMarco(marcoSelector) {
        if (marcoSelector.startsWith("{") && marcoSelector.endsWith("}") && `${marcoSelector.slice(1, (marcoSelector.length - 1))}` in Object.values(this._macros)) {
            return this._macros[`${marcoSelector.slice(1, (marcoSelector.length - 1))}`];
        };

        return false;
    };

    reloadAll() {
        if (this.macros.length < 1) {
            this.emit("reloadAllFailed");
            this._root.emit("macrosReloadFailed");
            return false;
        };

        this.macros.forEach(macro => this.load(macro, false));
        this._macros = this._generateMacros();
        this.emit("reloadAll", this.macros);
        this._root.emit("macrosReload");
        return true;
    };

    load(macro, genMacros = true) {
        if (typeof macro !== 'object') return false;

        this.macros.push(macro);

        if (genMacros == true) this._macros = this._generateMacros();

        if (macro in this.macros) {
            this.emit("load", this.macros[this.macros.indexOf(macro)]);
            this._root.emit("macroLoad", this._macros[this.macros.indexOf(macro)]);

            this.emit("reload", this.macros[this.macros.indexOf(macro)]);
            this._root.emit("macroReload", this._macros[this.macros.indexOf(macro)]);

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
        if (macro in this.macros) {
            delete this.macros[this.macros.indexOf(macro)];
            this._macros = this._generateMacros();
            return true;
        } else {
            return false;
        };
    };

    _generateMacros(marcos = this.macros) {
        const mergedMacros = {};

        for (let obj of marcos) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    mergedDict[key] = obj[key];
                };
            };
        };

        return mergedDict;
    };
}

export { MacroLoader };