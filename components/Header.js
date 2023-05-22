import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav>
            <h1>Digital Rights Maykr</h1>
            <div>
                <Link href="/">Home</Link>
                <Link href="/certificates">Certificates</Link>
                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
