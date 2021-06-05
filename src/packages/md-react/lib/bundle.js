import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useCallback, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { message, Menu, Tooltip, Dropdown, Spin, Modal, Input } from 'antd';
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

var NavBarContainer = styled.div(templateObject_1 || (templateObject_1 = __makeTemplateObject(["\n     width: 100%;\n    height: 50px;\n    border-bottom: 1px solid #e1e1e1;\n    box-sizing: border-box;\n    display: flex;\n    align-items: center;\n    padding: 0 20px;\n    overflow-y: auto;\n    .item {\n        cursor: pointer;\n        margin-right: 15px;\n        font-size: 17px;\n        border-radius: 3px;\n        &:hover{\n            background-color: #eee;\n        }\n        &.code {\n            padding: 5px 0;\n        }\n    }\n"], ["\n     width: 100%;\n    height: 50px;\n    border-bottom: 1px solid #e1e1e1;\n    box-sizing: border-box;\n    display: flex;\n    align-items: center;\n    padding: 0 20px;\n    overflow-y: auto;\n    .item {\n        cursor: pointer;\n        margin-right: 15px;\n        font-size: 17px;\n        border-radius: 3px;\n        &:hover{\n            background-color: #eee;\n        }\n        &.code {\n            padding: 5px 0;\n        }\n    }\n"])));
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

var css_248z$2 = "/*! normalize.css v8.0.1 | MIT License | github.com/necolas/normalize.css */\n\n/* Document\n   ========================================================================== */\n\n/**\n * 1. Correct the line height in all browsers.\n * 2. Prevent adjustments of font size after orientation changes in iOS.\n */\n\n html {\n  line-height: 1.15; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n}\n\n/* Sections\n   ========================================================================== */\n\n/**\n * Remove the margin in all browsers.\n */\n\nbody {\n  margin: 0;\n}\n\n/**\n * Render the `main` element consistently in IE.\n */\n\nmain {\n  display: block;\n}\n\n/**\n * Correct the font size and margin on `h1` elements within `section` and\n * `article` contexts in Chrome, Firefox, and Safari.\n */\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n/* Grouping content\n   ========================================================================== */\n\n/**\n * 1. Add the correct box sizing in Firefox.\n * 2. Show the overflow in Edge and IE.\n */\n\nhr {\n  box-sizing: content-box; /* 1 */\n  height: 0; /* 1 */\n  overflow: visible; /* 2 */\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\npre {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/* Text-level semantics\n   ========================================================================== */\n\n/**\n * Remove the gray background on active links in IE 10.\n */\n\na {\n  background-color: transparent;\n}\n\n/**\n * 1. Remove the bottom border in Chrome 57-\n * 2. Add the correct text decoration in Chrome, Edge, IE, Opera, and Safari.\n */\n\nabbr[title] {\n  border-bottom: none; /* 1 */\n  text-decoration: underline; /* 2 */\n  text-decoration: underline dotted; /* 2 */\n}\n\n/**\n * Add the correct font weight in Chrome, Edge, and Safari.\n */\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/**\n * 1. Correct the inheritance and scaling of font size in all browsers.\n * 2. Correct the odd `em` font sizing in all browsers.\n */\n\ncode,\nkbd,\nsamp {\n  font-family: monospace, monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/**\n * Add the correct font size in all browsers.\n */\n\nsmall {\n  font-size: 80%;\n}\n\n/**\n * Prevent `sub` and `sup` elements from affecting the line height in\n * all browsers.\n */\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/* Embedded content\n   ========================================================================== */\n\n/**\n * Remove the border on images inside links in IE 10.\n */\n\nimg {\n  border-style: none;\n}\n\n/* Forms\n   ========================================================================== */\n\n/**\n * 1. Change the font styles in all browsers.\n * 2. Remove the margin in Firefox and Safari.\n */\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  line-height: 1.15; /* 1 */\n  margin: 0; /* 2 */\n}\n\n/**\n * Show the overflow in IE.\n * 1. Show the overflow in Edge.\n */\n\nbutton,\ninput { /* 1 */\n  overflow: visible;\n}\n\n/**\n * Remove the inheritance of text transform in Edge, Firefox, and IE.\n * 1. Remove the inheritance of text transform in Firefox.\n */\n\nbutton,\nselect { /* 1 */\n  text-transform: none;\n}\n\n/**\n * Correct the inability to style clickable types in iOS and Safari.\n */\n\nbutton,\n[type=\"button\"],\n[type=\"reset\"],\n[type=\"submit\"] {\n  -webkit-appearance: button;\n}\n\n/**\n * Remove the inner border and padding in Firefox.\n */\n\nbutton::-moz-focus-inner,\n[type=\"button\"]::-moz-focus-inner,\n[type=\"reset\"]::-moz-focus-inner,\n[type=\"submit\"]::-moz-focus-inner {\n  border-style: none;\n  padding: 0;\n}\n\n/**\n * Restore the focus styles unset by the previous rule.\n */\n\nbutton:-moz-focusring,\n[type=\"button\"]:-moz-focusring,\n[type=\"reset\"]:-moz-focusring,\n[type=\"submit\"]:-moz-focusring {\n  outline: 1px dotted ButtonText;\n}\n\n/**\n * Correct the padding in Firefox.\n */\n\nfieldset {\n  padding: 0.35em 0.75em 0.625em;\n}\n\n/**\n * 1. Correct the text wrapping in Edge and IE.\n * 2. Correct the color inheritance from `fieldset` elements in IE.\n * 3. Remove the padding so developers are not caught out when they zero out\n *    `fieldset` elements in all browsers.\n */\n\nlegend {\n  box-sizing: border-box; /* 1 */\n  color: inherit; /* 2 */\n  display: table; /* 1 */\n  max-width: 100%; /* 1 */\n  padding: 0; /* 3 */\n  white-space: normal; /* 1 */\n}\n\n/**\n * Add the correct vertical alignment in Chrome, Firefox, and Opera.\n */\n\nprogress {\n  vertical-align: baseline;\n}\n\n/**\n * Remove the default vertical scrollbar in IE 10+.\n */\n\ntextarea {\n  overflow: auto;\n}\n\n/**\n * 1. Add the correct box sizing in IE 10.\n * 2. Remove the padding in IE 10.\n */\n\n[type=\"checkbox\"],\n[type=\"radio\"] {\n  box-sizing: border-box; /* 1 */\n  padding: 0; /* 2 */\n}\n\n/**\n * Correct the cursor style of increment and decrement buttons in Chrome.\n */\n\n[type=\"number\"]::-webkit-inner-spin-button,\n[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/**\n * 1. Correct the odd appearance in Chrome and Safari.\n * 2. Correct the outline style in Safari.\n */\n\n[type=\"search\"] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/**\n * Remove the inner padding in Chrome and Safari on macOS.\n */\n\n[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/**\n * 1. Correct the inability to style clickable types in iOS and Safari.\n * 2. Change font properties to `inherit` in Safari.\n */\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/* Interactive\n   ========================================================================== */\n\n/*\n * Add the correct display in Edge, IE 10+, and Firefox.\n */\n\ndetails {\n  display: block;\n}\n\n/*\n * Add the correct display in all browsers.\n */\n\nsummary {\n  display: list-item;\n}\n\n/* Misc\n   ========================================================================== */\n\n/**\n * Add the correct display in IE 10+.\n */\n\ntemplate {\n  display: none;\n}\n\n/**\n * Add the correct display in IE 10.\n */\n\n[hidden] {\n  display: none;\n}\n";
styleInject(css_248z$2);

