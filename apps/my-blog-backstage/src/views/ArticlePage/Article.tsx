import Style from './Article.module.less'
// 导入react相关模块
import React, { useEffect, useState, useRef } from 'react'
// 导入自定义类型
import { iArticleUpload, iArticleDownload } from '@/types/interfaceType'
// 导入接口
import { getArticle, addArticle, deleteArticle } from '@/service/apis/article'
//导入antDesign组件
import { Image, Input, Button, message, Popconfirm } from 'antd'
const { TextArea } = Input
import {
    DeleteOutlined,
} from '@ant-design/icons'
import type { PopconfirmProps } from 'antd'
//导入工具
import useStorageState from '@/store/index.tsx'
import classNames from 'classnames'
import { marked } from 'marked'
import { formatDate, checkIfInstanceOf } from '@/utils'
function Article() {
    const [articleList, setArticleList] = useState<iArticleDownload[]>([])
    /**
     * 获取文章列表
     * @returns 文章列表
     */
    const handleGetArticle = async () => {
        try {
            const res = await getArticle()
            console.log(res.data.data)
            return res.data.data.reverse()
        } catch (err) {
            console.log(err)
            return []
        }
    }
    useEffect(() => {
        const init = async () => {
            try {
                const articleRes = await handleGetArticle()
                setArticleList(articleRes)
            } catch (err) {
                console.log(err)
            }
        }
        init()
    }, [])
    const [head, setHead] = useState('')
    const [digest, setDigest] = useState('')
    const [article, setArticle] = useState('')
    const [time, setTime] = useState('')
    const [cover, setCover] = useState('')
    const [uid, setUid] = useState(1)
    const [singleLabel, setSingleLabel] = useState('')
    const [label, setLabel] = useState<string[]>([])
    const [myArticle, setMyArticle] = useState<iArticleUpload>({} as iArticleUpload)
    useEffect(() => {
        setMyArticle({
            head: head,
            digest: digest,
            article: article,
            time: time || formatDate(),
            cover: cover,
            user_id: uid,
            label: label,
        })
    }, [head, digest, article, time, cover, uid, label])
    const addLabel = (singleLabel: string) => {
        setLabel([...label, singleLabel])
        setSingleLabel('')
    }
    //上传图片
    const { handleUploadImage } = useStorageState()
    const handleAddArticle = async (article: iArticleUpload) => {
        try {
            const res = await addArticle(article)
            console.log(res.data)
            const articleRes = await handleGetArticle()
            setArticleList(articleRes)
            setHead('')
            setDigest('')
            setArticle('')
            setTime('')
            setCover('')
            setLabel([])
            if (res.data.code === 200) {
                message.success('添加成功')
                return
            }
            message.error(res.data.msg)
        } catch (err) {
            console.log(err)
            message.error('添加失败')
        }
    }
    /**
     * 删除文章
     * @param article 文章
     */
    const handleDeleteArticle = async (article: iArticleUpload, e: React.MouseEvent | undefined) => {
        if (e) {
            e.stopPropagation()
            if (article.arid) {
                try {
                    const res = await deleteArticle(article.arid)
                    console.log(res.data)
                    const articleRes = await handleGetArticle()
                    setArticleList(articleRes)
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
    //我的文章
    const [chooseArticle, setChooseArticle] = useState<iArticleDownload>({} as iArticleDownload)
    const articleRef = useRef<HTMLDivElement>(null)
    marked.setOptions({
        gfm: true, // 启用 GitHub 风格的 Markdown
        breaks: true // 支持换行符
    })
    useEffect(() => {
        const getMyArticleHtml = async () => {
            const html = await marked(chooseArticle.article || '404 not found')
            if (articleRef.current) {
                articleRef.current.innerHTML = html
            }
        }
        getMyArticleHtml()
    }, [chooseArticle])
    /**
         * 阻止冒泡
         * @param e 
         */
    const stopPropagation = (e: React.MouseEvent) => {
        e.stopPropagation()
    }
    return (
        <>
            <div className={Style.articleBox}>
                <section className={Style.leftBox}>
                    <h2 className={Style.sectionTitle}>添加文章</h2>
                    <form className={Style.leftForm}>
                        <div className={Style.articleInputDiv}>
                            <span>标题</span>
                            <Input value={head} onChange={(e) => { setHead(e.target.value) }}></Input>
                        </div>
                        <div className={Style.articleInputDiv}>
                            <span>概要</span>
                            <TextArea autoSize value={digest} onChange={(e) => { setDigest(e.target.value) }}></TextArea>
                        </div>
                        <div className={classNames(Style.articleInputDiv, Style.articleInput)}>
                            <span>文章</span>
                            <TextArea autoSize value={article} onChange={(e) => { setArticle(e.target.value) }}></TextArea>
                        </div>
                        <div className={Style.articleInputDiv}>
                            <span>时间</span>
                            <Input value={time} onChange={(e) => { setTime(e.target.value) }}></Input>
                        </div>
                        <div className={Style.articleInputDiv}>
                            <span>封面</span>
                            <Input value={cover} onChange={(e) => { setCover(e.target.value) }}></Input>
                        </div>
                        <div className={Style.articleInputDiv}>
                            <span>用户ID</span>
                            <Input value={uid} onChange={(e) => { setUid(+e.target.value) }}></Input>
                        </div>
                        <div className={Style.articleInputDiv}>
                            <span>标签</span>
                            <Input value={singleLabel} onChange={(e) => { setSingleLabel(e.target.value) }}></Input>
                        </div>
                        <ul className={Style.labelList}>
                            <span>已有标签</span>
                            {label.map((item) => { return <li key={item}>{item}</li> })}
                        </ul>
                        <div className={Style.inputSubmit}>
                            <Button type='primary' onClick={() => handleAddArticle(myArticle)}>增加</Button>
                            <div>
                                <input type='file' accept='image/*' id='uploadImage' style={{ display: 'none' }} onChange={(e) => handleUploadImage(e, { folderName: 'article' })}></input>
                                <label htmlFor="uploadImage">
                                    <div className='button'>上传图片</div>
                                </label>
                            </div>
                            <Button onClick={() => addLabel(singleLabel)}>增加标签</Button>
                            <Button onClick={() => setLabel([])}>清空标签</Button>
                        </div>
                    </form>
                </section>
                <section className={Style.rightBox}>
                    <h2 className={Style.sectionTitle}>文章列表</h2>
                    <div className={Style.articleList}>
                        {!chooseArticle.article && <ul>
                            {articleList.map((item) => {
                                return <li className={Style.articleListItem} key={item.arid} onClick={() => { setChooseArticle(item) }}>
                                    <div className={Style.block}></div>
                                    <div className={Style.articleCover}>
                                        <Image src={item.cover} height={'100%'} width={'100%'}></Image>
                                    </div>
                                    <div className={Style.articleInfo}>
                                        <h2 style={{ wordBreak: 'break-word' }}>{item.head}</h2>
                                        <span className={Style.digest}>{item.digest}</span>
                                        <div>
                                            <Image src={item.avatar} width={50} height={50} style={{ borderRadius: '50%' }}></Image>
                                            <span>{item.username}</span>
                                            <time>{item.time}</time>
                                        </div>
                                        <Popconfirm
                                            title="删除这个文章"
                                            description="你确定删除这个文章吗？"
                                            onConfirm={(e) => handleDeleteArticle(item, e)}
                                            onCancel={(e) => { cancel(e) }}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <Button type='primary' danger shape='circle' style={{ position: 'absolute', bottom: '10px', right: '10px', cursor: 'pointer', zIndex: 1 }} icon={<DeleteOutlined />} onClick={(e) => { stopPropagation(e) }}></Button>
                                        </Popconfirm>
                                    </div>
                                </li>
                            })}
                        </ul>}
                    </div>
                    {chooseArticle.article && <div className={Style.articleShow}>
                        <Button onClick={() => { setChooseArticle({} as iArticleDownload) }}>返回</Button>
                        <h1>{chooseArticle.head}</h1>
                        <ul className={Style.labelList}>
                            {(checkIfInstanceOf(chooseArticle.label, Array) ? chooseArticle.label : []).map((item) => {
                                return <li key={item}>{item}</li>
                            })}
                        </ul>
                        <div ref={articleRef} className={classNames('markdown-body', Style.markdownBox)}></div>
                    </div>}
                </section>
            </div>
        </>
    )
}

export default Article
