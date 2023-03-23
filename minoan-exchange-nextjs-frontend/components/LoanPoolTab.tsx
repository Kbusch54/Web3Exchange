'use client';
import * as React from 'react';
import { styled } from '@mui/system';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import { buttonUnstyledClasses } from '@mui/base/ButtonUnstyled';
import TabUnstyled, { tabUnstyledClasses } from '@mui/base/TabUnstyled';
import LoanStepper from './LoanStepper';

const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#80BFFF',
  300: '#66B2FF',
  400: '#3399FF',
  500: '#007FFF',
  600: '#0072E5',
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};

const Tab = styled(TabUnstyled)`
  font-family: IBM Plex Sans, sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  margin: 6px 6px;
  border: none;
  border-radius: 7px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${blue[400]};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${blue[200]};
  }

  &.${tabUnstyledClasses.selected} {
    background-color: #fff;
    color: ${blue[600]};
  }

  &.${buttonUnstyledClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(TabPanelUnstyled)`
  width: 100%;
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.95rem;
  margin: 10px 10px;
`;

const TabsList = styled(TabsListUnstyled)(
  ({ theme }) => `
  min-width: 400px;
  background-color: ${blue[500]};
  border-radius: 12px;
    margin:10px auto;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 8px grey[900];
  `,
);

export default function LoanPoolTab() {
  return (
    <TabsUnstyled defaultValue={0}>
      <TabsList>
        <Tab>Loan Pool</Tab>
        <Tab>Rewards and Risk</Tab>
        <Tab>How To become liquidity provider</Tab>
      </TabsList>
      <TabPanel value={0}>
        <div className='flex flex-col text-left gap-y-2'>
            <p>Our loan pools are called Ariadne pools. In the myth of Theseus Ariadne daughter of King Minas, gifts Thesues the yarn to help him traverse the Labrynth. Without her help Theseus would have surley parashed like many before. Just as a liquidity provider gives traders a chance at success.</p>
            <p>Each trading pair has its own individual loan pool. As well as a corresponding DAO, to control the aspects of the loans. I.E. max leverage allowed, max loan, the minimum margin requirments, the interest rate and reward periods.</p>
            <p>In order to become a liquity provider and be apart of the DAO one must stake USDC for the particular loan pool.</p>
            <p>Once a liquidity provider has staked their USDC they will be able to vote on the various aspects of the loan pool. As well as claim rewards for being a liquidity provider.</p>
            <p>When one stakes USDC they will recieve the LP&apos;s ERC20 token which can be transfered bought or sold outside of the protocol. This token can be used to vote on the respective DAO.</p>
            <p>At anytime a staker may transfer their tokens back to the pool to recieve their portion via percentage of USDC in the pool.</p>
            <p>If at any point the pool&apos;s availble funds, i.e. USDC is loaned out, the staker may not be able to redeem full amount of USDC at that time, in order to protect the underlying pool.</p>
        </div>
      </TabPanel>
      <TabPanel value={1}>     
        <div className='flex flex-col text-left gap-y-2'>
            <p>Rewards for being a liquidity provider will vary from pool to pool according to their respective DAO&apos;s. As well as the the reward periods. One can expect a certain percentage of trading and interest payments to go to rewards while the remaining go directly into the pool.</p>
            <p>If a stakers respective rewards are not claimed within the alloted time period set by the DAO their reward and any other staker&apos;s rewards will be deposited into the pool. One may check rewards via the Ariadne pools page.</p>
            <p>How this protocol functions is if an investor&apos;s pnl is positive upon close after their interest payment and funding rate are adjusted, first their collateral is drained to pay their pnl and any further payments required will come form the corresponding loan pool.</p>
            <p>If the loan pool drops below a certain margin, dictaded by the protocol DAO i.e. The Theseus DAO, debt will be issued to the loan pool to pay the investor from the protocol insurance fund. Upon debt insuance to a loan pool a portion of rewards and other fees will go into the insurance fund until the LP&apos;s debt is payed. </p>
            <p>Important note although each LP has significat control over how loans are structured, the Theseus DAO does have control over the range of allowed controllabloe variables for the pools.</p>
        </div>
      </TabPanel>
      <TabPanel value={2}>
        <div className='min-w-[40vw]'>

            <LoanStepper/>
        </div>
      </TabPanel>
    </TabsUnstyled>
  );
}