var css_248z$1 = "@import url('https://fonts.googleapis.com/css2?family=Source+Code+Pro&display=swap');\n\nbody {\n  font-family: Helvetica, arial, sans-serif;\n  font-size: 16px;\n  line-height: 1.6;\n}\n\nbody > *:first-child {\n  margin-top: 0 !important; }\nbody > *:last-child {\n  margin-bottom: 0 !important; } \n\na {\n  color: #4183C4; }\na.absent {\n  color: #cc0000; }\na.anchor {\n  display: block;\n  padding-left: 30px;\n  margin-left: -30px;\n  cursor: pointer;\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0; }\n\nh1, h2, h3, h4, h5, h6 {\n  margin: 20px 0 10px;\n  padding: 0;\n  font-weight: bold;\n  -webkit-font-smoothing: antialiased;\n  cursor: text;\n  position: relative; }\n\n/* h1:hover a.anchor, h2:hover a.anchor, h3:hover a.anchor, h4:hover a.anchor, h5:hover a.anchor, h6:hover a.anchor {\n  background: url(\"../../images/modules/styleguide/para.png\") no-repeat 10px center;\n  text-decoration: none; } */\n\nh1 tt, h1 code {\n  font-size: inherit; }\n\nh2 tt, h2 code {\n  font-size: inherit; }\n\nh3 tt, h3 code {\n  font-size: inherit; }\n\nh4 tt, h4 code {\n  font-size: inherit; }\n\nh5 tt, h5 code {\n  font-size: inherit; }\n\nh6 tt, h6 code {\n  font-size: inherit; }\n\nh1 {\n  font-size: 38px;\n  color: black; }\n\nh2 {\n  font-size: 28px;\n  border-bottom: 1px solid #cccccc;\n  color: black; }\n\nh3 {\n  font-size: 24px; }\n\nh4 {\n  font-size: 20px; }\n\nh5 {\n  font-size: 18px; }\n\nh6 {\n  color: #777777;\n  font-size: 18px; }\n\np, blockquote, ul, ol, dl, table, pre {\n  margin: 10px 0; }\n\nli {\n  margin: 5px 0;\n}\n\nhr {\n  border: solid 1px #cccccc;\n  padding: 0; }\n\nbody > h2:first-child {\n  margin-top: 0;\n  padding-top: 0; }\nbody > h1:first-child {\n  margin-top: 0;\n  padding-top: 0; }\n  body > h1:first-child + h2 {\n    margin-top: 0;\n    padding-top: 0; }\nbody > h3:first-child, body > h4:first-child, body > h5:first-child, body > h6:first-child {\n  margin-top: 0;\n  padding-top: 0; }\n\na:first-child h1, a:first-child h2, a:first-child h3, a:first-child h4, a:first-child h5, a:first-child h6 {\n  margin-top: 0;\n  padding-top: 0; }\n\nh1 p, h2 p, h3 p, h4 p, h5 p, h6 p {\n  margin-top: 0; }\n\nli p.first {\n  display: inline-block; }\n\nul, ol {\n  padding-left: 30px; }\n\nul :first-child, ol :first-child {\n  margin-top: 0; }\n\nul :last-child, ol :last-child {\n  margin-bottom: 0; }\n\ndl {\n  padding: 0; }\n  dl dt {\n    font-size: 14px;\n    font-weight: bold;\n    font-style: italic;\n    padding: 0;\n    margin: 15px 0 5px; }\n    dl dt:first-child {\n      padding: 0; }\n    dl dt > :first-child {\n      margin-top: 0; }\n    dl dt > :last-child {\n      margin-bottom: 0; }\n  dl dd {\n    margin: 0 0 15px;\n    padding: 0 15px; }\n    dl dd > :first-child {\n      margin-top: 0; }\n    dl dd > :last-child {\n      margin-bottom: 0; }\n\nblockquote {\n  border-left: 4px solid #dddddd;\n  padding: 0 15px;\n  color: #777777; }\n  blockquote > :first-child {\n    margin-top: 0; }\n  blockquote > :last-child {\n    margin-bottom: 0; }\n\ntable {\n  padding: 0; }\n  table tr {\n    border-top: 1px solid #cccccc;\n    background-color: white;\n    margin: 0;\n    padding: 0; }\n    table tr:nth-child(2n) {\n      background-color: #f8f8f8; }\n    table tr th {\n      font-weight: bold;\n      border: 1px solid #cccccc;\n      text-align: left;\n      margin: 0;\n      padding: 6px 13px; }\n    table tr td {\n      border: 1px solid #cccccc;\n      text-align: left;\n      margin: 0;\n      padding: 6px 13px; }\n    table tr th :first-child, table tr td :first-child {\n      margin-top: 0; }\n    table tr th :last-child, table tr td :last-child {\n      margin-bottom: 0; }\n\nimg {\n  max-width: 100%; }\n\nspan.frame {\n  display: block;\n  overflow: hidden; }\n  span.frame > span {\n    border: 1px solid #dddddd;\n    display: block;\n    float: left;\n    overflow: hidden;\n    margin: 13px 0 0;\n    padding: 7px;\n    width: auto; }\n  span.frame span img {\n    display: block;\n    float: left; }\n  span.frame span span {\n    clear: both;\n    color: #333333;\n    display: block;\n    padding: 5px 0 0; }\nspan.align-center {\n  display: block;\n  overflow: hidden;\n  clear: both; }\n  span.align-center > span {\n    display: block;\n    overflow: hidden;\n    margin: 13px auto 0;\n    text-align: center; }\n  span.align-center span img {\n    margin: 0 auto;\n    text-align: center; }\nspan.align-right {\n  display: block;\n  overflow: hidden;\n  clear: both; }\n  span.align-right > span {\n    display: block;\n    overflow: hidden;\n    margin: 13px 0 0;\n    text-align: right; }\n  span.align-right span img {\n    margin: 0;\n    text-align: right; }\nspan.float-left {\n  display: block;\n  margin-right: 13px;\n  overflow: hidden;\n  float: left; }\n  span.float-left span {\n    margin: 13px 0 0; }\nspan.float-right {\n  display: block;\n  margin-left: 13px;\n  overflow: hidden;\n  float: right; }\n  span.float-right > span {\n    display: block;\n    overflow: hidden;\n    margin: 13px auto 0;\n    text-align: right; }\n\ncode, tt {\n  margin: 0 2px;\n  padding: 0 5px;\n  white-space: nowrap;\n  border: 1px solid #eaeaea;\n  background-color: #f8f8f8;\n  font-family: 'Source Code Pro', monospace;\n  border-radius: 5px; }\n\npre code {\n  margin: 0;\n  padding: 0;\n  white-space: pre;\n  font-family: 'Source Code Pro', monospace;\n  border: none;\n  background: transparent; }\n\n.highlight pre {\n  background-color: #f8f8f8;\n  border: 1px solid #dddddd;\n  font-size: 13px;\n  line-height: 19px;\n  overflow: auto;\n  font-family: 'Source Code Pro', monospace;\n  padding: 16px 20px;\n  border-radius: 5px; }\n\npre {\n  background-color: #f8f8f8;\n  border: 1px solid #dddddd;\n  font-size: 16px;\n  line-height: 19px;\n  overflow: auto;\n  padding: 5px 16px;\n  border-radius: 5px; }\n  pre code, pre tt {\n    background-color: transparent;\n    border: none; }\n\n\n.checklist {\n  list-style-type: none;\n  padding: 0;\n}\n\ninput[type=\"checkbox\"] {\n  margin: 0 5px;\n}\n";
styleInject(css_248z$1);

