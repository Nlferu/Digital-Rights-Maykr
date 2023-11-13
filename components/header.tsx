import { ConnectButton } from "web3uikit"
import { links } from "@/lib/data"
import Link from "next/link"

export default function Header() {
    return (
        <nav className="flex w-full h-[4.5rem] bg-transparent">
            <h1 className="flex ml-[2rem] items-center w-[20rem] text-2xl text-green-800 font-bold">Digital Rights Maykr</h1>
            <div className="flex justify-end gap-4 right-0 w-full items-center text-white list-none">
                {links.map((link) => (
                    <li key={link.hash}>
                        <Link
                            className="inline-block text-xl uppercase after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-lightGreen after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100"
                            href={link.hash}
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}

                <ConnectButton moralisAuth={false} />
            </div>
        </nav>
    )
}
