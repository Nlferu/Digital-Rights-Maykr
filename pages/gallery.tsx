import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import { useSectionInView } from "@/lib/hooks"
import contract from "@/contracts/DigitalRightsMaykr.json"
import CertificateBox from "@/components/certificateBox"

interface CertificateItem {
    imageUrl: string
}

interface JsonData {
    image: string
}

export default function Gallery() {
    const { ref } = useSectionInView("Gallery", 0.5)
    const { isWeb3Enabled } = useMoralis()
    const [certificateData, setCertificateData] = useState<CertificateItem[]>([])
    const [amount, setAmount] = useState<string>("")
    /* @ts-ignore */
    const { runContractFunction } = useWeb3Contract()

    const contractAddress = contract.address
    const abi = contract.abi

    const { runContractFunction: emittedCount } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "emittedCount",
        params: {},
    })

    const handleEmittedCertsCounter = async () => {
        /** @dev Wallet has to be connected to get below associated with -> isWeb3Enabled check */
        const getAmount = ((await emittedCount()) as string).toString()
        console.log(`Emitted Certs Count is: ${getAmount}`)
        setAmount(getAmount)
    }

    const handleGetCertificates = async (amount: number) => {
        try {
            const imageUrls: string[] = []

            for (let i = 0; i <= amount - 1; i++) {
                // i will be our tokenId, now we have to call tokenURI function
                const tokenUri = {
                    abi: abi,
                    contractAddress: contractAddress,
                    functionName: "tokenURI",
                    params: {
                        tokenId: i,
                    },
                }

                let getMetadata = await runContractFunction({
                    params: tokenUri,
                })

                const response = await fetch(getMetadata as string)

                const jsonData: JsonData = await response.json()

                const imageUrl = jsonData.image
                console.log(`image: ${imageUrl}`)
                const updatedUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/")

                imageUrls.push(updatedUrl)
            }
            const updatedCertificateData = imageUrls.map((imageUrl) => ({ imageUrl }))
            setCertificateData(updatedCertificateData)
        } catch (error) {
            console.error("Error fetching data: ", error)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (isWeb3Enabled) {
                await handleEmittedCertsCounter()
                await handleGetCertificates(parseInt(amount))
            }
        }

        fetchData()
    }, [isWeb3Enabled, amount])

    return (
        <section className="min-h-[48.5rem]" ref={ref}>
            <div className="flex flex-wrap gap-10 mt-[8rem] p-[1rem] justify-center">
                {!isWeb3Enabled ? (
                    <div className="flex flex-col text-center items-center justify-center mt-[12rem] mb-[16rem]">
                        <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-6xl font-bold h-[10rem]">
                            Connect Your Wallet To View Certificates
                        </p>
                    </div>
                ) : certificateData.length === 0 ? (
                    <div className="flex flex-col text-center items-center justify-center mt-[12rem] mb-[16rem]">
                        <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-6xl font-bold h-[10rem]">
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
