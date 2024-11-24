const flip = (data) => Object.fromEntries(
    Object
      .entries(data)
      .map(([key, value]) => [value, key])
    );

import stenoToNumbers from '../assets/stenoKeyNumbers.json' with { type: "json" };
import binaryToSteno from '../assets/binaryToSteno.json' with { type: "json" };
import qwertyToSteno from '../assets/qwertyToSteno.json' with { type: "json" };
import keyCodeToSteno from '../assets/keyCodeToSteno.json' with { type: "json" };

export default {
  stenoToBinary: flip(binaryToSteno),
  stenoToQwerty: flip(qwertyToSteno),
  stenoToKeyCode: flip(keyCodeToSteno),
  stenoToNumbers,
  binaryToSteno,
  qwertyToSteno,
  keyCodeToSteno,
  numbersToSteno: flip(stenoToNumbers)
};