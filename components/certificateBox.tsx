import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import { useNotification } from "web3uikit"
import Image from "next/image"
import CertBox from "@/styles/CertBox.module.css"
import Creation from "@/styles/Creation.module.css"
import contract from "@/contracts/DigitalRightsMaykr.json"

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
        <div className={CertBox.box}>
            <a href={imageUrl} target="_blank">
                <Image src={imageUrl} height={200} width={200} alt="NFT Image" />
            </a>
            <div className={CertBox.additionalHover}>
                {!buttonStatus?.[index] ? (
                    <button className={CertBox.disabledButton}>Unbuyable</button>
                ) : (
                    <button className={CertBox.button} disabled={isLoading} onClick={() => handleBuyRights(index)}>
                        {isLoading ? <div className={Creation.waitSpinner}></div> : "Buy Rights"}
                    </button>
                )}
            </div>
        </div>
    )
}
