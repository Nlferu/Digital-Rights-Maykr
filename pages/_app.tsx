import type { AppProps } from "next/app"
import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Head from "next/head"
import "@/styles/globals.css"

export default function App({ Component, pageProps }: AppProps) {
    return (
        <div className="flex-col min-h-[100vh] jsutify-center items-center bg-[url('/digital.jpg')] bg-cover">
            <Head>
                <title>Digital Rights Maykr</title>
                <meta name="description" content="Digital Rights Maykr" />
                <link rel="icon" href="/icon.png" />
            </Head>

            <MoralisProvider initializeOnMount={false}>
                <NotificationProvider>
                    <Header />
                    <Component {...pageProps} />
                    <Footer />
                </NotificationProvider>
            </MoralisProvider>
        </div>
    )
}
