'use client'
import React, { useEffect } from 'react';
import { useGetVotingProportion } from '../../../utils/contractReads/ariadneDao/voteProportion';
import { Address } from 'wagmi';

interface Props {
  signers: Address[];
  tokenId: number;
  maxVotingPower: number;
  minVotingPower: number;
  func: Function | null | undefined;
}

const VotingProportion: React.FC<Props> = ({
  signers,
  tokenId,
  maxVotingPower,
  minVotingPower,
  func,
}) => {
  const votePercentage = useGetVotingProportion(
    signers,
    tokenId,
    maxVotingPower,
    minVotingPower
  );

  useEffect(() => {
    if (func) {
      func(Number(votePercentage.totalVotePercent) / 10 ** 4);
    }
  }, [votePercentage, func]);

  return (
    <div>
      {Number(votePercentage.totalVotePercent) / 10 ** 4}%
    </div>
  );
};

export default VotingProportion;
