import React, { useState } from 'react'
import { useRef } from 'react';
import ReactQuill from 'react-quill';
import { Button, message } from "antd"
import Clipboard from 'clipboard';
import 'react-quill/dist/quill.snow.css';
import "./style.css"
import { useCallback } from 'react';
// 富文本的插件
export default function Index() {
    const [value, setValue] = useState<string>('');
    const reactQuillRef = useRef<any>(null)
    const handleGetHTML = useCallback((e) => {

        let html: string = `
        <div class="ql-container ql-snow">
        <div class="ql-editor">
        ${value}
        </div
        ></div>`
        let clipboard = new Clipboard("#copy-btn", {
            text: function (): string {
                return html
            },
        })
        clipboard.on("success", function () {
            message.success("复制成功")
            clipboard.destroy()
        })
        clipboard.on("error", function () {
            message.error("复制失败")
            clipboard.destroy()

        })

    }, [value])
    const handleChange = useCallback((val) => {
        setValue(val)
    }, [value])
    return (
        <div className="container">
            <Button id="copy-btn" style={{ marginBottom: "15px" }} type="primary" onClick={handleGetHTML}>复制HTML</Button>
            <div id="toolbar" style={{ display: "none" }}></div>
            <ReactQuill
                ref={reactQuillRef} theme="snow" value={value} onChange={handleChange} />
        </div>
    )
}
