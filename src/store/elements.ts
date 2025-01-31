import { defineStore } from 'pinia'
import type { ElementItem, ElementsStore } from "@/interface"
import { deepcopy } from '@/utils/deepcopy'
import $ from 'jquery'

export const useElementsStore: () => ElementsStore = defineStore('elements', {
    state: () => {
        return {
            sum: 0,
            elements: []
        }
    },
    getters: {
        // 获取选中/未选中元素列表
        focusElements(): {
            focus: Array<ElementItem>,
            unfocus: Array<ElementItem>
        } {
            let focus: Array<ElementItem> = []
            let unfocus: Array<ElementItem> = []
            this.elements.forEach(element => (element.focus ? focus : unfocus).push(element))
            return {
                focus,
                unfocus
            }
        }
    },
    actions: {
        // 添加元素
        addElement(component: ElementItem): void {
            this.elements.push({
                id: this.sum,
                ...component
            })
            this.sum++
        },
        // 清空元素
        clearAll(): void {
            this.sum = 0
            this.elements.splice(0, this.elements.length)
        },
        // 清空元素 focus 状态
        clearFocus(): void {
            this.elements.forEach(item => item.focus = false)
        },
        // 移动元素
        move(X: number, Y: number, focus: Array<ElementItem>, Pos: { top: number, left: number }[]): void {
            focus.map((element, index) => {
                element.top = Pos[index].top + Y
                element.left = Pos[index].left + X
            })
        },
        // 设置元素属性
        set(elements: Array<ElementItem>): void {
            this.clearAll()
            elements.forEach((item) => {
                this.addElement(item)
            })
        },
        // 删除元素
        delete(elements: Array<ElementItem>): void {
            elements.forEach((item) => {
                let index: number = 0
                this.elements.forEach((element, idx) => {
                    if (element.id == item.id) 
                        index = idx
                })

                let temp = deepcopy(this.elements)
                let deltemp = temp.splice(index, 1)
                this.$patch({
                    sum: this.sum,
                    elements: temp
                })
            })
        },
        // 全选
        chooseAll(): void {
            this.elements.forEach(element => {
                element.focus = true
            })
        },
        // 更新事件代码
        updateCode(id: number, code: string): void {
            console.log(id, code);
            
            this.elements[id].event = code
        },
        // 处理带参字符串
        processString(paramStr: string): string {
            let substring: Array<string> = paramStr.split(/[{}]/)
            if (substring.length === 1) {
                return paramStr
            }
            let res: string = ''
            substring.forEach((item, index) => {
                let sub: Array<string> = item.split(/[-.]/)
                console.log(item, index);
                
                if (index === 0 || sub.length < 3) {
                    res += item
                    return
                }
                res += this.elements.filter(item => item.id == sub[1])[0][sub[2]]
            })
            return res
        },
        updateElements(newElements) {
            this.elements = newElements;
        },
    }
})