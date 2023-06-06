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
                        Manage Certificate
                    </Link>
                    <Link className="navBar" href="/profits">
                        Profits
                    </Link>
                    <Link className="navBar" href="/clause">
                        Clause
                    </Link>

                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
        </nav>
    )
}
