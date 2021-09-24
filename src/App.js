// import MarkdownEditor from "./packages/md-react/index.js"
import MarkdownEditor from "./packages/md-react/src/index.ts";
import RichTextEditor from "./packages/rich-text-editor/src/index"
import { Tabs } from "antd";
import "./App.css";
import { useCallback, useState } from "react";
const {TabPane} = Tabs
function App() {
  const [key, setKey] = useState("1")
  const handleChange = useCallback((key) => {
    setKey(key)
  }, [])
  return (
    <div className="App">
      <Tabs className="tab-container" defaultActiveKey={key} onChange={handleChange}>
        <TabPane tab="富文本编辑器" key="1">
        <RichTextEditor></RichTextEditor>
        </TabPane>
        <TabPane tab="Markdown编辑器" key="2">
      <MarkdownEditor></MarkdownEditor>
        </TabPane>
      </Tabs>
    </div>
  );
}

export default App;
