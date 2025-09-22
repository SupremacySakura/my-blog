import React from 'react'
interface IParams {
    id: string
}
export default async function page({ params }: { params: IParams }) {
    const res = await (await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/article/url?id=${params.id}`, { cache: "no-store" })).json()
    console.log(res)
    return (
        <div className='h-screen box-border p-10 dark:bg-gray-300/30 backdrop-blur-sm'>
            <iframe src={res.data.article} className='box-border mt-4 w-full h-full rounded-lg' />
        </div>
    )
}
