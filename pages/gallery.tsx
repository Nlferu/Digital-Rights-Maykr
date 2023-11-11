import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import CertificateBox from "../components/CertificateBox"
import Gallery from "../styles/Gallery.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"

interface CertificateItem {
    imageUrl: string
}

interface JsonData {
    image: string
}

export default function Home() {
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
        <div className={Gallery.positioning}>
            {!isWeb3Enabled ? (
                <p className={Gallery.info}>Connect Your Wallet To See Certificates</p>
            ) : certificateData.length === 0 ? (
                <p className={Gallery.info}>No Certificates To Display For Now...</p>
            ) : (
                certificateData.map((certificate, index) => <CertificateBox key={index} imageUrl={certificate.imageUrl} index={index} />)
            )}
        </div>
    )
}
