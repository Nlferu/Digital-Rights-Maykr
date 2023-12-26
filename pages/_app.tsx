import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import { ThirdwebProvider } from "@thirdweb-dev/react"
import { Sepolia } from "@thirdweb-dev/chains"
import ActiveSectionContextProvider from "@/context/active-section-context"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Head from "next/head"
import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    const activeChain = Sepolia

    return (
        <div className="flex px-4 flex-col min-h-[100vh] items-center bg-[url('/digital.jpg')] bg-cover">
            <Head>
                <title>Digital Rights Maykr</title>
                <meta name="description" content="Digital Rights Maykr" />
                <link rel="icon" href="/icon.png" />
            </Head>

            <MoralisProvider initializeOnMount={false}>
                <ThirdwebProvider clientId="your-client-id" activeChain={activeChain} supportedChains={[activeChain]}>
                    <NotificationProvider>
                        <ActiveSectionContextProvider>
                            <Header />
                            <Component {...pageProps} />
                            <Footer />
                        </ActiveSectionContextProvider>
                    </NotificationProvider>
                </ThirdwebProvider>
            </MoralisProvider>
        </div>
    )
}
