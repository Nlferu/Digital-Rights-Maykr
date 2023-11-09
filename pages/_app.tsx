import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import Header from "@/components/Header"
import Head from "next/head"
import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div>
            <Head>
                <title>Digital Rights Maykr</title>
                <meta name="description" content="Digital Rights Maykr" />
                <link rel="icon" href="/favicon.png" />
            </Head>

            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}
