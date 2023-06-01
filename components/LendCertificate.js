import { useWeb3Contract } from "react-moralis"
import React, { useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import Creation from "../styles/Creation.module.css"
import Lending from "../styles/Lending.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"

export default function LendCertificate() {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingB, setIsLoadingB] = useState(false)
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const combinedSipnner = `${Creation.generateButton} ${Creation.waitSpinnerCenter}`

    const contractAddress = contract.address
    const abi = contract.abi

    const handleLendCertificate = async () => {
        setIsLoading(true)

        try {
            var tokenId = document.getElementById("tokenId").value
            var price = document.getElementById("price").value

            // ETH Conversion To Wei
            let convPrice = ethers.utils.parseEther(price)

            const allowLending = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "allowLending",
                params: {
                    tokenId: tokenId,
                    price: convPrice,
                },
            }

            await runContractFunction({
                params: allowLending,
                onError: () => handleAllowError(),
                onSuccess: () => handleAllowSuccess(),
            })
        } catch (error) {
            console.error(`Allowing Certificate Lending Failed With Error: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleAllowSuccess() {
        dispatch({
            type: "success",
            message: "Certificate Lending Allowed",
            title: "Lending Allowed!",
            position: "bottomR",
            icon: "bell",
        })
    }

    async function handleAllowError() {
        dispatch({
            type: "error",
            message: "Lending Allowance Failed",
            title: "Allowance Error!",
            position: "bottomR",
            icon: "exclamation",
        })
    }
    const handleBlockCertificate = async () => {
        setIsLoadingB(true)

        try {
            var blockTokenId = document.getElementById("blockTokenId").value

            const blockLending = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "blockLending",
                params: {
                    tokenId: blockTokenId,
                },
            }

            await runContractFunction({
                params: blockLending,
                onError: () => handleBlockError(),
                onSuccess: () => handleBlockSuccess(),
            })
        } catch (error) {
            console.error(`Blocking Certificate Lending Failed With Error: ${error}`)
        } finally {
            setIsLoadingB(false)
        }
    }

    async function handleBlockSuccess() {
        dispatch({
            type: "success",
            message: "Certificate Lending Blocked",
            title: "Lending Blocked!",
            position: "bottomR",
            icon: "bell",
        })
    }

    async function handleBlockError(cid) {
        dispatch({
            type: "error",
            message: "Lending Blockage Failed",
            title: "Blockage Error!",
            position: "bottomR",
            icon: "exclamation",
        })
    }

    return (
        <div>
            <div className={Creation.inputsContainer}>
                <input type="text" className={Creation.inputBox} id="tokenId" name="tokenId" placeholder="TokenId" />
                <input type="text" className={Creation.inputBox} id="price" name="price" placeholder="Price" />
                <button className={combinedSipnner} onClick={handleLendCertificate} disabled={isLoading}>
                    {isLoading ? <div className={Creation.waitSpinner}></div> : "Allow Lending"}
                </button>
            </div>
            <div className={Lending.blockSpacing}>
                <input type="text" className={Creation.inputBox} id="blockTokenId" name="tokenId" placeholder="TokenId" />
                <button className={combinedSipnner} onClick={handleBlockCertificate} disabled={isLoading}>
                    {isLoadingB ? <div className={Creation.waitSpinner}></div> : "Block Lending"}
                </button>
            </div>
        </div>
    )
}