class Node {
  constructor(name, type) {
    this.name = name;
    this.type = type;
  }
}

const IMAGE_REGEX = /^!\[([^\]]*)?\]\(([^\)]+)\)$/;
const LINK_REGEX = /^\[([^\]]*)?\]\(([^\)]+)\)$/;

class Text extends Node {
  constructor(text) {
    super('text', 'inline');
    this.value = text;
  }
}

class Html extends Node {
  constructor(text) {
    super('html', 'inline');
    this.value = text;
  }
}

class HtmlComment extends Node {
  constructor(text) {
    super('htmlcomment', 'inline');
    this.value = text;
  }
}

class Em extends Node {
  constructor(text) {
    super('em', 'inline');
    this.value = text;
  }
}

class Italic extends Node {
  constructor(text) {
    super('italic', 'inline');
    this.value = text;
  }
}
class EmItalic extends Node {
  constructor(text) {
    super('emitalic', 'inline');
    this.value = text;
  }
}
class Strikethrough extends Node {
  constructor(text) {
    super('strikethrough', 'inline');
    this.value = text;
  }
}

class InlineCode extends Node {
  constructor(text) {
    super('code', 'inline');
    this.value = text;
  }
}

class Image extends Node {
  constructor(text) {
    const match = text.match(IMAGE_REGEX);
    if (!match) {
      throw new Error(`Invalid image syntax: ${text}`);
    }
    super('image', 'inline');
    this.alt = match[1] || '';
    this.src = match[2] || '';
  }
}

