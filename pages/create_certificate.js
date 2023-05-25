import "../styles/CreateCertificate.module.css"
import { useEffect, useState } from "react"
import contract from "../contracts/DigitalRightsMaykr.json"
import InputFields from "../components/InputFields"
import CertificateGenerator from "../components/CertificateGenerator"

const contractAddress = contract.address
const abi = contract.abi

export default function Home() {
    // var artName = document.getElementById("artInput")
    // var author = document.getElementById("authorInput")
    // var description = document.getElementById("descriptionInput")

    // const retVal = () => {
    //     return console.log(`Art Name: ${artName.value}, \nAuthor: ${author.value}, \nDescription: ${description.value}`)
    // }

    const mintNftHandler = async () => {
        try {
            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const nftContract = new ethers.Contract(contractAddress, abi, signer)

                console.log("Initialize payment")
                let nftTxn = await nftContract.mintNFTs(1, { value: ethers.utils.parseEther("0.01") })

                console.log("Mining... please wait")
                await nftTxn.wait()

                console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`)
            } else {
                console.log("Ethereum object does not exist")
            }
        } catch (err) {
            console.log(err)
        }
    }

    const inputs = () => {
        return (
            <div>
                <InputFields />
            </div>
        )
    }

    const imgGenerator = () => {
        return (
            <div>
                <CertificateGenerator />
            </div>
        )
    }

    const mintNftButton = () => {
        return (
            <button onClick={imgGenerator} className="cta-button mint-nft-button">
                Mint NFT
            </button>
        )
    }

    const imageButton = () => {
        return (
            <button onClick={imgGenerator} className="cta-button mint-nft-button">
                Generate Image
            </button>
        )
    }

    return (
        <div>
            <h1>Page assigned for creating Cerificates</h1>
            <div>{mintNftButton()}</div>
            <div>{imageButton()}</div>
            <div>{inputs()}</div>
            <div>{imgGenerator()}</div>
        </div>
    )
}
