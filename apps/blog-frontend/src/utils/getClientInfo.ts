// utils/getClientInfo.ts
import { UAParser } from "ua-parser-js"

export function getClientInfo() {
    const parser = new UAParser(navigator.userAgent)

    const device = parser.getDevice().type || "PC"
    const browser = parser.getBrowser().name || "Unknown"
    const os = parser.getOS().name || "Unknown"
    const timestamp = new Date().toISOString()

    return { device, browser, os, timestamp }
}
