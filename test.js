const { createHash } = require('node:crypto');

function createHashAs64BitHex(input) {
  const hash = createHash('sha256').update(input).digest('hex');
  console.log(hash);
  return hash.substring(0, 16);
}

function generateSourceKeyPiece(input) {
  const hash = createHashAs64BitHex(input);
  return `0x${hash}0000000000000000`;
}

const result = generateSourceKeyPiece('abc');

console.log(result);