class Link extends Node {
  constructor(text) {
    const match = text.match(LINK_REGEX);
    if (!match) {
      throw new Error(`Invalid link syntax: ${text}`);
    }
    super('link', 'inline');
    this.title = match[1] || '';
    this.href = match[2] || '';
  }
}

var inline = {
  Text,
  Html,
  HtmlComment,
  Em,
  Italic,
  EmItalic,
  Strikethrough,
  InlineCode,
  Image,
  Link
};

const EMPTY_REGEX = /^\s*$/;

const isEmpty = str => {
  return str.length === 0 || EMPTY_REGEX.test(str);
};

var helper = {
  isEmpty
};

const MODE_DEFAULT$1 = 0;
const MODE_ASTERISK = 1;
const MODE_ASTERISK_DOUBLE = 2;
const MODE_ASTERISK_TRIPLE = 3;
const MODE_UNDERLINE = 4;
const MODE_UNDERLINE_DOUBLE = 5;
const MODE_UNDERLINE_TRIPLE = 6;
const MODE_STRIKETHROUGH = 7;
const MODE_IMAGE = 8;
const MODE_LINK = 9;
const MODE_INLINE_CODE = 10;

var inlineParser = text => {
  const ast = [];

  let stack = '';
  let mode = MODE_DEFAULT$1;
  let escapeSequence = false;
  const html = [];

  for (let i = 0; i < text.length; ++i) {
    const char = text[i];

    if (escapeSequence === true) {
      stack += char;
      escapeSequence = false;
      continue;
    }

    switch (char) {
      case "*":
        if (text[i + 1] === '*') {
          i++;
          if (text[i + 1] === '*') {
            i++;
            if (mode === MODE_ASTERISK_TRIPLE) {
              ast.push(new inline.EmItalic(stack));
              mode = MODE_DEFAULT$1;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(new inline.Text(stack));
              }
              mode = MODE_ASTERISK_TRIPLE;
            }
            stack = '';
          } else {
            if (mode === MODE_ASTERISK_DOUBLE) {
              ast.push(new inline.Em(stack));
              mode = MODE_DEFAULT$1;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(new inline.Text(stack));
              }
              mode = MODE_ASTERISK_DOUBLE;
            }
            stack = '';
          }
          continue;
        }
        if (mode === MODE_ASTERISK) {
          ast.push(new inline.Italic(stack));
          mode = MODE_DEFAULT$1;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(new inline.Text(stack));
          }
          mode = MODE_ASTERISK;
        }
        stack = '';
        continue;
      case "_":
        if (text[i + 1] === '_') {
          i++;
          if (text[i + 1] === '_') {
            i++;
            if (mode === MODE_UNDERLINE_TRIPLE) {
              ast.push(new inline.EmItalic(stack));
              mode = MODE_DEFAULT$1;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(new inline.Text(stack));
              }
              mode = MODE_UNDERLINE_TRIPLE;
            }
            stack = '';
          } else {
            if (mode === MODE_UNDERLINE_DOUBLE) {
              ast.push(new inline.Em(stack));
              mode = MODE_DEFAULT$1;
            } else {
              if (!helper.isEmpty(stack)) {
                ast.push(new inline.Text(stack));
              }
              mode = MODE_UNDERLINE_DOUBLE;
            }
            stack = '';
          }
          continue;
        }
        if (mode === MODE_UNDERLINE) {
          ast.push(new inline.Italic(stack));
          mode = MODE_DEFAULT$1;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(new inline.Text(stack));
          }
          mode = MODE_UNDERLINE;
        }
        stack = '';
        continue;
      case "~":
        if (text[i + 1] === '~') {
          i++;
          if (mode === MODE_STRIKETHROUGH) {
            ast.push(new inline.Strikethrough(stack));
            mode = MODE_DEFAULT$1;
          } else {
            if (!helper.isEmpty(stack)) {
              ast.push(new inline.Text(stack));
            }
            mode = MODE_STRIKETHROUGH;
          }
          stack = '';
          continue;
        }
        stack += char;
        continue;
      case "`":
        if (mode === MODE_INLINE_CODE) {
          ast.push(new inline.InlineCode(stack));
          mode = MODE_DEFAULT$1;
        } else {
          if (!helper.isEmpty(stack)) {
            ast.push(new inline.Text(stack));
          }
          mode = MODE_INLINE_CODE;
        }
        stack = '';
        continue;
      case "<":
        if (!helper.isEmpty(stack)) {
          if (html.length === 0) {
            ast.push(new inline.Text(stack));
          } else {
            html[html.length - 1] += stack;
          }
          stack = '';
        }
        let c = char;
        do {
          stack += c;
          c = text[++i];
        } while(c != ">");
        stack += c;
        if (stack[1] === '/') {
          const h = html.pop() + stack;
          ast.push(new inline.Html(h));
        } else if (stack[1] === '!') {
          ast.push(new inline.HtmlComment(stack));
        } else {
          html.push(stack);
        }
        stack = '';
        continue;
      case "!":
        if (!helper.isEmpty(stack)) {
          ast.push(new inline.Text(stack));
        }
        stack = '';
        mode = MODE_IMAGE;
        stack = char;
        continue;
      case "[":
        if (mode !== MODE_IMAGE) {
          if (!helper.isEmpty(stack)) {
            ast.push(new inline.Text(stack));
          }
          mode = MODE_LINK;
          stack = char;
          continue
        }
        stack += char;
        continue;
      case ")":
        stack += char;
        if (mode === MODE_IMAGE) {
          ast.push(new inline.Image(stack));
          mode = MODE_DEFAULT$1;
          stack = '';
        } else if (mode === MODE_LINK) {
          ast.push(new inline.Link(stack));
          mode = MODE_DEFAULT$1;
          stack = '';
        } else {
          stack += char;
        }
        continue;
      case "\\":
        escapeSequence = true;
        continue;
      default:
        stack += char;
        break;
    }
  }
  if (!helper.isEmpty(stack)) {
    const prev = ast[ast.length - 1];
    if (!prev || mode === MODE_DEFAULT$1) {
      ast.push(new inline.Text(stack));
    } else {
      let prefix = '';
      switch (mode) {
        case MODE_ASTERISK: prefix = '*'; break;
        case MODE_ASTERISK_DOUBLE: prefix = '**'; break;
        case MODE_ASTERISK_TRIPLE: prefix = '**'; break;
        case MODE_UNDERLINE: prefix = '_'; break;
        case MODE_UNDERLINE_DOUBLE: prefix = '__'; break;
        case MODE_UNDERLINE_TRIPLE: prefix = '___'; break;
        case MODE_STRIKETHROUGH: prefix = '~~'; break;
        case MODE_INLINE_CODE: prefix = '`'; break;
      }
      prev.value += `${prefix}${stack}`;
    }
  }
  return ast;
};

