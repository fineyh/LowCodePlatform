<template>
    <div class="main">
        <el-container>
            <!-- 顶部工具栏 -->
            <el-header class="topbar">
                <el-button-group>
                    <el-button :disabled="state.current < 0" title="撤销" @click="undo"><i class="iconfont icon-undo"></i>
                    </el-button>
                    <el-button :disabled="state.current > state.stack.length - 2" title="重做" @click="redo"><i
                            class="iconfont icon-redo"></i>
                    </el-button>
                    <el-button title="删除组件" @click="deleteElement"><i class="iconfont icon-delete"></i>
                    </el-button>
                    <el-button title="清空画布" @click="clearCanvas"><i class="iconfont icon-clear"></i>
                    </el-button>
                </el-button-group>
                <div class="divider"></div>
                <el-button-group>
                    <el-button @click="helpDialog = true">帮助</el-button>
                    <el-button @click="previewDialog = true">预览</el-button>
                    <el-button @click="getShots">截图</el-button>
                </el-button-group>
                <div class="divider"></div>
              <el-button-group>
                <el-button title="AI" @click="openAIDialog">AI</el-button>
                <el-button @click="editCode">编辑代码</el-button>
              </el-button-group>
              <div class="divider"></div>
                <el-button-group>
                    <el-button @click="exportCode">导出</el-button>
                    <el-button @click="showPublishDialog">发布</el-button>
                </el-button-group>
                <div class="divider"></div>
                <el-radio-group v-model="themeSelector" size="small" fill="#ecf5ff" @change="toggleDark()">
                    <el-radio-button title="白昼模式" label=false><i class="iconfont icon-light"></i></el-radio-button>
                    <el-radio-button title="黑夜模式" label=true><i class="iconfont icon-dark"></i></el-radio-button>
                </el-radio-group>
            </el-header>
            <el-container>
                <!-- 左侧组件列表 -->
                <el-aside class="leftmenu">
                    <ComponentList></ComponentList>
                </el-aside>
                <el-container>
                    <!-- 画布 -->
                    <el-main class="canvas-box">
                        <el-scrollbar class="canvas-block">
                            <EditCanvas></EditCanvas>
                        </el-scrollbar>
                    </el-main>
                </el-container>
                <!-- 右侧属性表单 -->
                <el-aside class="rightmenu">
                    <ConfigMenu></ConfigMenu>
                </el-aside>
            </el-container>
        </el-container>
