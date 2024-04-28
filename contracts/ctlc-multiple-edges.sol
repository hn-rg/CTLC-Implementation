pragma solidity ^0.8.0;

contract CTLCMultipleEdges {

    address payable party; /* sender */
    address payable counterparty; /* receiver */
    uint[] timelock; /* vector of timelocks -> per subcontract */
    bytes32[][][] conditions; /* vector of vector of vector of conditions */
    uint height; /* pointer to the top subcontract */

    constructor ( 
        address payable _party,
        address payable _counterparty,
        uint[] memory _timelock,
        bytes32[][][] memory _conditions
    ) payable {
        party = _party;
        counterparty = _counterparty;
        timelock = _timelock;
        conditions = _conditions;
        height = 0; /* pointer is set to 0, ensuring that contracts need to be executed starting from first array element */
    }

    function disableSubcontract (uint i) public {
        require(msg.sender == party);
        require (i == height); 
        require(block.number >= timelock[i]);
        height ++;
    }

    function claim(uint i, uint j, bytes [] memory secrets) public { 
        require(msg.sender == counterparty); 
        require (i == height);
        require (secrets.length == conditions[i][j].length);
        for (uint k = 0; k < secrets.length; k++){
            require (keccak256(secrets[k]) == conditions[i][j][k]);
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

