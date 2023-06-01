import LendCertificate from "../components/LendCertificate"

export default function Home() {
    const lendCertificate = () => {
        return (
            <div>
                <LendCertificate />
            </div>
        )
    }

    return (
        <div>
            <div>{lendCertificate()}</div>
        </div>
    )
}
