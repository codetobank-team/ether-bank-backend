var Nairacoin = artifacts.require("./Nairacoin.sol");

contract("Nairacoin", function (accounts) {
  var tokenInstance;

  it(" ...initializing the contract with the correct default values", function () {
    return Nairacoin.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.name();
      })
      .then(function (name) {
        assert.equal(name, "Naira", "has the correct name");
        return tokenInstance.symbol();
      })
      .then(function (symbol) {
        assert.equal(symbol, "cNGN", "has the correct symbol");
        return tokenInstance.decimals();
      })
      .then(function (decimals) {
        assert.equal(decimals, 18, "has the correct decimals standard");
      });
  });

  it(" ...allocating an initial supply upon deployment", function () {
    return Nairacoin.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      })
      .then(function (totalSupply) {
        assert.equal(
          web3.utils.fromWei(totalSupply.toString(), "ether"),
          1000000,
          "sets the total supply to 1,000,000"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function (adminBalance) {
        assert.equal(
          web3.utils.fromWei(adminBalance.toString(), "ether"),
          1000000,
          "it allocates the initial supply to the admin account"
        );
      });
  });

  it(" ...transfer(_to, _value): Tranfers token ownership", function () {
    return Nairacoin.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        // Test `require` statement first by transferring something larger than the sender's balance
        return tokenInstance.transfer.call(
          accounts[1],
          99999999999999999999999
        );
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(error.message, "error message must contain revert");
        return tokenInstance.transfer.call(accounts[1], 250000, {
          from: accounts[0],
        });
      })
      .then(function (success) {
        assert.equal(success, true, "it returns true");
        return tokenInstance.transfer(accounts[1], "250000000000000000000000", {
          from: accounts[0],
        });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Transfer",
          'should be the "Transfer" event'
        );
        assert.equal(
          receipt.logs[0].args.from,
          accounts[0],
          "logs the account the tokens are transferred from"
        );
        assert.equal(
          receipt.logs[0].args.to,
          accounts[1],
          "logs the account the tokens are transferred to"
        );
        assert.equal(
          receipt.logs[0].args.value,
          250000000000000000000000,
          "logs the transfer amount"
        );
        return tokenInstance.balanceOf(accounts[1]);
      })
      .then(function (balance) {
        assert.equal(
          balance.toString(),
          250000000000000000000000,
          "adds the amount to the receiving account"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function (balance) {
        // console.log(balance.toString());
        assert.equal(
          balance.toString(),
          750000000000000000000000,
          "deducts the amount from the sending account"
        );
      });
  });

  it(" ...approve(from, to, value): approves tokens for delegated transfer", function () {
    return Nairacoin.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        //   return tokenInstance.approve.call(accounts[1], 100);
        // })
        // .then(function (success) {
        //   assert.equal(success, true, "it returns true");
        return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Approval",
          'should be the "Approval" event'
        );
        assert.equal(
          receipt.logs[0].args.owner,
          accounts[0],
          "logs the account the tokens are authorized by"
        );
        assert.equal(
          receipt.logs[0].args.spender,
          accounts[1],
          "logs the account the tokens are authorized to"
        );
        assert.equal(
          receipt.logs[0].args.value,
          100,
          "logs the transfer amount"
        );
        return tokenInstance.allowance(accounts[0], accounts[1]);
      })
      .then(function (allowance) {
        assert.equal(
          allowance.toNumber(),
          100,
          "stores the allowance for delegated trasnfer"
        );
      });
  });

  it(" ...transferFrom(from, spender, value): handles delegated token transfers", function () {
    return (
      Nairacoin.deployed()
        .then(function (instance) {
          tokenInstance = instance;
          fromAccount = accounts[2];
          toAccount = accounts[3];
          spendingAccount = accounts[4];

          // Transfer some cNGN to fromAccount         =>  fromAccount = 100cNGN
          return tokenInstance.transfer(fromAccount, "100000000000000000000", {
            from: accounts[0],
          });
        })
        .then(function () {
          //spendongAccount to spend 10cNGN of fromAccount
          // Approve spendingAccount to spend 10cNGN form fromAccount
          return tokenInstance.approve(
            spendingAccount,
            "10000000000000000000", //10cNGN
            {
              from: fromAccount,
            }
          );
        })
        .then(function () {
          // Try transferring something larger than the balance of fromAccount
          return tokenInstance.transferFrom(
            fromAccount,
            toAccount,
            "9999000000000000000000", //9999cNGN
            {
              from: spendingAccount,
            }
          );
        })
        .then(assert.fail)
        .catch(function (error) {
          assert(error.message, "cannot transfer value larger than balance");

          // Try to transfer something larger than the approved amount
          return tokenInstance.transferFrom(
            fromAccount,
            toAccount,
            "20000000000000000000", // 20cNGN
            {
              from: spendingAccount,
            }
          );
        })
        .then(assert.fail)
        .catch(function (error) {
          assert(
            error.message,
            "cannot transfer value larger than approved amount"
          );

          // 'Calling' the transferFrom function to see if it works
          return tokenInstance.transferFrom.call(
            fromAccount,
            toAccount,
            "1000000000000000000", //1cNGN
            {
              from: spendingAccount,
            }
          );
        })

        // An actual call to the transferFrom function
        .then(function (success) {
          assert.equal(success, true);
          return tokenInstance.transferFrom(
            fromAccount,
            toAccount,
            "1000000000000000000", //1cNGN
            {
              from: spendingAccount,
            }
          );
        })

        // Get the event log and check the returned data
        .then(function (receipt) {
          assert.equal(receipt.logs.length, 1, "triggers one event");
          assert.equal(
            receipt.logs[0].event,
            "Transfer",
            'should be the "Transfer" event'
          );
          assert.equal(
            receipt.logs[0].args.from,
            fromAccount,
            "logs the account the tokens are transferred from"
          );
          assert.equal(
            receipt.logs[0].args.to,
            toAccount,
            "logs the account the tokens are transferred to"
          );
          assert.equal(
            receipt.logs[0].args.value,
            "1000000000000000000", //1cNGN
            "logs the transfer amount"
          );
          return tokenInstance.balanceOf(fromAccount);
        })
        .then(function (balance) {
          assert.equal(
            balance.toString(),
            "99000000000000000000", //99cNGN
            "deducts the amount from the sending account"
          );
          return tokenInstance.balanceOf(toAccount);
        })
        .then(function (balance) {
          assert.equal(
            balance.toString(),
            "1000000000000000000", //1cNGNG
            "adds the amount from the receiving account"
          );
          return tokenInstance.allowance(fromAccount, spendingAccount);
        })
        .then(function (allowance) {
          assert.equal(
            allowance.toString(),
            9000000000000000000, //9cNGN
            "deducts the amount from the allowance"
          );
        })
    );
  });
});