<!--      编辑代码-->
      <el-dialog custom-class="edit-code-dialog" v-model="editCodeDialog" title="编辑代码" width="40%" top="calc(4vh + 20px)">
        <el-scrollbar class="code-editor">
          <el-input
              type="textarea"
              :rows="18"
              placeholder="请输入代码"
              class="code-textarea"
              v-model="editedCode"
          ></el-input>
        </el-scrollbar>
        <div slot="footer" class="dialog-footer" style="margin-top: 20px; text-align: right">
          <!-- 添加导入按钮 -->
          <el-button type="warning" @click="importFile">导入JSON</el-button>
          <!-- 添加导出按钮 -->
          <el-button type="warning" @click="exportToFile">导出JSON</el-button>
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </div>
        <!-- 用于文件选择的输入元素（隐藏的） -->
        <input type="file" ref="fileInput" style="display: none" accept=".json" @change="handleFileUpload">
      </el-dialog>

        <!-- 预览对话框 -->
        <el-dialog custom-class="preview-dialog" v-model="previewDialog" width="80%" top="calc(4vh + 20px)">
            <template #header="{ titleId }">
                <span class="el-dialog__title" :id="titleId">预览窗口</span>
                <i title="全屏预览" class="iconfont icon-fullscreen" @click="fullScreen"></i>
            </template>
            <el-scrollbar class="canvas-block flex-center">
                <ShowCanvas class="preview_canvas" id="preview_canvas" :data="{canvas, elements: elements.elements}"></ShowCanvas>
            </el-scrollbar>
        </el-dialog>
        <!-- 帮助对话框 -->
        <el-dialog custom-class="help-dialog" v-model="helpDialog" title="操作帮助" width="540px">
            <div class="help-box">
                <p v-for="(item, index) in shortcuts" :key="index">
                    <el-tag>{{item.key}}</el-tag>: {{item.content}}
                </p>
            </div>
        </el-dialog>
        <!-- 发布项目对话框 -->
        <el-dialog custom-class="publish-dialog" v-model="publishDialog" title="发布项目" width="620px">
            <el-table v-if="publishPages.list.length" :data=" publishPages.list" style="width: 100%"
                @row-click="selectPage">
                <el-table-column type="index" label="序号" width="60" />
                <el-table-column prop="updateTime" label="发布时间" width="150" show-overflow-tooltip />
                <el-table-column prop="src" label="链接" width="240" show-overflow-tooltip>
                    <template #default="scope">
                        <a target="_blank" :href="scope.row.src">{{scope.row.src}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="src" label="操作">
                    <template #default="scope">
                        <el-button link type="primary" size="small" @click="copyUrl(scope.row.src)">复制地址</el-button>
                        <el-popconfirm confirm-button-text="删除" cancel-button-text="取消" :icon="InfoFilled"
                            icon-color="#626AEF" title="确定要删除这个已发布页面吗?" @confirm="deletePage(scope.row.id)"
                            @cancel="deletePage(-1)">
                            <template #reference>
                                <el-button link type="danger" size="small">删除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <h4 v-else>分享你的作品，让更多人看到！</h4>
            <el-input v-model="publishUrl" readonly>
                <template v-if="!isNewPublish" #prepend>
                    <el-button @click="getUrl">重置</el-button>
                </template>
                <template #append>
                    <el-button type="primary" :icon="Upload" @click="submitPublish">
                        {{isNewPublish ? '发布当前页面' : '保存到该页面'}}
                    </el-button>
                </template>
            </el-input>
        </el-dialog>
      <!-- AI 对话框 -->
      <el-dialog custom-class="ai-dialog" v-model="aiDialogVisible" title="AI" width="50%" top="calc(4vh + 20px)">
        <el-scrollbar class="ai-dialog-content">
          <!-- 消息列表 -->
          <div v-if="aiDialogContent.length === 0" class="welcome-message">
            <h2>你好，我能为你做什么？</h2>
          </div>
          <div v-else>
            <!-- 消息列表 -->
            <div v-for="(message, index) in aiDialogContent" :key="index" class="message" :class="{ 'user-message': message.role === 'user', 'ai-message': message.role === 'AI' }">
              <!-- 判断是否为 AI 回答，是的话添加 ai-answer 类 -->
              <div v-if="message.role === 'AI'" class="ai-answer-container" @click="copyToClipboard(message.content)">
                <div class="ai-answer">{{ message.content }}</div>
              </div>
              <!-- 否则直接显示文本 -->
              <div v-else class="user-question-container">
                <div class="user-question">{{ message.content }}</div>
              </div>
            </div>
          </div>
        </el-scrollbar>

        <!-- 输入框和发送按钮 -->
        <div class="input-container">
          <el-input type="textarea" v-model="aiInput" placeholder="请输入内容"></el-input>
          <div class="send-button">
            <el-button type="primary" @click="sendToAI">确认</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, Ref, ref, watch, WritableComputedRef} from 'vue'
import { useElementsStore, usePublishStore, useCanvasStore } from '@/store'
import { useDark, useToggle } from '@vueuse/core'
import { screenshots } from '@/utils/screenshots'
import { ComponentList, EditCanvas, ConfigMenu, ShowCanvas } from '@/components'
import { registerCommand } from '@/utils/registerCommand'
import type { CanvasStore, ElementsStore, PublishStore, State, VoidF } from "@/interface"
import emitter from '@/utils/bus'
import { Upload, InfoFilled, Promotion } from "@element-plus/icons-vue"
import { getCode, downloadCode } from '@/utils/useExport'
import { deleteRequest, getRequest, postRequest, putRequest } from '@/http'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from "axios";

// 获取画布元素列表
let elements: ElementsStore = useElementsStore()
let canvas: CanvasStore = useCanvasStore()

// 获取操作命令
let state: State = reactive(registerCommand(elements))

// 获取发布数据
let publishPages: PublishStore = usePublishStore()

// 是否为新发布页面
let isNewPublish: Ref<boolean> = ref(true)

// 发布网址
let publishId: Ref<number> = ref(-1)
let publishUrl: Ref<string> = computed(() => {
    return `http://${window.location.host}/page/${publishId.value}`
})

// 快捷键列表
let shortcuts: Array<{ [key: string]: string }> = [{
        key: 'Ctrl',
        content: '按住后可以进行多选元素'
    }, {
        key: 'Ctrl + A',
        content: '全选'
    }, {
        key: 'Ctrl + Z',
        content: '撤销操作'
    }, {
        key: 'Ctrl + Y',
        content: '重做操作'
    }, {
        key: 'Delete',
        content: '删除选中元素'
    }, {
        key: 'Ctrl + Delete',
        content: '清空画布'
    }
]

// 撤回/重做
let { undo, redo, deleteElement, clearCanvas } = state.commands

