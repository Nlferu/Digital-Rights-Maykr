import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav>
            <div className="title">
                <h1>Digital Rights Maykr</h1>
                <div className="navBar">
                    <Link className="navBar" href="/">
                        Home
                    </Link>
                    <Link className="navBar" href="/gallery">
                        Gallery
                    </Link>
                    <Link className="navBar" href="/create_certificate">
                        Create Certificate
                    </Link>
                    <Link className="navBar" href="/lend_certificate">
                        Lend Certificate
                    </Link>
                    <Link className="navBar" href="/buy_rights">
                        Buy Rights
                    </Link>

                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
        </nav>
    )
}
