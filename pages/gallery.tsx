import { useWeb3Contract } from "react-moralis"
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
    const [certificateData, setCertificateData] = useState<CertificateItem[]>([])

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

    const handleGetCertificates = async () => {
        try {
            const emittedCerts = (await emittedCount()) as string
            const emittedCertsInt = parseInt(emittedCerts)

            const imageUrls: string[] = []

            for (let i = 0; i <= emittedCertsInt - 1; i++) {
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
            localStorage.setItem("certificateData", JSON.stringify(updatedCertificateData))
        } catch (error) {
            console.error("Error fetching data: ", error)
        }
    }

    useEffect(() => {
        const storedData = localStorage.getItem("certificateData")

        if (storedData) {
            const certificateData = JSON.parse(storedData) as CertificateItem[]

            const updatedCertificateData = certificateData.map((item) => ({
                imageUrl: item.imageUrl,
            }))

            setCertificateData(updatedCertificateData)
        } else {
            console.log("No data found in local storage")
            handleGetCertificates()
        }
    }, [])

    return (
        <div className={Gallery.positioning}>
            {certificateData.length === 0 ? (
                <p className={Gallery.info}>No Certificates To Display For Now...</p>
            ) : (
                certificateData.map((certificate, index) => <CertificateBox key={index} imageUrl={certificate.imageUrl} index={index} />)
            )}
        </div>
    )
}
