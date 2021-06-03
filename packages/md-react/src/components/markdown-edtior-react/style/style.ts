import styled from "styled-components"
export const MarkdownEditorContainer = styled.div`
    height: 100%;
    .write-spin{
        width: 100%;;
        height: calc(100% - 50px);
    }
    .markdown-main{
        width: 100%;
        height: 100%;
        display: flex;
        #markdown-editor-reactjs-edit{
            flex: 1;
            height: 100%;
            width: 50%;
            border: 0;
            border-right: 1px solid #eee;
            background-color: rgb(248, 248, 250);
            padding: 20px;
            resize: none;
            outline: none;
            box-sizing: border-box;
            font-size: 15px;
            &.hide {
                display: none;
            }
        }
        #write{
            width: 100%;
            flex: 1;
            height: 100%;
            overflow: auto;
            padding: 20px 20px 40px;
            &.fullScrren{
                width: 100%;
            }
        }
    }
`