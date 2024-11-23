const event = require('events');

class Output extends event.EventEmitter {
    constructor(root) {
        super();

        // Private
        this._root = root;
        this._chordListeners = [];
        this._dataListeners = []; // The full string
        this._modifyListeners = []; // will have a array of actions to do such as [ { action: 'delete', amount: 5 }, { action: 'add', text: "hello" } ]

        // Public
        this.data = "";
        this.modifications = []; // array of  modification listeners data
        this.chords = [];

        // Aliases
        this.chordCallback = this.onChord;
        this.dataCallback = this.onData;
        this.modifyCallback = this.onData;

        this.sendChord = this._onChord;
        this.sendData = this._onData;
        this.sendModify = this._onModify;
    };

    _onChord(chord) {
        this.chords.push(chord);

        this.emit("chord", chord);
        this._root.emit("outputChord", chord);

        this._chordListeners.forEach(listener => listener(chord));
    };

    _onData(data) {
        this.data = data;

        this.emit("data", data);
        this._root.emit("outputData", data);

        this._dataListeners.forEach(listener => listener(data));
    };

    _onModify(diff) {
        this.modifications.push(diff);
        
        this.emit("modify", diff);
        this._root.emit("outputModify", diff);

        this._modifyListeners.forEach(listener => listener(diff));
    };

    onChord(callback) {
        this._chordListeners.push(callback);
    };

    onData(callback) {
        this._dataListeners.push(callback);
    };

    onModify(callback) {
        this._modifyListeners.push(callback);
    };
};

module.exports = { Output };