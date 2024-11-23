const flip = (data) => Object.fromEntries(
    Object
      .entries(data)
      .map(([key, value]) => [value, key])
    );
    
const stenoToBinary = flip(require('../assets/binaryToSteno.json'));
const stenoToQwerty = flip(require('../assets/qwertyToSteno.json'));
const stenoToKeyCode = flip(require('../assets/keyCodeToSteno.json'));
const stenoToNumbers = require('../assets/stenoKeyNumbers.json');

const binaryToSteno = require('../assets/binaryToSteno.json');
const qwertyToSteno = require('../assets/qwertyToSteno.json');
const keyCodeToSteno = require('../assets/keyCodeToSteno.json');
const numbersToSteno = flip(require('../assets/stenoKeyNumbers.json'));

module.exports = { stenoToBinary, stenoToQwerty, stenoToKeyCode, stenoToNumbers, binaryToSteno, qwertyToSteno, keyCodeToSteno, numbersToSteno };