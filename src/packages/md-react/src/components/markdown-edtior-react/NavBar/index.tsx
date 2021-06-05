import { useCallback, useEffect, useState } from 'react'
import { Tooltip, Dropdown, Menu, message } from "antd"
import {
    BoldOutlined, ItalicOutlined, StrikethroughOutlined, OrderedListOutlined,
    UnorderedListOutlined, CarryOutOutlined, LinkOutlined, TableOutlined,
    PictureOutlined, LeftOutlined, RightOutlined, BulbOutlined, CodeOutlined,
    EllipsisOutlined, DownloadOutlined, UploadOutlined, ExpandOutlined,
    CompressOutlined,ClearOutlined, SaveOutlined
} from '@ant-design/icons'
import { NavBarContainer } from "./style"
import { hash, getCursorPosition } from "../utils"
const { Item, ItemGroup } = Menu
interface PropsType {
    value: string,
    editElement: any,
    fullScreen: boolean,
    setFullScreen: (fullScreen: boolean) => void,
    setLoading: (loading: boolean) => void,
    setValue: (value: string) => void

}
export default function NavBar(props: PropsType) {

    // markdown主题
    const [markdownTheme, setMarkdownTheme] = useState("maize")
    // markdown 代码高亮主题
    const [codeHighLightTheme, setCodeHighLightTheme] = useState("railscasts")
    // 选择markdown的主题
    const selectMarkdownTheme = useCallback(({ key }: { key: string }) => {
        // 重新设置loading状态为true
        props.setLoading(true)
        setMarkdownTheme(key)
    }, [])
    // 监听主题的变化
    useEffect(() => {
        // 拿到head标签
        let head = document.head
        let oldLink = head.getElementsByClassName("markdownTheme-style-link")
        // 如果存在我们就移除了
        if (oldLink.length) {
            head.removeChild(oldLink[0])
        }
        // 否则我们需要自己增加css的内容
        let newLink = document.createElement("link")
        newLink.setAttribute("type", "text/css")
        newLink.setAttribute("rel", "stylesheet")
        newLink.setAttribute("class", "markdownTheme-style-link")
        newLink.setAttribute("href", `https://lpyexplore.gitee.io/taobao_staticweb/css/theme/${markdownTheme}.css`)
        head.append(newLink)

        // newLink加载成功之后 将loading改为false
        newLink.onload = () => {
            props.setLoading(false)
        }
        // 如果出错
        newLink.onerror = () => {
            props.setLoading(false)
            message.error({
                content: "主题获取失败, 请稍后重试或者尝试其他主题"
            })
        }
    }, [markdownTheme])

    // 代码高亮部分的监听
    useEffect(() => {
        // 拿到head标签
        let head = document.head
        let oldLink = head.getElementsByClassName("highlightjs-style-link")
        // 如果存在我们就移除了
        if (oldLink.length) {
            head.removeChild(oldLink[0])
        }
        // 否则我们需要自己增加css的内容
        let newLink = document.createElement("link")
        newLink.setAttribute("type", "text/css")
        newLink.setAttribute("rel", "stylesheet")
        newLink.setAttribute("class", "highlightjs-style-link")
        newLink.setAttribute("href", `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/${codeHighLightTheme}.min.css`)
        head.append(newLink)
        // newLink加载成功之后 将loading改为false
        newLink.onload = () => {
            props.setLoading(false)
        }
        // 如果出错
        newLink.onerror = () => {
            props.setLoading(false)
            message.error({
                content: "主题获取失败, 请稍后重试或者尝试其他主题"
            })
        }
    }, [codeHighLightTheme])
    // 选择代码高亮部分
    const selectCodeHighLightTheme = useCallback(({ key }: { key: string }) => {
        props.setLoading(true)
        setCodeHighLightTheme(key)
    }, [])

    // 选择更多功能
    const handleMoreFunction = useCallback(({ key }: { key: string }) => {
        switch (key) {
            case "importMd":
                importMd();
                break;
            case "exportMd":
                exportMd()
                break;
        }
    }, [])

    // 导入md文件
    const importMd = useCallback(() => {
        // 判断是否有写入对象
        if (!FileReader) {
            return message.error({
                content: "浏览器不支持导入md文件, 请更换浏览器再试"
            })
        }
        // 手动创建input文件上传框，来支持文件上传的操作
        let inputEl = document.createElement("input")
        inputEl.type = "file"
        inputEl.accept = ".md"
        inputEl.click()
        inputEl.addEventListener("change", () => {
            let files = inputEl.files as FileList
            // 没有文件
            if (!files.length) {
                return
            }
            let reader = new FileReader()
            reader.readAsText(files[0])
            reader.onload = () => {
                props.setValue(reader.result as string)
                message.success({
                    content: "导入成功"
                })
            }
        })
    }, [])

    // 导出md文档
    const exportMd = useCallback(() => {
        // 首先判断是否支持流对象
        if (!Blob || !URL) {
            return message.error({
                content: "浏览器不支持导出md文件，请更换浏览器再试"
            })
        }
        // 是否存在转换只会走的value值
        if (!props.value) {
            // 不存在
            return message.warn({
                content: "当前内容为空，无需导出"
            })
        }
        let blob = new Blob([props.value])
        // 创建a标签
        let aEl = document.createElement("a")
        let downloadUrl = URL.createObjectURL(blob)
        aEl.href = downloadUrl
        aEl.download = `${hash()}.md`
        aEl.click()
        // 移除创建的流对象
        URL.revokeObjectURL(downloadUrl)
    }, [])

    // 选择代码块
    const addCodeBlock = ({key}: {key: string}) => {
        // 拿到光标位置
        let [start, end] = getCursorPosition(props.editElement.current)
        let newValue = start === end ? `${props.value.slice(0, start)}\n\`\`\`${key}\n\`\`\`${props.value.slice(end)}\n` : `${props.value.slice(0, start)}\n\`\`\`${key}\n${props.value.slice(start, end)}\n\`\`\`\n${props.value.slice(end)}\n`
        props.setValue(newValue)
    }

    /**
     * 加粗
     */
    const handleTwoSideSymbol = useCallback((value: string, symbol: string, txt: string) => {
        // 首先获取当前编辑区的光标的位置
        let [start, end] = getCursorPosition(props.editElement.current)
        let newValue = start === end ? value.slice(0, start) + `${symbol}${txt}${symbol}` + value.slice(end) : value.slice(0, start) + symbol + value.slice(start, end) + symbol + value.slice(end)
        // 拿到最新的value重新设置
        props.setValue(newValue)
    }, [getCursorPosition])

    const addList = useCallback((value: string, symbol: string, txt: string) => {
        let [start, end] = getCursorPosition(props.editElement.current)
        let newValue = start === end ? `${value.slice(0, start)}\n${symbol} ${txt}\n${value.slice(end)}` : `${value.slice(0, start)}\n${symbol} ${value.slice(start, end)}\n${value.slice(end)}`
        props.setValue(newValue)
    }, [getCursorPosition])

    // 加入链接
    const addLink = () => {
        let [start,end] = getCursorPosition(props.editElement.current)
        let newValue = start === end ? `${props.value.slice(0, start)}[链接描述文字](https://blog.xxytime.top/)${props.value.slice(end)}`
        : `${props.value.slice(0, start)}[${props.value.slice(start, end)}](https://blog.xxytime.top/)${props.value.slice(end)}`
        props.setValue(newValue)
    }

    // 插入一个表格
    const addTable = () => {
        let [start, end] = getCursorPosition(props.editElement.current)
        let newValue = start === end ? `${props.value.slice(0, start)}\n| | |\n|--|--|\n| | |${props.value.slice(end)}` : `${props.value.slice(0, start)}\n|${props.value.slice(start, end)} | |\n|--|--|\n| | |${props.value.slice(end)}`
        props.setValue(newValue)
    }

    // 加入一个图片
    const addPhoto = () => {
        let [start, end] = getCursorPosition(props.editElement.current)
        let newValue = start === end ? `${props.value.slice(0, start)}![]()${props.value.slice(end)}` : `${props.value.slice(0, end)}![${props.value.slice(start, end)}]()${props.value.slice(end)}`
        props.setValue(newValue)
    }

    // 清除内容
    const clear = () => {
        props.setValue("")
        localStorage.setItem("md-react-value", "")
    }

    // 暂存
    const handleTemporaryStorage = () => {
        try {
            
            localStorage.setItem("md-react-value", props.value)
            message.success({
                content: "暂存成功"
            })
        } catch (error) {
            message.error({
                content: "暂存失败"
            })
        }
    }
    // 代码块菜单
    const codeBlockMenu = (
        <Menu onClick={addCodeBlock}>
            <ItemGroup key="codeBlockMenu" title="代码块语言" className="item-group-list-container">
                <Item key="js">JavaScript</Item>
                <Item key="ts">TypeScript</Item>
                <Item key="html">HTML</Item>
                <Item key="css">CSS</Item>
                <Item key="java">Java</Item>
                <Item key="bash">Bash</Item>
                <Item key="c">C</Item>
                <Item key="csharp">C#</Item>
                <Item key="c++">C++</Item>
                <Item key="go">Go</Item>
                <Item key="json">JSON</Item>
                <Item key="php">PHP</Item>
                <Item key="python">Python</Item>
                <Item key="ruby">Ruby</Item>
                <Item key="rust">Rust</Item>
                <Item key="sql">SQL</Item>
                <Item key="shell">Shell Session</Item>
                <Item key="vb">Visual Basic</Item>
            </ItemGroup>
        </Menu>
    )
    // 主题菜单
    const markdownThemeMenu = (<Menu onClick={selectMarkdownTheme}>
        <ItemGroup key="markdownThemeMenu" title="markdown主题" className="item-group-list-container markdown-theme-menu">
            <Item key="github" className={`${markdownTheme === 'github' && 'active'}`}>github</Item>
            <Item key="maize" className={`${markdownTheme === 'maize' && 'active'}`}>maize</Item>
        </ItemGroup>
    </Menu>)

    const codeHighLightMenu = (
        <Menu onClick={selectCodeHighLightTheme}>
            <ItemGroup key="codeHighLightMenu" title="代码高亮主题" className="item-group-list-container code-highlight-theme-menu">
                <Item key="github" className={`${codeHighLightTheme === 'github' && 'active'}`}>github</Item>
                <Item key="railscasts" className={`${codeHighLightTheme === 'railscasts' && 'active'}`}>railscasts</Item>
                <Item key="androidstudio" className={`${codeHighLightTheme === 'androidstudio' && 'active'}`}>androidstudio</Item>
                <Item key="dracula" className={`${codeHighLightTheme === 'dracula' && 'active'}`}>dracula</Item>
                <Item key="atom-one-dark" className={`${codeHighLightTheme === 'atom-one-dark' && 'active'}`}>atom-one-dark</Item>
                <Item key="atom-one-light" className={`${codeHighLightTheme === 'atom-one-light' && 'active'}`}>atom-one-light</Item>
                <Item key="monokai-sublime" className={`${codeHighLightTheme === 'monokai-sublime' && 'active'}`}>monokai-sublime</Item>
                <Item key="tomorrow" className={`${codeHighLightTheme === 'tomorrow' && 'active'}`}>tomorrow</Item>
                <Item key="solarized-dark" className={`${codeHighLightTheme === 'solarized-dark' && 'active'}`}>solarized-dark</Item>
                <Item key="solarized-light" className={`${codeHighLightTheme === 'solarized-light' && 'active'}`}>solarized-light</Item>
                <Item key="color-brewer" className={`${codeHighLightTheme === 'color-brewer' && 'active'}`}>color-brewer</Item>
                <Item key="zenburn" className={`${codeHighLightTheme === 'zenburn' && 'active'}`}>zenburn</Item>
                <Item key="agate" className={`${codeHighLightTheme === 'agate' && 'active'}`}>agate</Item>
            </ItemGroup>
        </Menu>
    )
    // 更多功能
    const moreMenu = (
        <Menu onClick={handleMoreFunction}>
            <Item key="importMd">
                <UploadOutlined />
                导入md
            </Item>
            <Item key="exportMd">
                <DownloadOutlined />
                导出md
            </Item>
        </Menu>
    )
    return (
        <NavBarContainer>
            <Tooltip title="加粗" arrowPointAtCenter>
                <BoldOutlined onClick={() => handleTwoSideSymbol(props.value, "**", "加粗")} className="item"></BoldOutlined>
            </Tooltip>
            <Tooltip title='斜体' arrowPointAtCenter>
                <ItalicOutlined className="item" onClick={() => handleTwoSideSymbol(props.value, '*', '倾斜字体')} />
            </Tooltip>
            <Tooltip title='删除线' arrowPointAtCenter>
                <StrikethroughOutlined className="item" onClick={() => handleTwoSideSymbol(props.value, '~~', '删除文本')} />
            </Tooltip>
            <Tooltip title='有序列表' arrowPointAtCenter>
                <OrderedListOutlined className="item" onClick={() => addList(props.value, '1.', '有序列表')} />
            </Tooltip>
            <Tooltip title='无序列表' arrowPointAtCenter>
                <UnorderedListOutlined className="item" onClick={() => addList(props.value, '-', '无序列表')} />
            </Tooltip>
            <Tooltip title='任务列表' arrowPointAtCenter>
                <CarryOutOutlined className="item" onClick={() => addList(props.value, '- [x]', '任务列表')} />
            </Tooltip>
            <Dropdown
                overlay={codeBlockMenu}
                placement="bottomCenter"
                arrow
            >
                <span className="item code" style={{ fontSize: 12 }}>
                    <LeftOutlined />/<RightOutlined />
                </span>
            </Dropdown>
            <Tooltip title='超链接' arrowPointAtCenter>
                <LinkOutlined className="item" onClick={addLink} />
            </Tooltip>
            <Tooltip title='表格' arrowPointAtCenter>
                <TableOutlined className="item" onClick={addTable} />
            </Tooltip>
            <Tooltip title='图片' arrowPointAtCenter>
                <PictureOutlined className="item" onClick={addPhoto} />
            </Tooltip>
            <Dropdown
                overlay={markdownThemeMenu}
                placement="bottomCenter"
                arrow
            >
                <BulbOutlined className="item" />
            </Dropdown>
            {/* 代码高亮部分 */}
            <Dropdown
                overlay={codeHighLightMenu}
                placement="bottomCenter"
                arrow
            >
                <CodeOutlined className="item" />
            </Dropdown>
            {/* 更多功能 */}
            <Dropdown
                overlay={moreMenu}
                placement="bottomCenter"
                arrow
            >
                <EllipsisOutlined className="item" />
            </Dropdown>
            <Tooltip title='清空' arrowPointAtCenter>
                <ClearOutlined className="item" onClick={clear} />
            </Tooltip>
            <Tooltip title='暂存' arrowPointAtCenter>
                <SaveOutlined className="item" onClick={handleTemporaryStorage} />
            </Tooltip>
                {
                    props.fullScreen
                        ? <Tooltip title='退出全屏' arrowPointAtCenter>
                            <CompressOutlined className="item" onClick={() => { props.setFullScreen(false); message.info('退出全屏模式') }} />
                        </Tooltip>
                        : <Tooltip title='进入全屏' arrowPointAtCenter>
                            <ExpandOutlined className="item" onClick={() => { props.setFullScreen(true); message.info('进入全屏模式') }} />
                        </Tooltip>
                }
            
        </NavBarContainer>
    )
}
