import React, { useState, useRef, MouseEvent } from "react"
import { BigNumber, ethers } from "ethers"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import { FaEthereum } from "react-icons/fa"
import maykr from "@/contracts/DigitalRightsMaykr.json"
import Tilt from "react-parallax-tilt"
import Image from "next/image"

type ModalProps = {
    children?: React.ReactNode
    tokenId: number
    closeModal: () => void
    selectedCertificateImage: string
}

export default function Modal({ children, tokenId, closeModal, selectedCertificateImage }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null)
    const flipRef = useRef<HTMLDivElement>(null)
    const [flipHorizontally, setFlipHorizontally] = useState<boolean>(false)

    const contractAddress = maykr.address
    const abi = maykr.abi

    const { contract } = useContract(contractAddress, abi)
    const lendingPeriod = useContractRead(contract, "getLendingPeriod", [tokenId])
    const certificatePrice = useContractRead(contract, "getCertificatePrice", [tokenId])

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        if (modalRef.current && e.target === modalRef.current) {
            closeModal()
            setFlipHorizontally(false)
        } else if (flipRef.current && e.target === flipRef.current) {
            setFlipHorizontally(false)
        }
    }

    const handleModalImageClick = () => {
        setFlipHorizontally(!flipHorizontally)
    }

    return (
        <div ref={modalRef} className="flex flex-col fixed items-center justify-center left-0 top-0 w-full h-full bg-black/60 z-10 px-2" onClick={handleClick}>
            <Tilt tiltReverse={true} glareEnable={true} glareColor="#a4a4a4" glareMaxOpacity={0.35} flipHorizontally={flipHorizontally}>
                {flipHorizontally ? (
                    <div
                        ref={flipRef}
                        className="hover:cursor-pointer gap-[15vw] sm:gap-20 font-bold text-2xl max-w-[500px] max-h-[565.109px] px-[4.791rem] py-[6.1rem] bg-stone-950 border border-black flex flex-col items-center justify-center my-rotate-y-180 shadow-cert"
                        onClick={handleClick}
                    >
                        <div className="text-green-600 underline underline-offset-4" style={{ textShadow: "4px 4px #000" }}>
                            Certificate Data
                        </div>
                        <div className="text-green-400" style={{ textShadow: "4px 4px #000" }}>
                            TokenId: <span className="text-white">{tokenId}</span>
                        </div>
                        <div className="flex text-green-400" style={{ textShadow: "4px 4px #000" }}>
                            Price:
                            <span className="text-white flex ml-[0.5rem]">
                                {certificatePrice ? parseFloat(ethers.utils.formatEther(certificatePrice.data as BigNumber)) : 0}
                                <FaEthereum className="ml-[0.4rem] mt-[0.1rem] text-3xl text-green-300" />
                            </span>
                        </div>
                        <div className="text-green-400 text-center" style={{ textShadow: "4px 4px #000" }}>
                            Lending Period:{" "}
                            <span className="text-white">
                                {lendingPeriod && lendingPeriod.data > 1 ? lendingPeriod.data + " days" : lendingPeriod.data + " day"}
                            </span>
                        </div>
                    </div>
                ) : (
                    <Image
                        className="shadow-cert hover:cursor-pointer"
                        src={selectedCertificateImage}
                        height={400}
                        width={400}
                        quality="95"
                        priority={true}
                        alt="NFT Image"
                        onClick={handleModalImageClick}
                    />
                )}
            </Tilt>

            <div>{children}</div>
            <div className="text-white text-center py-[2rem] text-2xl underline">Click card to view more details...</div>
        </div>
    )
}
