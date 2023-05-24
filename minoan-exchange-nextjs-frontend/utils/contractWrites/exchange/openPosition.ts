import { ExchangeAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { usdc,exchange,TeslaAmm as teslaAmm,GoogleAmm as googleAmm, MetaAmm as metaAmm} from "../../address";

export const useOpenPosition = (
    side:number,
    collateral:number,
    leverage:number,
    ammId:string,
    signer: Address,
  ) => {
    // (address _amm, uint _collateral,uint _leverage,int _side
    const amm = getAmmAddress(ammId);
    const { config, error } = usePrepareContractWrite({
        address:exchange,
       abi:ExchangeAbi,
      functionName: "openPosition",
      args: [amm,collateral,leverage,side],
      overrides: {
        from: signer,
      },
    });
    return { config, error };
  };

function getAmmAddress(ammId: string) {
    if(ammId === "tesla"){
        return teslaAmm;
    }else if(ammId === "google"){
        return googleAmm;
    }else if(ammId === "meta"){
        return metaAmm;
    }
    else{
        return teslaAmm;
    }
}
