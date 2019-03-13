pragma solidity ^0.4.17;

contract Lottery {
    address public manager;
    address[] public players;
    
    constructor() public {
        manager = msg.sender;
    }
    
    function enter() public payable{
        require(msg.value > .01 ether); // for this function to be called the one calling (msg) should be paying ether
        players.push(msg.sender);
    }
    
    function random() private view returns(uint){
        return uint(keccak256(block.difficulty, now, players));
    }
    
    function pickAWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(this.balance); // this.balance reffers to all the ether in the current contract 
    
        players = new address[](0);
    } 
    
    modifier restricted(){
        require(msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}