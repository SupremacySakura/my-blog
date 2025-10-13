import React from 'react'
import Image from 'next/image'
import friendBackground from '../../../../public/friend.png'
import NoticeCard from '@/components/business/NoticeCard/NoticeCard'
import { INotice } from '@/types/notice'
import { IFriend } from '@/types/friend'
import FriendCard from '@/components/business/FriendCard/FriendCard'
import ApplyFriendDialog from '@/components/business/ApplyFriendDialog/ApplyFriendDialog'
export default async function page() {
  const notice: INotice[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend/notice`, { method: "GET" })).json()).data
  const friendList: IFriend[] = (await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/friend`, { method: "GET" })).json()).data
  return (
    <div className="w-ful h-full">
      <Image
        src={friendBackground}
        alt="artcile"
        className="z-[-1] fixed w-full h-screen object-cover object-[right_top]"
      />
      <section className='w-full flex flex-col gap-4 p-22 items-center'>
        {/* 公告 */}
        <div className="w-full mx-auto mb-6">
          <NoticeCard notice={notice} />
        </div>

        {/* 友链 */}
        <div
          className="w-full p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-md
          "
        >
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            🤝 友链站点
          </h1>
          <div className=' flex gap-6 flex-wrap justify-center'>
            {friendList.length > 0 &&
              friendList.map((item) => (
                <FriendCard key={item._id} friend={item} />
              ))}
          </div>
        </div>

        {/* 申请友链 */}
        <div className="w-full p-6 bg-white/60 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl shadow-md">
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-3">
            🤝 申请友链
          </h1>
          <ApplyFriendDialog />
        </div>
      </section>
    </div>
  )
}
