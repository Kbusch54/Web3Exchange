import { ExchangeAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { exchange} from "../../address";
import { parseUnits } from "ethers/lib/utils.js";

export const useAddLiquidity = (
    signer: Address,
    tradeId:string,
    leverage: number,
    collateral:number,
    payload:string
  ) => {
    const { config, error } = usePrepareContractWrite({
        address:exchange,
       abi:ExchangeAbi,
       chainId:5,
      functionName: "addLiquidityToPosition",
      args: [tradeId,leverage,collateral,payload],
      account: signer,
      gas: parseUnits("400000", "wei").toBigInt(),
      gasPrice: parseUnits("20", "gwei").toBigInt(),

      
    });
    console.log("config",config)
    console.log("error",error)
    return { config, error };
  };


