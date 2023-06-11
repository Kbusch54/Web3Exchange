'use client'
import { useEffect, useState } from 'react';
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signIn, useSession, signOut } from 'next-auth/react';



export default function SignIn() {

    const [redirectUrl, setRedirectUrl] = useState<string>("http://localhost:3000/auth/signin");

    
    useEffect(() => {
        const url = new URL(location.href);
        const newDeal = url.searchParams.get("callbackUrl")!
        newDeal && setRedirectUrl(url.searchParams.get("callbackUrl")!);
    }, []);
    const session = useSession();
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const signInFull = async () => {
        const message ='Welcome to Minoan Exchange '.concat( new Date().toString());
        const sig = await signMessageAsync({ message: message }).then((data) => {
            return data
        }).catch((err) => {
            console.log(err)
        });
        await signIn("credentials", { address, message, signature: sig, redirect: true, callbackUrl: redirectUrl })
    }
    const { disconnect } = useDisconnect();
    const { isConnected } = useAccount();

    const signOutFull = async () => {
        disconnect();
        await signOut()
    }
    return (
            <div className='grid h-screen place-items-center'>
                <ConnectButton.Custom>
                    {({
                        //@ts-ignore
                        account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted,
                    }) => {
                        // Note: If your app doesn't use authentication, you
                        // can remove all 'authenticationStatus' checks
                        const ready = mounted && authenticationStatus !== 'loading';
                        const connected =
                            ready &&
                            account &&
                            chain &&
                            (!authenticationStatus ||
                                authenticationStatus === 'authenticated');
                        return (
                            <div
                                {...(!ready && {
                                    'aria-hidden': true,
                                    'style': {
                                        opacity: 0,
                                        pointerEvents: 'none',
                                        userSelect: 'none',
                                    },
                                })}
                            >
                                {(() => {
                                    if (!connected) {
                                        return (
                                            <button className='px-3 py-2 bg-teal-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={openConnectModal} type="button">
                                                Connect Wallet
                                            </button>
                                        );
                                    }
                                    if (isConnected && address && (!session || session.status != 'authenticated')) {
                                        return (
                                            <div className='flex gapx-8'>
                                                <button className='px-3 py-2 m-4 bg-blue-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={() => signInFull()}>Sign Message</button>
                                                <button className='px-3 py-2 m-4 bg-red-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={() => disconnect()}>Disconnect</button>
                                            </div>
                                        )
                                    }
                                    if (chain.unsupported) {
                                        return (
                                            <button onClick={openChainModal} type="button">
                                                Wrong network
                                            </button>
                                        );
                                    }
                                    return (
                                        <div style={{ display: 'flex', gap: 12 }}>
                                            <button className='px-3 py-2 bg-teal-400 text-xl text-white border rounded-xl hover:scale-125 '
                                                onClick={openChainModal}
                                                style={{ display: 'flex', alignItems: 'center' }}
                                                type="button"
                                            >
                                                {chain.hasIcon && (
                                                    <div
                                                        style={{
                                                            background: chain.iconBackground,
                                                            width: 12,
                                                            height: 12,
                                                            borderRadius: 999,
                                                            overflow: 'hidden',
                                                            marginRight: 4,
                                                        }}
                                                    >
                                                        {chain.iconUrl && (
                                                            <img
                                                                alt={chain.name ?? 'Chain icon'}
                                                                src={chain.iconUrl}
                                                                style={{ width: 12, height: 12 }}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                                {chain.name}
                                            </button>
                                            <div className='flex flex-col justify-center text-center'>
                                                <p>{account.address}</p>
                                                <p>{account.displayBalance}</p>
                                                <button className='px-3 py-2 m-4 bg-red-400 text-xl text-white border rounded-xl hover:scale-125 ' onClick={signOutFull}>Sign Out</button>
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        );
                    }}
                </ConnectButton.Custom>
            </div>

    );
}