import { BigNumber } from "ethers"
import { useState, useEffect } from "react"
import { useNotification } from "web3uikit"
import { RightsButton, DisabledButton } from "@/components/button"
import { useAddress, useContract, useContractRead, useContractWrite } from "@thirdweb-dev/react"
import maykr from "@/contracts/DigitalRightsMaykr.json"
import Tilt from "react-parallax-tilt"
import Image from "next/image"

type CertificateBoxProps = {
    imageUrl: string
    index: number
}

export default function CertificateBox({ imageUrl, index }: CertificateBoxProps) {
    const [buttonStatus, setButtonStatus] = useState<boolean[] | undefined>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const dispatch = useNotification()

    const contractAddress = maykr.address
    const abi = maykr.abi

    const { contract } = useContract(contractAddress, abi)
    const account = useAddress()
    const emitted = useContractRead(contract, "emittedCount")
    const handleBuy = useContractWrite(contract, "buyLicense")

    const handleButtonStatus = async (id: number) => {
        if (contract) {
            try {
                const statuses: boolean[] = []

                for (let i = 0; i <= id; i++) {
                    const lendingStatus = await contract.call("getLendingStatus", [i])
                    console.log(`Lending status for token: ${i} is: ${lendingStatus}`)

                    statuses.push(lendingStatus as boolean)
                }

                setButtonStatus(statuses)
            } catch (error) {
                console.log("FOllowing Error Ocurred! ", error)
            }
        }
    }

    const handleBuyRights = async (tokenId: number) => {
        setIsLoading(true)

        if (contract) {
            const price = await contract.call("getCertificatePrice", [tokenId])
            console.log("Price: ", price as number)

            try {
                await handleBuy.mutateAsync({ args: [tokenId, account], overrides: { value: price as BigNumber } })
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
        handleButtonStatus(emitted.data.toNumber())
    }, [emitted.data])

    return (
        <div className="">
            <div className="hover:scale-110 duration-500">
                <a href={imageUrl} target="_blank">
                    <Tilt tiltReverse={true} glareEnable={true} glareColor="#a4a4a4" glareMaxOpacity={0.25}>
                        <Image
                            className="w-[17.5rem] h-[24.09rem] object-cover shadow-dark"
                            src={imageUrl}
                            height={400}
                            width={400}
                            quality="95"
                            priority={true}
                            alt="NFT Image"
                        />
                    </Tilt>
                </a>
            </div>
            <div className="">
                {!buttonStatus?.[index] ? (
                    <DisabledButton name="Unbuyable" />
                ) : (
                    <RightsButton name="Buy Rights" onClick={() => handleBuyRights(index)} disabled={isLoading} />
                )}
            </div>
        </div>
    )
}
