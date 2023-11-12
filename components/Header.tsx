import { ConnectButton } from "web3uikit"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="flex w-full h-[4.5rem] border-b-[1px] border-b-slate-300 bg-darkGreen">
            <h1 className="flex ml-[2rem] items-center w-[20rem] text-2xl text-lightGreen">Digital Rights Maykr</h1>
            <div className="flex justify-end gap-4 right-0 w-full items-center text-white">
                <Link
                    className="inline-block text-xl uppercase after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-lightGreen after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100"
                    href="/"
                >
                    Home
                </Link>
                <Link
                    className="inline-block text-xl uppercase after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-lightGreen after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100"
                    href="/gallery"
                >
                    Gallery
                </Link>
                <Link
                    className="inline-block text-xl uppercase after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-lightGreen after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100"
                    href="/create-certificate"
                >
                    Create Certificate
                </Link>
                <Link
                    className="inline-block text-xl uppercase after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-lightGreen after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100"
                    href="/lend-certificate"
                >
                    Manage Certificate
                </Link>
                <Link
                    className="inline-block text-xl uppercase after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-lightGreen after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100"
                    href="/profits"
                >
                    Profits
                </Link>
                <Link
                    className="inline-block text-xl uppercase after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-lightGreen after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100"
                    href="/clause"
                >
                    Clause
                </Link>

                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
