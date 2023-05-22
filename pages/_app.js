import "../styles/globals.css"
import { MoralisProvider } from "react-moralis"
import Header from "../components/Header"
import Head from "next/head"

export default function App({ Component, pageProps }) {
    return (
        <div>
            <Head>
                <title>Digital Rights Maykr</title>
                <meta name="description" content="Digital Rights Maykr" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="lama">
                <MoralisProvider initializeOnMount={false}>
                    <Header />
                    <Component {...pageProps} />
                </MoralisProvider>
            </div>
        </div>
    )
}
