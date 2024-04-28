
const EthCrypto = require("eth-crypto");
const signerIdentityA = EthCrypto.createIdentity();
const signerIdentityB = EthCrypto.createIdentity();
const signerIdentityC = EthCrypto.createIdentity();


//hashLockA
const seedA = 1;
const hashLockA = EthCrypto.hash.keccak256([ { type: "uint256", value: seedA }]);

//hashLockB
const seedB = 2;
const hashLockB = EthCrypto.hash.keccak256([ { type: "uint256", value: seedB }]);

//hashLock C
const seedC = 3;
const hashLockC = EthCrypto.hash.keccak256([ { type: "uint256", value: seedC }]);


const allSecretsHash = EthCrypto.hash.keccak256([ { type: "uint256", value: seedA }, { type: "uint256", value: seedB }, { type: "uint256", value: seedC }]);

const signatureA = EthCrypto.sign(signerIdentityA.privateKey, allSecretsHash);
const signatureB = EthCrypto.sign(signerIdentityB.privateKey, allSecretsHash);
const signatureC = EthCrypto.sign(signerIdentityC.privateKey, allSecretsHash);



console.log(`const partyA = '${signerIdentityA.address}';`);
console.log(`const partyB = '${signerIdentityB.address}';`);
console.log(`const partyC = '${signerIdentityC.address}';`);
console.log(`const partyAsk = '${signerIdentityA.privateKey}';`);
console.log(`const partyBsk = '${signerIdentityB.privateKey}';`);
console.log(`const partyCsk = '${signerIdentityC.privateKey}';`);

console.log(`const seedA = '${seedA}';`);
console.log(`const seedB = '${seedB}';`);
console.log(`const seedC = '${seedC}';`);

console.log(`const hashlockA = '${hashLockA}';`);
console.log(`const hashlockB = '${hashLockB}';`);
console.log(`const hashlockC = '${hashLockC}';`);

console.log(`const allSecretsHash = '${allSecretsHash}';`);

console.log(`const signatureA = '${signatureA}';`);
console.log(`const signatureB = '${signatureB}';`);
console.log(`const signatureC = '${signatureC}';`);