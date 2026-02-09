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
import {
    getArticles,
    getSayingList,
    getOwner,
    getAddressList,
    getLabels,
    getTechnologies,
    getStatistics
} from "@/service"

export const dynamic = "force-dynamic"

export default async function Home() {
    const saying: ISaying[] = await getSayingList()
    const owner: IUser = await getOwner()
    const address: IAddress[] = await getAddressList()
    const label: ILabel[] = await getLabels()
    const technology: ITechnology[] = await getTechnologies()
    const statistics: IStatistics = await getStatistics()
    const article: IArticleItem[] = await getArticles()

   return (
        <div className="relative w-full min-h-screen bg-[#f8fafc] dark:bg-[#09090b] overflow-x-hidden">
            {/* 背景装饰光晕 */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 rounded-full blur-[120px]" />
            </div>

            {/* 头部视口 */}
            <section className="relative min-h-screen flex flex-col items-center justify-center gap-8 text-center px-4 z-10">
                <div className="relative group">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl group-hover:bg-blue-500/40 transition-all duration-500" />
                    <img
                        src={owner.avatar}
                        alt={owner.username}
                        className="relative w-32 h-32 rounded-full ring-4 ring-white dark:ring-zinc-800 shadow-2xl object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>
                
                <div className="space-y-2">
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                        {owner.username}
                    </h1>
                    <TypeWriter wordList={saying.map(item => item.text)} />
                </div>

                <div className="flex gap-4 flex-wrap justify-center mt-4">
                    {address.map(item => (
                        <IconMorphButton
                            key={item._id}
                            icon={item.icon}
                            text={item.text}
                            url={item.url}
                        />
                    ))}
                </div>
                
                {/* 向下指引 */}
                <div className="absolute bottom-10 animate-bounce text-gray-400">
                    <div className="w-1 h-12 bg-gradient-to-b from-blue-500 to-transparent rounded-full mx-auto" />
                </div>
            </section>

            {/* 内容区 */}
            <section className="relative z-20 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8 p-6 md:p-10 max-w-7xl mx-auto">
                {/* 左栏 */}
                <aside className="flex flex-col gap-8">
                    <TechStack techList={technology} />
                    <LabelCard label={label} />
                    <StatisticsCard statistics={statistics} />
                </aside>

                {/* 右栏文章列表 */}
                <main className="flex flex-col gap-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-2">
                            <span className="w-2 h-6 bg-blue-500 rounded-full" />
                            📝 最新文章
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {article.map(item => (
                            <ArticleCard key={item._id} article={item} />
                        ))}
                    </div>
                </main>
            </section>
        </div>
    )
}
