import { motion } from "framer-motion"

export default function Footer() {
    return (
        <motion.footer
            className="mt-auto mb-10 px-4 text-center text-gray-500"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.5 }}
        >
            <small className="mb-2 block text-xs">&copy; 2023 Niferu. All rights reserved.</small>
            <p className="text-xs">
                <span className="font-semibold">About this website:</span> built with React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS,
                Framer Motion, Vercel hosting.
            </p>
            <p className="text-xs">
                <span className="font-semibold">Backend built with:</span> Solidity, Hardhat & Typescript. Data straight from blockchain.
            </p>
        </motion.footer>
    )
}
