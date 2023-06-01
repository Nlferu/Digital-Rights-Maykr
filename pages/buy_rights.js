import BuyRights from "../components/BuyRights"

export default function Home() {
    const buyRights = () => {
        return (
            <div>
                <BuyRights />
            </div>
        )
    }

    return (
        <div>
            <div>{buyRights()}</div>
        </div>
    )
}
