const ConvertLib = artifacts.require("ConvertLib");
const MetaCoin = artifacts.require("MetaCoin");
const ECDSALib = artifacts.require("ECDSA");
const Swap = artifacts.require("Swap");
const TestCTLC = artifacts.require("TestCTLC");
const SwapImproved = artifacts.require("SwapImproved");
const CTLCOnly = artifacts.require("CTLCOnly");
const CTLCMultipleEdges = artifacts.require("CTLCMultipleEdges");

const EthCrypto = require("eth-crypto");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(ECDSALib);
  deployer.link(ECDSALib, Swap);
  deployer.link(ECDSALib, SwapImproved);
  deployer.deploy(TestCTLC);

// This is the setup for swap
const partyA = '0x95b9B96E37A986383cBc015D125f45d659DCaC2a';
const partyB = "0xA33827471Fb29F9eea599FF4De6958D44F5f0C69";
const partyC = "0x554666Ab3A7d1FC139937C652f0b3F21904087E0";

  const arcs_left = [
    partyA,
    partyA,
    partyB, 
    partyB,
    partyC,
    partyC
  ];

  const arcs_right = [
    partyB,
    partyC,
    partyA, 
    partyC,
    partyA,
    partyB
  ];

  const leaders = [
    partyB, 
    partyA, 
    partyB, 
    partyA
  ];

  const party = partyB; 
  const counterparty = partyC;

  const start = 12;
  const delta = 1;
  const timelocks = [
    start + 3 * delta, 
    start + 4 * delta,
    start + 4 * delta,
    start + 3 * delta,
  ];

  const hashLockCB = EthCrypto.hash.keccak256([ { type: "bytes", value: "0xc0e980cb61f5184197feb588e1f8238f3a7a8595ea7c7060066656b44a09305977a48ee5f38abf3ca3d0f02157e4ab526c9196abbb50efd0442bd93fab3076411b" }]);
  const hashLockCBA = EthCrypto.hash.keccak256([ { type: "bytes", value: "0xe4fbfb656ed8300fd5ffbe1714a83a6034ad7e1e370564de3e2d04d97b2453783a42ad698d6ff4eecc06197f312459b12638fba95cb6dc119acdcdb322f676aa1c" }]);
  const hashLockCA = EthCrypto.hash.keccak256([ { type: "bytes", value: "0xfd06d0c8823932cd41fbacc62e727cf056142c6d9469080aaab887ac13febfed47d74f3b811a71975a04c45a6596c7a671f56fdf73508db8a44e75c0c20e01511c" }]);
  const hashLockCAB = EthCrypto.hash.keccak256([ { type: "bytes", value: "0x7b7b37fc0195ae79d6b723d8740ee92d48f46bc68a4031e93961614c056135074633d58fb128b475b5f2bf00e583570bce539da28fa6756d43497f7d66ee953e1c" }]);
  const hashlocks = [
  hashLockCB,  
  hashLockCBA,
  hashLockCAB,  
  hashLockCA,  
  ];
  deployer.deploy(Swap, arcs_left, arcs_right, leaders, party, counterparty, timelocks, hashlocks);

  //This is the setup for swapimproved

const _partyA = '0x4AcefB5F25CDC9C654Eda1b20E0a81272639B914';
const _partyB = '0x1b6cA9d210f7FEB9360E43347b5918B31E84465C';
const _partyC = '0x606f82b2D0B9126Ea4966Bd888c8Fb598a4dDC63';
const _party = _partyC;
const _counterparty = _partyB;
const _hashlockA = '0xb10e2d527612073b26eecdfd717e6a320cf44b4afac2b0732d9fcbe2b7fa0cf6';
const _hashlockB = '0x405787fa12a823e0f2b7631cc41b3ba8828b3321ca811111fa75cd3aa3bb5ace';
const _hashlockC = '0xc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b';
  const _hashlocks = [_hashlockA, _hashlockB, _hashlockC];
  const _users = [_partyA, _partyB, _partyC];
  const _start = 1;
  const _delta = 1; 
  const _diam = 1;

  deployer.deploy(SwapImproved, _party, _counterparty, _hashlocks, _users, _start, _delta, _diam);

    //This is the setup for ctlc only

const __partyA = '0x4AcefB5F25CDC9C654Eda1b20E0a81272639B914';
const __partyB = '0x1b6cA9d210f7FEB9360E43347b5918B31E84465C';
const __partyC = '0x606f82b2D0B9126Ea4966Bd888c8Fb598a4dDC63';

const secretCAone = "0xc0e980cb61fa";
const secretBCtwo = "0x575a0e1ec0cd";

const secretBAone = "0x0e4c271c323a";
const secretCBtwo = "0x7863b0603954";
const secretBCthree = "0xd297fd40fea7";

const hashLockCAone = EthCrypto.hash.keccak256([ { type: "bytes", value: secretCAone }]);
const hashLockBCtwo = EthCrypto.hash.keccak256([ { type: "bytes", value: secretBCtwo }]);

const hashLockBAone = EthCrypto.hash.keccak256([ { type: "bytes", value: secretBAone }]);
const hashLockCBtwo = EthCrypto.hash.keccak256([ { type: "bytes", value: secretCBtwo }]);
const hashLockBCthree = EthCrypto.hash.keccak256([ { type: "bytes", value: secretBCthree }]);

const __party = __partyC;
const __counterparty = __partyB;

const __start = 1;
const __delta = 1;

const timelockZero = __start + 2 * __delta;
const timelockOne = __start + 3 * __delta;

const __timelocks = [timelockZero, timelockOne];

const conditions = [[hashLockCAone,hashLockBCtwo ],[hashLockBAone, hashLockCBtwo, hashLockBCthree]];


deployer.deploy(CTLCOnly, __party, __counterparty, __timelocks, conditions); 



//This is the setup for ctlc multiple edges (it reuses the variables from CTLCOnly)

const CTLCMEstart = 1;
const CTLCMEdelta = 1;

const CTLCMEtimelockZero = CTLCMEstart + 2 * CTLCMEdelta;
const CTLCMEtimelockOne = CTLCMEstart + 3 * CTLCMEdelta;

const CTLCMEtimelocks = [CTLCMEtimelockZero, CTLCMEtimelockOne];

const CTLCMEconditions = [[[hashLockCAone,hashLockBCtwo ]],[[hashLockBAone, hashLockCBtwo, hashLockBCthree]]];


deployer.deploy(CTLCMultipleEdges, __party, __counterparty, CTLCMEtimelocks, CTLCMEconditions); 

};
