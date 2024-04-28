pragma solidity ^0.8.0;
import "./ECDSA.sol";

contract Swap {

    // struct Path {
    //     address [] users;
    // }

    address[] arcs_left; /* left users of arcs */
    address[] arcs_right; /* right users of arcs */
    /* Needed to be implemented as two separate arrays instead of one over a struct due to Solidity Compiler restrictions */
    address[] leaders ; /* leaders */
    address payable party; /* sender */
    address payable counterparty; /* receiver */
    uint[] timelock; /* vector of timelocks -> need to be checked with respect to a protocol start time, delta, and diameter of the graph */
    bytes32[] hashlock; /* vector of haslocks */
    bool[] unlocked; /* which hashlocks unlocked? */

    /* Note Users will need to perform sanity checks (e.g., that timelocks and hashlocks are correctly set and that the graph information is consistent with the digraph to be implemented */

    /* constructor */

    constructor (
        /* Arc[] memory _arcs, */
        address[] memory _arcs_left,
        address[] memory _arcs_right,
        address[] memory _leaders,
        address payable _party,
        address payable _counterparty,
        uint[] memory _timelock,
        bytes32[] memory _hashlock
        ) payable
        {
         /* arcs = _arcs; */
         arcs_left = _arcs_left;
         arcs_right = _arcs_right;
         leaders = _leaders;
         party = _party;
         counterparty = _counterparty;
         timelock = _timelock;
         hashlock = _hashlock;
         unlocked = new bool[](timelock.length);

        unlocked = new bool[](timelock.length);
         for (uint i = 0; i < timelock.length; i++){
            unlocked[i] = false;
         }

    }


/* checks whether path is a path from startuser to enduser in the digraph */
    function isPath(address[] memory path, address startuser, address enduser) view  private returns (bool) {
        if (path[0] != startuser || path[path.length -1] != enduser){ /* check whether path starts in startuser and ends in end user) */
            return false;
        }
        for (uint i = 0; i < path.length - 1; i++){  /* For all pairs on the path */
            bool inArc = false;
            for (uint j = 0; j < arcs_left.length; j++){
                if (arcs_left[j] == path[i] && arcs_right[j] == path[i+1]){
                    inArc = true;
                    break; /* If there is a corresponding edge continue with outer loop */
                }
            }
            if (!inArc){ /* if no arc was found, return false */
                return false; 
            }
        }
        return true;
    }

/* Verifies a single signaturel uses functions from the OpenZeppellin library */
     function verifySig(
        bytes32 messageHash,
        bytes memory signature,
        address verifyingAddress
    ) public returns (bool) {
        /* 
        bytes32 signedMessageHash = messageHash.toEthSignedMessageHash();
        return (signedMessageHash.recover(signature) == verifyingAddress); */
        //bytes32 testHash = keccak256(abi.encodePacked(message));
        address recoveredAddress = ECDSA.recover(messageHash, signature);
        return (recoveredAddress == verifyingAddress);
    }



/* Verifies whether sigs constitute nested signatures of s along the path verifySig(H(s), sigs[k], path.users[k]) && ... &&  verifySig (H(sigs[1]), sigs[0], path.users[0])   */
    function verifySigs(bytes[] memory sigs, bytes memory seed, address[] memory path) public returns (bool){
        
        
        
        bytes32 sigHash = keccak256(abi.encodePacked(seed));
        for (uint i = 0; i < path.length; i++){
            if (!verifySig(sigHash, sigs[i], path[i])){
                return false;
            }
            sigHash = keccak256(abi.encodePacked(sigs[i])); 
        }

        return true;
    }

    function unlock (uint i, bytes memory seed, address[] memory path, bytes[] memory sigs) public { 
        require (msg.sender == counterparty );
        if (    (block.number < timelock[i]) && 
                (hashlock[i] == keccak256(abi.encodePacked(seed))) &&
                (isPath(path, leaders[i], counterparty) || counterparty == leaders[i]) &&
                (verifySigs(sigs, seed, path))
        ){
            unlocked[i] = true;
        }

        require(unlocked[i] == true);
    }

    function refund () public {
        require (msg.sender == party ); /* only from party */ 
        for (uint i = 0; i < hashlock.length; i++){
            if (unlocked[i] == false && timelock[i] <= block.number){ /* if any hashlock is unlocked and timed out */
                party.transfer(address(this).balance);
                return; 
            }
        }
    }

    function claim () public {
        require (msg.sender == counterparty ); /* only from counterparty */ 
        for (uint i = 0; i < hashlock.length; i++){
            if (!unlocked[i]){
                return; /* if there is a locked hashlock; nothing happens*/
            }
        }
        counterparty.transfer(address(this).balance); /* if every hashlock is unlocked, return */
        return;
    }

    receive() external payable {}
}

