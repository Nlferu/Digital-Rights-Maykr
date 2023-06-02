import { useWeb3Contract } from "react-moralis"
import { useState, useEffect } from "react"
import CertificateBox from "../components/CertificateBox"
import Gallery from "../styles/Gallery.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"

export default function Home() {
    const [certificateData, setCertificateData] = useState([])
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
        const index = (await emittedCount()).toString()
        const imageUrls = []

        for (let i = 0; i < index; i++) {
            // i will be our tokenId, nowwe have to call tokenURI function
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

            const response = await fetch(getMetadata)
            response
                .json()
                .then((jsonData) => {
                    // Access and work with the JSON data here
                    console.log(jsonData)
                    // Extract specific parameters from the JSON
                    const imageUrl = jsonData.image
                    // Update url
                    const updatedUrl = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/")
                    imageUrls.push(updatedUrl)
                })
                .catch((error) => {
                    console.error("Error:", error)
                })
            setCertificateData(imageUrls.map((imageUrl) => ({ imageUrl })))
        }
    }

    useEffect(() => {
        handleGetCertificates()
    }, [])

    return (
        <div class={Gallery.positioning}>
            {certificateData.map((certificate, index) => (
                <CertificateBox key={index} imageUrl={certificate.imageUrl} />
            ))}
        </div>
    )
}
