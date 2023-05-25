import { StakingAbi } from "../../abis";
import { usePrepareContractWrite, Address } from "wagmi";
import { staking,TeslaAmm as teslaAmm,GoogleAmm as googleAmm, MetaAmm as metaAmm} from "../../address";

export const useStake = (
    amount:number,
    ammId:string,
    signer: Address,
  ) => {
    // (address _amm, uint _collateral,uint _leverage,int _side
    const amm = getAmmAddress(ammId);
    const { config, error } = usePrepareContractWrite({
        address:staking,
       abi:StakingAbi,
      functionName: "stake",
      args: [amount,amm],
      overrides: {
        from: signer,
        // gasLimit: parseUnits("200000", "wei"),
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
