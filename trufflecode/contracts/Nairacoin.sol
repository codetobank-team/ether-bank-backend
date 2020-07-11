pragma solidity 0.5.8;

/**
 * @title SafeMath
 *
 * @dev Math operations with safety checks that throw on error
 */
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b < a); // assert(b <= a);
        return a - b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // assert(b > 0); // Solidity automatically throws when dividing by 0
        uint256 c = a / b;
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold
        return c;
    }
}

/**
 * @title Ownable
 *
 * @dev The Ownable contract has an owner address, and provides basic authorization
 * control functions which enables it to be transferrable. This simplifies the
 * implementation of the "user permissions".
 */
contract Ownable {
    address public owner;

    // The Ownable constructor sets the original `owner` of the contract.
    constructor() public {
        owner = msg.sender;
    }

    // Throws if called by any account other than the owner.
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
     * @dev Allows the current owner to transfer control of the contract to a newOwner.
     *
     * @param newOwner The address which the ownership is to be transfer to.
     */
    function transferOwnership(address newOwner) public onlyOwner {
        if (newOwner != address(0)) {
            owner = newOwner;
        }
    }
}

/**
 * @title Pausable
 *
 * @dev A contract which is used as a mechanism to allow/implementation emergency stop.
 */
contract Pausable is Ownable {
    event Pause();
    event Unpause();

    bool public paused = false;

    // Modifier to make a function callable only when the contract is not paused.
    modifier whenNotPaused() {
        require(!paused);
        _;
    }

    // Modifier to make a function callable only when the contract is paused.
    modifier whenPaused() {
        require(paused);
        _;
    }

    // Called by the owner to pause and trigger stopped state.
    function pause() public onlyOwner whenNotPaused {
        paused = true;
        emit Pause();
    }

    // Called by the owner to unpause and return state to normal.
    function unpause() public onlyOwner whenPaused {
        paused = false;
        emit Unpause();
    }
}

/**
 * @title ERC20Interface
 */
contract ERC20Interface {
    uint256 public _totalSupply;

    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
    event Transfer(address indexed from, address indexed to, uint256 value);

    function totalSupply() public view returns (uint256);

    function balanceOf(address who) public view returns (uint256);

    function transfer(address to, uint256 value) public returns (bool success);

    function transferFrom(
        address from,
        address to,
        uint256 value
    ) public returns (bool success);

    function approve(address spender, uint256 value)
        public
        returns (bool success);

    function allowance(address owner, address spender)
        public
        view
        returns (uint256);
}

/**
 * @title StandardToken
 *
 * @dev Implementation of the Standard ERC20 token interface.
 */
