import Style from './Friend.module.less'
// 导入react相关模块
import React, { useEffect, useState } from 'react'
// 导入自定义类型
import { iFriendUpload,iFriendDownload } from '@/types/interfaceType'
// 导入接口
import { addFriend, deleteFriend, getFriendList, changeFriendStatus } from '@/service/apis/friend'
//导入antDesign组件
import { Image, Input, Button, message, Popconfirm } from 'antd'
import {
    DeleteOutlined,
} from '@ant-design/icons'
import type { PopconfirmProps } from 'antd'
import classNames from 'classnames'
function Friend() {
    const [friendList, setFriendList] = useState<iFriendDownload[]>([])
    /**
     * 获取朋友列表
     * @returns 朋友列表
     */
    const handleGetFriend = async () => {
        try {
            const res = await getFriendList()
            return res.data.data.reverse()
        } catch (err) {
            console.log(err)
            return []
        }
    }
    /**
     * 初始化
     */
    const init = async () => {
        try {
            const friendRes = await handleGetFriend()
            setFriendList(friendRes)
        } catch (err) {
            console.log(err)
        }
    }
    useEffect(() => {
        init()
    }, [])
    const [myFriend, setMyFriend] = useState<iFriendUpload>({} as iFriendUpload)
    const [uid, setUid] = useState(0)
    const [name, setName] = useState('')
    const [label, setLabel] = useState('')
    const [url, setUrl] = useState('')
    useEffect(() => {
        setMyFriend({
            user_id: uid,
            label: label,
            url: url,
            status: true
        })
    }, [uid, name, label, url])
    const handleAddFriend = async (friend: iFriendUpload) => {
        try {
            const res = await addFriend(friend)
            console.log(res.data)
            const friendRes = await handleGetFriend()
            setFriendList(friendRes)
            message.success('添加成功')
            setName('')
            setLabel('')
            setUrl('')
        } catch (err) {
            console.log(err)
            message.error('添加失败')
        }
    }
    /**
    * 删除文章
    * @param article 文章
    */
    const handleDeleteFriend = async (friend: iFriendUpload, e: React.MouseEvent | undefined) => {
        if (e) {
            e.stopPropagation()
            if (friend.id) {
                try {
                    const res = await deleteFriend(friend.id)
                    console.log(res.data)
                    const friendRes = await handleGetFriend()
                    setFriendList(friendRes)
                    message.success('删除成功')
                } catch (err) {
                    console.log(err)
                    message.error('删除失败')
                }
            }
        }

    }
    /**
        * 取消删除
        */
    const cancel: PopconfirmProps['onCancel'] = (e) => {
        if (e) {
            e.stopPropagation()
            message.error('取消删除')
        }
    }
    /**
        * 阻止冒泡
        * @param e 
        */
    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation()
    } /**
     * 跳转至指定页面
     * @param src 地址
     */
    const handleGoToPage = (src: string) => {
        window.open(src, '_blank')
    }
    const handleChangeFriendStatus = async (e: React.MouseEvent, id: number, status: boolean) => {
        stopPropagation(e)
        try {
            const res = await changeFriendStatus(id, status)
            if (res.data.code === 200) {
                message.success('修改成功')
                init()
            } else {
                message.error('修改失败')
            }
        } catch (err) {
            message.error('修改失败')
            console.log(err)
        }
    }
    return (
        <>
            <div className={Style.friendBox}>
                <section className={Style.leftBox}>
                    <h2 className={Style.sectionTitle}>添加友链</h2>
                    <form className={Style.leftForm}>
                        <div className={Style.friendInputDiv}>
                            <span>用户ID</span>
                            <Input value={uid} onChange={(e) => { setUid(+e.target.value) }}></Input>
                        </div>
                        <div className={Style.friendInputDiv}>
                            <span>标签</span>
                            <Input value={label} onChange={(e) => { setLabel(e.target.value) }}></Input>
                        </div>
                        <div className={Style.friendInputDiv}>
                            <span>链接</span>
                            <Input value={url} onChange={(e) => { setUrl(e.target.value) }}></Input>
                        </div>
                        <div className={Style.inputSubmit}>
                            <Button type='primary' onClick={() => handleAddFriend(myFriend)}>增加</Button>
                        </div>
                    </form>
                </section>
                <section className={Style.rightBox}>
                    <h2 className={Style.sectionTitle}>友链列表</h2>
                    <div className={Style.friendListBox}>
                        <ul>
                            {friendList.map((item) => {
                                return <li className={classNames(Style.friendListItem, item.status ? Style.friendListItemActive : Style.friendListItemFrozen)} key={item.id} onClick={() => handleGoToPage(item.url)}>
                                    <div className={Style.userHeadPortrait} onClick={(e) => { stopPropagation(e) }}>
                                        <Image src={item.avatar} width={50} height={50} style={{ borderRadius: '50%' }} ></Image>
                                    </div>
                                    <div className={Style.friendInfo}>
                                        <span>{item.username}</span>
                                        <span className={Style.friendLabel}>{item.label}</span>
                                    </div>
                                    <Popconfirm
                                        title="删除这个朋友"
                                        description="你确定删除这个朋友吗？"
                                        onConfirm={(e) => handleDeleteFriend(item, e)}
                                        onCancel={(e) => { cancel(e) }}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <Button type='primary' danger shape='circle' style={{ position: 'absolute', bottom: '10px', right: '10px', cursor: 'pointer', zIndex: 1 }} icon={<DeleteOutlined />} onClick={(e) => { stopPropagation(e) }}></Button>
                                    </Popconfirm>
                                    {item.status ?
                                        <Button style={{ position: 'absolute', bottom: '10px', right: '50px', cursor: 'pointer', zIndex: 1 }} onClick={(e) => { handleChangeFriendStatus(e, item.id as number, false) }}>冻结</Button>
                                        :
                                        <Button style={{ position: 'absolute', bottom: '10px', right: '50px', cursor: 'pointer', zIndex: 1 }} onClick={(e) => { handleChangeFriendStatus(e, item.id as number, true) }}>解冻</Button>
                                    }
                                </li>
                            })}
                        </ul>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Friend
