import type { AppProps } from "next/app";

import "@rainbow-me/rainbowkit/styles.css";
import "react-toastify/dist/ReactToastify.css";

// custom css
import "css/base/utilities.css";
import "../css/base/base.scss";
import "../css/base/font.css";
import "../css/base/normalize.css";
import "../css/base/type.css";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { ToastContainer } from "react-toastify";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import HelpOverlay, { HelpOverlayContext } from "components/HelpOverlay";
import UIBlock, { UIBlockContext } from "components/UIBlock";
import Head from "next/head";
import { EcoClaimProvider } from "providers/EcoClaim";
import { useState, useEffect } from "react";
import MobileBlock from "components/MobileBlock";
import UnsecureGate from "components/UnsecureGate";

const client = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_SUBGRAPH_URI,
  cache: new InMemoryCache(),
});

const { chains, provider } = configureChains(
  [chain[process.env.NEXT_PUBLIC_CHAIN]],
  [
    infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_ID || "56b7c5428c1d4f1cb97b437ec67264d8" }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY || "CjccbhvHOgr96gSq9rbmBIxKaqWBhl7A" }),
    publicProvider(),
  ]
);

const { connectors } = getDefaultWallets({
  appName: "ECOx Community",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

function ClaimDapp({ Component, pageProps }: AppProps) {

  const [shouldShowHelp, setShouldShowHelp] = useState(false);
  const [shouldShowBlock, setShouldShowBlock] = useState(false);

  const [unsecure, setUnsecure] = useState(true);
  useEffect(() => {
    setUnsecure(window.self !== window.top);
  }, [])

  return unsecure ? <UnsecureGate/> : (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <ApolloProvider client={client}>
          <EcoClaimProvider>
            <HelpOverlayContext.Provider value={{
              shouldShow: shouldShowHelp,
              setShouldShow: setShouldShowHelp
            }}>
              <UIBlockContext.Provider value={{
                shouldShow: shouldShowBlock,
                setShouldShow: setShouldShowBlock
              }}>
                <Head>
                  <title>Eco Claim</title>
                  <meta name="viewport" content="initial-scale=1.0, width=device-width" />

                  <link rel="alternate icon" type="image/png" href="/favicon.png" />
                  <meta name="description"
                    content="Claim your on-chain Eco ID representing your Discord or Twitter account." />

                  <meta property="og:title" content="Eco Claim" />
                  <meta property="og:type" content="website" />
                  <meta property="og:url" content="https://claim.eco.id" />
                  <meta property="og:image" content="/meta_image.png" />

                  <link rel="image_src" href="/meta_image.png" />

                  <meta name="twitter:title" content="Eco Claim" />
                  <meta name="twitter:description" content="Claim your on-chain Eco ID representing your Discord or Twitter account." />
                  <meta name="twitter:image" content="/meta_image.png" />
                  <meta name="twitter:card" content="summary_large_image" />

                </Head>
                <Component {...pageProps} />
                <ToastContainer position="bottom-right" />
                <HelpOverlay shouldShow={shouldShowHelp} />
                <MobileBlock />
                <UIBlock />
              </UIBlockContext.Provider>
            </HelpOverlayContext.Provider>
          </EcoClaimProvider>
        </ApolloProvider>
      </RainbowKitProvider >
    </WagmiConfig >
  );
}

export default ClaimDapp;
