import { useWeb3Contract, useMoralis } from "react-moralis"
import { useState, useEffect } from "react"
import { useNotification } from "web3uikit"
import CertBox from "../styles/CertBox.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"

export default function CertificateBox({ imageUrl, index }) {
    // Check if certificate rights are allowed to buy
    const { isWeb3Enabled } = useMoralis()
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

                console.log(`Button ${i} Status: ${status}`)
                statuses.push(status)
            }
            setButtonStatus(statuses)
        } catch (error) {
            console.error("Error fetching data: ", error)
        }
    }

    const handleBuyRights = async (tokenId) => {
        setIsLoading(true)

        try {
            const buyLicense = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "buyLicense",
                params: {
                    tokenId: tokenId,
                    lendingTime: "30", // hardcoding parameters for now...
                    borrower: "0xe0c5aDdCfbd028FF4e69CDd6565efA5EedCFd743", // hardcoding parameters for now...
                },
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
        if (isWeb3Enabled) {
            handleButtonStatus()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            <div className={CertBox.objectMover}>
                <div className={CertBox.box}>
                    <div>
                        <img src={imageUrl} alt="NFT Image" />
                        <div className={CertBox.additionalHover}>
                            {console.log(`Button ${index} Status: ${buttonStatus[index]}`)}
                            <button className={CertBox.button} disabled={!buttonStatus[index]} onClick={() => handleBuyRights(index)}>
                                Buy Rights {index}
                                {buttonStatus[index] && <span> - Status: {buttonStatus[index]}</span>}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
