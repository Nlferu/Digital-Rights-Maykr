import { useWeb3Contract } from "react-moralis"
import React, { useState } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import Proceeds from "../styles/Proceeds.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"

export default function Profits() {
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingB, setIsLoadingB] = useState(false)
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    // Display Proceeds Amount Based on acc connected
    // Inpute field (amount)
    // Add button for withdrawal
    // Add button for Verse
    // Add additional info about farms!

    const spinnerW = `${Proceeds.buttonW} ${Proceeds.waitSpinnerCenter}`
    const spinnerV = `${Proceeds.buttonV} ${Proceeds.waitSpinnerCenter}`

    const contractAddress = contract.address
    const abi = contract.abi

    const handleLendCertificate = async () => {
        setIsLoading(true)

        try {
            var tokenId = document.getElementById("tokenId").value
            var lendingTime = document.getElementById("lendingTime").value
            var price = document.getElementById("price").value

            // ETH Conversion To Wei
            let convPrice = ethers.utils.parseEther(price)

            const allowLending = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "allowLending",
                params: {
                    tokenId: tokenId,
                    lendingTime: lendingTime,
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

    async function handleBlockError() {
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
            <div className={Proceeds.containerW}>
                <p>Your Current Proceeds:</p>
                <p>amount</p>
                <button className={spinnerW} onClick={handleLendCertificate} disabled={isLoading}>
                    {isLoading ? <div className={Proceeds.waitSpinner}></div> : "Withdraw"}
                </button>
            </div>
            <div className={Proceeds.containerV}>
                <p>Stake your money with Verse</p>
                <input type="text" className={Proceeds.inputBox} id="stake" name="stake" placeholder="Stake Amount (ETH)" />
                <button className={spinnerV} onClick={handleBlockCertificate} disabled={isLoading}>
                    {isLoadingB ? <div className={Proceeds.waitSpinner}></div> : "Verse Stake"}
                </button>
                <p>You can also put your money into farm</p>
            </div>
        </div>
    )
}
