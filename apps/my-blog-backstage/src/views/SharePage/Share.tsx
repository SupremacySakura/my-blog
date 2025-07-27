//导入样式文件
import Style from './Share.module.less'
// 导入react相关模块
import React, { useEffect, useState } from 'react'
// 导入自定义类型
import type { iMomentUpload, iMomentDownload, iTechnology } from '@/types/interfaceType'
// 导入接口
import { getMoments, addMoment, deleteMoment, getTechnology, addTechnology, deleteTechnology } from '@/service/apis/share'
//导入antDesign组件
import { Image, Input, Button, message, Popconfirm, Popover } from 'antd'
const { TextArea } = Input
import {
    DeleteOutlined,
} from '@ant-design/icons'
import type { PopconfirmProps } from 'antd'
import { formatDate } from '@/utils'
function Share() {
    //moment列表
    const [momentList, setMomentList] = useState<iMomentDownload[]>([])
    /**
     * 获取moment列表
     * @returns moment列表
     */
    const handleGetMoments = async () => {
        try {
            const res = await getMoments()
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
                const momentRes = await handleGetMoments()
                setMomentList(momentRes)
                const technologyRes = await handleGetTechnology()
                setTechnologyList(technologyRes)
            } catch (err) {
                console.log(err)
            }
        }
        init()
    }, [])
    //分享数据
    const [uid, setUid] = useState(1)
    const [name, setName] = useState('')
    const [content, setContent] = useState('')
    const [time, setTime] = useState('')
    const [moment, setMoment] = useState<iMomentUpload>({} as iMomentUpload)
    //计算出新增结果
    useEffect(() => {
        setMoment({
            user_id: uid,
            content: content,
            time: time || formatDate(),
        })
    }, [name, content, time])
    /**
        * 添加分享
        * @param moment 分享
        */
    const handleAddMoment = async (moment: iMomentUpload) => {
        try {
            const res = await addMoment(moment)
            if (res.data.code === 200) {
                message.success('添加成功')
                const momentRes = await handleGetMoments()
                setMomentList(momentRes)
                setName('')
                setContent('')
                setTime('')
            } else {
                message.error('添加失败')
                console.log('error', res.data.error)
            }
        } catch (err) {
            message.error('添加失败')
            console.log('error', err)
        }

    }
    /**
    * 删除分享
    * @param technology 技术栈
    */
    const handleDeleteMoment = async (moment: iMomentUpload, e: React.MouseEvent | undefined) => {
        if (e) {
            e.stopPropagation()
            if (moment.id) {
                try {
                    const res = await deleteMoment(moment.id)
                    console.log(res.data)
                    const MomentRes = await handleGetMoments()
                    setMomentList(MomentRes)
                    message.success('删除成功')
                } catch (err) {
                    message.error('删除失败')
                    console.log('error', err)
                }
            }
        }
    }
    //技术栈列表
    const [technologyList, setTechnologyList] = useState<iTechnology[]>([])
    /**
     * 获取技术栈列表
     * @returns 技术栈列表
     */
    const handleGetTechnology = async () => {
        try {
            const res = await getTechnology()
            return res.data.data.reverse()
        } catch (err) {
            console.log(err)
            return []
        }
    }
    //技术栈添加数据
    const [photo, setPhoto] = useState('')
    const [text, setText] = useState('')
    const [src, setSrc] = useState('')
    const [height, setHeight] = useState(0)
    const [icon, setIcon] = useState('')
    const [note, setNote] = useState('')
    const [technology, setTechnology] = useState<iTechnology>({} as iTechnology)
    //计算出技术栈新增结果
    useEffect(() => {
        setTechnology({
            photo: photo,
            text: text,
            src: src,
            height: height,
            icon: icon,
            note: note,
        })
    }, [photo, text, src, height, icon, note])
    /**
     * 添加技术栈
     * @param technology 技术栈
     */
    const handleAddTechnology = async (technology: iTechnology) => {
        try {
            const tchnologyRes = await addTechnology(technology)
            if (tchnologyRes.data.code === 200) {
                message.success('添加成功')
                const res = await handleGetTechnology()
                setTechnologyList(res)
                setPhoto('')
                setText('')
                setSrc('')
                setHeight(0)
                setIcon('')
                setNote('')
            } else {
                message.error('添加失败')
                console.log('error', tchnologyRes.data.error)
            }
        }
        catch (err) {
            message.error('添加失败')
            console.log('error', err)
        }
    }
    /**
     * 跳转至指定页面
     * @param src 地址
     */
    const handleGoToPage = (src: string) => {
        window.open(src, '_blank')
    }
    /**
     * 删除技术栈
     * @param technology 技术栈
     */
    const handleDeleteTechnology = async (technology: iTechnology, e: React.MouseEvent | undefined) => {
        if (e) {
            e.stopPropagation()
            if (technology.id) {
                try {
                    const res = await deleteTechnology(technology.id)
                    console.log(res.data)
                    const technologyRes = await handleGetTechnology()
                    setTechnologyList(technologyRes)
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
    }
    return (
        <>
            <div className={Style.shareBox}>
                <section className={Style.momentBox}>
                    <h2 className={Style.sectionTitle}>分享内容</h2>
                    <form className={Style.momentForm}>
                        <div className={Style.momentInputDiv}>
                            <span>用户ID</span>
                            <Input value={uid} onChange={(e) => { setUid(+e.target.value) }}></Input>
                        </div>
                        <div className={Style.momentInputDiv}>
                            <span>内容</span>
                            <TextArea placeholder="" autoSize value={content} onChange={(e) => { setContent(e.target.value) }}></TextArea>
                        </div>
                        <div className={Style.momentInputDiv}>
                            <span>时间</span>
                            <Input value={time} onChange={(e) => { setTime(e.target.value) }}></Input>
                        </div>
                        <div className={Style.inputSubmit}>
                            <Button type='primary' onClick={() => handleAddMoment(moment)}>增加</Button>
                        </div>
                    </form>
                    <div className={Style.momentList}>
                        <ul>
                            {momentList.map((item) => {
                                return <li key={item.id} className={Style.momentItem}>
                                    <div className={Style.momentInfo}>
                                        <div className={Style.topBox}>
                                            <div className={Style.userHeadPortrait}>
                                                <Image src={item.avatar} width={50} height={50} style={{ borderRadius: '50%' }}></Image>
                                            </div>
                                            <span>{item.username}</span>
                                        </div>
                                        <div>
                                            <time>{item.time}</time>
                                        </div>
                                    </div>
                                    <p>{item.content}</p>
                                    <Popconfirm
                                        title="删除这个分享"
                                        description="你确定删除这个分享吗？"
                                        onConfirm={(e) => handleDeleteMoment(item, e)}
                                        onCancel={(e) => { cancel(e) }}
                                        okText="确定"
                                        cancelText="取消"

                                    >
                                        <Button type='primary' danger shape='circle' style={{ position: 'absolute', bottom: '10px', right: '10px' }} icon={<DeleteOutlined />} onClick={(e) => { stopPropagation(e) }}></Button>
                                    </Popconfirm>
                                </li>
                            })}
                        </ul>
                    </div>
                </section>
                <section className={Style.technologyBox}>
                    <h2 className={Style.sectionTitle}>技术栈</h2>
                    <form className={Style.technologyForm}>
                        <div className={Style.technologyInputDiv}>
                            <span>图片地址</span>
                            <Input value={photo} onChange={(e) => { setPhoto(e.target.value) }}></Input>
                        </div>

                        <div className={Style.technologyInputDiv}>
                            <span>名字</span>
                            <Input value={text} onChange={(e) => { setText(e.target.value) }}></Input>
                        </div>
                        <div className={Style.technologyInputDiv}>
                            <span>链接</span>
                            <Input value={src} onChange={(e) => { setSrc(e.target.value) }}></Input>
                        </div>
                        <div className={Style.technologyInputDiv}>
                            <span>高度</span>
                            <Input value={height} onChange={(e) => { setHeight(Number(e.target.value)) }}></Input>
                        </div>
                        <div className={Style.technologyInputDiv}>
                            <span>图标地址</span>
                            <Input value={icon} onChange={(e) => { setIcon(e.target.value) }}></Input>
                        </div>
                        <div className={Style.technologyInputDiv}>
                            <span>提示内容</span>
                            <TextArea autoSize value={note} onChange={(e) => { setNote(e.target.value) }}></TextArea>
                        </div>
                        <div className={Style.inputSubmit}>
                            <Button type='primary' onClick={() => handleAddTechnology(technology)}>增加</Button>
                        </div>
                    </form>
                    <div className={Style.technologyList}>
                        <ul>
                            {technologyList.map((item) => {
                                return <li key={item.id} className={Style.technologyItem} style={{ height: item.height }} onClick={() => handleGoToPage(item.src)}>
                                    <img src={item.photo} className={Style.photo}></img>
                                    <div className={Style.technologyInfo}>
                                        <div className={Style.block}></div>
                                        <Image src={item.icon} width={50} height={50} ></Image>
                                        <span className={Style.text}>{item.text}</span>
                                        <Popover content={(<div>{item.note}</div>)} title="Title">
                                            <Button>了解</Button>
                                        </Popover>
                                        <Popconfirm
                                            title="删除这个技术栈"
                                            description="你确定删除这个技术栈吗？"
                                            onConfirm={(e) => handleDeleteTechnology(item, e)}
                                            onCancel={(e) => { cancel(e) }}
                                            okText="确定"
                                            cancelText="取消"

                                        >
                                            <Button type='primary' danger shape='circle' style={{ position: 'absolute', top: '10px', right: '10px' }} icon={<DeleteOutlined />} onClick={(e) => { stopPropagation(e) }}></Button>
                                        </Popconfirm>
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                </section>
            </div>
        </>
    )
}

export default Share
