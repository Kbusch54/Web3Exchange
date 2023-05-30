
import React, { use } from 'react';
import request, { gql } from 'graphql-request';

interface Props {
  daoAddress: string;
  user: string;
}

const fetchPurposals = async (daoId: string) => {
  const query = gql`
    query ($daoId: String!) {
        proposals {
        proposedAt
        nonce
        isPassed
        dAO {
          id
        }
      }
    }
  `;
  const endpoint =
    'https://api.studio.thegraph.com/query/46803/subgraph-minoan/v0.1.3';
  const variables = { daoId: daoId };
  const data = await request(endpoint, query, variables);

  return data;
};

const DAOPurposals =  ({ daoAddress, user }: Props) => { 
//@ts-ignore
const {proposals} = use(fetchPurposals(daoAddress));
  console.log('PURPOSALS',proposals);
  console.log('DAO ADDRESS',daoAddress);



  if (proposals) {
    return (
      <div>
        {proposals.map((purposal: any) => (
          <div key={purposal.nonce}>
            <h1>{purposal.nonce}</h1>
            <h1>{purposal.proposedAt}</h1>
          </div>
        ))}
      </div>
    );
  } else {
    return <div className='text-white'>no data</div>;
  }
};

export default DAOPurposals;
