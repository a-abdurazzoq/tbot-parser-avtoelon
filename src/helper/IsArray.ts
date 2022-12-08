export default function isArray (data: any): data is Array<any> {
    return Array.isArray(data)
}