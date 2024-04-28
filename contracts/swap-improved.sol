pragma solidity ^0.8.0;
import "./ECDSA.sol";


contract SwapImproved {

    address payable party; /* sender */
    address payable counterparty; /* receiver */
    bytes32[] hashlock; /* vector of haslocks */
    address[] users; /* users of the swap graph */
    uint start; /* global timeout, based on startime, diameter...*/
    uint delta;
    uint diam;
    uint funds; /* contract funds */



    constructor (
        address payable _party,
        address payable _counterparty,
        bytes32[] memory _hashlock,
        address[] memory _users,
        uint _start,
        uint _delta,
        uint _diam) payable {
            party = _party;
            counterparty = _counterparty;
            hashlock = _hashlock;
            users = _users;
            start = _start;
            delta = _delta;
            diam = _diam;

            funds = msg.value; /* contract funds are the funds transferred upon creation */
    }

    /* Verifies a single signature; uses functions from the OpenZeppellin library */
     function verifySig(
        bytes32 messageHash,
        bytes memory signature,
        address verifyingAddress
    ) private pure returns (bool) {
        /* 
        bytes32 signedMessageHash = messageHash.toEthSignedMessageHash();
        return (signedMessageHash.recover(signature) == verifyingAddress); */
        address recoveredAddress = ECDSA.recover(messageHash, signature);
        return (recoveredAddress == verifyingAddress);
    }

    function claim (uint256 [] memory secrets, bytes[] memory sigs, address[] memory sig_users) public {
        require (msg.sender == counterparty ); /* only from counterparty */ 
        require (block.number < start + (diam + sigs.length + 1) * delta); /* check that number of signatures is in accordance with the round */
        require(users.length == secrets.length); /* check that there are the secrets for all users provided */
        require (sigs.length == sig_users.length);
        for (uint j = 0; j < secrets.length; j++){ /* checks validity of all secrets */
            require (keccak256(abi.encodePacked(secrets[j])) == hashlock[j]);
        }
        for (uint i = 0; i < sigs.length; i ++){
            /* require that user belongs to protocol users */
            bool inUsers = false;
            for (uint j = 0; j < users.length; j++){ /* Question: could we use another data structure for users for a more efficient membership check here? */
                if (sig_users[i] == users[j]){
                    inUsers = true;
                    break;
                }
            }
            require (inUsers);
            for (uint j = 0; j < sigs.length; j++){
                if (i != j){
                    require (sig_users[i] != sig_users[j]); /* check that sig_users are distinct*/
                }
            }
            require (verifySig(keccak256(abi.encodePacked(secrets)), sigs[i], sig_users[i])); /* check that signature verifies */ 
        }
        counterparty.transfer(address(this).balance);
    }

    function refund () public {
        require (msg.sender == party);
        require (block.number > start + (diam + users.length + 1) * delta);
        counterparty.transfer(address(this).balance);
    }

    receive() external payable {}

}