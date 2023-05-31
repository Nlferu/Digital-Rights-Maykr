import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import Header from "../components/Header"
import Head from "next/head"
import "../styles/globals.css"

export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Digital Rights Maykr</title>
                <meta name="description" content="Digital Rights Maykr" />
                <link rel="icon" href="/favicon.ico" />
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
