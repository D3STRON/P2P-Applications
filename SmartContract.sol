pragma solidity ^0.4.17;

contract Inbox{
    string public message;
    
    function Inbox (string initialMessage) public
    {
        message = initialMessage;
    }
    
    function setMessage(string newMessage) public
    {
        message = newMessage;
    }
    
    function getMessage() public view returns (string){ //view is used since we are not modifying the data by this function
        return message;
    }
}