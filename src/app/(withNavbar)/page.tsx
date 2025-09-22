import ArticleCard from "@/components/ArticleCard/ArticleCard"
import IconMorphButton from "@/components/IconMorphButton/IconMorphButton"
import LabelCard from "@/components/LabelCard/LabelCard"
import StatisticsCard from "@/components/StatisticsCard/StatisticsCard"
import TechStack from "@/components/TechStack/TechStack"
import TypeWriter from "@/components/TypeWriter/TypeWriter"
import { IAddress } from "@/types/address"
import { IArticleItem } from "@/types/article"
import { ILabel } from "@/types/label"
import { ISaying } from "@/types/saying"
import { IStatistics } from "@/types/statistics"
import { ITechnology } from "@/types/technology"
import { IUser } from "@/types/user"
import background from "../../../public/background.jpg"
import Image from "next/image"
export default async function Home() {
    const saying: ISaying[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`, { method: "GET" })).json()).data
    const owner: IUser = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/owner`, { method: "GET" })).json()).data
    const address: IAddress[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/address`, { method: "GET" })).json()).data
    const label: ILabel[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/label`, { method: "GET" })).json()).data
    const technology: ITechnology[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/technology`, { method: "GET" })).json()).data
    const statistics: IStatistics = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/statistics`, { method: "GET" })).json()).data
    const article: IArticleItem[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article`, { method: "GET" })).json()).data
    return (
        <div className="w-full h-screen">
            <Image src={background} alt="" className="fixed top-0 left-0 w-full h-screen object-cover z-[-1]"></Image>
            {/* 第一层 */}
            <div className="relative w-full h-full flex items-center justify-center flex-col gap-5">
                <img src={owner.avatar} alt="" className="w-30 h-30 rounded-full"></img>
                <span className="text-2xl">{owner.username}</span>
                <TypeWriter wordList={[...saying.map((item) => item.text)]}></TypeWriter>
                <div className="flex gap-5">
                    {address.map((item) => (<IconMorphButton key={item._id} icon={item.icon} text={item.text} url={item.url}></IconMorphButton>))}
                </div>
            </div>
            {/* 第二层 */}
            <div className="flex gap-5 p-4 h-screen">
                <section className="w-1/3 gap-5 flex flex-col">
                    {/* 技术栈 */}
                    <TechStack techList={technology}></TechStack>
                    {/* 标签 */}
                    <LabelCard label={label}></LabelCard>
                    {/* 博客统计 */}
                    <StatisticsCard statistics={statistics}></StatisticsCard>
                </section>
                <section className="w-2/3 bg-gray-300/30 backdrop-blur-md rounded-lg p-4 flex flex-col gap-4">
                    {article.length > 0 && article.map((item) => (<ArticleCard key={item._id} article={item} />))}
                </section>
            </div>
        </div>
    )
}
