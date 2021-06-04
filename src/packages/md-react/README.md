Hi md-markdown-react

一款react的markdown在线编辑器，可拆离出来单独在react项目中使用
```shell
npm i md-react-best / yarn add md-react-best
```
[在线Demo](https://web-markdown-react.vercel.app/)

**核心原理讲解**

### md是什么
额。。。就是一款程序员很喜欢使用的文件格式，简单来说就是使用标记的语法，来解析成加粗，图片，斜体，列表等等的效果

### 文本标记识别
最基础的一部分就是当我编写了md文件格式时，我们需要去解析，`#`,`****`等等这种标记，我观察了很多插件，最终选择了`markdown-it`这款插件

### 基本布局
最基本的左右两栏的布局，左侧编辑区，右侧转换显示区
![](./images/image1.png)

### 解析的核心代码
```tsx
import MarkdownIt from "markdown-it"
import hljs from "highlight.js"
const md:any = new MarkdownIt({
    breaks: true, // 自动换行
    /**
     * 
     * @param code 代码
     * @param lang 语言模式
     */
    highlight: function(code, lang):string{
        // 判断是否传入语言和能否从高亮插件中获取语言
        if(lang && hljs.getLanguage(lang)){
            try {
                return `<pre><code class='hljs' language=${lang}>${hljs.highlight(code, {language: lang}).value}</code></pre>`
            } catch (error) {
                
            }
        }
        return `<pre class='hljs'><code>${md.utils.escapeHtml(code)}</code></pre>`
    }
}).use(require("markdown-it-task-checkbox"), {
    disabled: true,
    divWrap: false,
    divClass: "checkbox",
    idPrefix: "cbx_",
    ulClass: "task-list",
    liClass: "task=list-item"
}) // 任务插件配置

export default md
```
主要的核心就是使用markdown-it进行标记解析，然后通过传入的语言模式，使用highlight.js转换为对应的语言模式的代码
> 上面这一步已经将标记语言转换

### 快捷按钮
布局就不说了，列出基本的已存在的功能
- 加粗
- 斜体
- 删除线
- 有序列表
- 无需列表
- 任务列表
- 代码语言块
- 超链接
- 表格
- 图片
- markdown主题
- 代码高亮主题
- 导入导出
- 清除
- 暂存
这里我列表加粗， 斜体，删除线如何实现的。其实实现原理很简单，居然是标记语言，那么就和html没什么区别，无疑通过一些符号占位符来标记

1.加粗
通过`****`包裹
```md
**hi md-react-best**
```
当点击加粗按钮是时候，只需要将之前的内容加入标记字符串即可
```tsx
// 首先获取当前编辑区的光标的位置
let [start, end] = getCursorPosition(props.editElement.current)
let newValue = start === end ? value.slice(0, start) + `${symbol}${txt}${symbol}` + value.slice(end) : value.slice(0, start) + symbol + value.slice(start, end) + symbol + value.slice(end)
// 拿到最新的value重新设置
props.setValue(newValue)
```
光标的位置很关键，分为两种情况
1.开始光标和结束光标相等的情况下
2.开始光标和结束光标不等情况下，其实就是选择了一些文字的情况

### 导入导出如何做到的？
如何大家对js的基础很熟悉，其实实现起来很简单，或者至少能看懂那块的代码吧
- 导出mdwe文件
```tsx
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
```
原理实际上就是，创建a标签，a标签模拟下载链接，下载链接通过objectUrl对象创建，前提是先将编辑器内的内容变为ibjectUrl，然后出发a标签的download操作即可完成下载

- 导出md文件
```tsx
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
            content: "dao"
        })
    }
})
```
需要使用到`FileReader`对象，和模拟input文件上传的操作，再将文件对象转为text文本流即可导入成功