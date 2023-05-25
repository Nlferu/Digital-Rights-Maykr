import React from "react"

/** @dev
 * 1. Input file
 * 2. Art name
 * 3. Description
 * 4. hash -> generated
 * 5. author
 * 6. author address - auto
 * 7. date - generated
 * 8. certificate Id: hash_tokenId -> generated
 */

export default function InputFields() {
    return (
        <div>
            <input type="text" id="artInput" />
            <br />
            <input type="text" id="authorInput" />
            <br />
            <input type="text" id="descriptionInput" />
        </div>
    )
}
