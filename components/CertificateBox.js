import CertBox from "../styles/CertBox.module.css"

export default function CertificateBox({ imageUrl }) {
    // Check if certificate rights are allowed to buy

    return (
        <div>
            <div class={CertBox.objectMover}>
                <div class={CertBox.box}>
                    <div>
                        <img src={imageUrl} alt="NFT Image" />
                        <div class={CertBox.additionalHover}>
                            <button class={CertBox.button}>Buy Rights</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
