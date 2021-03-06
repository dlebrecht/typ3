import * as BN from 'bn.js';

export const isBigNumber = (object: object) =>
  object instanceof BN ||
  (object &&
    object.constructor &&
    (object.constructor.name === 'BigNumber' ||
      object.constructor.name === 'BN'));

export const objReduce = (obj, cb) => obj.reduce(cb, {});
