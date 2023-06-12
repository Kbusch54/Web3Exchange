import { ExchangeAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { usdc,exchange,TeslaAmm as teslaAmm,GoogleAmm as googleAmm, MetaAmm as metaAmm} from "../../address";
import { parseUnits } from "ethers/lib/utils.js";

export const useRemoveCollateral = (
    signer: Address,
    tradeId:string,
    collateral:number,
  ) => {
    const { config, error } = usePrepareContractWrite({
        address:exchange,
       abi:ExchangeAbi,
       chainId:5,
      functionName: "removeCollateral",
      args: [tradeId,collateral],
      account: signer,
        gas: parseUnits("200000", "wei").toBigInt(),
      
    });
    return { config, error };
  };


