import Certificate from "../styles/Certificate.module.css"
import contract from "../contracts/DigitalRightsMaykr.json"
import CertificateGenerator from "../components/CertificateGeneratorDD"

/** @dev Solution for this is that user needs to download his certificate, upload it into nft.storage or pinata and get CID number then in next tab "Mint NFT" he will provide
 * all details again to create Certificate
 */

const contractAddress = contract.address
const abi = contract.abi

export default function Home() {
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

    const imgGenerator = () => {
        return (
            <div>
                <CertificateGenerator />
            </div>
        )
    }

    const mintNftButton = () => {
        return (
            <button onClick={mintNftHandler} className={CreateCertificate.mint}>
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
            <div>{imgGenerator()}</div>
        </div>
    )
}