contract StandardToken is Ownable, ERC20Interface {
    using SafeMath for uint256;

    uint256 public constant MAX_UINT = 2**256 - 1;

    mapping(address => uint256) public balances;
    mapping(address => mapping(address => uint256)) public allowed;

    // Variables for setting transaction fees if it ever becames necessary
    uint256 public basisPointsRate = 0;
    uint256 public maximumFee = 0;

    // A fix for the ERC20 short address attack.
    modifier onlyPayloadSize(uint256 size) {
        require(!(msg.data.length < size + 4));
        _;
    }

    /**
     * @dev transfer token for a specified address
     *
     * @param _to The address to transfer to.
     * @param _value The amount to be transferred.
     */
    function transfer(address _to, uint256 _value)
        public
        onlyPayloadSize(2 * 32)
        returns (bool success)
    {
        uint256 fee = (_value.mul(basisPointsRate)).div(10000);
        if (fee > maximumFee) {
            fee = maximumFee;
        }
        uint256 sendAmount = _value.sub(fee);
        balances[msg.sender] = balances[msg.sender].sub(_value);
        balances[_to] = balances[_to].add(sendAmount);
        if (fee > 0) {
            balances[owner] = balances[owner].add(fee);
            emit Transfer(msg.sender, owner, fee);
        }
        emit Transfer(msg.sender, _to, sendAmount);

        return true;
    }

    /**
     * @dev Transfer tokens from one address to another
     *
     * @param _from address The address which you want to send tokens from
     * @param _to address The address which you want to transfer to
     * @param _value uint the amount of tokens to be transferred
     */
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public onlyPayloadSize(3 * 32) returns (bool success) {
        uint256 _allowance = allowed[_from][msg.sender];

        // Check is not needed because sub(_allowance, _value) will already throw if this condition is not met
        // if (_value > _allowance) throw;

        uint256 fee = (_value.mul(basisPointsRate)).div(10000);
        if (fee > maximumFee) {
            fee = maximumFee;
        }
        if (_allowance < MAX_UINT) {
            allowed[_from][msg.sender] = _allowance.sub(_value);
        }
        uint256 sendAmount = _value.sub(fee);
        balances[_from] = balances[_from].sub(_value);
        balances[_to] = balances[_to].add(sendAmount);
        if (fee > 0) {
            balances[owner] = balances[owner].add(fee);
            emit Transfer(_from, owner, fee);
        }
        emit Transfer(_from, _to, sendAmount);
        return true;
    }

    /**
     * @dev Approve the passed address to spend a specified amount of tokens on behalf of msg.sender.
     *
     * @param _spender The address which will spend the funds.
     * @param _value The amount of tokens to be spent.
     */
    function approve(address _spender, uint256 _value)
        public
        onlyPayloadSize(2 * 32)
        returns (bool success)
    {
        // To change the approve amount you first have to reduce the addresses
        // allowance to zero by calling `approve(_spender, 0)` if it is not already 0.
        require(!((_value != 0) && (allowed[msg.sender][_spender] != 0)));

        allowed[msg.sender][_spender] = _value;

        emit Approval(msg.sender, _spender, _value);

        return true;
    }

    /**
     * @dev Gets the balance of an address.
     *
     * @param _owner The address to query the the balance.
     * @return An uint representing the amount owned by the above address.
     */
    function balanceOf(address _owner) public view returns (uint256 balance) {
        return balances[_owner];
    }

    /**
     * @dev Function to check the amount the owner allowed to a spender.
     *
     * @param _owner The address which owns the funds.
     * @param _spender The address which will spend the funds.
     *
     * @return A uint specifying the amount of tokens still available for the spender.
     */
    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        return allowed[_owner][_spender];
    }
}

/**
 * @title BlackList
 *
 * @dev A contract which is a mechanism to implement the BlackListing bad addresses.
 */
contract BlackList is Ownable, StandardToken {
    mapping(address => bool) public isBlackListed;

    event AddedBlackList(address _user);
    event RemovedBlackList(address _user);
    event DestroyedBlackFunds(address _blackListedUser, uint256 _balance);

    function getOwner() external view returns (address) {
        return owner;
    }

    // Getters to allow the same blacklist to be used also by other contracts
    function getBlackListStatus(address _checkUser)
        external
        view
        returns (bool)
    {
        return isBlackListed[_checkUser];
    }

    // To add a blacklisted address to the contract
    function addBlackList(address _evilUser) public onlyOwner {
        isBlackListed[_evilUser] = true;
        emit AddedBlackList(_evilUser);
    }

    // To remove blacklist address.
    function removeBlackList(address _clearedUser) public onlyOwner {
        isBlackListed[_clearedUser] = false;
        emit RemovedBlackList(_clearedUser);
    }

    function destroyBlackFunds(address _blackListedUser) public onlyOwner {
        require(isBlackListed[_blackListedUser]);
        uint256 dirtyFunds = balanceOf(_blackListedUser);
        balances[_blackListedUser] = 0;
        _totalSupply -= dirtyFunds;
        emit DestroyedBlackFunds(_blackListedUser, dirtyFunds);
    }
}

/**
 * @title UpgradedStandardToken To upgrade this protocol
 *
 * @dev A contract which is a mechanism to allow the implementation Upgrading
 * the token contract. These methods are called by the legacy contract and they
 * must ensure msg.sender to be the contract address.
 */
contract UpgradedStandardToken is StandardToken {
    function transferByLegacy(
        address from,
        address to,
        uint256 value
    ) public returns (bool success);

    function transferFromByLegacy(
        address sender,
        address from,
        address spender,
        uint256 value
    ) public returns (bool success);

    function approveByLegacy(
        address from,
        address spender,
        uint256 value
    ) public returns (bool success);
}

/**
 * @title Nairacoin
 *
 * @dev The main contract implementing the ERC20 Stablecoin.
 */
