import { ExchangeAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { exchange} from "../../address";
import { parseUnits } from "ethers/lib/utils.js";

export const useRemoveLiquidity = (
    signer: Address,
    tradeId:string,
    positionSize: number,
    payyload:string
  ) => {
    console.log("removeLiquidity",positionSize)
    const { config, error } = usePrepareContractWrite({
        address:exchange,
       abi:ExchangeAbi,
       chainId:5,
      functionName: "removeLiquidityFromPosition",
      args: [tradeId,positionSize,payyload],
      account: signer,
      gas: parseUnits("4000000", "wei").toBigInt(),
 
      
    });
    return { config, error };
  };


