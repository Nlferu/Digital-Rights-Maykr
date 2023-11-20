import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import { useNotification } from "web3uikit"
import { RightsButton, DisabledButton } from "@/components/button"
import contract from "@/contracts/DigitalRightsMaykr.json"
import Tilt from "react-parallax-tilt"
import Image from "next/image"

type CertificateBoxProps = {
    imageUrl: string
    index: number
}

export default function CertificateBox({ imageUrl, index }: CertificateBoxProps) {
    const { isWeb3Enabled, account } = useMoralis()
    /* @ts-ignore */
    const { runContractFunction } = useWeb3Contract()
    const [buttonStatus, setButtonStatus] = useState<boolean[] | undefined>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [amount, setAmount] = useState<string>("")
    const dispatch = useNotification()

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

        setAmount(getAmount)
    }

    const handleButtonStatus = async (id: number) => {
        const statuses: boolean[] = []

        for (let i = 0; i <= id; i++) {
            // Index i will be our tokenId, now we have to call tokenURI function
            const lendingStatus = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "getLendingStatus",
                params: {
                    tokenId: i,
                },
            }

            let status = await runContractFunction({
                params: lendingStatus,
            })

            statuses.push(status as boolean)
        }
        setButtonStatus(statuses)
    }

    const handleBuyRights = async (tokenId: number) => {
        setIsLoading(true)

        const getPrice = {
            abi: abi,
            contractAddress: contractAddress,
            functionName: "getCertificatePrice",
            params: {
                tokenId: tokenId,
            },
        }

        const price = await runContractFunction({
            params: getPrice,
        })

        try {
            const buyLicense = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "buyLicense",
                params: {
                    tokenId: tokenId,
                    borrower: account,
                },
                msgValue: price as number,
            }

            await runContractFunction({
                params: buyLicense,
                onError: () => handleBuyRightsError(),
                onSuccess: () => handleBuyRightsSuccess(),
            })
        } catch (error) {
            console.error(`Buying Rights To Use Certified Art Failed With Error: ${error}`)
        } finally {
            setIsLoading(false)
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
        const fetchData = async () => {
            if (isWeb3Enabled) {
                await handleEmittedCertsCounter()
                await handleButtonStatus(parseInt(amount))
            }
        }

        fetchData()
    }, [isWeb3Enabled, amount])

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
