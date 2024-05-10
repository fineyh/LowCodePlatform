我有一个低代码平台项目，它可以根据符合规范的数据生成页面，这个数据是一个数组，里面的每一项都是一个对象，每个对象都对应着一个组件。 
下面的代码就是所有的组件列表。

[
  {
    "id": 0,
    "top": 65,
    "left": 30,
    "key": "text",
    "label": "文本",
    "focus": false,
    "width": 40,
    "height": 22,
    "zIndex": 0,
    "fontSize": 14,
    "zoom": 100,
    "revolve": 0,
    "fontFamily": "sans-serif",
    "color": "#333",
    "background": "",
    "event": ""
  },
  {
    "id": 1,
    "top": 54,
    "left": 139,
    "key": "btn",
    "label": "按钮",
    "focus": false,
    "width": 60,
    "height": 32,
    "zIndex": 0,
    "fontSize": 14,
    "zoom": 100,
    "revolve": 0,
    "fontFamily": "sans-serif",
    "color": "#606266",
    "borderRadius": 5,
    "event": ""
  },
  {
    "id": 2,
    "top": 50,
    "left": 285,
    "key": "input",
    "label": "输入框",
    "value": "",
    "focus": false,
    "width": 180,
    "height": 32,
    "zIndex": 0,
    "fontSize": 14,
    "color": "#333",
    "zoom": 100,
    "revolve": 0,
    "inputType": "",
    "borderRadius": 5,
    "event": ""
  },
  {
    "id": 3,
    "top": 35,
    "left": 482,
    "key": "image",
    "label": "图片",
    "focus": false,
    "width": 192,
    "height": 108,
    "zIndex": 0,
    "fontSize": 14,
    "color": "#333",
    "borderRadius": 0,
    "zoom": 100,
    "revolve": 0,
    "img": "img.png",
    "event": ""
  },
  {
    "id": 4,
    "top": 143,
    "left": 88.5,
    "key": "video",
    "label": "视频",
    "focus": false,
    "width": 145,
    "height": 108,
    "zIndex": 0,
    "fontSize": 14,
    "color": "#333",
    "zoom": 100,
    "revolve": 0,
    "video": "https://www.w3schools.com/html/movie.mp4",
    "autoplay": false,
    "loop": true,
    "muted": true,
    "event": ""
  },
  {
    "id": 5,
    "top": 224.5,
    "left": 194,
    "key": "line",
    "label": "线段",
    "focus": false,
    "width": 400,
    "height": 1,
    "zIndex": 0,
    "background": "#333",
    "zoom": 100,
    "revolve": 0,
    "event": ""
  }
]

如果一个页面包含了一个文本和按钮组件，那么这个页面的代码如下：
[
  {
    "id": 0,
    "top": 67,
    "left": 133,
    "key": "text",
    "label": "文本",
    "focus": false,
    "width": 40,
    "height": 22,
    "zIndex": 0,
    "fontSize": 14,
    "zoom": 100,
    "revolve": 0,
    "fontFamily": "sans-serif",
    "color": "#333",
    "background": "",
    "event": ""
  },
  {
    "id": 1,
    "top": 130,
    "left": 94,
    "key": "btn",
    "label": "按钮",
    "focus": false,
    "width": 60,
    "height": 32,
    "zIndex": 0,
    "fontSize": 14,
    "zoom": 100,
    "revolve": 0,
    "fontFamily": "sans-serif",
    "color": "#606266",
    "borderRadius": 5,
    "event": ""
  }
]

你作为一个技术专家，现在需要按照上面的规则来为我生成页面，并且生成的页面中每一个组件的属性都不能忽略。
除了组件代码，以\[开头，以\]结尾，不要说其他任何话
event事件代码说明：事件代码格式为'触发条件(事件(参数))',其中参数可以使用{组件名.属性}的方式进行插值，例如click(href({input-0.value}))或者click(href(https://www.nuist.edu.cn/main.htm))。

