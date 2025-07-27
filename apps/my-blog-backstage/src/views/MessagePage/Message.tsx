import Style from './Message.module.less'
import user from '@/assets/user.png'
//导入react相关模块
import { useState, useEffect } from 'react'
//导入自定义类型
import type { iMessage } from '@/types/interfaceType'
//导入接口
import { getMessageList, deleteMessage } from '@/service/apis/message'
//导入antDesign组件
import { Image, Button, message, Popconfirm } from 'antd'
import {
    DeleteOutlined,
} from '@ant-design/icons'
import type { PopconfirmProps } from 'antd'
function Message() {
    //留言列表
    const [messageList, setMessageList] = useState<iMessage[]>([])
    /**
         * 获取message列表
         * @returns message列表
         */
    const handleGetMessages = async () => {
        try {
            const res = await getMessageList()
            return res.data.data.reverse()
        } catch (err) {
            console.log(err)
            return []
        }
    }
    //初始化
    useEffect(() => {
        const init = async () => {
            try {
                const messageRes = await handleGetMessages()
                setMessageList(messageRes)
            } catch (err) {
                console.log(err)
            }
        }
        init()
    }, [])
    /**
     * 删除留言
     * @param techn 技术栈
     */
    const handleDeleteMessage = async (delMessage: iMessage) => {
        if (delMessage.id) {
            try {
                const res = await deleteMessage(delMessage.id)
                console.log(res.data)
                const messageRes = await handleGetMessages()
                setMessageList(messageRes)
                message.success('删除成功')
            } catch (err) {
                console.log(err)
                message.error('删除失败')
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

    return (
        <>
            <div className={Style.messageBox}>
                <section className={Style.messageListBox}>
                    <h2 className={Style.sectionTitle}>留言列表</h2>
                    <ul className={Style.messageList}>
                        {messageList.map((item) => {
                            return <li className={Style.messageItem}>
                                <div className={Style.userHeadPortrait}>
                                    <Image src={item.avatar} width={50} height={50} fallback={user}></Image>
                                </div>
                                <div className={Style.messageContent}>
                                    <h3>{item.username}</h3>
                                    <p>{item.content}</p>
                                    <div className={Style.messageInfo}>
                                        <time>{item.time}</time>
                                        <address>{item.address}</address>
                                    </div>
                                </div>
                                <Popconfirm
                                    title="删除这个留言"
                                    description="你确定删除这个留言吗？"
                                    onConfirm={() => handleDeleteMessage(item)}
                                    onCancel={() => { cancel() }}
                                    okText="确定"
                                    cancelText="取消"
                                >
                                    <Button type='primary' danger shape='circle' style={{ position: 'absolute', top: '5px', right: '5px' }} icon={<DeleteOutlined />}></Button>
                                </Popconfirm>
                            </li>
                        })}
                    </ul>
                </section>
            </div>
        </>
    )
}

export default Message
