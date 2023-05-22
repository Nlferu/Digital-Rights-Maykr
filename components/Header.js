import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    const connectButtonStyle = {
        backgroundColor: "black",
        color: "black",
        // Add any other desired styles here
    }

    return (
        <nav>
            <div className="lama">
                <h1>Digital Rights Maykr</h1>
                <div className="rambo">
                    <Link href="/">Home</Link>
                    <Link href="/certificates">Certificates</Link>
                    <div className="ameba">
                        <ConnectButton moralisAuth={false} />
                    </div>
                </div>
            </div>
        </nav>
    )
}
