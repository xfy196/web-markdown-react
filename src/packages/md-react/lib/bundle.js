import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { message, Menu, Tooltip, Dropdown, Spin } from 'antd';
import { UploadOutlined, DownloadOutlined, BoldOutlined, ItalicOutlined, StrikethroughOutlined, OrderedListOutlined, UnorderedListOutlined, CarryOutOutlined, LeftOutlined, RightOutlined, LinkOutlined, TableOutlined, PictureOutlined, BulbOutlined, CodeOutlined, EllipsisOutlined, ClearOutlined, SaveOutlined, CompressOutlined, ExpandOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import emoji from 'markdown-it-emoji';
import MarkdownIt from 'markdown-it';
import hljs from 'highlight.js';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __makeTemplateObject(cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
}

var MarkdownEditorContainer = styled.div(templateObject_1$1 || (templateObject_1$1 = __makeTemplateObject(["\n    height: 100%;\n    .write-spin{\n        width: 100%;;\n        height: calc(100% - 50px);\n    }\n    .markdown-main{\n        width: 100%;\n        height: 100%;\n        display: flex;\n        #markdown-editor-reactjs-edit{\n            flex: 1;\n            height: 100%;\n            width: 50%;\n            border: 0;\n            border-right: 1px solid #eee;\n            background-color: rgb(248, 248, 250);\n            padding: 20px;\n            resize: none;\n            outline: none;\n            box-sizing: border-box;\n            font-size: 15px;\n            &.hide {\n                display: none;\n            }\n        }\n        #write{\n            width: 100%;\n            flex: 1;\n            height: 100%;\n            overflow: auto;\n            padding: 20px 20px 40px;\n            &.fullScrren{\n                width: 100%;\n            }\n        }\n    }\n"], ["\n    height: 100%;\n    .write-spin{\n        width: 100%;;\n        height: calc(100% - 50px);\n    }\n    .markdown-main{\n        width: 100%;\n        height: 100%;\n        display: flex;\n        #markdown-editor-reactjs-edit{\n            flex: 1;\n            height: 100%;\n            width: 50%;\n            border: 0;\n            border-right: 1px solid #eee;\n            background-color: rgb(248, 248, 250);\n            padding: 20px;\n            resize: none;\n            outline: none;\n            box-sizing: border-box;\n            font-size: 15px;\n            &.hide {\n                display: none;\n            }\n        }\n        #write{\n            width: 100%;\n            flex: 1;\n            height: 100%;\n            overflow: auto;\n            padding: 20px 20px 40px;\n            &.fullScrren{\n                width: 100%;\n            }\n        }\n    }\n"])));
var templateObject_1$1;

var NavBarContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n     width: 100%;\n    height: 50px;\n    border-bottom: 1px solid #e1e1e1;\n    box-sizing: border-box;\n    display: flex;\n    align-items: center;\n    padding: 0 20px;\n    overflow-y: auto;\n    .item {\n        cursor: pointer;\n        margin-right: 15px;\n        font-size: 17px;\n        border-radius: 3px;\n        &:hover{\n            background-color: #eee;\n        }\n        &.code {\n            padding: 5px 0;\n        }\n    }\n    .right {\n        flex: 1;\n        text-align: right;\n    }\n"], ["\n     width: 100%;\n    height: 50px;\n    border-bottom: 1px solid #e1e1e1;\n    box-sizing: border-box;\n    display: flex;\n    align-items: center;\n    padding: 0 20px;\n    overflow-y: auto;\n    .item {\n        cursor: pointer;\n        margin-right: 15px;\n        font-size: 17px;\n        border-radius: 3px;\n        &:hover{\n            background-color: #eee;\n        }\n        &.code {\n            padding: 5px 0;\n        }\n    }\n    .right {\n        flex: 1;\n        text-align: right;\n    }\n"])));
var templateObject_1;

function hash(len) {
    if (len === void 0) { len = 10; }
    var numbers = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
    var chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    var hashString = '';
    for (var i = 0; i < len; i++) {
        if (Math.floor(Math.random() * 10) % 2 === 0) {
            hashString += numbers[Math.floor(Math.random() * 10)];
        }
        else {
            var char = chars[Math.floor(Math.random() * 26)];
            if (Math.floor(Math.random() * 10) % 2 === 0) {
                char = char.toLowerCase();
                hashString += char;
            }
        }
    }
    return hashString;
}
// 获取光标位置，在点击一些快捷操作的时候我们需要或许当前的光标位置，然后插入具体内容
function getCursorPosition(el) {
    var selectionStart = el.selectionStart, selectionEnd = el.selectionEnd;
    return [selectionStart, selectionEnd];
}

var Item = Menu.Item, ItemGroup = Menu.ItemGroup;
function NavBar(props) {
    // markdown主题
    var _a = useState("maize"), markdownTheme = _a[0], setMarkdownTheme = _a[1];
    // markdown 代码高亮主题
    var _b = useState("railscasts"), codeHighLightTheme = _b[0], setCodeHighLightTheme = _b[1];
    // 选择markdown的主题
    var selectMarkdownTheme = useCallback(function (_a) {
        var key = _a.key;
        // 重新设置loading状态为true
        props.setLoading(true);
        setMarkdownTheme(key);
    }, []);
    // 监听主题的变化
    useEffect(function () {
        // 拿到head标签
        var head = document.head;
        var oldLink = head.getElementsByClassName("markdownTheme-style-link");
        // 如果存在我们就移除了
        if (oldLink.length) {
            head.removeChild(oldLink[0]);
        }
        // 否则我们需要自己增加css的内容
        var newLink = document.createElement("link");
        newLink.setAttribute("type", "text/css");
        newLink.setAttribute("rel", "stylesheet");
        newLink.setAttribute("class", "markdownTheme-style-link");
        newLink.setAttribute("href", "https://lpyexplore.gitee.io/taobao_staticweb/css/theme/" + markdownTheme + ".css");
        head.append(newLink);
        // newLink加载成功之后 将loading改为false
        newLink.onload = function () {
            props.setLoading(false);
        };
        // 如果出错
        newLink.onerror = function () {
            props.setLoading(false);
            message.error({
                content: "主题获取失败, 请稍后重试或者尝试其他主题"
            });
        };
    }, [markdownTheme]);
    // 代码高亮部分的监听
    useEffect(function () {
        // 拿到head标签
        var head = document.head;
        var oldLink = head.getElementsByClassName("highlightjs-style-link");
        // 如果存在我们就移除了
        if (oldLink.length) {
            head.removeChild(oldLink[0]);
        }
        // 否则我们需要自己增加css的内容
        var newLink = document.createElement("link");
        newLink.setAttribute("type", "text/css");
        newLink.setAttribute("rel", "stylesheet");
        newLink.setAttribute("class", "highlightjs-style-link");
        newLink.setAttribute("href", "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/10.7.2/styles/" + codeHighLightTheme + ".min.css");
        head.append(newLink);
        // newLink加载成功之后 将loading改为false
        newLink.onload = function () {
            props.setLoading(false);
        };
        // 如果出错
        newLink.onerror = function () {
            props.setLoading(false);
            message.error({
                content: "主题获取失败, 请稍后重试或者尝试其他主题"
            });
        };
    }, [codeHighLightTheme]);
    // 选择代码高亮部分
    var selectCodeHighLightTheme = useCallback(function (_a) {
        var key = _a.key;
        props.setLoading(true);
        setCodeHighLightTheme(key);
    }, []);
    // 选择更多功能
    var handleMoreFunction = useCallback(function (_a) {
        var key = _a.key;
        switch (key) {
            case "importMd":
                importMd();
                break;
            case "exportMd":
                exportMd();
                break;
        }
    }, []);
    // 导入md文件
    var importMd = useCallback(function () {
        // 判断是否有写入对象
        if (!FileReader) {
            return message.error({
                content: "浏览器不支持导入md文件, 请更换浏览器再试"
            });
        }
        // 手动创建input文件上传框，来支持文件上传的操作
        var inputEl = document.createElement("input");
        inputEl.type = "file";
        inputEl.accept = ".md";
        inputEl.click();
        inputEl.addEventListener("change", function () {
            var files = inputEl.files;
            // 没有文件
            if (!files.length) {
                return;
            }
            var reader = new FileReader();
            reader.readAsText(files[0]);
            reader.onload = function () {
                props.setValue(reader.result);
                message.success({
                    content: "导入成功"
                });
            };
        });
    }, []);
    // 导出md文档
    var exportMd = useCallback(function () {
        // 首先判断是否支持流对象
        if (!Blob || !URL) {
            return message.error({
                content: "浏览器不支持导出md文件，请更换浏览器再试"
            });
        }
        // 是否存在转换只会走的value值
        if (!props.value) {
            // 不存在
            return message.warn({
                content: "当前内容为空，无需导出"
            });
        }
        var blob = new Blob([props.value]);
        // 创建a标签
        var aEl = document.createElement("a");
        var downloadUrl = URL.createObjectURL(blob);
        aEl.href = downloadUrl;
        aEl.download = hash() + ".md";
        aEl.click();
        // 移除创建的流对象
        URL.revokeObjectURL(downloadUrl);
    }, []);
    // 选择代码块
    var addCodeBlock = function (_a) {
        var key = _a.key;
        // 拿到光标位置
        var _b = getCursorPosition(props.editElement.current), start = _b[0], end = _b[1];
        var newValue = start === end ? props.value.slice(0, start) + "\n```" + key + "\n```" + props.value.slice(end) + "\n" : props.value.slice(0, start) + "\n```" + key + "\n" + props.value.slice(start, end) + "\n```\n" + props.value.slice(end) + "\n";
        props.setValue(newValue);
    };
    /**
     * 加粗
     */
    var handleTwoSideSymbol = useCallback(function (value, symbol, txt) {
        // 首先获取当前编辑区的光标的位置
        var _a = getCursorPosition(props.editElement.current), start = _a[0], end = _a[1];
        var newValue = start === end ? value.slice(0, start) + ("" + symbol + txt + symbol) + value.slice(end) : value.slice(0, start) + symbol + value.slice(start, end) + symbol + value.slice(end);
        // 拿到最新的value重新设置
        props.setValue(newValue);
    }, [getCursorPosition]);
    var addList = useCallback(function (value, symbol, txt) {
        var _a = getCursorPosition(props.editElement.current), start = _a[0], end = _a[1];
        var newValue = start === end ? value.slice(0, start) + "\n" + symbol + " " + txt + "\n" + value.slice(end) : value.slice(0, start) + "\n" + symbol + " " + value.slice(start, end) + "\n" + value.slice(end);
        props.setValue(newValue);
    }, [getCursorPosition]);
    // 加入链接
    var addLink = function () {
        var _a = getCursorPosition(props.editElement.current), start = _a[0], end = _a[1];
        var newValue = start === end ? props.value.slice(0, start) + "[\u94FE\u63A5\u63CF\u8FF0\u6587\u5B57](https://blog.xxytime.top/)" + props.value.slice(end)
            : props.value.slice(0, start) + "[" + props.value.slice(start, end) + "](https://blog.xxytime.top/)" + props.value.slice(end);
        props.setValue(newValue);
    };
    // 插入一个表格
    var addTable = function () {
        var _a = getCursorPosition(props.editElement.current), start = _a[0], end = _a[1];
        var newValue = start === end ? props.value.slice(0, start) + "\n| | |\n|--|--|\n| | |" + props.value.slice(end) : props.value.slice(0, start) + "\n|" + props.value.slice(start, end) + " | |\n|--|--|\n| | |" + props.value.slice(end);
        props.setValue(newValue);
    };
    // 加入一个图片
    var addPhoto = function () {
        var _a = getCursorPosition(props.editElement.current), start = _a[0], end = _a[1];
        var newValue = start === end ? props.value.slice(0, start) + "![]()" + props.value.slice(end) : props.value.slice(0, end) + "![" + props.value.slice(start, end) + "]()" + props.value.slice(end);
        props.setValue(newValue);
    };
    // 清除内容
    var clear = function () {
        props.setValue("");
        localStorage.setItem("md-react-value", "");
    };
    // 暂存
    var handleTemporaryStorage = function () {
        try {
            localStorage.setItem("md-react-value", props.value);
            message.success({
                content: "暂存成功"
            });
        }
        catch (error) {
            message.error({
                content: "暂存失败"
            });
        }
    };
    // 代码块菜单
    var codeBlockMenu = (jsx(Menu, __assign({ onClick: addCodeBlock }, { children: jsxs(ItemGroup, __assign({ title: "\u4EE3\u7801\u5757\u8BED\u8A00", className: "item-group-list-container" }, { children: [jsx(Item, { children: "JavaScript" }, "js"),
                jsx(Item, { children: "TypeScript" }, "ts"),
                jsx(Item, { children: "HTML" }, "html"),
                jsx(Item, { children: "CSS" }, "css"),
                jsx(Item, { children: "Java" }, "java"),
                jsx(Item, { children: "Bash" }, "bash"),
                jsx(Item, { children: "C" }, "c"),
                jsx(Item, { children: "C#" }, "csharp"),
                jsx(Item, { children: "C++" }, "c++"),
                jsx(Item, { children: "Go" }, "go"),
                jsx(Item, { children: "JSON" }, "json"),
                jsx(Item, { children: "PHP" }, "php"),
                jsx(Item, { children: "Python" }, "python"),
                jsx(Item, { children: "Ruby" }, "ruby"),
                jsx(Item, { children: "Rust" }, "rust"),
                jsx(Item, { children: "SQL" }, "sql"),
                jsx(Item, { children: "Shell Session" }, "shell"),
                jsx(Item, { children: "Visual Basic" }, "vb")] }), "codeBlockMenu") }), void 0));
    // 主题菜单
    var markdownThemeMenu = (jsx(Menu, __assign({ onClick: selectMarkdownTheme }, { children: jsxs(ItemGroup, __assign({ title: "markdown\u4E3B\u9898", className: "item-group-list-container markdown-theme-menu" }, { children: [jsx(Item, __assign({ className: "" + (markdownTheme === 'github' && 'active') }, { children: "github" }), "github"),
                jsx(Item, __assign({ className: "" + (markdownTheme === 'maize' && 'active') }, { children: "maize" }), "maize")] }), "markdownThemeMenu") }), void 0));
    var codeHighLightMenu = (jsx(Menu, __assign({ onClick: selectCodeHighLightTheme }, { children: jsxs(ItemGroup, __assign({ title: "\u4EE3\u7801\u9AD8\u4EAE\u4E3B\u9898", className: "item-group-list-container code-highlight-theme-menu" }, { children: [jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'github' && 'active') }, { children: "github" }), "github"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'railscasts' && 'active') }, { children: "railscasts" }), "railscasts"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'androidstudio' && 'active') }, { children: "androidstudio" }), "androidstudio"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'dracula' && 'active') }, { children: "dracula" }), "dracula"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'atom-one-dark' && 'active') }, { children: "atom-one-dark" }), "atom-one-dark"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'atom-one-light' && 'active') }, { children: "atom-one-light" }), "atom-one-light"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'monokai-sublime' && 'active') }, { children: "monokai-sublime" }), "monokai-sublime"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'tomorrow' && 'active') }, { children: "tomorrow" }), "tomorrow"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'solarized-dark' && 'active') }, { children: "solarized-dark" }), "solarized-dark"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'solarized-light' && 'active') }, { children: "solarized-light" }), "solarized-light"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'color-brewer' && 'active') }, { children: "color-brewer" }), "color-brewer"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'zenburn' && 'active') }, { children: "zenburn" }), "zenburn"),
                jsx(Item, __assign({ className: "" + (codeHighLightTheme === 'agate' && 'active') }, { children: "agate" }), "agate")] }), "codeHighLightMenu") }), void 0));
    // 更多功能
    var moreMenu = (jsxs(Menu, __assign({ onClick: handleMoreFunction }, { children: [jsxs(Item, { children: [jsx(UploadOutlined, {}, void 0), "\u5BFC\u5165md"] }, "importMd"),
            jsxs(Item, { children: [jsx(DownloadOutlined, {}, void 0), "\u5BFC\u51FAmd"] }, "exportMd")] }), void 0));
    return (jsxs(NavBarContainer, { children: [jsx(Tooltip, __assign({ title: "\u52A0\u7C97", arrowPointAtCenter: true }, { children: jsx(BoldOutlined, { onClick: function () { return handleTwoSideSymbol(props.value, "**", "加粗"); }, className: "item" }, void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u659C\u4F53', arrowPointAtCenter: true }, { children: jsx(ItalicOutlined, { className: "item", onClick: function () { return handleTwoSideSymbol(props.value, '*', '倾斜字体'); } }, void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u5220\u9664\u7EBF', arrowPointAtCenter: true }, { children: jsx(StrikethroughOutlined, { className: "item", onClick: function () { return handleTwoSideSymbol(props.value, '~~', '删除文本'); } }, void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u6709\u5E8F\u5217\u8868', arrowPointAtCenter: true }, { children: jsx(OrderedListOutlined, { className: "item", onClick: function () { return addList(props.value, '1.', '有序列表'); } }, void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u65E0\u5E8F\u5217\u8868', arrowPointAtCenter: true }, { children: jsx(UnorderedListOutlined, { className: "item", onClick: function () { return addList(props.value, '-', '无序列表'); } }, void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u4EFB\u52A1\u5217\u8868', arrowPointAtCenter: true }, { children: jsx(CarryOutOutlined, { className: "item", onClick: function () { return addList(props.value, '- [x]', '任务列表'); } }, void 0) }), void 0),
            jsx(Dropdown, __assign({ overlay: codeBlockMenu, placement: "bottomCenter", arrow: true }, { children: jsxs("span", __assign({ className: "item code", style: { fontSize: 12 } }, { children: [jsx(LeftOutlined, {}, void 0), "/", jsx(RightOutlined, {}, void 0)] }), void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u8D85\u94FE\u63A5', arrowPointAtCenter: true }, { children: jsx(LinkOutlined, { className: "item", onClick: addLink }, void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u8868\u683C', arrowPointAtCenter: true }, { children: jsx(TableOutlined, { className: "item", onClick: addTable }, void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u56FE\u7247', arrowPointAtCenter: true }, { children: jsx(PictureOutlined, { className: "item", onClick: addPhoto }, void 0) }), void 0),
            jsx(Dropdown, __assign({ overlay: markdownThemeMenu, placement: "bottomCenter", arrow: true }, { children: jsx(BulbOutlined, { className: "item" }, void 0) }), void 0),
            jsx(Dropdown, __assign({ overlay: codeHighLightMenu, placement: "bottomCenter", arrow: true }, { children: jsx(CodeOutlined, { className: "item" }, void 0) }), void 0),
            jsx(Dropdown, __assign({ overlay: moreMenu, placement: "bottomCenter", arrow: true }, { children: jsx(EllipsisOutlined, { className: "item" }, void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u6E05\u7A7A', arrowPointAtCenter: true }, { children: jsx(ClearOutlined, { className: "item", onClick: clear }, void 0) }), void 0),
            jsx(Tooltip, __assign({ title: '\u6682\u5B58', arrowPointAtCenter: true }, { children: jsx(SaveOutlined, { className: "item", onClick: handleTemporaryStorage }, void 0) }), void 0),
            jsx("section", __assign({ className: "right" }, { children: props.fullScreen
                    ? jsx(Tooltip, __assign({ title: '\u9000\u51FA\u5168\u5C4F', arrowPointAtCenter: true }, { children: jsx(CompressOutlined, { className: "item", onClick: function () { props.setFullScreen(false); message.info('退出全屏模式'); } }, void 0) }), void 0)
                    : jsx(Tooltip, __assign({ title: '\u8FDB\u5165\u5168\u5C4F', arrowPointAtCenter: true }, { children: jsx(ExpandOutlined, { className: "item", onClick: function () { props.setFullScreen(true); message.info('进入全屏模式'); } }, void 0) }), void 0) }), void 0)] }, void 0));
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/* 修改antd dropdown组件的最大高度，并使其形成滚动条 */\n.item-group-list-container .ant-dropdown-menu-item-group-list {\n    max-height: 243px;\n    overflow: auto;\n    margin: 0;\n    padding: 0 8px;\n}\n\n/* 修改antd加载的内嵌容器样式 */\n.write-spin .ant-spin-container {\n    width: 100%;\n    height: 100%;\n}\n\n/* 去除任务列表前面的小黑点  */\nli.task-list-item {\n    list-style: none;\n}\n\n/* antd的dropdown组件选中的选项的样式 */\n.code-highlight-theme-menu .active, .markdown-theme-menu .active {\n    background-color: rgb(225, 248, 222);\n    border-radius: 3px;\n}";
styleInject(css_248z);

var md = new MarkdownIt({
    breaks: true,
    /**
     *
     * @param code 代码
     * @param lang 语言模式
     */
    highlight: function (code, lang) {
        // 判断是否传入语言和能否从高亮插件中获取语言
        if (lang && hljs.getLanguage(lang)) {
            try {
                return "<pre><code class='hljs' language=" + lang + ">" + hljs.highlight(code, { language: lang }).value + "</code></pre>";
            }
            catch (error) {
            }
        }
        return "<pre class='hljs'><code>" + md.utils.escapeHtml(code) + "</code></pre>";
    }
}).use(require("markdown-it-task-checkbox"), {
    disabled: true,
    divWrap: false,
    divClass: "checkbox",
    idPrefix: "cbx_",
    ulClass: "task-list",
    liClass: "task=list-item"
}).use(emoji, []); // 任务插件配置

var throttle = require("lodash.throttle");
var scrolling = 0; // 当前滚动块的状态 0: both: none 1: edit 2: show
var scrollTimer; // 改变scroll值的定时器
var initValue = localStorage.getItem("md-react-value") ? localStorage.getItem("md-react-value") : "";
function MarkDownEditor(props) {
    var _a = useState(false), loading = _a[0], setLoading = _a[1];
    var _b = useState(false), fullScreen = _b[0], setFullScreen = _b[1];
    var _c = useState(""), htmlString = _c[0], setHtmlString = _c[1];
    var editRef = useRef(null);
    var showRef = useRef(null);
    var _d = useState(initValue), value = _d[0], setValue = _d[1];
    // 监听value的改变, 每一次的改变都会触发
    useEffect(function () {
        setHtmlString(md.render(value));
    }, [value]);
    /**
     * 滚动事件
     */
    var handleScroll = useCallback(function (e) {
        var target = e.target;
        var scale = getScale(target);
        // 判断他是否为文本域，是文本与操作的同步滚动showRef
        if (target.nodeName === 'TEXTAREA') {
            if (scrolling === 0)
                scrolling = 1;
            else if (scrolling === 2)
                return; // 当前是「展示区」主动触发的滚动，因此不需要再驱动展示区去滚动
            // 驱动「展示区」同步滚动showRef
            driveScroll(scale, showRef.current);
        }
        else {
            if (scrolling === 0)
                scrolling = 2;
            else if (scrolling === 1)
                return;
            // 同步滚动editRef
            driveScroll(scale, editRef.current);
        }
    }, []);
    // 进行同步内容滚动的操作
    var driveScroll = useCallback(function (scale, el) {
        var scrollHeight = el.scrollHeight, clientHeight = el.clientHeight;
        // 重新这只一下编辑dom的scrollTop滚动的位置
        el.scrollTop = (scrollHeight - clientHeight) * scale;
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(function () {
            scrolling = 0;
            clearTimeout(scrollTimer);
        }, 200);
    }, []);
    // 滚动的缩放比列
    var getScale = useCallback(function (el) {
        var scrollTop = el.scrollTop, scrollHeight = el.scrollHeight, clientHeight = el.clientHeight;
        return scrollTop / (scrollHeight - clientHeight);
    }, []);
    var handleChange = useCallback(function (e) {
        throttle(function () {
            setValue(e.target.value);
        }, 100)();
    }, []);
    /**
     * 需求
     * 左侧面板输入markdown格式的文本，然后右侧进行转换为markdown的风格的文档
     */
    return (jsxs(MarkdownEditorContainer, { children: [jsx(NavBar, { setValue: setValue, value: value, editElement: editRef, fullScreen: fullScreen, setFullScreen: setFullScreen, setLoading: setLoading }, void 0),
            jsx(Spin, __assign({ tip: "\u66F4\u65B0\u4E3B\u9898\u4E2D...", wrapperClassName: "write-spin", spinning: loading }, { children: jsxs("main", __assign({ className: "markdown-main" }, { children: [jsx("textarea", { onScroll: handleScroll, onChange: handleChange, value: value, ref: editRef, className: "" + (fullScreen ? 'hide' : ''), id: "markdown-editor-reactjs-edit" }, void 0),
                        jsx("div", { onScroll: handleScroll, ref: showRef, className: "" + (fullScreen ? 'fullScreen' : ''), id: "write", dangerouslySetInnerHTML: { __html: htmlString } }, void 0)] }), void 0) }), void 0)] }, void 0));
}

export default MarkDownEditor;
