export function rewritePrice(price: string): string {
    let str = price.replace(/&nbsp;/g, " ").replace(/у.е./g, "").trim()
    return `$ ${str}`
}

export function parsePosition(position: string): string {
    let str = position.split(",").at(-1)
    str = String(str).trim()

    if (!isPosition(str)) return ""

    return str[0]
}

function isPosition(str: string) {
    let expPosition = /pozitsiya/i

    if (!expPosition.test(str))
        return false

    return true
}

export function parseName(position: string): string {
    let str = position.split(",").at(0)

    if (!str) return ""

    return str
}