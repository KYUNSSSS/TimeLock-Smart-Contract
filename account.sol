// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Account {
    enum AccountType { PARENT, CHILD }

    struct User {
        address account;
        string name;
        string email;
        uint age;
        AccountType accountType;
        address parent; // Address of the parent account (for child accounts)
    }

    mapping(address => User) public users;
    mapping(address => address[]) public children; // Mapping from parent to child accounts

    function register(string memory _name, string memory _email, uint _age, address _parent) public {
        require(users[msg.sender].account == address(0), "Account already exists. Please use another address.");
        
        AccountType accountType = _parent == address(0) ? AccountType.PARENT : AccountType.CHILD;
        users[msg.sender] = User(msg.sender, _name, _email, _age, accountType, _parent);
        
        if (_parent != address(0)) {
            require(users[_parent].account != address(0), "Parent account does not exist.");
            children[_parent].push(msg.sender);
        }
    }

    function getProfile() public view returns (User memory) {
        return users[msg.sender];
    }

    function getParent(address _child) public view returns (User memory) {
        address parentAddress = users[_child].parent;
        return users[parentAddress];
    }

    function getChildren(address _parent) public view returns (address[] memory) {
        return children[_parent];
    }

    function modifyProfile(string memory _name, string memory _email, uint _age) public {
        require(users[msg.sender].account != address(0), "Account does not exist");

        users[msg.sender].name = _name;
        users[msg.sender].email = _email;
        users[msg.sender].age = _age;
    }
    function login(address _account) public view returns (bool) {
    return users[_account].account != address(0);
}

    function deleteAccount() public {
        require(users[msg.sender].account != address(0), "Account does not exist");

        address parent = users[msg.sender].parent;
        if (parent != address(0)) {
            address[] storage parentChildren = children[parent];
            for (uint i = 0; i < parentChildren.length; i++) {
                if (parentChildren[i] == msg.sender) {
                    parentChildren[i] = parentChildren[parentChildren.length - 1];
                    parentChildren.pop();
                    break;
                }
            }
        }
        
        delete users[msg.sender];
    }
}
