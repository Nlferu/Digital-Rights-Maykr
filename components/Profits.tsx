import { useWeb3Contract, useMoralis } from "react-moralis"
import React, { useState, useEffect, useRef } from "react"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import Proceeds from "@/styles/Proceeds.module.css"
import contract from "@/contracts/DigitalRightsMaykr.json"
import verseContract from "@/contracts/Verse.json"
import Gallery from "../styles/Gallery.module.css"

export default function Profits() {
    const { isWeb3Enabled, account } = useMoralis()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingB, setIsLoadingB] = useState<boolean>(false)
    const [proceeds, setProceeds] = useState<number>()
    /* @ts-ignore */
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const stakeRef = useRef<HTMLInputElement | null>(null)

    const spinnerW = `${Proceeds.buttonW} ${Proceeds.waitSpinnerCenter}`
    const spinnerV = `${Proceeds.buttonV} ${Proceeds.waitSpinnerCenter}`

    const contractAddress = contract.address
    const abi = contract.abi

    const verseContractAddress = verseContract.address
    const verseAbi = verseContract.abi

    const handleProceeds = async () => {
        try {
            const getProceeds = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "getProceeds",
                params: { lender: account },
            }

            const proceedsWei = await runContractFunction({
                params: getProceeds,
            })
            const proceedsEth = ethers.utils.formatEther(proceedsWei as number)
            if (parseFloat(proceedsEth) > 0) {
                setProceeds(parseFloat(proceedsEth))
            } else {
                setProceeds(0)
            }
        } catch (error) {
            console.error(`Getting Proceeds Failed With Error: ${error}`)
        }
    }

    const handleWithdraw = async () => {
        setIsLoading(true)

        try {
            const withdrawProceeds = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "withdrawProceeds",
                params: {},
            }

            await runContractFunction({
                params: withdrawProceeds,
                onError: () => handleWithdrawError(),
                onSuccess: () => handleWithdrawSuccess(),
            })
        } catch (error) {
            console.error(`Withdrawing Proceeds Failed With Error: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    async function handleWithdrawSuccess() {
        dispatch({
            type: "success",
            message: "Proceeds Withdrew",
            title: "Proceeds Withdrawal Success!",
            position: "bottomR",
            icon: "bell",
        })
    }

    async function handleWithdrawError() {
        dispatch({
            type: "error",
            message: "Proceeds Not Withdrew",
            title: "Proceeds Withdrawal Failure!",
            position: "bottomR",
            icon: "exclamation",
        })
    }

    const handleVerseStake = async () => {
        setIsLoadingB(true)

        try {
            var amount = stakeRef.current?.value

            const withdrawProceeds = {
                abi: abi,
                contractAddress: contractAddress,
                functionName: "withdrawProceeds",
                params: {},
            }

            await runContractFunction({
                params: withdrawProceeds,
            })

            /** @dev DISCLAIMER !!! */
            /* As Verse does not support testnets like Sepolia or Goerli below code should be taken just as an example !!! */

            const verseStaking = {
                abi: verseAbi,
                contractAddress: verseContractAddress,
                functionName: "verseStaking",
                params: {},
                msgValue: amount,
            }

            await runContractFunction({
                params: verseStaking,
                onError: () => handleVerseStakeError(),
                onSuccess: () => handleVerseStakeSuccess(),
            })
        } catch (error) {
            console.error(`Staking With Verse Failed With Error: ${error}`)
        } finally {
            setIsLoadingB(false)
        }
    }

    async function handleVerseStakeSuccess() {
        dispatch({
            type: "success",
            message: "Verse Staking Success",
            title: "Staking Success!",
            position: "bottomR",
            icon: "bell",
        })
    }

    async function handleVerseStakeError() {
        dispatch({
            type: "error",
            message: "Verse Staking Error",
            title: "Staking Failure!",
            position: "bottomR",
            icon: "exclamation",
        })
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            handleProceeds()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            {!isWeb3Enabled ? (
                <p className={Gallery.info}>Connect Your Wallet To See Certificates</p>
            ) : (
                <div>
                    <div className={Proceeds.containerW}>
                        <p className={Proceeds.headText}>Your Current Proceeds:</p>
                        <p className={Proceeds.amountText}>
                            <span className={Proceeds.amount}>{proceeds}</span> ETH
                        </p>
                        <button className={spinnerW} onClick={handleWithdraw} disabled={isLoading}>
                            {isLoading ? <div className={Proceeds.waitSpinner}></div> : "Withdraw"}
                        </button>
                    </div>
                    <div className={Proceeds.containerV}>
                        <p className={Proceeds.verseTxt}>Stake Your Proceeds With Verse!</p>
                        <input type="text" className={Proceeds.inputBox} ref={stakeRef} id="stake" name="stake" placeholder="Stake Amount (ETH)" />
                        <button className={spinnerV} onClick={handleVerseStake} disabled={isLoading}>
                            {isLoadingB ? <div className={Proceeds.waitSpinner}></div> : "Verse Stake"}
                        </button>
                        <p className={Proceeds.verseInfo}>
                            Rewards for staking are paid in Verse. Above function allows you to deposit your proceeds into Verse, which will give you some
                            Liquidity Pools (LP) tokens with some APY profit %. If you would like to go further you can deposit your generated LP tokens into
                            Verse Farms for even more profits! You can find more details here: <br></br>
                            <a href="https://verse.bitcoin.com/" target="_blank" rel="noopener noreferrer">
                                Verse
                            </a>
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