class SyntaxError extends Error {
  constructor(message) {
    super(message);
  }
}

class Paragraph extends Node {
  constructor(text) {
    super('paragraph', 'block');
    this.values = inlineParser(text);
  }
}

class Horizontal extends Node {
  constructor(text) {
    super('horizontal', 'block');
    this.values = [];
  }
}

class Br extends Node {
  constructor() {
    super('br', 'block');
    this.values = [];
  }
}

class Code extends Node {
  constructor(text, syntax) {
    super('code', 'block');
    this.syntax = syntax;
    this.values = [
      new inline.Text(text)
    ];
  }
}

class Blockquote extends Node {
  constructor(text, level) {
    super('blockquote', 'block');
    this.level = level;
    this.values = new inlineParser(text);
  }
}

class Heading extends Node {
  constructor(text, level) {
    if (level === 0 || level > 6) {
      throw new SyntaxError('Invalid heading: heading support only between H1 and H6');
    }
    super('heading', 'block');
    this.level = level;
    this.values = inlineParser(text);
  }
}

class List extends Node {
  constructor(text, level) {
    super('list', 'block');
    this.level = level;
    this.values = inlineParser(text);
  }
}

class OrderedList extends Node {
  constructor(text, order, level) {
    super('orderedlist', 'block');
    this.level = level;
    this.order = order;
    this.values = inlineParser(text);
  }
}

class CheckList extends Node {
  constructor(text, checked, level) {
    super('checklist', 'block');
    this.level = level;
    this.checked = checked;
    this.values = inlineParser(text);
  }
}

class Table extends Node {
  constructor(_rows) {
    super('table', 'block');
    const [heading, separator, ...rows] = _rows.map(line => line.replace(/^\||\|$/g, '').split('|'));
    if(heading !== undefined) {
      this.headings = heading.map(cell => cell.trim());
    }
    if (separator !== undefined) {
      this.aligns = separator.map(cell => {
        cell = cell.trim();
        let align = 'left';
        if (cell[cell.length - 1] === ':') {
          align = cell[0] === ':' ? 'center': 'right';
        }
        return align;
      });
    }
    if (rows !== undefined) {
      this.rows = rows.map(row => {
        return row.map(cell => inlineParser(cell.trim()));
      });
    }
  }
}

var nodes = {
  Paragraph,
  Horizontal,
  Code,
  Blockquote,
  Heading,
  List,
  CheckList,
  OrderedList,
  Table,
  Br
};

