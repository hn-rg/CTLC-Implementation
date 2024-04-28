pragma solidity ^0.8.0;

contract CTLC {

    address payable party; /* sender */
    address payable counterparty; /* receiver */
    uint[] timelock; /* vector of timelocks -> per subcontract */
    bytes32[][] conditions; /* vector of vector of conditions */
    uint [] status ; /* status of each subCTLC */
    uint funds; /* contract funds */
    uint height; /* pointer to the top subcontract */

    constructor ( 
        address payable _party,
        address payable _counterparty,
        uint[] memory _timelock,
        bytes32[][] memory _conditions
    ) payable {
        party = _party;
        counterparty = _counterparty;
        timelock = _timelock;
        conditions = _conditions;
        status = new uint[](timelock.length);
        for (uint i = 0; i < timelock.length - 1; i++){
            status[i] = 0;
         }
        status[timelock.length - 1] = 1; /* Last subContract is enabled */
        height = 0; /* pointer is set to 0, ensuring that contracts need to be executed starting from first array element */
        funds = msg.value; /* contract funds are the funds transferred upon creation */
    }

    /* function to enable a subcontract */
    function enableSubcontract (uint i) public{
        require(msg.sender == party);
        require(status[i] == 0);
        status[i] = 1; 
    }

    function disableSubcontract (uint i) public {
        require(msg.sender == party);
        require (i == height); 
        require(block.number >= timelock[i]);
        height ++;
    }

    function claim(uint i, bytes [] memory secrets) public { /* TODO: check that contract is top-level */
        require(msg.sender == counterparty); 
        require (i == height); 
        require(status[i] == 1); 
        require(conditions[i].length == secrets.length);  
        for (uint j = 0; j < secrets.length; j++){
            require (keccak256(secrets[j]) == conditions[i][j]);
        }
        counterparty.transfer(address(this).balance); 
    }

    function refund () public { 
        require(msg.sender == party);
        require(height == timelock.length -1); /* the current subcontract is the last one */
        require (block.number >= timelock[height]);
        party.transfer(address(this).balance);
    }

    receive() external payable {}
}

contract TestCTLC {

    /* Set up the three party fully connected graph */
    CTLC ctlc;

    uint delta = 1;
    uint start = 10;

    /* hashlocks */

    bytes32 hashLockCAone = keccak256(bytes("secretCAone"));
    bytes32 hashLockBCtwo = keccak256(bytes("secretBCtwo"));

    bytes32 hashLockBAone = keccak256(bytes("secretBAone"));
    bytes32 hashLockCBtwo = keccak256(bytes("secretCBtwo"));
    bytes32 hashLockBCthree = keccak256(bytes("secretBCthree"));

    address payable party;
    address payable counterparty;  /* We consider the arc from B to C. However, need to set up both party and counterparty to address of TestCTLC contract */

    bytes32[][] conditions = new bytes32[][](2);
    bytes[][] secrets = new bytes[][](2);
    uint[] timelock = new uint[](2);

    constructor () {
        bytes32[] memory conditionTwo = new bytes32[](2);
        conditionTwo[0] = hashLockCAone;
        conditionTwo[1] = hashLockBCtwo;

        bytes32[] memory conditionThree = new bytes32[](3);
        conditionThree[0] = hashLockBAone;
        conditionThree[1] = hashLockCBtwo;
        conditionThree[2] = hashLockBCthree;

        conditions[0] = conditionTwo;
        conditions[1] = conditionThree;

        bytes[] memory secretsTwo = new bytes[] (2);
        secretsTwo[0] = bytes("secretCAone");
        secretsTwo[1] = bytes("secretBCtwo");

        bytes[] memory secretsThree = new bytes[] (3);
        secretsThree[0] = bytes("secretBAone");
        secretsThree[1] = bytes("secretCBtwo");
        secretsThree[2] = bytes("secretBCthree");

        secrets[0] = secretsTwo; 
        secrets[1] = secretsThree;

        timelock[0] = start + 2 * delta;
        timelock[1] = start + 3 * delta;

        party = payable(address(this));
        counterparty = payable(address(this));
    }

    receive() external payable {}

    function transferInitialFunds () public {
        payable(address(ctlc)).transfer(address(this).balance);
    }

    function setUp () public {
        ctlc = new CTLC(party, counterparty, timelock, conditions);
    }

    function enableSubcontract () public { /* enables the first edge */
        ctlc.enableSubcontract(0);
    }

    function claimBestCase () public { /* claims the first edge */
        ctlc.claim(0, secrets[0]); 
    }

    function claimWorstCase() public { // claims the second edge 
        ctlc.disableSubcontract(0); // First, disables the first subCTLC
        ctlc.claim(1, secrets[1]); //Second, claim the second subcontract
    }

    function refundCase() public { // claims the second edge 
        ctlc.disableSubcontract(0); // First, disables the first subCTLC
        ctlc.refund();
    }

}