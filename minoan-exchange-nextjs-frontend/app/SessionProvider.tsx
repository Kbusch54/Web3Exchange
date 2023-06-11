'use client';
import { SessionProvider } from 'next-auth/react'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { Session } from 'next-auth';
interface Props {
    children?: React.ReactNode
    // session: Session
}



const projectId = '68cd4f66bb75d85ad9574e37bc54a3e8';

const { chains, publicClient } = configureChains(
    [goerli],
    [
        // @ts-ignore
      alchemyProvider({ apiKey: "X7CfmD6NMU46pX47PooiyVs7J5XxPCqk" }),
      publicProvider()
    ]
  );
  
  const { connectors } = getDefaultWallets({
    appName: 'MinoanExchange',
    projectId: projectId,
    chains
  });
  
  const wagmiConfig = createConfig({
    autoConnect: true,
    
    connectors,
    publicClient
  });
  const NextAuthSessionProvider: React.FC<Props> = ({ children }) => {
    return (
        <WagmiConfig config={wagmiConfig}>
            <SessionProvider >
                    <RainbowKitProvider  chains={chains}>
                        {children}
                    </RainbowKitProvider>
                </SessionProvider>
        </WagmiConfig>

    )
}

export default NextAuthSessionProvider