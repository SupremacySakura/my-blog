import { request } from "./request"
import { getClientInfo } from "@/utils/getClientInfo"

export async function postVisit(info: ReturnType<typeof getClientInfo>) {
  return request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(info)
  })
}

