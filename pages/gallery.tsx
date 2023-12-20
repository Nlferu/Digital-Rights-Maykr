import { useState, useEffect } from "react"
import { useSectionInView } from "@/lib/hooks"
import { useConnectionStatus } from "@thirdweb-dev/react"
import { useContract, useContractRead } from "@thirdweb-dev/react"
import maykr from "@/contracts/DigitalRightsMaykr.json"
import CertificateBox from "@/components/certificateBox"

type CertificateItem = {
    imageUrl: string
}

export default function Gallery() {
    const { ref } = useSectionInView("Gallery", 0.5)
    const [certificateData, setCertificateData] = useState<CertificateItem[]>([])

    const contractAddress = maykr.address
    const abi = maykr.abi

    const connectionStatus = useConnectionStatus()
    const { contract } = useContract(contractAddress, abi)
    const emitted = useContractRead(contract, "emittedCount")

    const handleGetCertificates = async () => {
        if (contract && emitted.data) {
            console.log("Tokens Emitted Amount: ", emitted.data.toNumber())

            try {
                const imageUrls: string[] = []

                for (let i = 0; i <= emitted.data.toNumber() - 1; i++) {
                    const metadataURI = await contract.call("tokenURI", [i])
                    console.log("Metadata: ", metadataURI)

                    const response = await fetch(metadataURI)
                    const metadata = await response.json()
                    console.log("Metadata for token", i, ": ", metadata)

                    const imageUrl = metadata.image
                    console.log("Image URL for token", i, ": ", imageUrl)
                    const updatedUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/")

                    imageUrls.push(updatedUrl)
                }
                setCertificateData(imageUrls.map((imageUrl) => ({ imageUrl })))
            } catch (error) {
                console.log("Following Error Occurred! ", error)
            }
        }
    }

    useEffect(() => {
        handleGetCertificates()
    }, [connectionStatus === "connected", emitted.data])

    return (
        <section className="min-h-[48.5rem]" ref={ref}>
            <div className="flex flex-wrap gap-10 mt-[8rem] p-[1rem] justify-center">
                {connectionStatus !== "connected" ? (
                    <div className="flex flex-col text-center items-center justify-center mt-[12rem] mb-0 sm:mb-[15rem]">
                        <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-6xl font-bold h-[20rem] sm:h-[11rem]">
                            Connect Your Wallet To View Certificates
                        </p>
                    </div>
                ) : certificateData.length === 0 ? (
                    <div className="flex flex-col text-center items-center justify-center mt-[12rem] mb-[16rem]">
                        <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-6xl font-bold h-[15rem] sm:h-[10rem]">
                            No Certificates To Display For Now...
                        </p>
                    </div>
                ) : (
                    certificateData.map((certificate, index) => <CertificateBox key={index} imageUrl={certificate.imageUrl} index={index} />)
                )}
            </div>
        </section>
    )
}
