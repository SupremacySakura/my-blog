import IconMorphButton from "@/components/IconMorphButton/IconMorphButton"
import TypeWriter from "@/components/TypeWriter/TypeWriter"
import { IAddress } from "@/types/address"
import { ISaying } from "@/types/saying"
import { IUser } from "@/types/user"

export default async function Home() {
  const saying: ISaying[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`, { method: "GET" })).json()).data
  const owner: IUser = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/owner`, { method: "GET" })).json()).data
  const address: IAddress[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/address`, { method: "GET" })).json()).data
  return (
    <div className="w-full h-screen">
      <div className="relative w-full h-full flex items-center justify-center flex-col gap-5">
        <img src={owner.avatar} alt="" className="w-30 h-30 rounded-full"></img>
        <span className="text-2xl">{owner.username}</span>
        <TypeWriter wordList={[...saying.map((item) => item.text)]}></TypeWriter>
        <div className="flex gap-5">
          {address.map((item) => (<IconMorphButton key={item._id} icon={item.icon} text={item.text} url={item.url}></IconMorphButton>))}
        </div>
      </div>
      <div>

      </div>
    </div>
  )
}
