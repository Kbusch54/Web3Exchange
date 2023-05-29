export const LoanPoolAbi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_exchange",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "amm",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "AddDebt",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "tradeId",
          "type": "bytes"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "amm",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "BorrowAmount",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_interestPeriods",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "InterestPeriodsSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_loanInterestRate",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "LoanInterestRateSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_dao",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timeStamp",
          "type": "uint256"
        }
      ],
      "name": "LoanPoolInitialized",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "ammPool",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minLoan",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "maxLoan",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "loanInterestRate",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "loanInterestPeriod",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "mmr",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "minHoldingsReqPercentage",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "tradingFee",
          "type": "uint256"
        }
      ],
      "name": "LoanPoolValues",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_mmr",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "MMRSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_maxLoan",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "MaxLoanSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_minHoldingsReqPercentage",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_maxHoldingsReqPercentage",
          "type": "uint256"
        }
      ],
      "name": "MinAndMaxHoldingsReqPercentageSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_minInterestPeriods",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_maxInterestPeriods",
          "type": "uint256"
        }
      ],
      "name": "MinAndMaxInterestPeriodsSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_minInterestRate",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_maxInterestRate",
          "type": "uint256"
        }
      ],
      "name": "MinAndMaxInterestRateSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_minLoan",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_maxLoan",
          "type": "uint256"
        }
      ],
      "name": "MinAndMaxLoanSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_minMMR",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_maxMMR",
          "type": "uint256"
        }
      ],
      "name": "MinAndMaxMMRSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_minTradingFee",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_maxTradingFee",
          "type": "uint256"
        }
      ],
      "name": "MinAndMaxTradingFeeSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_minHoldingsReqPercentage",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "MinHoldingsReqPercentageSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_minLoan",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "MinLoanSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "internalType": "address",
          "name": "amm",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PayDebt",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "tradeId",
          "type": "bytes"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "lastPayed",
          "type": "uint256"
        }
      ],
      "name": "PayInterest",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "bytes",
          "name": "tradeId",
          "type": "bytes"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "amm",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "RepayLoan",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "_tradingFee",
          "type": "uint256"
        },
        {
          "indexed": true,
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "TradingFeeSet",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "oldTheseus",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "address",
          "name": "newTheseus",
          "type": "address"
        }
      ],
      "name": "UpdateTheseus",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "addDebt",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_tradeId",
          "type": "bytes"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_newLoan",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_tradeCollateral",
          "type": "uint256"
        }
      ],
      "name": "borrow",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "borrowedAmount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "dao",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "debt",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "exchange",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_tradeId",
          "type": "bytes"
        },
        {
          "internalType": "address",
          "name": "_amm",
          "type": "address"
        }
      ],
      "name": "fullRepaymentFailed",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_amm",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_ariadneDao",
          "type": "address"
        }
      ],
      "name": "initializeVamm",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "interestForTrade",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_tradeId",
          "type": "bytes"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "interestOwed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "_totalInterest",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_toPools",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "interestPeriods",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "loanInterestLastPayed",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "loanInterestRate",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxHoldingsReqPercentageLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxInterestPeriodsLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "maxLoan",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxLoanInterestRateLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxLoanLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxMMRLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "maxTradingFeeLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "minHoldingsReqPercentage",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minHoldingsReqPercentageLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minInterestPeriodsLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "minLoan",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minLoanInterestRateLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minLoanLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minMMRLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "minTradingFeeLimit",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "mmr",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_tradeId",
          "type": "bytes"
        }
      ],
      "name": "payInterest",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes",
          "name": "_tradeId",
          "type": "bytes"
        },
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "repayLoan",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_interestPeriods",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "setInterestPeriods",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_loanInterestRate",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "setLoanInterestRate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_mmr",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "setMMR",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_maxLoan",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "setMaxLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minInterestPeriods",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxInterestPeriods",
          "type": "uint256"
        }
      ],
      "name": "setMinAndMaxInterestPeriods",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minInterestRate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxInterestRate",
          "type": "uint256"
        }
      ],
      "name": "setMinAndMaxInterestRate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minLoan",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxLoan",
          "type": "uint256"
        }
      ],
      "name": "setMinAndMaxLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minMMR",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxMMR",
          "type": "uint256"
        }
      ],
      "name": "setMinAndMaxMMR",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minMinHoldingsReqPercentage",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxMinHoldingsReqPercentage",
          "type": "uint256"
        }
      ],
      "name": "setMinAndMaxMinHoldingsReqPercentage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minTradingFee",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_maxTradingFee",
          "type": "uint256"
        }
      ],
      "name": "setMinAndMaxTradingFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minHoldingsReqPercentage",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "setMinHoldingsReqPercentage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_minLoan",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "setMinLoan",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_theseusDao",
          "type": "address"
        }
      ],
      "name": "setTheseusDao",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_tradingFee",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "setTradingFee",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "_amount",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "_ammPool",
          "type": "address"
        }
      ],
      "name": "subDebt",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "theseusDao",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_amm",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "_loanAmt",
          "type": "uint256"
        }
      ],
      "name": "tradingFeeCalc",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "feeToPool",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "feeToDAO",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "tradingFeeLoanPool",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]