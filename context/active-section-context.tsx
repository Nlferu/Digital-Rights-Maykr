import React, { useState, createContext, useContext } from "react"
import type { SectionName } from "@/lib/types"

type ActiveSectionContextProviderProps = {
    children: React.ReactNode
}

type ActiveSectionContextType = {
    activeSection: SectionName
    setActiveSection: React.Dispatch<React.SetStateAction<SectionName>>
}

const ActiveSectionContext = createContext<ActiveSectionContextType | null>(null)

/** @dev Component below will keep track of the state */
export default function ActiveSectionContextProvider({ children }: ActiveSectionContextProviderProps) {
    const [activeSection, setActiveSection] = useState<SectionName>("Home")

    return (
        <ActiveSectionContext.Provider
            value={{
                activeSection,
                setActiveSection,
            }}
        >
            {children}
        </ActiveSectionContext.Provider>
    )
}

/** @dev Custom Hook, which will allow us to access activeSection and setActiveSection values */
export function useActiveSectionContext() {
    const context = useContext(ActiveSectionContext)

    if (context === null) {
        throw new Error("useActiveSectionContext must be used within an ActiveSectionContextProvider")
    }

    return context
}
