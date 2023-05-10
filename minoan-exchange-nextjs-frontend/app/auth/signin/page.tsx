'use client'
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSession } from "next-auth/react";
import { useConnect, useBalance, useAccount, useNetwork, useSigner,useDisconnect } from "wagmi";
import { ethers } from "ethers";
import React, { useState, useEffect,FormEventHandler } from "react";
import { signIn, signOut } from "next-auth/react";

interface Props {}

export default function page() {
  const [userInfo, setUserInfo] = useState({ account: '', signature: "",message:"" });
  const { address, isConnected,isDisconnected } = useAccount();
  const { status, data:session } = useSession();
    const [hasMounted, setHasMounted] = useState(false);
    const [signatureVerified, setSignatureVerified] = useState(false);
    const { data: signer } = useSigner();
    let redirectUrl = "http://localhost:3000/auth/signin";

useEffect(() => {
  const url = new URL(location.href);
  redirectUrl = url.searchParams.get("callbackUrl")!;
});
   
    const { disconnect } = useDisconnect({
        onSettled() {
            setSignatureVerified(()=>false);
            setUserInfo(()=>({account:"",signature:"",message:""}));
            signOut();
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
        const messageToSign = Date.now();
        console.log(messageToSign);
      const message = ethers.utils.arrayify(messageToSign);
          const signature =  await signer?.signMessage(message);
          console.log('signature',signature);
          if (signature) {
            const verified = ethers.utils.verifyMessage(
              message,
              String(signature)
            );
            if(address==verified){
                setSignatureVerified(()=>true);
                //@ts-ignore
                setUserInfo(()=>({account:address,signature:signature,message:messageToSign}));             
    const res = await signIn("credentials", {
        address,
     signature,
      messageToSign,
      redirect: true,
      callbackUrl: redirectUrl,

    });

            }
    }
}
console.log(status)
console.log(session)
if(!session){
  return (
    <div className="sign-in-form text-white ml-24 mt-24">
       <div className="main  z-30">
        {!isConnected&&(

               <>
        <h1>Click below to connect your wallet with RainbowKit</h1>
        <ConnectButton.Custom>
      {({
        //@ts-ignore
        account,chain,openAccountModal,openChainModal,openConnectModal,authenticationStatus,mounted,
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
        {(signatureVerified )&&(<>
        <div>Verified</div>
        <div>
            <div>Address: {address}</div>
            <button onClick={() => disconnect()}>Disconnect</button>
        </div>
        </>)}
      </div>
    </div>
  );
        }else{
            return(
            <div className="sign-in-form text-white ml-24 mt-24">
            <div className="main  z-30">
            <div>Verified</div>
            <div>
                <div>Address: {address}</div>
                <button onClick={() => disconnect()}>Disconnect</button>
            </div>
          </div>
        </div>
          )
        }
};