// 显示预览窗口
let previewDialog: Ref<boolean> = ref(false)


// 显示编辑代码
let editCodeDialog: Ref<boolean> = ref(false)
const elementsStore = useElementsStore();

// 创建一个响应式引用来存储elements的初始内容
const initialCode = ref();

// 创建一个响应式引用来存储elements的内容
const editedCode = ref();

// 当组件挂载时，初始化editedCode的值
onMounted(() => {
  initialCode.value = JSON.stringify(elementsStore.elements, null, 2);
  editedCode.value = initialCode.value;
});

// 监听store中elements的变化，并更新editedCode的值
watch(() => elementsStore.elements, (newValue) => {
  editedCode.value = JSON.stringify(newValue, null, 2);
});

// 取消编辑的方法
const cancelEdit = () => {
  // 恢复textarea到初始状态
  editedCode.value = initialCode.value;
  // 关闭对话框
  editCodeDialog.value = false;
  // 可以添加提示用户取消编辑的逻辑
  console.log('编辑已取消！');
  ElMessage({
    message: '取消编辑',
  })
};

// saveEdit 方法，保存编辑后的代码到 Pinia store
const saveEdit = () => {
  try {
    // 尝试解析编辑后的代码为 JSON 对象
    const parsedElements = JSON.parse(editedCode.value);
    // 更新 Pinia store 中的 elements
    elementsStore.updateElements(parsedElements);
    // 关闭对话框
    editCodeDialog.value = false;
    console.log('代码保存成功！');
    ElMessage({
      type: 'success',
      message: '保存成功',
    })
  } catch (error) {
    // 解析 JSON 失败时的处理逻辑
    console.error('代码解析失败:', error);
    ElMessage({
      type: 'error',
      message: '保存失败',
    })
  }
};

// 显示编辑对话框
const editCode: VoidF = () => {
  editCodeDialog.value = true
}

//导入JSON
const fileInput = ref(null)

const importFile = () => {
  fileInput.value.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]

  const reader = new FileReader()
  reader.onload = () => {
    if (reader.result) {
      editedCode.value = reader.result as string
    }
  }
  reader.readAsText(file)
}

