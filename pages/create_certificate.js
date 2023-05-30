import CertificateGenerator from "../components/CertificateGenerator"

export default function Home() {
    const generateCertificate = () => {
        return (
            <div>
                <CertificateGenerator />
            </div>
        )
    }

    return (
        <div>
            <div>{generateCertificate()}</div>
        </div>
    )
}
