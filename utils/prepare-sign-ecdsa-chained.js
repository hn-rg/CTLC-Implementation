/*const EthCrypto = require("eth-crypto");
const signerIdentity = EthCrypto.createIdentity();
const hashMessage = EthCrypto.hash.keccak256([ { type: "bytes", value: "0xfd06d0c8823932cd41fbacc62e727cf056142c6d9469080aaab887ac13febfed47d74f3b811a71975a04c45a6596c7a671f56fdf73508db8a44e75c0c20e01511c" }]);
const signature = EthCrypto.sign(signerIdentity.privateKey, hashMessage);
console.log(`hashMessage: ${hashMessage}`);
console.log(`signature: ${signature}`);
console.log(`signer public key: ${signerIdentity.address}`);
console.log(`signer private key: ${signerIdentity.privateKey}`);
*/

// const signerIdentitytwo = EthCrypto.createIdentity();
// const messagetwo = EthCrypto.hash.keccak256([
// {type: "string", value: `${signature}`}
// ]);
// const signaturetwo = EthCrypto.sign(signerIdentitytwo.privateKey, messagetwo);
// console.log(`message2: ${messagetwo}`);
// console.log(`signature2: ${signaturetwo}`);
// console.log(`signer public key two: ${signerIdentitytwo.address}`);

const EthCrypto = require("eth-crypto");
const signerIdentityA = EthCrypto.createIdentity();
const signerIdentityB = EthCrypto.createIdentity();
const signerIdentityC = EthCrypto.createIdentity();


//Lock CA
const SeedCA = '0xfd06d0c8823932cd41fbacc62e727cf056142c6d9469080aaab887ac13febfed47d74f3b811a71975a04c45a6596c7a671f56fdf73508db8a44e75c0c20e01511c';
const hashMessageCAZero = EthCrypto.hash.keccak256([ { type: "bytes", value: SeedCA }]);
const signatureCAZero = EthCrypto.sign(signerIdentityA.privateKey, hashMessageCAZero);
const hashMessageCAOne = EthCrypto.hash.keccak256([ { type: "bytes", value: signatureCAZero }]);
const signatureCAOne = EthCrypto.sign(signerIdentityC.privateKey, hashMessageCAOne);


//Lock CBA
const SeedCBA = '0xe4fbfb656ed8300fd5ffbe1714a83a6034ad7e1e370564de3e2d04d97b2453783a42ad698d6ff4eecc06197f312459b12638fba95cb6dc119acdcdb322f676aa1c';
const hashMessageCBAZero = EthCrypto.hash.keccak256([ { type: "bytes", value: SeedCBA }]);
const signatureCBAZero = EthCrypto.sign(signerIdentityA.privateKey, hashMessageCBAZero);
const hashMessageCBAOne = EthCrypto.hash.keccak256([ { type: "bytes", value: signatureCBAZero }]);
const signatureCBAOne = EthCrypto.sign(signerIdentityB.privateKey, hashMessageCBAOne);
const hashMessageCBATwo = EthCrypto.hash.keccak256([ { type: "bytes", value: signatureCBAOne }]);
const signatureCBATwo = EthCrypto.sign(signerIdentityC.privateKey, hashMessageCBATwo);


//Lock CB
const SeedCB = '0xc0e980cb61f5184197feb588e1f8238f3a7a8595ea7c7060066656b44a09305977a48ee5f38abf3ca3d0f02157e4ab526c9196abbb50efd0442bd93fab3076411b';
const hashMessageCBZero = EthCrypto.hash.keccak256([ { type: "bytes", value: SeedCB }]);
const signatureCBZero = EthCrypto.sign(signerIdentityB.privateKey, hashMessageCBZero);
const hashMessageCBOne = EthCrypto.hash.keccak256([ { type: "bytes", value: signatureCBZero }]);
const signatureCBOne = EthCrypto.sign(signerIdentityC.privateKey, hashMessageCBOne);


//Lock CAB
const SeedCAB = '0x7b7b37fc0195ae79d6b723d8740ee92d48f46bc68a4031e93961614c056135074633d58fb128b475b5f2bf00e583570bce539da28fa6756d43497f7d66ee953e1c';
const hashMessageCABZero = EthCrypto.hash.keccak256([ { type: "bytes", value: SeedCAB }]);
const signatureCABZero = EthCrypto.sign(signerIdentityB.privateKey, hashMessageCABZero);
const hashMessageCABOne = EthCrypto.hash.keccak256([ { type: "bytes", value: signatureCABZero }]);
const signatureCABOne = EthCrypto.sign(signerIdentityA.privateKey, hashMessageCABOne);
const hashMessageCABTwo = EthCrypto.hash.keccak256([ { type: "bytes", value: signatureCABOne }]);
const signatureCABTwo = EthCrypto.sign(signerIdentityC.privateKey, hashMessageCABTwo);


console.log(`const partyA = '${signerIdentityA.address}';`);
console.log(`const partyB = '${signerIdentityB.address}';`);
console.log(`const partyC = '${signerIdentityC.address}';`);
console.log(`const partyAsk = '${signerIdentityA.privateKey}';`);
console.log(`const partyBsk = '${signerIdentityB.privateKey}';`);
console.log(`const partyCsk = '${signerIdentityC.privateKey}';`);

console.log(`const seedCA = '${SeedCA}';`);
console.log(`const hashMessageCAZero = '${hashMessageCAZero}';`);
console.log(`const signatureCAZero = '${signatureCAZero}';`);
console.log(`const hashMessageCAOne = '${hashMessageCAOne}';`);
console.log(`const signatureCAOne = '${signatureCAOne}';`);

console.log(`const seedCBA = '${SeedCBA}';`);
console.log(`const hashMessageCBAZero = '${hashMessageCBAZero}';`);
console.log(`const signatureCBAZero = '${signatureCBAZero}';`);
console.log(`const hashMessageCBAOne = '${hashMessageCBAOne}';`);
console.log(`const signatureCBAOne = '${signatureCBAOne}';`);
console.log(`const hashMessageCBATwo = '${hashMessageCBATwo}';`);
console.log(`const signatureCBATwo = '${signatureCBATwo}';`);

console.log(`const seedCB = '${SeedCB}';`);
console.log(`const hashMessageCBZero = '${hashMessageCBZero}';`);
console.log(`const signatureCBZero = '${signatureCBZero}';`);
console.log(`const hashMessageCBOne = '${hashMessageCBOne}';`);
console.log(`const signatureCBOne = '${signatureCBOne}';`);

console.log(`const seedCAB = '${SeedCAB}';`);
console.log(`const hashMessageCABZero = '${hashMessageCABZero}';`);
console.log(`const signatureCABZero = '${signatureCABZero}';`);
console.log(`const hashMessageCABOne = '${hashMessageCABOne}';`);
console.log(`const signatureCABOne = '${signatureCABOne}';`);
console.log(`const hashMessageCABTwo = '${hashMessageCABTwo}';`);
console.log(`const signatureCABTwo = '${signatureCABTwo}';`);