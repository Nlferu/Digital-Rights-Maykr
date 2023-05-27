import Certificate from "../styles/Certificate.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"
import CertificateGenerator from "../components/CertificateGenerator"
import { useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"

/** @dev Solution for this is that user needs to download his certificate, upload it into nft.storage or pinata and get CID number then in next tab "Mint NFT" he will provide
 * all details again to create Certificate
 */

const contractAddress = contract.address
const abi = contract.abi

console.log(contractAddress)

export default function Home() {
    // const retVal = () => {
    //     return console.log(`Art Name: ${artName.value}, \nAuthor: ${author.value}, \nDescription: ${description.value}`)
    // }

    const { runContractFunction: emittedCount } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddress,
        functionName: "emittedCount",
        params: {},
    })

    const mintNftHandler = async () => {
        try {
            const { ethereum } = window

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum)
                const signer = provider.getSigner()
                const nftContract = new ethers.Contract(contractAddress, abi, signer)

                const accounts = await ethereum.request({ method: "eth_accounts" })
                const address = accounts.toString()

                const nfts = (await emittedCount()).toString()

                console.log(`Contract Address: ${contractAddress}, EmittedCount: ${nfts}, User Address: ${address}`)
            } else {
                console.log("Ethereum object does not exist")
            }
        } catch (err) {
            console.log(err)
        }
    }

    const imgGenerator = () => {
        return (
            <div>
                <CertificateGenerator />
            </div>
        )
    }

    const mintNftButton = () => {
        return <button onClick={mintNftHandler}>Mint NFT</button>
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
            <div>{imgGenerator()}</div>
            <div>{mintNftButton()}</div>
        </div>
    )
}
