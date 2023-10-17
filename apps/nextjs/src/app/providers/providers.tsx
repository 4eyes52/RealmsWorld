"use client";

import { WebWalletConnector } from "@argent/starknet-react-webwallet-connector";
import { darkTheme, ReservoirKitProvider } from "@reservoir0x/reservoir-kit-ui";
import { InjectedConnector, StarknetConfig } from "@starknet-react/core";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import { Provider as StarkProvider } from "starknet";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { goerli, mainnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";

import { TransferLogProvider } from "./TransferLogProvider";

enum StarknetChainId {
  SN_MAIN = "0x534e5f4d41494e",
  SN_GOERLI = "0x534e5f474f45524c49",
  SN_GOERLI2 = "0x534e5f474f45524c4932",
}
const starkConnectors = [
  new InjectedConnector({ options: { id: "braavos" } }),
  new InjectedConnector({ options: { id: "argentX" } }),
  new WebWalletConnector({
    url: "https://web.argent.xyz",
  }),
];

const theme = darkTheme({
  headlineFont: "Sans Serif",
  font: "Serif",
  primaryColor: "#323aa8",
  primaryHoverColor: "#252ea5",
});

const { chains } = configureChains(
  [...(process.env.NEXT_PUBLIC_IS_TESTNET === "true" ? [goerli] : [mainnet])],
  [publicProvider()],
);
const testnetProvider = new StarkProvider({
  sequencer: {
    baseUrl: "https://alpha4.starknet.io",
    feederGatewayUrl: "https://alpha4.starknet.io/feeder_gateway",
    chainId: StarknetChainId.SN_GOERLI,
    gatewayUrl: "https://alpha4.starknet.io/gateway",
  },
});
const mainnetProvider = new StarkProvider({
  sequencer: {
    baseUrl: "https://alpha-mainnet.starknet.io",
    feederGatewayUrl: "https://alpha-mainnet.starknet.io/feeder_gateway",
    chainId: StarknetChainId.SN_MAIN,
    gatewayUrl: "https://alpha-mainnet.starknet.io/gateway",
  },
});

export function Provider({ children }: any) {
  return (
    <StarknetConfig
      //autoConnect
      defaultProvider={
        process.env.NEXT_PUBLIC_IS_TESTNET ? testnetProvider : mainnetProvider
      }
      connectors={starkConnectors as any}
    >
      <WagmiConfig
        config={createConfig(
          getDefaultConfig({
            appName: "Realms.World",
            alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_API,
            chains,
            walletConnectProjectId:
              process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
          }),
        )}
      >
        <ConnectKitProvider theme="midnight">
          <TransferLogProvider>
            <ReservoirKitProvider
              options={{
                apiKey: process.env.RESERVOIR_API_KEY,
                chains: [
                  {
                    id: 1,
                    name: "mainnet",
                    baseApiUrl: "https://api.reservoir.tools",
                    active: true,
                  },
                  {
                    id: 5,
                    name: "goerli",
                    baseApiUrl: "https://api-goerli.reservoir.tools",
                    active: true,
                  },
                ],
              }}
              theme={theme}
            >
              {children}
            </ReservoirKitProvider>
          </TransferLogProvider>
        </ConnectKitProvider>
      </WagmiConfig>
    </StarknetConfig>
  );
}
