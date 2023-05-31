import { StakingHelperAbi } from "../../abis"
import { useEffect, useState } from "react";
import { Address, useContractRead } from 'wagmi';
import { stakingHelper } from "../../address";

export const useGetVotingProportion= (signers:Address[]|null,tokenId:number, maxVotingPower:number, minVotingPower:number) => {
    //@ts-ignore
  const [totalVotePercent, setTotalVotePercent] = useState<number | null>(null);
  const [isPending, setIsPending] = useState<boolean>(true);
  const [isError, setIsError] = useState<string | null>(null);

  const { data, error, isLoading } = useContractRead({
    address: stakingHelper,
    abi: StakingHelperAbi,
    functionName: 'getProportionOfVotes',
    args: [signers,tokenId,maxVotingPower,minVotingPower],
  });


  useEffect(() => {
    if (!isLoading && !error) {
        //@ts-ignore
      setTotalVotePercent(data);
      setIsPending(false);
    }
    if (error) {
      setIsError(error.message);
      setIsPending(false);
    }
  }, [isLoading, error, data]);

  return { totalVotePercent, isPending, isError };
};
