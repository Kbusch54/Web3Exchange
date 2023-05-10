"use client";
import React, { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useConnect, useBalance, useAccount, useNetwork, useSigner,useDisconnect } from "wagmi";
import { ethers } from "ethers";

interface Props {

}

const ConnectingButton: React.FC<Props> = () => {
    const { address, isConnected,isDisconnected } = useAccount();

    const [hasMounted, setHasMounted] = useState(false);
    const [signatureVerified, setSignatureVerified] = useState(false);
    const { data: signer } = useSigner();
    const { disconnect } = useDisconnect({
        onSettled() {
            setSignatureVerified(()=>false);
          },
    })
  
  
    isDisconnected && console.log("Disconnected");
    useEffect(() => {
      setHasMounted(true);
    }, []);
  
    if (!hasMounted) {
      return null;
    }

  
    async function handleSignMessage() {
        const hello = ethers.utils.arrayify(23232323+Date.now());
        console.log(hello);
      const message = ethers.utils.arrayify(23232323+Date.now());
          const signature =  await signer?.signMessage(message);
          if (signature) {
            const verified = ethers.utils.verifyMessage(
              message,
              signature
            );
            if(address==verified){
                setSignatureVerified(()=>true);
            }
    }
}
    return (
        <div className="main  z-30">
        {!isConnected&&(

               <>
        <h1>Click below to connect your wallet with RainbowKit</h1>
        <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
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
                  <button onClick={openConnectModal} type="button">
                    Connect Wallet
                  </button>
                );
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
                  <button
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

                  <button onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
            </>
            )}
        {(!signatureVerified && isConnected) && (
            <>
            
            <button onClick={handleSignMessage}>Sign Message</button>
            </>
            )}
        {signatureVerified&&(<>
        <div>Verified</div>
        <div>
            <div>Address: {address}</div>
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>
        </>)}
      </div>
    )
}

export default ConnectingButton
