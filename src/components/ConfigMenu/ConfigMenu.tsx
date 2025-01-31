import {useCanvasStore, useElementsStore} from "@/store"
import {
    ElButton,
    ElCheckboxButton, ElCheckboxGroup,
    ElCollapse,
    ElCollapseItem,
    ElColorPicker,
    ElForm,
    ElFormItem,
    ElInput,
    ElInputNumber,
    ElMessage,
    ElOption,
    ElPopover,
    ElSelect,
    ElSlider  
} from "element-plus"
import {ref, defineComponent, watch} from "vue"
import type {Ref} from "vue"
import {computed} from "vue"
import type {CanvasStore, ElementItem, ElementsStore, VoidF} from "@/interface"
import "./ConfigMenu.css"

export default defineComponent({
    setup() {

        let elements: ElementsStore = useElementsStore()
        let canvas: CanvasStore = useCanvasStore()

        // 折叠面板的展开层
        let configCollapse: Ref<string> = ref('baseConfig')

        // 当前选中的元素 id
        let focusId: Ref<number> = ref(0)

        // 当前选中是元素还是画布
        let currentFocus: Ref<string> = computed(() => {
            if (elements.focusElements.focus.length) {
                let focusList: Array<ElementItem> = elements.focusElements.focus

                elements.elements.forEach((item, index) => {
                    if (item.id === focusList[0].id) {
                        focusId.value = index
                        return
                    }
                })

                eventCode.value = elements.elements[focusId.value] ? elements.elements[focusId.value].event : ''
                
                baseConfigMenu.general.title = `[${focusList[0].key}-${focusList[0].id}]-样式`
                return 'general'
            } else {
                return 'canvas'
            }
        })

        // 当前选中的元素类型
        let currentFocusElement: Ref<string> = computed(() => {
            let focusList: Array<ElementItem> = elements.focusElements.focus
            if (focusList.length) {
                return focusList[0].key
            } else {
                return ''
            }
        })
        
        //自定义事件
        let currentFocusEvent: Ref<string> = computed(() => {
            if (elements.elements[focusId.value]) {
                return 'event'
            } else {
                return 'canvas'
            }
        })

        const roter = (value) =>{
            let doms = document.querySelectorAll('.element-item')
            doms.forEach((item)=>{
                if (item.className === 'element-item element-focus') {
                        // @ts-ignore
                      item.style.transform=`rotateZ(${elements.elements[focusId.value].revolve}deg)`
                 }
            })
        }
       //缩放功能
      
        const meth = (value) =>{
            let w = elements.elements[focusId.value].width
            let h = elements.elements[focusId.value].height
            elements.elements[focusId.value].width = w * value/100
            elements.elements[focusId.value].height = h * value/100
            if(elements.elements[focusId.value].width==0 || elements.elements[focusId.value].height==0){
                if(elements.elements[focusId.value].key=='line'){
                 elements.elements[focusId.value].width = 10
                 elements.elements[focusId.value].height = 1
               }else{
                 elements.elements[focusId.value].width = 10
                 elements.elements[focusId.value].height = 10
               }
             }
        }
        // 基础属性配置表单
        const baseConfigMenu = {
            canvas: {
                title: '画布样式',
                form:
                    <ElForm label-position="left" label-width="100px" model={canvas} style="max-width: 100%">
                        <ElFormItem label="画布背景">
                            <ElColorPicker v-model={canvas.bgColor} />
                        </ElFormItem>
                        <ElFormItem label="画布宽度">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={canvas.width}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="画布高度">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={canvas.height}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                    </ElForm>
            },
            general: {
                title: '',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="X坐标">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].left}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="Y坐标">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].top}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="控件宽度">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].width}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="控件高度">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].height}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="叠放层级">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].zIndex}
                                    controlsPosition='right'
                                    precision={0}
                                />
                            </div>
                        </ElFormItem>
                    </ElForm>
            }
        }

        // 字体族
        const fontFamilys: Array<{ [key: string]: string }> = [{
                label: '黑体',
                value: 'sans-serif'
            }, {
                label: '宋体',
                value: 'serif'
            }, {
                label: '仿宋',
                value: 'fangsong'
            }, {
                label: '楷体',
                value: 'cursive'
            }]

        // 组件属性配置表单
        const elementConfigMenu = {
            text: {
                title: '文本属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="文本内容">
                            <ElInput
                                v-model={elements.elements[focusId.value].label}
                                type="textarea"
                            />
                        </ElFormItem>
                        <ElFormItem label="字号">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].fontSize}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="字体">
                            <ElSelect v-model={elements.elements[focusId.value].fontFamily} placeholder="字体选择">
                                {fontFamilys.map(item =>
                                    <ElOption
                                        key={item.value}
                                        label={item.label}
                                        value={item.value}
                                    />)}
                            </ElSelect>
                        </ElFormItem>
                        <ElFormItem label="字体颜色">
                            <ElColorPicker v-model={elements.elements[focusId.value].color}/>
                        </ElFormItem>
                        <ElFormItem label="背景颜色">
                            <ElColorPicker v-model={elements.elements[focusId.value].background}/>
                        </ElFormItem>
                    </ElForm>
            },
            btn: {
                title: '按钮属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="按钮内容">
                            <ElInput
                                v-model={elements.elements[focusId.value].label}
                            />
                        </ElFormItem>
                        <ElFormItem label="字体">
                            <ElSelect v-model={elements.elements[focusId.value].fontFamily} placeholder="字体选择">
                                {fontFamilys.map(item =>
                                    <ElOption
                                        key={item.value}
                                        label={item.label}
                                        value={item.value}
                                    />)}
                            </ElSelect>
                        </ElFormItem>
                        <ElFormItem label="边框半径">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].borderRadius}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                        <ElFormItem label="字体颜色">
                            <ElColorPicker v-model={elements.elements[focusId.value].color}/>
                        </ElFormItem>
                    </ElForm>
            },
            input: {
                title: '输入框属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="提示信息">
                            <ElInput
                                v-model={elements.elements[focusId.value].label}
                                type="textarea"
                            />
                        </ElFormItem>
                        <ElFormItem label="边框半径">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].borderRadius}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                    </ElForm>,
            },
            image: {
                title: '图片属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="图片地址">
                            <ElInput
                                v-model={elements.elements[focusId.value].img}
                                type="textarea"
                            />
                        </ElFormItem>
                        <ElFormItem label="边框半径">
                            <div class="input-number">
                                <ElInputNumber
                                    v-model={elements.elements[focusId.value].borderRadius}
                                    controlsPosition='right'
                                    precision={0}
                                />
                                <span class='unit'>px</span>
                            </div>
                        </ElFormItem>
                    </ElForm>,
            },
            video: {
                title: '视频属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="视频地址">
                            <ElInput
                                v-model={elements.elements[focusId.value].video}
                                clearable
                            />
                        </ElFormItem>
                        <ElFormItem label="播放设置" size="small">
                                <ElCheckboxButton v-model={elements.elements[focusId.value].autoplay} label="自动" checked></ElCheckboxButton>
                                <ElCheckboxButton v-model={elements.elements[focusId.value].loop} label="循环" checked></ElCheckboxButton>
                                <ElCheckboxButton v-model={elements.elements[focusId.value].muted} label="静音" checked></ElCheckboxButton>
                        </ElFormItem>
                    </ElForm>,
            },
            line: {
                title: '线段属性',
                form:
                    <ElForm
                        label-position="left"
                        label-width="100px"
                        model={elements.elements[focusId.value]}
                        style="max-width: 100%"
                    >
                        <ElFormItem label="颜色">
                            <ElColorPicker v-model={elements.elements[focusId.value].background}/>
                        </ElFormItem>
                    </ElForm>,
            }
        }

        // 事件属性
        let eventListen: Ref<string> = ref('click')
        let eventAction: Ref<string> = ref('href')
        let eventContent: Ref<string> = ref('https://www.nuist.edu.cn/main.htm')
        let eventCode: Ref<string> = ref(elements.elements[focusId.value] ? elements.elements[focusId.value].event : '')

        // 添加事件
        const addEvent: VoidF = () => {
            if (eventCode.value && eventCode.value.match(eventListen.value)) {
                ElMessage.warning(`已添加 ${eventListen.value} 事件`)
                return
            }
            if (eventCode.value) {
                eventCode.value += ','
            }
            eventCode.value += `${eventListen.value}(${eventAction.value}(${eventContent.value}))`
            codeChange()
        }

        // 事件代码更改
        const codeChange: VoidF = () => {
            console.log('change');
            
            elements.updateCode(focusId.value, eventCode.value)
        }

        // 事件配置表单
        const eventConfigMenu = {
            title: '触发事件',
            form:
                <ElForm
                    label-position="left"
                    label-width="100px"
                    model={elements.elements[focusId.value]}
                    style="max-width: 100%"
                >
                    <ElFormItem label="触发条件">
                        <ElSelect v-model={eventListen.value} placeholder="触发条件">
                            <ElOption
                                key='1'
                                label='点击'
                                value='click'
                            />
                            <ElOption
                                key='2'
                                label='悬浮'
                                value='mouseenter'
                            />
                        </ElSelect>
                    </ElFormItem>
                    <ElFormItem label="执行事件">
                        <ElSelect v-model={eventAction.value} placeholder="字体选择">
                            <ElOption
                                key='1'
                                label='跳转'
                                value='href'
                            />
                            <ElOption
                                key='2'
                                label='弹框'
                                value='alert'
                            />
                        </ElSelect>
                    </ElFormItem>
                    <ElFormItem label={eventAction.value === 'href' ? '跳转链接' : '弹框内容'}>
                        <ElInput v-model={eventContent.value} />
                    </ElFormItem>
                    <ElFormItem>
                        <ElButton onClick={addEvent}>添加事件</ElButton>
                    </ElFormItem>
                    <ElPopover
                        title="事件代码说明"
                        width={300}
                        trigger="click"
                        placement="left"
                        content="事件代码格式为'触发条件(事件(参数))',其中参数可以使用{组件名.属性}的方式进行插值，例如click(href({input-0.value}))。"
                        v-slots={{
                            reference: () => (
                                <ElFormItem label="事件代码">
                                    <ElInput v-model={eventCode.value} type="textarea" onChange={codeChange} />
                                </ElFormItem>
                        ) }}
                    />
                </ElForm>
        }

        return () => (
            <div>
                {/* 基础样式 */}
                <div class="config-box">
                    <ElCollapse v-model={configCollapse.value} accordion>
                        {/* 基础属性 */}
                        <ElCollapseItem
                            v-slots={{title: () => <h4>{baseConfigMenu[currentFocus.value].title}</h4>}}
                            name="baseConfig"
                        >
                            {baseConfigMenu[currentFocus.value].form}
                        </ElCollapseItem>
                        {/* 组件属性 */}
                        {currentFocusElement.value != '' ? <ElCollapseItem
                            v-slots={{ title: () => <h4>{elementConfigMenu[currentFocusElement.value].title}</h4> }}
                            name="elementConfig"
                        >
                            {elementConfigMenu[currentFocusElement.value].form}
                        </ElCollapseItem> : null}
                        {/* 触发事件 */}
                        {currentFocusElement.value != '' ? <ElCollapseItem
                            v-slots={{ title: () => <h4>{eventConfigMenu.title}</h4> }}
                            name="eventConfig"
                        >
                            {eventConfigMenu.form}
                        </ElCollapseItem> : null}
                    </ElCollapse>
                </div>
            </div>
        )
    }
})