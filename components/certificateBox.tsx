import { BigNumber } from "ethers"
import { useState, useEffect } from "react"
import { useNotification } from "web3uikit"
import { RightsButton, DisabledButton } from "@/components/button"
import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import maykr from "@/contracts/DigitalRightsMaykr.json"
import Tilt from "react-parallax-tilt"
import Image from "next/image"

type CertificateBoxProps = {
    certificateId: number
}

export default function CertificateBox({ certificateId }: CertificateBoxProps) {
    const [updatedUrl, setUpdatedUrl] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const dispatch = useNotification()

    const contractAddress = maykr.address
    const abi = maykr.abi

    const { contract } = useContract(contractAddress, abi)
    const account = useAddress()
    const lendingStatus = useContractRead(contract, "getLendingStatus", [certificateId])
    const metadataURI = useContractRead(contract, "tokenURI", [certificateId])
    const handleBuy = useContractWrite(contract, "buyLicense")

    const getCorrectImageUrl = async () => {
        metadataURI.data
        //console.log("Metadata: ", metadataURI)

        const response = await fetch(metadataURI.data)
        const metadata = await response.json()
        //console.log("Metadata for token", certificateId, ": ", metadata)

        const imageUrl = metadata.image
        //console.log("Image URL for token", certificateId, ": ", imageUrl)

        const correctImage = imageUrl.replace("ipfs://", "https://ipfs.io/ipfs/")
        console.log(`Cprrect Image Link For Token ${certificateId} is: ${correctImage}`)

        return correctImage
    }

    const handleBuyRights = async () => {
        setIsLoading(true)

        if (contract) {
            const price = await contract.call("getCertificatePrice", [certificateId])
            console.log("Price: ", price as number)

            try {
                await handleBuy.mutateAsync({ args: [certificateId, account], overrides: { value: price as BigNumber } })
                handleBuyRightsSuccess()
            } catch (error) {
                handleBuyRightsError()
                console.error(`Buying Rights To Use Certified Art Failed With Error: ${error}`)
            } finally {
                setIsLoading(false)
            }
        } else {
            console.log("Contract does not exists")
        }
    }

    async function handleBuyRightsSuccess() {
        dispatch({
            type: "success",
            message: "Art Rights Acquired",
            title: "Rights Acquired!",
            position: "bottomR",
            icon: "bell",
        })
    }

    async function handleBuyRightsError() {
        dispatch({
            type: "error",
            message: "Buying Rights Failed",
            title: "Buying Rights Error!",
            position: "bottomR",
            icon: "exclamation",
        })
    }

    useEffect(() => {
        async function fetchData() {
            if (metadataURI.data) {
                const url = await getCorrectImageUrl()
                setUpdatedUrl(url)
            }
        }

        fetchData()
    }, [metadataURI.data])

    return (
        <div className="">
            <div className="hover:scale-110 duration-500">
                {updatedUrl && updatedUrl.toString() !== "" ? (
                    <a href={updatedUrl} target="_blank">
                        <Tilt tiltReverse={true} glareEnable={true} glareColor="#a4a4a4" glareMaxOpacity={0.25}>
                            <Image
                                className="w-[17.5rem] h-[24.09rem] object-cover shadow-dark"
                                src={updatedUrl}
                                height={400}
                                width={400}
                                quality="95"
                                priority={true}
                                alt="NFT Image"
                            />
                        </Tilt>
                    </a>
                ) : (
                    <div>There is no image</div>
                )}
            </div>
            <div className="">
                {!lendingStatus.data ? (
                    <DisabledButton name="Unbuyable" />
                ) : (
                    <RightsButton name="Buy Rights" onClick={() => handleBuyRights()} disabled={isLoading} />
                )}
            </div>
        </div>
    )
}
