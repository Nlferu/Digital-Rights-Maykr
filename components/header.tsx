import { ConnectButton } from "web3uikit"
import { links } from "@/lib/data"
import { Space_Grotesk } from "next/font/google"
import Link from "next/link"
import Image from "next/image"

const montserrat = Space_Grotesk({ subsets: ["latin"] })

export default function Header() {
    return (
        <nav className="flex w-full h-[4.5rem] bg-transparent">
            <Image className="pl-[2rem]" src="/icon.png" alt="DigitalRightsMaykr" height="100" width="100" quality="95" priority={true}></Image>
            <h1 className={`${montserrat.className} flex ml-[2rem] items-center w-[25rem] text-3xl text-white font-bold`}>Digital Rights Maykr</h1>

            <div className="flex justify-end gap-4 right-0 w-full items-center text-white list-none">
                {links.map((link) => (
                    <li key={link.hash}>
                        <Link
                            className="inline-block text-xl uppercase after:duration-1000 ease-out after:block after:h-0.5 after:w-full after:origin-bottom-right after:scale-x-0 after:bg-purple-400 after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100"
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
