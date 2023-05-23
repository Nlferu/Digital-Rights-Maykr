import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav>
            <div className="title">
                <h1>Digital Rights Maykr</h1>
                <div className="rightNavBar">
                    <Link className="rightNavBar" href="/">
                        Home
                    </Link>
                    <Link className="rightNavBar" href="/creator">
                        Create
                    </Link>
                    <Link className="rightNavBar" href="/lend">
                        Lend Certificate
                    </Link>
                    <Link className="rightNavBar" href="/buy">
                        Buy Rights
                    </Link>
                    <div className="button">
                        <ConnectButton moralisAuth={false} />
                    </div>
                </div>
            </div>
        </nav>
    )
}
