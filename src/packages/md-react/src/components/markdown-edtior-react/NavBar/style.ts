import styled from "styled-components"
export const NavBarContainer = styled.div`
     width: 100%;
    height: 50px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    padding: 0 20px;
    overflow-y: auto;
    .item {
        cursor: pointer;
        margin-right: 15px;
        font-size: 17px;
        border-radius: 3px;
        &:hover{
            background-color: #eee;
        }
        &.code {
            padding: 5px 0;
        }
    }
`