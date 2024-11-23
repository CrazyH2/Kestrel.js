const event = require('events');

const Convert = require("../convert");

class Input extends event.EventEmitter {
    constructor(root) {
        super();
        
        // Private
        this._root = root;

        // Public

        // Aliases
        this.sendSteno = this.fromSteno;
        this.sendQwerty = this.fromQwerty;
        this.sendKeyCode = this.fromKeyCode;
        this.sendBinary = this.fromBinary;

        this.steno = this.fromSteno;
        this.qwerty = this.fromQwerty;
        this.keyCode = this.fromKeyCode;
        this.binary = this.fromBinary;
    };

    fromSteno(down, key) {
        if (!(key in Convert.stenoToQwerty)) {
            this._root.parser[down == true ? "onKeyDown" : "onKeyUp"].call(this._root.parser, key);
            return false
        };

        this._root.parser[down == true ? "onKeyDown" : "onKeyUp"].call(this._root.parser, key);

        return true
    };

    fromQwerty(down, key) {
        if (!(key in Convert.qwertyToSteno)) return this.fromSteno(down, key);

        var converted = Convert.qwertyToSteno[key];
        return this.fromSteno(down, converted);
    };

    fromKeyCode(down, key) {
        if (!(key in Convert.keyCodeToSteno)) return this.fromSteno(down, key);

        var converted = Convert.keyCodeToSteno[key];
        return this.fromSteno(down, converted);
    };

    fromBinary(down, key) {
        if (!(key in Convert.binaryToSteno)) return this.fromSteno(down, key);

        var converted = Convert.binaryToSteno[key];
        return this.fromSteno(down, converted);
    };
};

module.exports = { Input };