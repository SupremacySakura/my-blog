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
        <div className="w-full min-h-screen">
            {/* 头部 */}
            <section className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
                <img
                    src={owner.avatar}
                    alt=""
                    className="w-28 h-28 rounded-full ring-4 ring-white/50 dark:ring-zinc-700"
                />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {owner.username}
                </h1>
                <TypeWriter wordList={saying.map(item => item.text)} />
                <div className="flex gap-4 flex-wrap justify-center">
                    {address.map(item => (
                        <IconMorphButton
                            key={item._id}
                            icon={item.icon}
                            text={item.text}
                            url={item.url}
                        />
                    ))}
                </div>
            </section>

            {/* 内容区 */}
            <section className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 p-4 max-w-7xl mx-auto">
                {/* 左栏 */}
                <aside className="flex flex-col gap-6">
                    <TechStack techList={technology} />
                    <LabelCard label={label} />
                    <StatisticsCard statistics={statistics} />
                </aside>

                {/* 文章列表 */}
                <main
                    className="
                        rounded-2xl
                        bg-white/70 dark:bg-zinc-900/60
                        backdrop-blur-md
                        border border-gray-200/60 dark:border-zinc-700/60
                        p-4 sm:p-6
                        flex flex-col gap-4
                    "
                >
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                        📝 最新文章
                    </h2>

                    {article.map(item => (
                        <ArticleCard key={item._id} article={item} />
                    ))}
                </main>
            </section>
        </div>
    )
}
