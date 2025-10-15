import ArticleCard from "@/components/business/ArticleCard"
import IconMorphButton from "@/components/my-ui/IconMorphButton"
import LabelCard from "@/components/business/LabelCard"
import StatisticsCard from "@/components/business/StatisticsCard"
import TechStack from "@/components/business/TechStack"
import TypeWriter from "@/components/my-ui/TypeWriter"
import { IAddress } from "@/types/address"
import { IArticleItem } from "@/types/article"
import { ILabel } from "@/types/label"
import { ISaying } from "@/types/saying"
import { IStatistics } from "@/types/statistics"
import { ITechnology } from "@/types/technology"
import { IUser } from "@/types/user"
import background from "../../../public/background.jpg"
import Image from "next/image"
import { getArticle } from "@/service"
export default async function Home() {
    const saying: ISaying[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/saying`, { method: "GET" })).json()).data
    const owner: IUser = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/user/owner`, { method: "GET" })).json()).data
    const address: IAddress[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/address`, { method: "GET" })).json()).data
    const label: ILabel[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/label`, { method: "GET" })).json()).data
    const technology: ITechnology[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/my/technology`, { method: "GET" })).json()).data
    const statistics: IStatistics = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/statistics`, { method: "GET" })).json()).data
    const article: IArticleItem[] = await getArticle()
    return (
        <div className="w-full h-screen">
            <Image src={background} alt="" className="fixed w-full h-screen object-cover z-[-1]"></Image>
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
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,1fr)_2fr] gap-5 p-4 h-screen">
                <section className="gap-5 flex flex-col">
                    {/* 技术栈 */}
                    <TechStack techList={technology}></TechStack>
                    {/* 标签 */}
                    <LabelCard label={label}></LabelCard>
                    {/* 博客统计 */}
                    <StatisticsCard statistics={statistics}></StatisticsCard>
                </section>

                <section className="bg-gray-300/30 backdrop-blur-md rounded-lg p-4 flex flex-col gap-4">
                    {article?.length > 0 &&
                        article.map((item) => (
                            <ArticleCard key={item._id} article={item} />
                        ))}
                </section>
            </div>
        </div>
    )
}
