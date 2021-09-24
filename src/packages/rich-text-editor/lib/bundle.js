import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useCallback } from 'react';
import ReactQuill from 'react-quill';
import { message, Button } from 'antd';
import Clipboard from 'clipboard';
import 'react-quill/dist/quill.snow.css';

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

var css_248z = ".container {\n    height: 100%;\n}\n.container .quill {\n    height: 100%;\n}";
styleInject(css_248z);

// 富文本的插件
function Index() {
    var _a = useState(''), value = _a[0], setValue = _a[1];
    var reactQuillRef = useRef(null);
    var handleGetHTML = useCallback(function (e) {
        var html = "\n        <div class=\"ql-container ql-snow\">\n        <div class=\"ql-editor\">\n        " + value + "\n        </div\n        ></div>";
        var clipboard = new Clipboard("#copy-btn", {
            text: function () {
                return html;
            },
        });
        clipboard.on("success", function () {
            message.success("复制成功");
            clipboard.destroy();
        });
        clipboard.on("error", function () {
            message.error("复制失败");
            clipboard.destroy();
        });
    }, [value]);
    var handleChange = useCallback(function (val) {
        setValue(val);
    }, [value]);
    return (jsxs("div", __assign({ className: "container" }, { children: [jsx(Button, __assign({ id: "copy-btn", style: { marginBottom: "15px" }, type: "primary", onClick: handleGetHTML }, { children: "\u590D\u5236HTML" }), void 0), jsx("div", { id: "toolbar", style: { display: "none" } }, void 0), jsx(ReactQuill, { ref: reactQuillRef, theme: "snow", value: value, onChange: handleChange }, void 0)] }), void 0));
}

export { Index as default };
