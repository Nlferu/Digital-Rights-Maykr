import React, { useState, useRef } from "react"
import { useWeb3Contract, useMoralis } from "react-moralis"
import { useNotification } from "web3uikit"
import { ethers } from "ethers"
import { manageInputs } from "@/lib/data"
import { Button } from "@/components/button"
import { useSectionInView } from "@/lib/hooks"
import contract from "@/contracts/DigitalRightsMaykr.json"

export default function Manage() {
    const { ref } = useSectionInView("Manage", 0.5)
    const { isWeb3Enabled } = useMoralis()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isLoadingB, setIsLoadingB] = useState<boolean>(false)
    /* @ts-ignore */
    const { runContractFunction } = useWeb3Contract()
    const dispatch = useNotification()

    const refs = {
        tokenIdRef: useRef<HTMLInputElement | null>(null),
        lendingTimeRef: useRef<HTMLInputElement | null>(null),
        priceRef: useRef<HTMLInputElement | null>(null),
        blockTokenIdRef: useRef<HTMLInputElement | null>(null),
    }

    const contractAddress = contract.address
    const abi = contract.abi

    const handleLendCertificate = async () => {
        setIsLoading(true)

        try {
            var tokenId = refs.tokenIdRef.current?.value
            var lendingTime = refs.lendingTimeRef.current?.value
            var price = refs.priceRef.current?.value
            console.log(`TokenId: ${tokenId} LendingTime: ${lendingTime} Price: ${price}`)

            // ETH Conversion To Wei
            let convPrice = ethers.utils.parseEther(price as string)

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
            var blockTokenId = refs.blockTokenIdRef.current?.value

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
        <div ref={ref}>
            {!isWeb3Enabled ? (
                <div className="flex flex-col text-center items-center justify-center mt-[20rem] mb-[17.5rem]">
                    <p className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block text-transparent bg-clip-text text-6xl font-bold h-[11rem]">
                        Connect Your Wallet To Manage Certificates
                    </p>
                </div>
            ) : (
                <div>
                    <div className="flex mt-[7rem] justify-center mb-[1rem]">
                        <h4 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-4xl font-bold">
                            Lend Certificate
                        </h4>
                    </div>
                    <div className="flex flex-col text-center">
                        <div className="flex flex-col gap-3 w-[16rem] self-center">
                            {manageInputs.map((input) => (
                                <input
                                    className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                                    key={input.name}
                                    type={input.type}
                                    name={input.name}
                                    id={input.name}
                                    ref={refs[input.ref]}
                                    placeholder={input.placeholder}
                                ></input>
                            ))}

                            <Button name="Allow Lending" onClick={handleLendCertificate} disabled={isLoading} />
                        </div>
                        <div className="flex mt-[5rem] justify-center">
                            <h4 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[5rem] text-transparent bg-clip-text text-4xl font-bold">
                                Block Certificate
                            </h4>
                        </div>
                        <div className="flex flex-col gap-3 w-[16rem] self-center">
                            <input
                                type="text"
                                className="p-[0.7rem] border-0 rounded-xl bg-impale hover:bg-hpale shadow-dark text-center text-gray-300 focus:text-gray-300 placeholder:text-gray-100"
                                ref={refs.blockTokenIdRef}
                                id="blockTokenId"
                                name="tokenId"
                                placeholder="TokenId"
                            />

                            <Button name="Block Lending" onClick={handleBlockCertificate} disabled={isLoadingB} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
