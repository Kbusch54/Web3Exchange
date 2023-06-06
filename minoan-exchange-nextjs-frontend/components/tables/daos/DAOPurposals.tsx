import React, { use } from 'react';
import request, { gql } from 'graphql-request';
import { supabase } from '../../../supabase';
import { Address } from 'wagmi';
import ProposalType from './ProposalType';

interface Props {
    daoAddress: Address;
    user: Address;
    tokenId: number;
    
    isTheseus: boolean;
}

const fetchTheseusPurposals = async (daoId: string) => {
  const query = gql`
  query ($daoId: String!) {
      proposals(where:{theseusDAO:$daoId}) {
      proposedAt
      nonce
      isPassed
      to
      proposer
      data
      transactionHash
      theseusDAO{
  id
  votingTime
  votesNeededPercentage
  tokenId
  maxVotingPower
  minVotingPower
}
  }
  }
`;
  const endpoint =
      'https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest';
  const variables = { daoId: daoId };
  const data = await request(endpoint, query, variables);

  return data;
};

const fetchPurposals = async (daoId: string) => {
    const query = gql`
    query ($daoId: String!) {
        proposals(where:{dAO:$daoId}) {
        proposedAt
        nonce
        isPassed
        to
        proposer
        data
        transactionHash
       
        dAO {
          id
          votesNeededPercentage
          tokenId
          maxVotingPower
          minVotingPower
            votingTime
          poolToken{
            tokenBalance{
              user{
				        id						
              }
            }
          }
      }
    }
    }
  `;
    const endpoint =
        'https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest';
    const variables = { daoId: daoId };
    const data = await request(endpoint, query, variables);

    return data;
};

const checkUserStakes = async (userId: string, inputTokenId: number) => {
    const query = gql`
      query CheckUserStakes($userId: String!) {
        users(where: { id: $userId }) {
          id
          stakes {
            totalStaked
            token {
              tokenId
            }
          }
        }
      }
    `;
    const endpoint =
      'https://api.studio.thegraph.com/query/46803/subgraph-minoan/version/latest';
    const variables = { userId: userId };
    const data = await request(endpoint, query, variables);
  
    //@ts-ignore
    const user = data.users[0];
    let hasStakes = false;
    if(!user){
      return false;
    }
    for (let i = 0; i < user.stakes.length; i++) {
      if (user.stakes[i].token.tokenId === inputTokenId && user.stakes[i].totalStaked > 0) {
        hasStakes = true;
      }
    }
   
    return hasStakes;
  };
  
  
  
  

const DAOPurposals = ({ daoAddress, user,tokenId ,isTheseus}: Props) => {
  //@ts-ignore
  const {proposals}=isTheseus?use(fetchTheseusPurposals(daoAddress)):use(fetchPurposals(daoAddress));
   
    // const hasStakes = use(checkUserStakes(user,tokenId?tokenId:0));
    //@ts-ignore
    const { data, error } = use(supabase.from('Proposals').select().ilike('contractAddress', `%${daoAddress}%`));
    if (proposals) {
        return (
            <ProposalType daoAddress={daoAddress} dbData={data} hasStakes={false}  proposals={proposals} tokenId={tokenId} user={user} />
        );
    } else {
        return <div className='text-white'>no data</div>;
    }
};

export default DAOPurposals;
