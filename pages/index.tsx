import { useRouter } from "next/router"
import { Button } from "@/components/button"
import { useSectionInView } from "@/lib/hooks"
import { motion } from "framer-motion"

export default function Index() {
    const { ref } = useSectionInView("Home", 0.5)
    const router = useRouter()

    const handleClick = () => {
        router.push("/maykr")
    }

    return (
        <section className="w-full mt-[6rem] mb-[2rem] lg:mb-[5rem] text-center text-purple-200" ref={ref}>
            <motion.div className="text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 1 }}>
                <h1 className="bg-gradient-to-r from-pink-600 via-purple-600 to-red-600 inline-block h-[10rem] text-transparent bg-clip-text text-4xl sm:text-6xl font-bold drop-shadow-shady">
                    Welcome To Digital Rights Maykr!
                </h1>
            </motion.div>

            <motion.div
                className="flex flex-col items-center justify-center px-8"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.25, duration: 1 }}
            >
                <iframe width="640" height="360" src="https://www.youtube.com/embed/LLAGgFATvGY" allowFullScreen className="max-w-[90vw]"></iframe>

                <Button name="Enter Maykr!" onClick={handleClick} />
            </motion.div>
        </section>
    )
}
