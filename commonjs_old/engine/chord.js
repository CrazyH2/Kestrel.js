const Convert = require("../convert");

class Chord {
    constructor(keys) {
        this.keys = keys.reduce(function (result, item, index, array) {
            result[item] = item;
            return result;
        }, {});
    }

    toString() {
        return `${Object.values(this.keys).map(key => key).join(', ')}`;
    }

    getKeys() {
        return this.keys;
    }

    setKeys(newKeys) {
        this.keys = newKeys[0];
    }

    contains(keyParam) {
        return Object.values(this.keys).includes(keyParam);
    }

    toBinary() {
        return Object.values(this.keys).reduce((flags, key) => {
            const keyBinary = Convert.binaryToSteno[key];
            return flags | keyBinary;
        }, 0);
    }

    toRTFCRE() {
        // TAKEN FROM PLOVERPAD
        // FULL CREDITS

        var rtfcre = '';
        for (var i = parseInt('00000000000000000000001', 2); i <= parseInt('10000000000000000000000', 2); i <<= 1) {
            if (this.contains(Convert.binaryToSteno[i]) && Convert.binaryToSteno[i] != '#') {
                if (this.contains('#') && Convert.stenoToNumbers[Convert.binaryToSteno[i]]) {
                    rtfcre += Convert.stenoToNumbers[Convert.binaryToSteno[i]];
                } else {
                    rtfcre += Convert.binaryToSteno[i];
                }
            }
        }
        if (this.contains('A-') || this.contains('O-') || this.contains('-E') || this.contains('-U') || this.contains('*')) {
            return rtfcre.replace(/-/g, '');
        }
        if (rtfcre[0] === '-') {
            return '-' + rtfcre.replace('--', '.').replace(/-/g, '').replace('.', '-');
        } else {
            return rtfcre.replace('--', '.').replace(/-/g, '').replace('.', '-');
        }
    }

    addKey(key) {
        this.keys[key] = key;
    }

    removeKey(key) {
        if (key in this.keys) {
            delete this.keys[key];
        }
    }
}

module.exports = Chord;