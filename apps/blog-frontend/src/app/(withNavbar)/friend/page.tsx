import NoticeCard from '@/components/business/NoticeCard'
import { INotice } from '@/types/notice'
import { IFriend } from '@/types/friend'
import FriendCard from '@/components/business/FriendCard'
import ApplyFriendDialog from '@/components/business/ApplyFriendDialog'
import { getFriendList, getFriendNotice } from '@/service'

export const dynamic = "force-dynamic"

export default async function Page() {
  const notice: INotice[] = await getFriendNotice()
  const friendList: IFriend[] = await getFriendList()

  return (
    <div className="min-h-full w-full bg-transparent p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* 公告部分 */}
        <NoticeCard notice={notice} />

        {/* 友链列表 */}
        <section className="p-8 bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
              <span className="text-blue-500">🤝</span> 友链站点
            </h1>
            <span className="text-sm text-gray-500 font-medium bg-white/50 dark:bg-gray-800/50 px-4 py-1 rounded-full">
              共 {friendList.length} 位小伙伴
            </span>
          </div>

          {friendList.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {friendList.map((item) => (
                <FriendCard key={item._id} friend={item} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">暂无友链，快来申请吧~</div>
          )}
        </section>

        {/* 申请区域 */}
        <section className="p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-xl rounded-[2.5rem] border border-white/40 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">互换友链？</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">欢迎各位大佬交换链接，共同成长</p>
          </div>
          <ApplyFriendDialog />
        </section>
      </div>
    </div>
  )
}