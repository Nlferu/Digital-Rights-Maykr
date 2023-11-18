export const links = [
    {
        name: "Home",
        hash: "/",
    },
    {
        name: "Gallery",
        hash: "/gallery",
    },
    {
        name: "Maykr",
        hash: "/maykr",
    },
    {
        name: "Manage",
        hash: "/manage",
    },
    {
        name: "Profits",
        hash: "/profits",
    },
    {
        name: "Clause",
        hash: "/clause",
    },
    {
        name: "About",
        hash: "/about",
    },
] as const

export const inputs = [
    { type: "text", name: "author", placeholder: "Author" },
    { type: "text", name: "co_author", placeholder: "Co-Author" },
    { type: "text", name: "title", placeholder: "Title" },
    { type: "text", name: "description", placeholder: "Description" },
] as const
