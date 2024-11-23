class AddonBase {
    constructor(output, convert) {
        this.output = output;
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

    async onChord(chord, next) {
        return next();
    };
};

AddonBase.isAddon = true;
module.exports = { AddonBase };