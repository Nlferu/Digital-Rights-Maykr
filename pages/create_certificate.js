import CreateCertificate from "../components/CreateCertificate"

export default function Home() {
    const createCertificate = () => {
        return (
            <div>
                <CreateCertificate />
            </div>
        )
    }

    return (
        <div>
            <div>{createCertificate()}</div>
        </div>
    )
}
