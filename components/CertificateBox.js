import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import { useNotification } from "web3uikit"
import CertBox from "../styles/CertBox.module.css"
import Creation from "../styles/Creation.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"

export default function CertificateBox({ imageUrl, index }) {
    // Check if certificate rights are allowed to buy
    const { isWeb3Enabled, account } = useMoralis()
    const { runContractFunction } = useWeb3Contract()
    const [buttonStatus, setButtonStatus] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useNotification()

    const contractAddress = contract.address
    const abi = contract.abi

    const { runContractFunction: emittedCount } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "emittedCount",
        params: {},
    })

    const handleButtonStatus = async () => {
        try {
            const index = (await emittedCount()).toString()
            const statuses = []

            for (let i = 0; i <= index; i++) {
                // i will be our tokenId, nowwe have to call tokenURI function
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

                statuses.push(status)
            }
            setButtonStatus(statuses)
        } catch (error) {
            console.error("Error fetching data: ", error)
        }
    }

    const handleBuyRights = async (tokenId) => {
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
                    lendingTime: 30, // hardcoding parameters for now...
                    borrower: account, // hardcoding parameters for now...
                },
                msgValue: price,
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
        handleButtonStatus()
    }, [])

    return (
        <div className={CertBox.box}>
            <a href={imageUrl} target="_blank">
                <img src={imageUrl} alt="NFT Image" />
            </a>
            <div className={CertBox.additionalHover}>
                {!buttonStatus[index] ? (
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