contract Nairacoin is StandardToken, Pausable, BlackList {
    using SafeMath for uint256;

    string public name;
    string public symbol;
    uint256 public decimals;

    address public upgradedAddress;
    bool public deprecated;

    event Issue(uint256 amount);
    event Redeem(uint256 amount);
    event Deprecate(address newAddress);
    event Params(uint256 feeBasisPoints, uint256 maxFee);

    /** The contract might be initialized with some number of tokens (e.g. 1,000,000).
     *  All initialized and issued tokens are deposited to the owner address.
     *
     * @param _initialSupply    - balance Initial supply of the contract
     *        name              - Name of the Token
     *        symbol            - Symblo of the Token
     *        decimals          - Token decimals
     */
    constructor(uint256 _initialSupply) public {
        name = "Naira";
        symbol = "cNGN";
        decimals = 18;

        _totalSupply = (_initialSupply.mul(10**decimals));

        balances[owner] = _totalSupply;
        deprecated = false;
    }

    // To deprecate this current contract in favour of a new one
    function deprecate(address _upgradedAddress) public onlyOwner {
        deprecated = true;
        upgradedAddress = _upgradedAddress;
        emit Deprecate(_upgradedAddress);
    }

    // Forward ERC20 methods to upgraded contract if this one is deprecated
    function transfer(address _to, uint256 _value)
        public
        whenNotPaused
        returns (bool success)
    {
        require(!isBlackListed[msg.sender]);
        if (deprecated) {
            return
                UpgradedStandardToken(upgradedAddress).transferByLegacy(
                    msg.sender,
                    _to,
                    _value
                );
        } else {
            return super.transfer(_to, _value);
        }
    }

    // Forward ERC20 methods to upgraded contract if this one is deprecated
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public whenNotPaused returns (bool success) {
        require(!isBlackListed[_from]);
        if (deprecated) {
            return
                UpgradedStandardToken(upgradedAddress).transferFromByLegacy(
                    msg.sender,
                    _from,
                    _to,
                    _value
                );
        } else {
            return super.transferFrom(_from, _to, _value);
        }
    }

    // Forward ERC20 methods to upgraded contract if this one is deprecated
    function balanceOf(address who) public view returns (uint256) {
        if (deprecated) {
            return UpgradedStandardToken(upgradedAddress).balanceOf(who);
        } else {
            return super.balanceOf(who);
        }
    }

    // Forward ERC20 methods to upgraded contract if this one is deprecated
    function approve(address _spender, uint256 _value)
        public
        onlyPayloadSize(2 * 32)
        returns (bool success)
    {
        if (deprecated) {
            return
                UpgradedStandardToken(upgradedAddress).approveByLegacy(
                    msg.sender,
                    _spender,
                    _value
                );
        } else {
            return super.approve(_spender, _value);
        }
    }

    // Forward ERC20 methods to upgraded contract if this one is deprecated
    function allowance(address _owner, address _spender)
        public
        view
        returns (uint256 remaining)
    {
        if (deprecated) {
            return StandardToken(upgradedAddress).allowance(_owner, _spender);
        } else {
            return super.allowance(_owner, _spender);
        }
    }

    // deprecate current contract if favour of a new one
    function totalSupply() public view returns (uint256) {
        if (deprecated) {
            return StandardToken(upgradedAddress).totalSupply();
        } else {
            return _totalSupply;
        }
    }

    /** issue - Issue more tokens which are deposited into the owner address
     *
     * @param _amount - Number of tokens to be issued
     */
    function issue(uint256 _amount) public onlyOwner {
        require(_totalSupply + _amount > _totalSupply);
        require(balances[owner] + _amount > balances[owner]);

        balances[owner] += _amount;
        _totalSupply += _amount;
        emit Issue(_amount);
    }

    /** redeem - Redeem tokens are withdrawn from the owner address and
     *  the balance must be enough to cover the redeem or the call will fail.
     *
     *  @param _amount Number of tokens to be issued
     */
    function redeem(uint256 _amount) public onlyOwner {
        require(_totalSupply >= _amount);
        require(balances[owner] >= _amount);

        _totalSupply -= _amount;
        balances[owner] -= _amount;
        emit Redeem(_amount);
    }

    /** setParams - SetParams allow the Owner to set parameters for fees
     *  It ensures transparency by hardcoding limit beyond which fees can never be added
     *
     *  @param newBasisPoints - for a new BasicPoints
     *  @param newMaxFee - to set a new maxFee
     */
    function setParams(uint256 newBasisPoints, uint256 newMaxFee)
        public
        onlyOwner
    {
        require(newBasisPoints < 20);
        require(newMaxFee < 50);

        basisPointsRate = newBasisPoints;
        maximumFee = newMaxFee.mul(10**decimals);

        emit Params(basisPointsRate, maximumFee);
    }
}
