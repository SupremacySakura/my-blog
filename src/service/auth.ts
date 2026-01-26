import { request } from "./request"

export async function login(payload: { username: any; password: any; loginType: string }) {
  return request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
}

export async function registerVerify(email: string) {
  return request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/register/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email })
  })
}

export async function register(payload: { username: any; password: any; code: any; email: any }) {
  return request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  })
}

export async function checkOwnerRole() {
  const res = await request(`${process.env.NEXT_PUBLIC_SITE_URL}/api/login/checkRole`, { method: "POST" })
  return res.json()
}
