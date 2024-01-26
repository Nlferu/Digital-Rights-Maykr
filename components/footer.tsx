export default function Footer() {
    return (
        <footer className="mt-auto mb-10 px-4 text-center text-gray-500">
            <small className="mb-2 block text-xs">&copy; 2023 Niferu. All rights reserved.</small>
            <p className="text-xs">
                <span className="font-semibold">About this website:</span> built with React & Next.js (App Router & Server Actions), TypeScript, Tailwind CSS,
                Framer Motion, Vercel hosting.
            </p>
            <p className="text-xs">
                <span className="font-semibold">Backend built with:</span> Solidity, Hardhat & Typescript. Data straight from blockchain.
            </p>
        </footer>
    )
}
