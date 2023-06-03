import { ExchangeAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { usdc,exchange,TeslaAmm as teslaAmm,GoogleAmm as googleAmm, MetaAmm as metaAmm} from "../../address";
import { parseUnits } from "ethers/lib/utils.js";



export const useOpenPosition = (
    side:number,
    collateral:number,
    leverage:number,
    ammId:string,
    signer: Address,
    payload:string
  ) => {
    // (address _amm, uint _collateral,uint _leverage,int _side
    const amm = getAmmAddress(ammId);
    const { config, error } = usePrepareContractWrite({
        address:exchange,
       abi:ExchangeAbi,
       chainId:5,
      functionName: "openPosition",
      args: [amm,collateral,leverage,side,payload],
      overrides: {
        from: signer,
        gasLimit: parseUnits("5000", "wei"),
      },
      
    });
    return { config, error };
  };

  function getAmmAddress(ammId: string) {
    const amm =ammId.toLowerCase();
    if(amm === "tesla"){
        return teslaAmm;
    }else if(amm === "google"){
        return googleAmm;
    }else if(amm === "meta"){
        return metaAmm;
    }
    else{
        return teslaAmm;
    }
}