const HEADING_REGEX = /^(#{1,})\s(.+)$/;
const ULIST_REGEX = /^(\s*)?(?:\-|\*)\s(.+)$/;
const OLIST_REGEX = /^(\s*)?([0-9]+)\.\s(.+)$/;
const HORIZONTAL_RULE_REGEX = /^[\*\-_\s]+$/;
const CODE_REGEX = /^[`~]{3}(.*)|[`~]{3}(.*)\b[\l]+\b$/;
const BLOCKQUOTE_REGEX = /^(>{1,})\s?(.+)$/;
const LINEBREAK_REGEX = /(.+?)[\u0020]{2}$/;
const TABLE_REGEX = /(?:\s*)?\|(.+)\|(?:\s*)$/;

const MODE_DEFAULT = 0;
const MODE_CODE = 1;

var require$$0 = str => {
  const ast = [];

  if (!/\n$/.test(str)) {
    str += '\n';
  }

  let stack = '';
  let line = '';
  let mode = MODE_DEFAULT;
  let tables = [];
  let match;
  let codeLang = '';

  const parseParagraph = stack => {
    if (tables.length > 0) {
      ast.push(new nodes.Table(tables));
      tables = [];
    }
    if (!helper.isEmpty(stack)) {
      ast.push(new nodes.Paragraph(stack));
    }
  };

  for (let i = 0; i < str.length; ++i) {
    const char = str[i];

    if (char === '\r') {
      continue;
    }

    if (char === '\n') {
      if (null !== (match = line.match(LINEBREAK_REGEX))) {
        parseParagraph(stack + match[1]);
        stack = '';
      } else if (CODE_REGEX.test(line)) {
        if (mode === MODE_CODE) {
          ast.push(new nodes.Code(stack.trim(), codeLang));
          codeLang = '';
          mode = MODE_DEFAULT;
        } else {
          parseParagraph(stack);
          codeLang = line.replace(/\`\`\`/, '').trim();
          mode = MODE_CODE;
        }
        stack = '';
      } else if (null !== (match = line.match(BLOCKQUOTE_REGEX))) {
        parseParagraph(stack);
        stack = '';
        ast.push(new nodes.Blockquote(match[2], match[1].length));
      } else if (HORIZONTAL_RULE_REGEX.test(line) && line.split(/[\*\-_]/).length > 3) {
        parseParagraph(stack);
        stack = '';
        ast.push(new nodes.Horizontal());
      } else if (null !== (match = line.match(HEADING_REGEX))) {
        parseParagraph(stack);
        stack = '';
        ast.push(new nodes.Heading(match[2], match[1].length));
      } else if (null !== (match = line.match(ULIST_REGEX))) {
        parseParagraph(stack);
        stack = '';
        const prev = ast[ast.length - 1];
        const check = match[2].match(/^\[(x|\u0020)?\]\s(.+)$/);
        let level = 1;
        if (prev && (prev.name === 'list' || prev.name === 'checklist')) {
          const indent = (match[1] || '').length;
          if (prev.level * 2 <= indent) {
            level = prev.level + 1;
          } else if (prev.level === indent) {
            level = prev.level;
          } else if (indent === 0) {
            level = 1;
          } else {
            level = prev.level - 1;
          }
        }
        const list = check ? new nodes.CheckList(check[2], check[1] === 'x', level) : new nodes.List(match[2], level);
        ast.push(list);
      } else if (null !== (match = line.match(OLIST_REGEX))) {
        parseParagraph(stack);
        stack = '';
        const prev = ast[ast.length - 1];
        let level = 1;
        if (prev && (prev.name === 'orderedlist')) {
          const indent = (match[1] || '').length;
          if (prev.level * 2 <= indent) {
            level = prev.level + 1;
          } else if (prev.level === indent) {
            level = prev.level;
          } else {
            level = prev.level - 1;
          }
        }
        const list = new nodes.OrderedList(match[3], (match[2] | 0), level);
        ast.push(list);
      } else if (null !== (match = line.match(TABLE_REGEX))) {
        tables.push(line);
        stack = '';
      } else if (line === '') {
        parseParagraph(stack);
        stack = '';
        ast.push(new nodes.Br());
      } else {
        stack += line !== '' ? `${line}\n` : '';
      }
      line = '';
    } else {
      line += char;
    }
  }
  parseParagraph(stack.slice(0, -1));
  return ast;
};

var parser = require$$0;

var mtp = parser;

const heading = (level, value) => {
  return `<h${level}>${value}</h${level}>\n`
};

const paragraph = (values) => {
  let text = `<p>\n`;
  for(const data of values) {
    if (data.name === "em") {
      text += `<strong>${data.value}</strong>`;
    } else if (data.name === "strikethrough") {
      text += `<del>${data.value}</del>`;
    } else if (data.name === "italic") {
      text += `<em>${data.value}</em>`;
    } else if(data.name === "link") {
      text += `<a href="${data.href}">${data.title}</a>`;
    } else if(data.name === "image") {
      text += `<img src="${data.src}" alt="${data.alt}" />`;
    } else if(data.name === "code") {
      text += `<code>${data.value}</code>`;
    } 
    else {
      text += data.value;
    }
  }
  text += `</p>\n`;
  return text
};

const blockquote = (values) => {
  let bq = `<blockquote>\n`;
  for (const data of values) {
    let text = `<p>\n`;
    for (const val of data) {
      if (val.name === "em") {
        text += `<strong>${val.value}</strong>`;
      } else if (val.name === "strikethrough") {
        text += `<del>${val.value}</del>`;
      } else if (val.name === "italic") {
        text += `<em>${val.value}</em>`;
      } else if(val.name === "link") {
        text += `<a href="${val.href}">${val.title}</a>`;
      } else if(val.name === "image") {
        text += `<img src="${val.src}" alt="${val.alt}" />`;
      } else if(val.name === "code") {
        text += `<code>${val.value}</code>`;
      } 
      else {
        text += val.value;
      }
    }
    text += `</p>\n`;
    bq += text;
  }
  bq += `</blockquote>\n`;
  return bq
};

const ulist = (values) => {
  let prev = null;
  let ulist = `<ul>\n`;
  for (const data of values) {
    if (prev && data.level > prev.level) {
      ulist += `<ul>\n`;
      ulist += `<li>\n`;
      ulist += `${data.value[0].value}\n`;
      ulist += `</li>\n`;
    } else if (prev && data.level < prev.level) {
      for (let i = 0; i < prev.level - data.level; i++) {
        ulist += `</ul>\n`;
      }
      ulist += `<li>\n`; 
      ulist += `${data.value[0].value}\n`;
      ulist += `</li>\n`;
    } else if (prev && data.level === prev.level) {
      ulist += `<li>\n`;
      ulist += `${data.value[0].value}\n`;
      ulist += `</li>\n`;
    } else {
      ulist += `<li>\n`; 
      ulist += `${data.value[0].value}\n`;
      ulist += `</li>\n`;
    }
    prev = data;
  }
  ulist += `</ul>\n`;
  return ulist
};

const checklist = (values) => {
  let prev = null;
  let clist = `<ul class="checklist">\n`;
  for (const data of values) {
    if (prev && data.level > prev.level) {
      clist += `<ul class="checklist">\n`;
      clist += `<li>\n`;
      if(data.checked) {
        clist += `<input type="checkbox" checked="checked">${data.value[0].value}\n`;
      } else {
        clist += `<input type="checkbox">${data.value[0].value}\n`;
      }
      clist += `</li>\n`;
    } else if (prev && data.level < prev.level) {
      for (let i = 0; i < prev.level - data.level; i++) {
        clist += `</ul>\n`;
      }
      clist += `<li>\n`; 
      if(data.checked) {
        clist += `<input type="checkbox" checked="checked">${data.value[0].value}\n`;
      } else {
        clist += `<input type="checkbox">${data.value[0].value}\n`;
      }
      clist += `</li>\n`;
    } else if (prev && data.level === prev.level) {
      clist += `<li>\n`;
      if(data.checked) {
        clist += `<input type="checkbox" checked="checked">${data.value[0].value}\n`;
      } else {
        clist += `<input type="checkbox">${data.value[0].value}\n`;
      }
      clist += `</li>\n`;
    } else {
      clist += `<li>\n`; 
      if(data.checked) {
        clist += `<input type="checkbox" checked="checked">${data.value[0].value}\n`;
      } else {
        clist += `<input type="checkbox">${data.value[0].value}\n`;
      }
      clist += `</li>\n`;
    }
    prev = data;
  }
  clist += `</ul>\n`;
  return clist
};

const orderedlist = (values) => {
  let olist = `<ol>\n`;
  for (const datalist of values) {
    for (const data of datalist) {
      olist += `<li>${data.value}</li>\n`;
    }
  }
  olist += `</ol>\n`;
  return olist
};

const code = (data) => {
  return `<pre>\n<code class="${data.syntax}">\n${data.values[0].value}\n</code>\n</pre>\n`
};

const horizontal = () => {
  return `<hr />\n`
};

const table = (data) => {
  let tableblock = `<table>\n`;
  tableblock += `<thead>\n<tr>\n`;
  for (const heading of data.headings) {
    tableblock += `<th>${heading}</th>\n`;
  }
  tableblock += `</thead>\n</tr>\n`;
  tableblock += `<tbody>\n`;
  for (const row of data.rows) {
    tableblock += `<tr>\n`;
    for (const column of row) {
      for (const obj of column) {
        tableblock += `<td>${obj.value}</td>\n`;
      }
    }
    tableblock += `</tr>\n`;
  }
  tableblock += `</tbody>\n`;
  tableblock += `</table>\n`;
  return tableblock
};

const br = () => {
  return `<br />\n`
};

const mdConvert = (text) => {
  const mdTree = mtp(text);
  let htmlValue = ``;
  let prev = null;
  let bqValue = [];
  let listValue = [];
  for (const line of mdTree) {
    if(line.name === "heading") {
      if (line.values.length !== 0) {
        htmlValue += heading(line.level, line.values[0].value);
      }
      prev = line;
    } else if (line.name === "paragraph") {
      if (prev && prev.name === "blockquote") {
        bqValue.push(line.values);
        if (line === mdTree[mdTree.length-1]) {
          htmlValue += blockquote(bqValue);
        }
      } else {
        htmlValue += paragraph(line.values);
      }
      prev = line;
    } else if (line.name === "blockquote") {
      bqValue.push(line.values);
      prev = line;
      if (line === mdTree[mdTree.length-1]) {
        htmlValue += blockquote(bqValue);
      }
    } else if (line.name === "list") {
      listValue.push({ level: line.level, value: line.values });
      if (line === mdTree[mdTree.length-1]) {
        htmlValue += ulist(listValue);
      }
      prev = line;
    } else if (line.name === "checklist") {
      listValue.push({ level: line.level, value: line.values, checked: line.checked });
      if (line === mdTree[mdTree.length-1]) {
        htmlValue += checklist(listValue);
      }
      prev = line;
    } else if (line.name === "orderedlist") {
      listValue.push(line.values);
      if (line === mdTree[mdTree.length-1]) {
        htmlValue += orderedlist(listValue);
      }
      // htmlValue += convert.orderedlist(line.values)
      prev = line;
    } else if (line.name === "code") {
      htmlValue += code(line);
    } else if (line.name === "horizontal") {
      htmlValue += horizontal();
    } else if(line.name === "table") {
      htmlValue += table(line);
    } else if (line.name === "br") {
      if (bqValue.length !== 0) {
        htmlValue += blockquote(bqValue);
        bqValue = [];
        continue
      }
      if (prev && prev.name === "list") {
        htmlValue += ulist(listValue);
        listValue = [];
        continue
      }
      if (prev && prev.name === "orderedlist") {
        htmlValue += orderedlist(listValue);
        listValue = [];
        continue
      }
      if (prev && prev.name === "checklist") {
        htmlValue += checklist(listValue);
        listValue = [];
        continue
      }
      if (prev && prev.name === line.name) {
        continue
      }
      htmlValue += br();
      prev = line;
    }
  }
  return htmlValue
};

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
    /**
     * HTML转换markdown文档
     */
    var handleHtmlToMd = function () {
        props.setTransformTitle("html-to-md");
        props.setVisible(true);
    };
    /**
     * md转换为html
     */
    var handleMdToHtml = function () {
        try {
            var html = mdConvert(props.value);
            // 首先判断是否支持流对象
            if (!Blob || !URL) {
                return message.error({
                    content: "浏览器不支持导出html文件，请更换浏览器再试"
                });
            }
            // 是否存在转换只会走的value值
            if (!html) {
                // 不存在
                return message.warn({
                    content: "当前内容为空，无需导出"
                });
            }
            var blob = new Blob([html]);
            // 创建a标签
            var aEl = document.createElement("a");
            var downloadUrl = URL.createObjectURL(blob);
            aEl.href = downloadUrl;
            aEl.download = hash() + ".html";
            aEl.click();
            // 移除创建的流对象
            URL.revokeObjectURL(downloadUrl);
            message.success({
                content: "导出html成功"
            });
        }
        catch (error) {
            message.error({
                content: "该功能暂时不稳定，正在紧急修复"
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
            jsxs(Item, { children: [jsx(DownloadOutlined, {}, void 0), "\u5BFC\u51FAmd"] }, "exportMd"),
            jsx(Item, __assign({ onClick: handleHtmlToMd }, { children: "html-to-md" }), "html-to-md"),
            jsx(Item, __assign({ onClick: handleMdToHtml }, { children: "md-to-html" }), "md-to-html")] }), void 0));
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
            props.fullScreen
                ? jsx(Tooltip, __assign({ title: '\u9000\u51FA\u5168\u5C4F', arrowPointAtCenter: true }, { children: jsx(CompressOutlined, { className: "item", onClick: function () { props.setFullScreen(false); message.info('退出全屏模式'); } }, void 0) }), void 0)
                : jsx(Tooltip, __assign({ title: '\u8FDB\u5165\u5168\u5C4F', arrowPointAtCenter: true }, { children: jsx(ExpandOutlined, { className: "item", onClick: function () { props.setFullScreen(true); message.info('进入全屏模式'); } }, void 0) }), void 0)] }, void 0));
}

var css_248z = "/* 修改antd dropdown组件的最大高度，并使其形成滚动条 */\n.item-group-list-container .ant-dropdown-menu-item-group-list {\n    max-height: 243px;\n    overflow: auto;\n    margin: 0;\n    padding: 0 8px;\n}\n\n/* 修改antd加载的内嵌容器样式 */\n.write-spin .ant-spin-container {\n    width: 100%;\n    height: 100%;\n}\n\n/* 去除任务列表前面的小黑点  */\nli.task-list-item {\n    list-style: none;\n}\n\n/* antd的dropdown组件选中的选项的样式 */\n.code-highlight-theme-menu .active, .markdown-theme-menu .active {\n    background-color: rgb(225, 248, 222);\n    border-radius: 3px;\n}\npre {\n    padding: 0;\n    background-color: transparent;\n    border: none;\n}";
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
var HtmlToMd = require("html-to-md");
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
    var _e = useState(""), transformTitle = _e[0], setTransformTitle = _e[1];
    var _f = useState(false), visible = _f[0], setVisible = _f[1];
    var _g = useState(""), transformValue = _g[0], setTransformValue = _g[1];
    var _h = useState(false), transformLoading = _h[0], setTransformLoading = _h[1];
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
     * 将html转换为md
     * @param value
     */
    var handleTransformHtmlToMd = function () {
        if (!transformValue.trim()) {
            message.warning({
                content: "没有内容，不需要转换"
            });
            return;
        }
        setTransformLoading(true);
        var newValue = HtmlToMd(transformValue);
        setValue(newValue);
        setTransformLoading(false);
        message.success({
            content: "转换成功"
        });
        setVisible(false);
    };
    /**
     * 需求
     * 左侧面板输入markdown格式的文本，然后右侧进行转换为markdown的风格的文档
     */
    return (jsxs(MarkdownEditorContainer, { children: [jsx(NavBar, { setValue: setValue, value: value, editElement: editRef, fullScreen: fullScreen, setFullScreen: setFullScreen, setLoading: setLoading, setTransformTitle: setTransformTitle, setVisible: setVisible }, void 0),
            jsx(Spin, __assign({ tip: "\u66F4\u65B0\u4E3B\u9898\u4E2D...", wrapperClassName: "write-spin", spinning: loading }, { children: jsxs("main", __assign({ className: "markdown-main" }, { children: [jsx("textarea", { onScroll: handleScroll, onChange: handleChange, value: value, ref: editRef, className: "" + (fullScreen ? 'hide' : ''), id: "markdown-editor-reactjs-edit" }, void 0),
                        jsx("div", { onScroll: handleScroll, ref: showRef, className: "" + (fullScreen ? 'fullScreen' : ''), id: "write", dangerouslySetInnerHTML: { __html: htmlString } }, void 0)] }), void 0) }), void 0),
            jsx(Modal, __assign({ width: "50%", onCancel: function () {
                    setTransformValue("");
                    setVisible(false);
                }, onOk: function () {
                    // 转换过程
                    handleTransformHtmlToMd();
                }, cancelText: "\u8FD4\u56DE", okText: "\u786E\u5B9A", title: transformTitle, visible: visible }, { children: jsx(Spin, __assign({ tip: "\u8F6C\u6362\u4E2D...", spinning: transformLoading }, { children: jsx(Input.TextArea, { autoSize: { minRows: 6, maxRows: 18 }, value: transformValue, onChange: function (_a) {
                            var value = _a.target.value;
                            return setTransformValue(value);
                        } }, void 0) }), void 0) }), void 0)] }, void 0));
}

export default MarkDownEditor;
