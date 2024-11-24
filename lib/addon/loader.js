import event from '../events/events.js';
import Convert from '../convert.js';

class AddonLoader extends event.EventEmitter {
    constructor(root) {
        super();

        // Private
        this._root = root;
        this._addons = {};

        // Public
        this.addons = (() => {
            return Object.values(this._addons);
        })();

        // Aliases
        this.reload = this.load;
        this.remove = this.unload;
        this.add = this.load;
    };

    _onKeyDown(key) {
        Object.values(this._addons).forEach(addon => { if (addon.instance.onKeyDown) addon.instance.onKeyDown(key) });
    };

    _onKeyUp(key) {
        Object.values(this._addons).forEach(addon => { if (addon.instance.onKeyUp) addon.instance.onKeyUp(key) });
    };

    _onChord(chord) {
        const chor = chord;
        const addons = Object.values(this._addons);
        const middlewareQueue = addons.slice(); // Copy the addons array
        const output = this._root.output;

        function next() {
            if (middlewareQueue.length > 0) {
                const currentMiddleware = middlewareQueue.shift();
                currentMiddleware.instance.onChord(chor, next);
                //currentMiddleware.instance.onChord.call(currentMiddleware.instance, [chor, output, next]);
            };
        };

        next();
    };

    reloadAll() {
        if (this._addons.length < 1) {
            this.emit("reloadAllFailed");
            this._root.emit("addonsReloadFailed");
            return false;
        };

        Object.values(this._addons).forEach(addon => this.load(addon.class));
        this.emit("reloadAll", this._addons);
        this._root.emit("addonsReload");
        return true;
    };

    load(addon, args) {
        if (typeof addon !== 'class' && typeof addon !== 'function' && addon.isAddon != true) return false; // a function? somehow

        var addonInstance = new addon(this._root.output, Convert, ...args);

        this._addons[addon.name] = {
            class: addon,
            instance: addonInstance
        };

        if (addon.name in this._addons) {
            this._addons[addon.name].instance.onLoad();

            this.emit("load", this._addons[addon.name]);
            this._root.emit("addonLoad", this._addons[addon.name]);

            this.emit("reload", this._addons[addon.name]);
            this._root.emit("addonReload", this._addons[addon.name]);

            return this._addons[addon.name].instance;
        } else {
            this.emit("loadFailed", addon);
            this._root.emit("addonLoadFailed", addon);

            this.emit("reloadFailed", addon);
            this._root.emit("addonReloadFailed", addon);

            return false;
        };
    };

    unload(addon) {
        if (addon.name in this._addons) {
            this._addons[addon.name].instance.onUnload();
            delete this._addons[addon.name];
            return true;
        } else {
            return false;
        };
    };
}

export { AddonLoader };