const event = require('events');

const Chord = require("../engine/chord");
const Word = require("../engine/word");

class DictLoader extends event.EventEmitter {
    constructor(output, convert, root) {
        super()

        this.isdict = true;
        this.convert = convert;
        this.output = output;

        // Private
        this._root = root;
        this._words = [];
        this._dictionary = {};

        // Public
        this.dicts = [];

        // Aliases
        this.reload = this.load;
        this.remove = this.unload;
        this.add = this.load;
    };

    onLoad() {
        console.log("Loading Dictionaries");
    };

    onUnload() {
        console.log("Unloading Dictionaries");
    };

    _generateDictionary(dicts = this.dicts) {
        const mergedDict = {};

        for (let obj of dicts) {
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    mergedDict[key] = obj[key];
                };
            };
        };

        return mergedDict;
    };

    _demetafy(translationString) {
        // TAKEN FROM PLOVERPAD
        // FULL CREDITS

        // Sentence stops
        translationString = translationString.replace(/\s*{(\.|!|\?)}\s*(\w?)/g, function (matchString, punctuationMark, nextLetter) { return punctuationMark + ' ' + nextLetter.toUpperCase(); });

        // Sentence breaks
        translationString = translationString.replace(/\s*{(,|:|;)}\s*/g, function (matchString, punctuationMark) { return punctuationMark + ' '; });

        // Simple suffixes (pure javascript translation from the Python code base)
        translationString = translationString.replace(/(\w*)\s*{(\^ed|\^ing|\^er|\^s)}/g, simpleSuffix);
        function simpleSuffix() {
            var matchString = arguments[0];
            var prevWord = arguments[1];
            var suffix = arguments[2];
            var returnString = '';

            var CONSONANTS = { 'b': true, 'c': true, 'd': true, 'f': true, 'g': true, 'h': true, 'j': true, 'k': true, 'l': true, 'm': true, 'n': true, 'p': true, 'q': true, 'r': true, 's': true, 't': true, 'v': true, 'w': true, 'x': true, 'z': true, 'B': true, 'C': true, 'D': true, 'F': true, 'G': true, 'H': true, 'J': true, 'K': true, 'L': true, 'M': true, 'N': true, 'P': true, 'Q': true, 'R': true, 'S': true, 'T': true, 'V': true, 'W': true, 'X': true, 'Z': true };
            var VOWELS = { 'a': true, 'e': true, 'i': true, 'o': true, 'u': true, 'A': true, 'E': true, 'I': true, 'O': true, 'U': true };
            var W = { 'w': true, 'W': true };
            var Y = { 'y': true, 'Y': true };
            var PLURAL_SPECIAL = { 's': true, 'x': true, 'z': true, 'S': true, 'X': true, 'Z': true };
            var prepForSimpleSuffix = function (wordParam) {
                var numChars = wordParam.length;
                if (numChars < 2) {
                    return wordParam;
                }
                if (numChars >= 3) {
                    thirdToLast = wordParam.slice(-3, -2);
                } else {
                    thirdToLast = '';
                }
                secondToLast = wordParam.slice(-2, -1);
                last = wordParam.slice(-1);
                if (secondToLast in VOWELS || secondToLast in CONSONANTS) {
                    if (last in VOWELS) {
                        if (thirdToLast && (thirdToLast in VOWELS || thirdToLast in CONSONANTS)) {
                            return wordParam.slice(0, -1);
                        }
                    } else if (last in CONSONANTS && !(last in W) && secondToLast in VOWELS && thirdToLast && !(thirdToLast in VOWELS)) {
                        return wordParam + last;
                    } else if (last in Y && secondToLast in CONSONANTS) {
                        return wordParam.slice(0, -1) + 'i';
                    }
                }
                return wordParam;
            }

            if (suffix === '^s') {
                if (prevWord.length < 2) {
                    return prevWord + 's';
                }
                var a = prevWord.slice(-2, -1);
                var b = prevWord.slice(-1);

                if (b in PLURAL_SPECIAL) {
                    return prevWord + 'es';
                } else if (b in Y && a in CONSONANTS) {
                    return prevWord.slice(0, -1) + 'ies';
                }
                return prevWord + 's';
            }
            if (suffix === '^ed') {
                return prepForSimpleSuffix(prevWord) + 'ed';
            }
            if (suffix === '^er') {
                return prepForSimpleSuffix(prevWord) + 'er';
            }
            if (suffix === '^ing') {
                if (prevWord && prevWord.slice(-1) in Y) {
                    return prevWord + 'ing';
                }
                return prepForSimpleSuffix(prevWord) + 'ing';
            }
        }

        // Capitalize
        translationString = translationString.replace(/\s*{-\|}\s*(\w?)/g, function (matchString, nextLetter) { return nextLetter.toUpperCase(); });

        // Glue flag
        translationString = translationString.replace(/(\s*{&[^}]+}\s*)+/g, glue);
        function glue() {
            var testString = '';
            for (i = 0; i < arguments.length; i++) {
                testString += arguments[i] + ', ';
            }
            var matchString = arguments[0];
            matchString = matchString.replace(/\s*{&([^}]+)}\s*/g, function (a, p1) { return p1; });
            return ' ' + matchString + ' ';
        }

        // Attach flag
        translationString = translationString.replace(/\s*{\^([^}]+)\^}\s*/g, function (matchString, attachString) { return attachString; });
        translationString = translationString.replace(/\s*{\^([^}]+)}(\s*)/g, function (matchString, attachString, whitespace) { return attachString + whitespace; });
        translationString = translationString.replace(/(\s*){([^}]+)\^}\s*/g, function (matchString, whitespace, attachString) { return whitespace + attachString; });

        // Key Combinations
        translationString = translationString.replace(/\s*{#Return}\s*/g, '\n');
        translationString = translationString.replace(/\s*{#Tab}\s*/g, '\t');

        return translationString;
    };

    onChord(keys, next) {
        var modifyArr = [];
        const chord = new Chord(keys);

        // Slightly rewritten ploverpad code. Huge credits to openstenoproject for making plover open source.
        if (this._words.length > 0) {
            if (chord.toRTFCRE() !== '*') { // NORMAL KEYS
                const lastWord = this._words[this._words.length - 1];
                const combinedString = lastWord.toString() + '/' + chord.toRTFCRE();
                modifyArr.push({ action: 'delete', amount: lastWord.length + 1 });
                if (this._dictionary[combinedString]) {
                    lastWord.addStroke(chord);
                    modifyArr.push({ action: 'add', text: this._demetafy(chord.toEnglish(this._dictionary) + ' ') });
                } else {
                    var temp = new Word([chord])
                    this._words.push(temp);
                    modifyArr.push({ action: 'add', text: this._demetafy(temp.toEnglish(this._dictionary) + ' ') });
                };
            } else if (chord.toRTFCRE() === '*') { // SPECIAL KEY
                modifyArr.push({ action: 'delete', amount: this._words.length + 1 });
                this._words[this._words.length - 1].removeStroke();
                if (this._words[this._words.length - 1].toString() === '') {
                    this._words.pop();
                };
                modifyArr.push({ action: 'add', text: this._demetafy(this._words[this._words.length - 1].toEnglish(this._dictionary) + ' ') });
            };
        } else { // NEW STROKE
            var temp = new Word([chord]);
            this._words.push(temp);
            modifyArr.push({ action: 'add', text: this._demetafy(temp.toEnglish(this._dictionary) + ' ') });
        };

        const fullSteno = this._words.reduce((acc, word) => acc + word.toEnglish(this._dictionary) + ' ', '');
        this.output._onData(this._demetafy(fullSteno));

        // Handle modify  [ { action: 'delete', amount: 5 }, { action: 'add', text: "hello" } ]
        this.output._onModify(modifyArr);

        return next();
    };

    lookup(phrase) {

    };

    reloadAll() {
        if (this.dicts.length < 1) {
            this.emit("reloadAllFailed");
            this._root.emit("dictionariesReloadFailed");
            return false;
        };

        this.dicts.forEach(dict => this.load(dict, false));
        this._dictionary = this._generateDictionary();
        this.emit("reloadAll", this.dicts);
        this._root.emit("dictionariesReload");
        return true;
    };

    load(dict, genDict = true) {
        if (typeof dict !== 'object') return false;

        this.dicts.push(dict);

        if (genDict == true) this._dictionary = this._generateDictionary();

        if (dict in this.dicts) {
            this.emit("load", dict);
            this._root.emit("dictionaryLoad", dict);

            this.emit("reload", dict);
            this._root.emit("dictionaryReload", dict);

            return dict;
        } else {
            this.emit("loadFailed", dict);
            this._root.emit("dictionaryLoadFailed", dict);

            this.emit("reloadFailed", dict);
            this._root.emit("dictionaryReloadFailed", dict);

            return false;
        };
    };

    unload(dict) {
        if (dict in this.dicts) {
            delete this.dicts[this.dicts.indexOf(dict)];
            return true;
        } else {
            return false;
        };
    };
};

module.exports = { DictLoader };