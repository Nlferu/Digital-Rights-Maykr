import React, { useState, useEffect } from "react"
import { ConnectButton } from "web3uikit"
import { links } from "@/lib/data"
import { Space_Grotesk } from "next/font/google"
import { FaBars, FaTimes } from "react-icons/fa"
import { useActiveSectionContext } from "@/context/active-section-context"
import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"

const montserrat = Space_Grotesk({ subsets: ["latin"] })

export default function Header() {
    const { activeSection, setActiveSection } = useActiveSectionContext()
    const [navBtn, setNavBtn] = useState(false)

    /** @dev Always set value opposite to current one */
    const handleNavBtn = () => setNavBtn(!navBtn)

    /** @dev Update navBtn based on screen width */
    const updateNavBtn = () => {
        if (window.innerWidth > 1024) {
            setNavBtn(false)
        }
    }

    /** @dev Add event listener for screen width changes */
    useEffect(() => {
        updateNavBtn()
        window.addEventListener("resize", updateNavBtn)
        return () => {
            window.removeEventListener("resize", updateNavBtn)
        }
    }, [])

    return (
        <header className="flex fixed w-full h-[4.5rem] bg-transparent z-10">
            <Image
                className="pl-[2rem] xl:ml-[3rem] h-[57.6px] w-[80px] sm:h-[72px] sm:w-[100px] mt-[0.3rem] sm:mt-[0]"
                src="/icon.png"
                alt="DigitalRightsMaykr"
                height="100"
                width="100"
                quality="95"
                priority={true}
            ></Image>

            <h1
                className={`${montserrat.className} fixed mt-[1.25rem] ml-[5rem] sm:ml-[6rem] xl:ml-[9rem] text-center w-[13rem] sm:w-[20rem] text-xl sm:text-3xl text-white font-bold`}
            >
                Digital Rights Maykr
            </h1>

            {/* Normal Version Of Navigation Bar */}
            <nav className="lg:flex hidden justify-end gap-4 mr-[1.5rem] w-full items-center text-white list-none">
                {links.map((link) => (
                    <li key={link.hash}>
                        <Link
                            className={clsx(
                                "inline-block hover:text-lightB text-xl uppercase after:duration-1000 ease-out after:block after:h-[0.15rem] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-slider after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100",
                                {
                                    "text-lightB": activeSection === link.name,
                                }
                            )}
                            href={link.hash}
                            onClick={() => {
                                setActiveSection(link.name)
                                setNavBtn(false)
                            }}
                        >
                            {link.name}
                        </Link>
                    </li>
                ))}
            </nav>

            {/* Mobile Version Of Navigation Bar */}
            <nav
                className={
                    navBtn
                        ? "lg:hidden text-center items-center text-white list-none absolute w-full top-[4.6rem] flex-col bg-black bg-opacity-70 backdrop-blur-[5px] rounded-b-lg"
                        : "hidden"
                }
            >
                <div className="mt-[0.5rem]">
                    {links.map((link) => (
                        <li className="" key={link.hash}>
                            <Link
                                className={clsx(
                                    "inline-block hover:text-lightB text-xl uppercase after:duration-1000 ease-out after:block after:h-[0.15rem] after:w-full after:origin-bottom-right after:scale-x-0 after:bg-slider after:transition-transform after:hover:origin-bottom-left after:hover:scale-x-100",
                                    {
                                        "text-lightB": activeSection === link.name,
                                    }
                                )}
                                href={link.hash}
                                onClick={() => {
                                    setActiveSection(link.name)
                                    setNavBtn(false)
                                }}
                            >
                                {link.name}
                            </Link>
                        </li>
                    ))}
                </div>
                <div className="flex justify-center items-center mt-[0.5rem] mb-[1rem]">
                    <ConnectButton moralisAuth={false} />
                </div>
            </nav>
            <div className="hidden lg:flex absolute right-0 top-[4.5rem]">
                <ConnectButton moralisAuth={false} />
            </div>
            <div className={"flex lg:hidden self-center ml-auto mr-[3rem] text-2xl text-white hover:cursor-pointer"}>
                {navBtn ? <FaTimes onClick={handleNavBtn} /> : <FaBars onClick={handleNavBtn} />}
            </div>
        </header>
    )
}
