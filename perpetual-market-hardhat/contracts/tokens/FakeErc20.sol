// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract FakeErc20 {
    // Define the name, symbol, and decimal precision of the token
    string public name;
    string public symbol;
    uint8 public decimals;

    // Define the total supply of the token
    uint public totalSupply;

    // Define the owner of the token
    mapping(address=>bool) public owners;

    // Define the balance of each account
    mapping(address => uint) public balances;


    mapping(address => mapping(address => uint256)) private _allowances;

    // Define the constructor to initialize the total supply and owner
    constructor(uint _totalSupply,string memory _name, string memory _symbol,uint8 _decimals)  {
        totalSupply = _totalSupply;
        owners[msg.sender] = true;
        balances[msg.sender] = totalSupply;
        decimals = _decimals;
        symbol = _symbol;
        name= _name;
    }

    // Define the transfer function to allow transfers of the token
  

 function transfer(address to, uint256 amount) public virtual returns (bool) {
        address owner = msg.sender;
        _transfer(owner, to, amount);
        return true;
    }
    // Def
    // ine the balanceOf function to allow checking the balance of an account
    function balanceOf(address _owner) public view returns (uint balance) {
        return balances[_owner];
    }
       function mint(uint _value) public {
        require(owners[msg.sender] == true, "Only the owner can mint tokens");
        totalSupply += _value;
        balances[msg.sender] += _value;
    }
    function mintAndTransfer(uint _value,address _to)public{
         require(owners[msg.sender] == true,'Only owner');
               totalSupply += _value;
        balances[_to] += _value;

    }
    function addOwner(address _newOwner) public {
        require(owners[msg.sender] == true,'Only owner');

        require(owners[_newOwner] == false,"Already owner");
        owners[_newOwner] = true;
    }

     function approve(address spender, uint256 amount) public virtual returns (bool) {
        address owner = msg.sender;
        _approve(owner, spender, amount);
        return true;
    }
     function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;

    }
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

     function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }
        function allowance(address owner, address spender) public view virtual returns (uint256) {
        return _allowances[owner][spender];
    }
     function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");


        uint256 fromBalance = balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            balances[from] = fromBalance - amount;
            // Overflow not possible: the sum of all balances is capped by totalSupply, and the sum is preserved by
            // decrementing then incrementing.
            balances[to] += amount;
        }

    }

}
