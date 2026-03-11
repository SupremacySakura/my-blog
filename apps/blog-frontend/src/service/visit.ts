import { getBaseUrl } from "@/lib/base-url";
import { request } from "./request"
import { getClientInfo } from "@/utils/getClientInfo"

export async function postVisit(info: ReturnType<typeof getClientInfo>) {
  return request(`${getBaseUrl()}/api/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(info)
  })
}

