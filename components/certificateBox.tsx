import { BigNumber } from "ethers"
import { useState, useEffect } from "react"
import { useNotification } from "web3uikit"
import { RightsButton, DisabledButton } from "@/components/button"
import { useAddress, useContract, useConnectionStatus, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import style from "@/styles/loading.module.css"
import Typed from "react-typed"
import maykr from "@/contracts/DigitalRightsMaykr.json"
import Image from "next/image"

type CertificateBoxProps = {
    certificateId: number
    onCertificateClick: (token: number, url: string) => void
}

export default function CertificateBox({ certificateId, onCertificateClick }: CertificateBoxProps) {
    const [updatedUrl, setUpdatedUrl] = useState<string>("")
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const dispatch = useNotification()

    const contractAddress = maykr.address
    const abi = maykr.abi

    const { contract } = useContract(contractAddress, abi)
    const account = useAddress()
    const connectionStatus = useConnectionStatus()
    const lendingStatus = useContractRead(contract, "getLendingStatus", [certificateId])
    const metadataURI = useContractRead(contract, "tokenURI", [certificateId])
    const handleBuy = useContractWrite(contract, "buyLicense")

    const getCorrectImageUrl = async () => {
        metadataURI.data
        console.log("Metadata: ", metadataURI)

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
        if (connectionStatus === "connected") {
            setIsLoading(true)

            if (contract) {
                const price = await contract.call("getCertificatePrice", [certificateId])
                console.log("Price: ", price as number)

                try {
                    await handleBuy.mutateAsync({ args: [certificateId, account], overrides: { value: price as BigNumber } })
                    handleBuyRightsSuccess()
                } catch (error) {
                    handleBuyRightsError("Buying Rights Failed")
                    console.error(`Buying Rights To Use Certified Art Failed With Error: ${error}`)
                } finally {
                    setIsLoading(false)
                }
            } else {
                console.log("Contract does not exists")
            }
        } else {
            handleBuyRightsError("Wallet Not Connected")
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

    async function handleBuyRightsError(error: string) {
        dispatch({
            type: "error",
            message: error,
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
            <div className="hover:scale-110 duration-500 hover:drop-shadow-cert">
                {updatedUrl && updatedUrl.toString() !== "" ? (
                    <a onClick={() => onCertificateClick(certificateId, updatedUrl)}>
                        <Image
                            className="w-[17.5rem] h-[24.09rem] object-cover shadow-cert hover:shadow-none duration-500 hover:cursor-pointer"
                            src={updatedUrl}
                            height={400}
                            width={400}
                            quality="95"
                            priority={true}
                            alt="NFT Image"
                        />
                    </a>
                ) : (
                    <div className="text-[#5acdf1] font-bold w-[17.5rem] my-[12.045rem] text-center">
                        <div className="flex items-center justify-center gap-1">
                            Loading Image From IPFS
                            <Typed
                                className="text-[#5acdf1] font-bold w-[1rem]"
                                strings={["..."]}
                                typeSpeed={300}
                                backSpeed={10}
                                backDelay={700}
                                loop
                                showCursor={false}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="mt-[3rem]">
                {!lendingStatus.data ? (
                    <DisabledButton name="Unbuyable" />
                ) : (
                    <RightsButton name="Buy Rights" onClick={() => handleBuyRights()} disabled={isLoading} />
                )}
            </div>
        </div>
    )
}
