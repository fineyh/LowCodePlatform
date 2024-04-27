import { ComponentRegisty } from '@/interface'

// 创建映射函数
function registerComponent(): ComponentRegisty {
    // 组件列表
    const componentList = []
    // 画布组件映射
    const componentMap = {}

    return {
        componentList,
        componentMap,
        register: (component) => {
            componentList.push(component)
            componentMap[component.key] = component
        }
    }
}

// 导出
export let registry: ComponentRegisty = registerComponent()

// 注册组件
registry.register({
    key: 'text',
    label: '文本',
    focus: false,
    width: 40,
    height: 22,
    zIndex: 0,
    fontSize: 14,
    zoom:100,
    revolve:0,
    fontFamily: "sans-serif",
    color: "#333",
    background: "",
    event: '',
    render: (data) => <p style={{
        textAlign: 'center',
        lineHeight: `${data.height}px`,
        fontFamily: `${data.fontFamily}`,
        background: `${data.background}`,
    }}>{data.label}</p>
})

registry.register({
    key: 'btn',
    label: '按钮',
    focus: false,
    width: 60,
    height: 32,
    zIndex: 0,
    fontSize: 14,
    zoom:100,
    revolve:0,
    fontFamily: "sans-serif",
    color: "#606266",
    borderRadius: 5,
    event: '',
    render: (data) => <button style={{
        width: '100%', height: '100%',
        fontFamily: `${data.fontFamily}`,
        borderRadius: `${data.borderRadius}px`,
    }} class='el-buttons'>{data.label}</button>
})

registry.register({
    key: 'input',
    label: '输入框',
    value: '',
    focus: false,
    width: 180,
    height: 32,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    zoom:100,
    revolve:0,
    inputType: "",
    borderRadius: 5,
    event: '',
    render: (data) => <input style={{
        lineHeight: `${data.height}px`,
        width: `${data.width}px`,
        height: `${data.height}px`,
        borderRadius: `${data.borderRadius}px`,
    }} placeholder={data.label}></input>
})

registry.register({
    key: 'image',
    label: '图片',
    focus: false,
    width: 150,
    height: 93,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    borderRadius: 0,
    zoom:100,
    revolve:0,
    img: "https://gimg3.baidu.com/search/src=http%3A%2F%2Fgips2.baidu.com%2Fit%2Fu%3D3426861169%2C1209499456%26fm%3D3030%26app%3D3030%26f%3DPNG%3Fw%3D200%26h%3D133%26s%3D58E3895447F1AFC80CF28F830300E08F&refer=http%3A%2F%2Fwww.baidu.com&app=2021&size=f242,150&n=0&g=0n&q=100&fmt=auto?sec=1714323600&t=114f966340173d4db494c9f3d349748a",
    event: '',
    render: (data) => <img src={data.img}
                           style={{
                               width: `${data.width}px`,
                               height: `${data.height}px`,
                               borderRadius: `${data.borderRadius}px`,
                           }}></img>
})

registry.register({
    key: 'video',
    label: '视频',
    focus: false,
    width: 145,
    height: 108,
    zIndex: 0,
    fontSize: 14,
    color: "#333",
    zoom:100,
    revolve:0,
    video: "https://www.w3schools.com/html/movie.mp4",
    autoplay: false,
    loop: true,
    muted: true,
    event: '',
    render: (data) => <video src={data.video}
                            controls
                             autoplay={data.autoplay} loop={data.loop} muted={data.muted}
                             style={{
                                 width: `${data.width}px`,
                                 height: `${data.height}px`
                             }}></video>
})

registry.register({
    key: 'line',
    label: '线段',
    focus: false,
    width: 400,
    height: 1,
    zIndex: 0,
    background: "#333",
    zoom:100,
    revolve: 0,
    event: '',
    render: (data) => <hr style={{
        width: `${data.width}px`,
        height: `${data.height}px`,
        background: `${data.background}`,
    }}></hr>
})