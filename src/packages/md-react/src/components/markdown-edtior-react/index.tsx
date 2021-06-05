import { useCallback, useEffect, useRef, useState } from 'react'
import { PropsType } from './types'
import { MarkdownEditorContainer } from "./style/style"
import { Spin, Modal, Input, message } from "antd"
import NavBar from "./NavBar"
import "antd/dist/antd.css"
import "./style/global.css"
import md from "./markdown"
const throttle = require("lodash.throttle")
const HtmlToMd = require("html-to-md")
let scrolling: 0 | 1 | 2 = 0 // 当前滚动块的状态 0: both: none 1: edit 2: show
let scrollTimer: any // 改变scroll值的定时器
let initValue: string = localStorage.getItem("md-react-value") as string ? localStorage.getItem("md-react-value") as string: ""
export default function MarkDownEditor(props: PropsType) {
    const [loading, setLoading] = useState(false)
    const [fullScreen, setFullScreen] = useState(false)
    const [htmlString, setHtmlString] = useState("")
    const editRef = useRef<any>(null)
    const showRef = useRef<any>(null)
    const [value, setValue] = useState(initValue)
    const [transformTitle, setTransformTitle] = useState("")
    const [visible, setVisible] = useState(false)
    const [transformValue, setTransformValue] = useState("")
    const [transformLoading, setTransformLoading] = useState(false)
    // 监听value的改变, 每一次的改变都会触发
    useEffect(() => {
        setHtmlString(md.render(value))
    }, [value])

    /**
     * 滚动事件
     */
    const handleScroll = useCallback((e) => {
        let { target } = e
        let scale = getScale(target)
        // 判断他是否为文本域，是文本与操作的同步滚动showRef
        if(target.nodeName === 'TEXTAREA') {
            if(scrolling === 0) scrolling = 1;
            else if(scrolling === 2) return;    // 当前是「展示区」主动触发的滚动，因此不需要再驱动展示区去滚动
            // 驱动「展示区」同步滚动showRef
            driveScroll(scale, showRef.current)
        } else {
            if(scrolling === 0) scrolling = 2;
            else if(scrolling === 1) return;
            // 同步滚动editRef
            driveScroll(scale, editRef.current)
        }
    }, [])

    // 进行同步内容滚动的操作
    const driveScroll = useCallback((scale: number, el: HTMLElement) => {
        let {scrollHeight, clientHeight} = el
        // 重新这只一下编辑dom的scrollTop滚动的位置
        el.scrollTop = (scrollHeight - clientHeight) * scale;
        if(scrollTimer){
            clearTimeout(scrollTimer)
        }
        scrollTimer = setTimeout(() => {
            scrolling = 0
            clearTimeout(scrollTimer)
        }, 200)
    }, [])
    // 滚动的缩放比列
    const getScale = useCallback((el: HTMLElement) => {
        let {scrollTop, scrollHeight, clientHeight} = el
        return scrollTop / (scrollHeight - clientHeight)
    }, [])
    const handleChange= useCallback((e) => {
        throttle(() => {
            setValue(e.target.value)
        }, 100)()
    }, [])

    /**
     * 将html转换为md
     * @param value 
     */
    const handleTransformHtmlToMd = () => {
        if(!transformValue.trim()){
            message.warning({
                content: "没有内容，不需要转换"
            })
            return
        }
        setTransformLoading(true)
        let newValue = HtmlToMd(transformValue)
        setValue(newValue)
        setTransformLoading(false)
        message.success({
            content: "转换成功"
        })
        setVisible(false)
    }
    /**
     * 需求
     * 左侧面板输入markdown格式的文本，然后右侧进行转换为markdown的风格的文档
     */
    return (
        <MarkdownEditorContainer>
            <NavBar 
            setValue={setValue}
            value={value}
            editElement={editRef}
            fullScreen={fullScreen}
            setFullScreen={setFullScreen}
            setLoading={setLoading}
            setTransformTitle={setTransformTitle}
            setVisible={setVisible}
            ></NavBar>
            {/* 加载组件 */}
            <Spin tip="更新主题中..." wrapperClassName="write-spin" spinning={loading}>
                <main className="markdown-main">
                    {/* 左侧的输入区域 */}
                    <textarea onScroll={handleScroll} onChange={handleChange} value={value}  ref={editRef} className={`${fullScreen ? 'hide' : ''}`} id="markdown-editor-reactjs-edit"></textarea>
                    <div onScroll={handleScroll} ref={showRef} className={`${fullScreen ? 'fullScreen' : ''}`} id="write" dangerouslySetInnerHTML={{ __html: htmlString }}></div>
                </main>
            </Spin>
            <Modal width={"50%"} onCancel={() => {
                setTransformValue("")
                setVisible(false)
            }} onOk={() => {
                // 转换过程
                handleTransformHtmlToMd()
            }} cancelText="返回" okText="确定" title={transformTitle} visible={visible}>
                <Spin tip="转换中..." spinning={transformLoading}>  
                <Input.TextArea autoSize={{minRows: 6, maxRows: 18}} value={transformValue} onChange={({target: {value}}) => setTransformValue(value)}></Input.TextArea>
            </Spin>
            </Modal>
        </MarkdownEditorContainer>
    )
}
