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