//导出JSON
const exportToFile = () => {
  const jsonData = editedCode.value
  const blob = new Blob([jsonData], { type: 'application/json' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'exported_data.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

// 显示帮助窗口
let helpDialog: Ref<boolean> = ref(false)

// 显示发布窗口
let publishDialog: Ref<boolean> = ref(false)

// 黑夜模式
const isDark: WritableComputedRef<boolean> = useDark()
const toggleDark: (value?: boolean) => boolean = useToggle(isDark)

// 主题切换
let themeSelector: Ref<boolean> = ref(isDark.value)

// 初始化发布页面列表
publishPages.init()

// 更新状态
const updateState: VoidF = () => {
    state.current++
    state.current--
}
emitter.on('updateState', updateState)

// 截图
const getShots: VoidF = () => {
    previewDialog.value = true
    setTimeout(() => {
        const preview_canvas: HTMLElement = document.getElementById('preview_canvas')
        screenshots(preview_canvas)
    }, 500)
}

// 导出代码
const exportCode: VoidF = () => {
    previewDialog.value = true
    setTimeout(() => {
        downloadCode(getCode('.preview_canvas'))
    }, 500)
}

// 全屏预览
const fullScreen: VoidF = () => {
    window.open('/preview')
}

// 获取发布网址
const getUrl: VoidF = () => {
    if (publishPages.list.length) {
        publishId.value = publishPages.list[0].id + 1
    } else {
        publishId.value = 1
    }
    isNewPublish.value = true
}

// 打开发布对话框
const showPublishDialog: VoidF = () => {
    if (publishId.value < 0) {
        getUrl()
    }
    publishPages.init()
    publishDialog.value = true
}

// 选中某一行
const selectPage: Function = (row: any) => {
    publishId.value = row.id
    isNewPublish.value = false
}

// 复制网址
const copyUrl: (url: string) => void = (url: string) => {
    navigator.clipboard.writeText(url)
    ElMessage({
        type: 'success',
        message: '复制成功',
    })
}

// 删除页面
const deletePage: (id: number) => void = (id: number) => {
    if (id > 0) {
        deleteRequest(id, (res) => {
            publishPages.delete(id)
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
        })
    } else {
        ElMessage({
            type: 'info',
            message: '取消删除',
        })
    }
}

// 发布页面
const submitPublish: VoidF = () => {
    if (publishPages.list.length && publishPages.have(publishUrl.value)) {
        putRequest(publishId.value, {
            elements: elements.elements,
            canvas: canvas
        }, (res) => {
            ElMessage({
                type: 'success',
                message: '发布成功',
            })
            publishPages.init()
        })
    } else {
        postRequest({
            elements: elements.elements,
            canvas: canvas
        }, (res) => {
            ElMessage({
                type: 'success',
                message: '发布成功',
            })
            isNewPublish.value = false
            publishPages.init()
        })
    }
}

// 定义响应式引用来控制AI对话框的可见性、输入和响应
let aiDialogVisible = ref(false);
let aiInput = ref('');
let aiResponse = ref('');

// 方法：打开AI对话框
const openAIDialog = () => {
  aiDialogVisible.value = true;
};

const aiDialogContent: { role: string; content: string }[] = reactive([]);

// 方法：发送请求至AI
const sendToAI: VoidF = async () => {
  const userInput = aiInput.value; // 获取用户输入的内容
  if (!userInput.trim()) return; // 如果输入为空则不发送请求

  // 构造请求参数
  const requestData = {
    "messages": [
      {
        "role": "user",
        "content": userInput
      }
    ],
    "temperature": 0.95,
    "top_p": 0.8,
    "penalty_score": 1,
    "disable_search": false,
    "enable_citation": false,
    "response_format": "text"
  };

  try {
    // 发送请求
    const response = await axios.post('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=24.c65ced2d52aef0aab677bca89fed88f1.2592000.1716711293.282335-64016530', requestData);

    // 更新显示区域的内容
    aiDialogContent.push({ role: 'user', content: userInput }); // 用户输入的内容
    aiDialogContent.push({ role: 'AI', content: response.data.result }); // AI 的回复
    aiResponse.value = response.data.result; // 只显示 AI 的回复
    console.log(response.data); // 在控制台保留 API 返回的信息
  } catch (error) {
    console.error(error);
    aiResponse.value = '请求处理时出错。'; // 处理错误
  }

  // 清空输入框的内容
  aiInput.value = '';
};

//复制回答
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

</script>

<style lang="scss" scoped>
.main {
    background-color: var(--el-bg-color);
}

.topbar {
    width: 100%;
    height: 8vh;
    min-height: 40px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid var(--el-border-color);

    .el-radio-button.is-active i {
        color: #409eff;
        transition: 0.3s;
    }
}

.divider {
    margin: 0 20px;
    width: 1px;
    height: 80%;
    background-color: var(--el-border-color);
}

.leftmenu {
    width: 200px;
    height: 92vh;
    padding: 20px 10px;
}

.canvas-box {
    width: calc(100% - 500px);
    background-color: var(--el-fill-color-light);

    .canvas-block {
        width: 100%;
        height: calc(92vh - 40px);
    }
}

.rightmenu {
    width: 300px;
    height: 92vh;
    padding: 20px;
}

.preview-dialog {
    .iconfont {
        font-size: 18px;
        margin-left: 10px;
        cursor: pointer;

        &:hover {
            color: #409eff;
        }
    }
}

.help-dialog {
    p {
        height: 40px;
        .el-tag {
            margin-right: 10px;
        }
    }
}
.publish-dialog .el-dialog__body {
    padding-top: 20px !important;
    .el-input {
        margin-top: 20px;
    }
}

.ai-dialog-content {
  height: 300px; /* 设置固定的高度 */
  overflow-y: auto; /* 添加垂直滚动条 */
}

.input-container {
  display: flex;
  align-items: center;

  .el-input {
    flex: 1; /* 输入框自动填充剩余空间 */
  }

  .send-button {
    margin-left: 10px; /* 给按钮一个左边距 */
  }
}

.welcome-message {
  text-align: center;
  margin-top: 20px;
}

.welcome-message h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

.ai-answer-container {
  margin: 10px 0; /* 为 AI 回答添加上下间距 */
  background-color: #E6F7FF; /* 设置 AI 回答的背景色 */
  border-radius: 8px; /* 设置 AI 回答的边框圆角 */
  padding: 10px; /* 设置 AI 回答的内边距 */
  cursor: pointer; /* 将鼠标指针设置为手型 */
  transition: background-color 0.3s; /* 添加颜色变化的过渡效果 */
}

.ai-answer-container:hover {
  background-color: #d6e4ff; /* 当光标悬停时，改变背景色 */
}

.user-question-container {
  margin: 10px 0; /* 为用户问题添加上下间距 */
  background-color: #e9feee; /* 设置用户问题的背景色 */
  border-radius: 8px; /* 设置用户问题的边框圆角 */
  padding: 10px; /* 设置用户问题的内边距 */
}

</style>