import React from "react"
import { useSectionInView } from "@/lib/hooks"
import { useContract, useContractRead, useConnectionStatus } from "@thirdweb-dev/react"
import maykr from "@/contracts/DigitalRightsMaykr.json"
import CertificateBox from "@/components/certificateBox"

export default function Gallery() {
    const { ref } = useSectionInView("Gallery", 0.5)

    const contractAddress = maykr.address
    const abi = maykr.abi

    const connectionStatus = useConnectionStatus()
    const { contract } = useContract(contractAddress, abi)
    const emitted = useContractRead(contract, "emittedCount")

    return (
        <section className="min-h-[48.5rem]" ref={ref}>
            <div className="flex flex-wrap gap-10 mt-[8rem] p-[1rem] justify-center">
                {connectionStatus !== "connected" ? (
                    <div className="flex flex-col text-center items-center justify-center mt-[12rem] mb-0 sm:mb-[15rem]">
                        <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-6xl font-bold h-[20rem] sm:h-[11rem] drop-shadow-shady">
                            Connect Your Wallet To View Certificates
                        </p>
                    </div>
                ) : emitted.data && emitted.data.toNumber() === 0 ? (
                    <div className="flex flex-col text-center items-center justify-center mt-[12rem] mb-[16rem]">
                        <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-6xl font-bold h-[15rem] sm:h-[10rem] drop-shadow-shady">
                            No Certificates To Display For Now...
                        </p>
                    </div>
                ) : (
                    <div className="max-w-[100rem] flex items-center justify-center flex-wrap w-full gap-10 list-none mt-[1rem]">
                        {Array.from({ length: (emitted.data as number) || 0 }, (_, index) => (
                            <li className="" key={index}>
                                <React.Fragment key={index}>
                                    <CertificateBox certificateId={index} />
                                </React.Fragment>
                            </li>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
