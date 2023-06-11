'use client'

import React, { useState } from 'react'
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession, signOut } from 'next-auth/react';
import WalletModal from './WalletModal';

interface Props {

}

const ConnectingButton: React.FC<Props> = () => {
    const session = useSession();
    const { address } = useAccount();
    const { disconnect } = useDisconnect();
    const { isConnected, status } = useAccount();
    const [modalState, setModalState] = useState(false)

    const signOutFull = async () => {
        disconnect();
        await signOut()
    }
    const openModal = () => {
        setModalState((prev) => !prev)
    }
    if (status == 'connecting'|| session?.status == 'loading') {
        return (
            <div>
                <button className='px-3 py-2 bg-teal-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={openModal} type="button">
                    Connecting...
                </button>
            </div>
        )
    } else {


        return (
            <div>
                <ConnectButton.Custom>
                    {({ account, chain, openChainModal, openConnectModal, authenticationStatus, mounted, }) => {
                        // Note: If your app doesn't use authentication, you
                        // can remove all 'authenticationStatus' checks
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus ||
                                authenticationStatus != 'authenticated');

                        return (
                            <div
                                {...(!ready && {
                                    disabled: true,
                                })}
                            >
                                {(() => {
                                    if (!connected && !isConnected) {
                                        return (
                                            <div>
                                                <button className='px-3 py-2 bg-teal-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={openConnectModal} type="button">
                                                    Connect Wallet
                                                </button>
                                            </div>
                                        );
                                    }
                                    if (isConnected && address && (!session || session.status != 'authenticated')) {
                                        return (
                                            <div className=''>
                                                <button className='px-3 py-2 m-4 bg-red-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={() => disconnect()}>Disconnect</button>
                                            </div>
                                        )
                                    }

                                    if (chain?.unsupported) {
                                        return (
                                            <div>
                                                <button className='px-3 py-2 m-4 bg-yellow-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={openChainModal} type="button">
                                                    Wrong network
                                                </button>
                                            </div>
                                        );
                                    }

                                    if (isConnected && account && account.address && session && session.status == 'authenticated') {


                                        return (
                                            <div style={{ display: 'flex', gap: 12 }}>
                                                <WalletModal account={account} signOutFunc={signOutFull} />
                                            </div>
                                        );
                                    }
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </div>
        )
    }
}

export default ConnectingButton
