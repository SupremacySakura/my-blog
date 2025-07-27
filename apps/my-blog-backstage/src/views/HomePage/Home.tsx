// 导入样式文件
import Style from './Home.module.less'
// 导入react相关模块
import { useState, useEffect, useRef } from 'react'
// 导入自定义类型
import { iTag, iTime, iInfo } from '@/types/interfaceType'
// 导入接口
import { getTag, addTag, deleteTag, updateMyArticle, getMyArticle, getMyInfo } from '@/service/apis/home'
import { getAsset } from '@/service/apis/asset'
//导入antDesign组件
import { Input, ColorPicker, Button, Flex, Popconfirm, message, Image } from 'antd'
import {
    DeleteOutlined,
} from '@ant-design/icons'
import type { PopconfirmProps } from 'antd'
//导入工具
import classNames from 'classnames'
import { addZero } from '@/utils'
import { marked } from 'marked'
function Home() {
    const [info,setInfo] = useState<iInfo>()
    //asset数据
    const [time, setTime] = useState<iTime>({
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
    })
    const [people, setPeople] = useState<number>(0)
    /**
     * 获取asset数据
     * @returns [iTime,number]
     */
    const handleGetAsset = async () => {
        try {
            const res = await getAsset()
            const startDate = new Date(res.data.data.time)
            const now = new Date()
            const betweenTime = now.getTime() - startDate.getTime()
            const time = {
                day: Math.floor(betweenTime / (24 * 3600 * 1000)),
                hour: Math.floor(betweenTime / (3600 * 1000)) % 24,
                minute: Math.floor(betweenTime / (60 * 1000)) % 60,
                second: Math.floor(betweenTime / 1000) % 60,
            }
            return [time, res.data.data.people]
        } catch (err) {
            console.log(err)
            return [null, null]
        }
    }
    // 标签列表
    const [tagList, setTagList] = useState<iTag[]>([])
    /**
     * 获取标签列表
     *  @returns tagList 标签列表
     */
    const handleGetTag = async () => {
        try {
            const res = await getTag()
            // setTagList(res.data.data)
            return res.data.data
        } catch (err) {
            console.log(err)
            return []
        }
    }
    //我的文章
    const [myArticle, setMyArticle] = useState<string>('')
    const myArticleRef = useRef<HTMLDivElement>(null)
    /**
     * 获取我的文章
     * @returns md文章
     */
    const handleGetMyArticle = async () => {
        try {
            const res = await getMyArticle()
            return res.data.data
        } catch (err) {
            console.log(err)
            return '# 404 NOT FOUND'
        }
    }
    marked.setOptions({
        gfm: true, // 启用 GitHub 风格的 Markdown
        breaks: true // 支持换行符
    })
    useEffect(() => {
        const getMyArticleHtml = async () => {
            const html = await marked(myArticle)
            if (myArticleRef.current) {
                myArticleRef.current.innerHTML = html
            }
        }
        getMyArticleHtml()
    }, [myArticle])
   
    /**
     * 获取我的信息
     * @returns 我的信息
     */
    const handleGetMyInfo = async () => {
        try {
            const res = await getMyInfo()
            return res.data.data
        } catch (err) {
            console.log(err)
            return {}
        }
    }
    //初始化
    useEffect(() => {
        let timer: NodeJS.Timeout
        const init = async () => {
            try {
                const tagRes = await handleGetTag()
                setTagList(tagRes)
                const articleRes = await handleGetMyArticle()
                setMyArticle(articleRes)
                const [time, people] = await handleGetAsset()
                setTime(time)
                setPeople(people)
                const myInfoRes = await handleGetMyInfo()
                console.log(myInfoRes)
                setInfo(myInfoRes)
                timer = setInterval(() => {
                    setTime((prevTime) => {
                        const { second, minute, hour, day } = prevTime
                        let newSecond = second + 1
                        let newMinute = minute
                        let newHour = hour
                        let newDay = day

                        if (newSecond >= 60) {
                            newSecond = 0
                            newMinute += 1
                        }
                        if (newMinute >= 60) {
                            newMinute = 0
                            newHour += 1
                        }
                        if (newHour >= 24) {
                            newHour = 0
                            newDay += 1
                        }

                        return { second: newSecond, minute: newMinute, hour: newHour, day: newDay }
                    })
                }, 1000)
            } catch (err) {
                console.log(err)
                message.error('初始化失败')
            }
        }
        init()
        return () => { clearInterval(timer) }
    }, [])
    //标签
    const [tagText, setTagText] = useState('标签预览')
    const [tagColor, setTagColor] = useState<string>('rgba(255, 255, 255, 1)')
    const [tagBackgroundColor, setTagBackgroundColor] = useState<string>('rgba(0, 0, 0, 1)')
    const [tag, setTag] = useState<iTag>({
        text: '标签预览',
        color: 'rgba(255, 255, 255, 1)',
        backgroundColor: 'rgba(0, 0, 0, 1)'
    })
    //处理预览标签
    useEffect(() => {
        setTag({
            text: tagText,
            color: tagColor,
            backgroundColor: tagBackgroundColor
        })
    }, [tagText, tagColor, tagBackgroundColor])
    /**
     * 添加标签
     * @param tag 标签
     */
    const handleAddTag = async (tag: iTag) => {
        try {
            const res = await addTag({ text: tag.text, color: tag.color, backgroundColor: tag.backgroundColor })
            console.log(res.data)
            const tagRes = await handleGetTag()
            setTagList(tagRes)
            message.success('添加成功')
            setTagText('标签预览')
            setTagColor('rgba(255, 255, 255, 1)')
            setTagBackgroundColor('rgba(0, 0, 0, 1)')
        } catch (err) {
            console.log(err)
            message.error('添加失败')
        }

    }
    /**
     * 删除标签
     * @param tag 标签
     */
    const handleDeleteTag = async (tag: iTag) => {
        if (tag.id) {
            try {
                const res = await deleteTag(tag.id)
                console.log(res.data)
                const tagRes = await handleGetTag()
                setTagList(tagRes)
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
    const cancel: PopconfirmProps['onCancel'] = () => {
        message.error('取消删除')
    }
    /**
     * 获取标签信息
     * @param tag 标签
     */
    const handleGetTagInfo = (tag: iTag) => {
        message.info(`字体颜色：${tag.color},背景颜色：${tag.backgroundColor}`)
    }
    /**
     * 更新文章方法
     * @param e 文件选择器返回值
     * @returns 
     */
    const handleUpdateMyArticle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) {
            return
        }
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await updateMyArticle(formData)
            message.success(res.data?.msg)
            const articleRes = await handleGetMyArticle()
            setMyArticle(articleRes)
        } catch (err) {
            message.error(`${err}`)
        }
    }
    return (
        <>
            <div className={Style.homeBox}>
                <header className={Style.homeHeader}>
                    <section>博客运行时间{addZero(time.day)}天{addZero(time.hour)}时{addZero(time.minute)}分{addZero(time.second)}秒</section>
                    <section>博客访问人数:{people}</section>
                </header>
                <main className={Style.homeBody}>
                    <section className={Style.tagBox}>
                        <h2 className={Style.sectionTitle}>标签管理</h2>
                        <div className={Style.tagForm}>
                            {/* 表单左侧输入区 */}
                            <div className={Style.tagFormInput}>
                                <Input placeholder="text" value={tagText} onChange={(e) => setTagText(e.target.value)} />
                                <div className={Style.tagFormColor}>
                                    <span>字体颜色</span>
                                    <ColorPicker defaultFormat='rgb' value={tagColor} onChange={(_, css) => { setTagColor(css) }} />
                                </div>
                                <div className={Style.tagFormColor}>
                                    <span>背景颜色</span>
                                    <ColorPicker defaultFormat='rgb' value={tagBackgroundColor} onChange={(_, css) => { setTagBackgroundColor(css) }} />
                                </div>
                            </div>
                            {/* 表单右侧预览区 */}
                            <div className={Style.tagFormPreview}>
                                <div className={Style.tagFormPreviewBox}>
                                    <span style={{ color: tagColor.toString(), backgroundColor: tagBackgroundColor.toString() }} className={Style.previewTag}>{tagText}</span>
                                </div>
                                <div className={Style.tagFormHandle}>
                                    <Flex gap="small" wrap>
                                        <Button type="primary" onClick={() => handleAddTag(tag)}>添加</Button>
                                    </Flex>
                                </div>
                            </div>
                        </div>
                        <div className={Style.tagList}>
                            <ul>
                                {tagList.slice().reverse().map((item) => {
                                    return (<li className={Style.tagItemBox} key={item.id}>
                                        <div className={Style.tagItem}>
                                            <div className={Style.tag} style={{ backgroundColor: item.backgroundColor, color: item.color }} onClick={() => handleGetTagInfo(item)}>{item.text}</div>
                                            <Popconfirm
                                                title="删除这个标签"
                                                description="你确定删除这个标签吗？"
                                                onConfirm={() => handleDeleteTag(item)}
                                                onCancel={cancel}
                                                okText="确定"
                                                cancelText="取消"
                                            >
                                                <Button type="primary" shape="circle" danger icon={<DeleteOutlined />}></Button>
                                            </Popconfirm>

                                        </div>

                                    </li>)
                                })}
                            </ul>
                        </div>
                    </section>
                    <section className={Style.myArticleBox}>
                        <h2 className={Style.sectionTitle}>个人文章</h2>
                        <div className={Style.myArticleInput}>
                            <label htmlFor='myArticle' className={Style.inputLabel}>
                                <span>更新我的文章:</span>
                                <div><span>上传我的文章(md)</span></div>
                            </label>
                            <input type="file" accept='.md' onChange={(e) => handleUpdateMyArticle(e)} id='myArticle' style={{ display: 'none' }} />
                        </div>
                        <div className={Style.myArticleShow}>
                            <div ref={myArticleRef} className={classNames('markdown-body', Style.markdownBox)}></div>
                        </div>
                    </section>
                    <section className={Style.myInfoBox}>
                        <h2 className={Style.sectionTitle}>个人信息</h2>
                        <div className={Style.myInfoShow}>
                            <div className={Style.myInfoShowBox}>
                                <Image src={info?.avatar} alt="头像" width={80} height={80} style={{ borderRadius: '50%' }}></Image>
                                <span>{info?.username}</span>
                                <p>{info?.introduce}</p>
                                <span>{info?.identity}</span>
                                <address>{info?.address}</address>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    )
}

export default Home
