export function rewritePrice(price: string): string {
    let str = price.replace(/&nbsp;/g, " ").replace(/у.е./g, "").trim()
    return `$ ${str}`
}

export function parsePosition(position: string): string {
    let str = position.split(",").at(-1)

    if(!str) return ""

    str = str.trim()

    return str[0]
}

export function parseName(position: string): string {
    let str = position.split(",").at(0)

    if(!str) return ""

    str = str.replace(/chevrolet/i, "").trim()

    return str
}