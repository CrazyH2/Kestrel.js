import Convert from '../convert.js';

class Parser {
    constructor(root) {
        // Private
        this._root = root;
        this._downKeys = [];
        this._chordKeys = [];
        this._allSteno = true;

        // Public

        // Aliases
    };

    onKeyDown(key) {
        this._root.addons._onKeyDown.apply(this._root.addons, [key]);

        // New stroke
        if (this._downKeys.length < 1) {
            this._downKeys = [];
            this._chordKeys = [];
            this._allSteno = true;
        };

        // Push keys
        if(!this._downKeys.includes(key)) this._downKeys.push(key);
        if(!this._chordKeys.includes(key)) this._chordKeys.push(key);

        // Fix issues with key shortcuts
        if (!Convert.stenoToKeyCode[key]) this._allSteno = false;
    };

    onKeyUp(key) {
        this._root.addons._onKeyUp.call(this._root.addons, key);

        // Delete key
        this._downKeys = this._downKeys.filter(e => e !== key);

        // Finish stroke
        if (this._allSteno == true && this._downKeys.length < 1 && this._root.config.arpeggiate == false) {
            var temp = this._chordKeys;
            this._root.output._onChord.call(this._root.output, temp);
            this._root.addons._onChord.call(this._root.addons, temp);
        };
    };

    arpeggiate() {
        // Finish stroke
        if (this._allSteno == true && this._downKeys.length < 2 && this._root.config.arpeggiate == true) {
            var temp = this._chordKeys;
            this._root.output._onChord.call(this._root.output, temp);
            this._root.addons._onChord.call(this._root.addons, temp);
            return true;
        };
        
        return false;
    };
}

export { Parser };