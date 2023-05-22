'use client';
import '@rainbow-me/rainbowkit/styles.css';
import { SessionProvider } from "next-auth/react";
import {
  getDefaultWallets,
  RainbowKitProvider, darkTheme
} from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, provider } = configureChains(
  [goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_ID }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'Minoan Exchange',
  projectId: '1',
  chains
});
const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})


export default function Providers({ children }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <SessionProvider>

        <RainbowKitProvider chains={chains} theme={darkTheme({
          accentColor: '#7b3fe4',
          accentColorForeground: 'white',
          borderRadius: 'medium',
        })}>{children}
        </RainbowKitProvider>
      </SessionProvider>
    </WagmiConfig>
  )
}