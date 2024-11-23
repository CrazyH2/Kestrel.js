class Word {
    constructor(strokes) {
        this.strokes = strokes;

        //this.string = strokes.map(stroke => stroke.toRTFCRE()).join('/');
        //console.log(this.string)
        this.string = '';
        if (this.strokes.length > 0) {
            for (var i = 0; i < this.strokes.length; i++) {
                this.string += this.strokes[i].toRTFCRE() + '/';
            }
            this.string = this.string.slice(0, -1);
        };
    }

    toString() {
        return this.string;
    }

    getStrokes() {
        return this.strokes;
    }

    setStrokes(newStrokes) {
        this.strokes = newStrokes;
        this.string = newStrokes.map(stroke => stroke.toRTFCRE()).join('/');
    }

    addStroke(stroke) {
        this.strokes.push(stroke);
        this.string += '/' + stroke.toRTFCRE();
    }

    removeStroke() {
        this.strokes.pop();
        this.string = this.strokes.map(stroke => stroke.toRTFCRE()).join('/');
    }

    toEnglish = function (dictionary) {
        if (dictionary[this.string]) {
            return dictionary[this.string];
        } else {
            return this.string;
        }
    }
}

module.exports = Word;