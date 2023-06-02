export const AmmViewerAbi =[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_priceFeed",
          "type": "address"
        },
        {
          "internalType": "bytes",
          "name": "_payload",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "ammAddr",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "symbol",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "bytes32",
          "name": "payload",
          "type": "bytes32"
        }
      ],
      "name": "AddAmm",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "ammAddr",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "amount",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "AmmClosePosition",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "ammAddr",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "amount",
          "type": "int256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        }
      ],
      "name": "AmmOpenPosition",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "amm",
          "type": "address"
        }
      ],
      "name": "Freeze",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "amm",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "newIndex",
          "type": "uint256"
        }
      ],
      "name": "NewSnappshot",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "amm",
          "type": "address"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "currentIndex",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "indexPrice",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "baseAsset",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "quoteAsset",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "int256",
          "name": "ffr",
          "type": "int256"
        }
      ],
      "name": "PriceChange",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "ammAddr",
          "type": "address"
        }
      ],
      "name": "RemoveAmm",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "amm",
          "type": "address"
        }
      ],
      "name": "UnFreeze",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "ammAddr",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_symbol",
          "type": "string"
        },
        {
          "internalType": "bytes32",
          "name": "_payload",
          "type": "bytes32"
        }
      ],
      "name": "addAmm",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "amount",
          "type": "int256"
        }
      ],
      "name": "emitAmmClosePosition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "int256",
          "name": "amount",
          "type": "int256"
        }
      ],
      "name": "emitAmmOpenPosition",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "emitFreeze",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "newIndex",
          "type": "uint256"
        }
      ],
      "name": "emitNewSnappshot",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "currentIndex",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "indexPrice",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "baseAsset",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "quoteAsset",
          "type": "uint256"
        },
        {
          "internalType": "int256",
          "name": "ffr",
          "type": "int256"
        }
      ],
      "name": "emitPriceChange",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "emitUnFreeze",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "_stock",
          "type": "bytes32"
        }
      ],
      "name": "getPriceValue",
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
      "name": "isAmm",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "payload",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "priceFeed",
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
          "name": "ammAddr",
          "type": "address"
        }
      ],
      "name": "removeAmm",
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
          "internalType": "bytes",
          "name": "_payload",
          "type": "bytes"
        }
      ],
      "name": "updatePayload",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_priceFeed",
          "type": "address"
        }
      ],
      "name": "updatePriceFeed",
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
          "internalType": "uint256",
          "name": "_quoteAssetStarter",
          "type": "uint256"
        }
      ],
      "name": "updateQuoteAssetStarter",
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
      "name": "updateTheseusDao",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]