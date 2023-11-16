import { useRouter } from "next/router"
import Button from "@/components/button"

export default function Index() {
    const router = useRouter()

    const handleClick = () => {
        router.push("/maykr")
    }

    return (
        <section className="w-full py-[6rem] text-center text-purple-200">
            <h1 className="font-bold text-4xl ">Welcome To Digital Rights Maykr!</h1>
            <div className="pt-[2rem] flex justify-center mb-[2rem]">
                <iframe width="640" height="360" src="https://www.youtube.com/embed/LLAGgFATvGY" allowFullScreen></iframe>
            </div>

            <div onClick={handleClick}>
                <Button name="Enter Maykr!" />
            </div>
        </section>
    )
}
