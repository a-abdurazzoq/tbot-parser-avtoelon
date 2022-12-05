import * as fs from "fs";
import {storageFileUrls} from "../constants/file-system";

export default function getUrlsFromTxt(): string[] {
    let urls = fs.readFileSync(storageFileUrls, "utf-8")
    urls = urls.trim()
    return urls.split("\n")
}