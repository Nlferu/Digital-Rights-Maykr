import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav>
            <div className="title">
                <h1 className="text-red-500">Digital Rights Maykr</h1>
                <div className="navBar">
                    <Link className="underline" href="/">
                        Home
                    </Link>
                    <Link className="underline" href="/gallery">
                        Gallery
                    </Link>
                    <Link className="underline" href="/create_certificate">
                        Create Certificate
                    </Link>
                    <Link className="underline" href="/lend_certificate">
                        Manage Certificate
                    </Link>
                    <Link className="underline" href="/profits">
                        Profits
                    </Link>
                    <Link className="underline" href="/clause">
                        Clause
                    </Link>

                    <ConnectButton moralisAuth={false} />
                </div>
            </div>
        </nav>
    )
}
