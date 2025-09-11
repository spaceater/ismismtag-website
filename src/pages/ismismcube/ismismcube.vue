<template>
  <!-- 设置页面favicon -->
  <link rel="icon" type="image/x-icon" href="@/assets/ismismcube_favicon.ico" style="display: none;" />
  <div class="ismismcube-container">
    <div id="left_part">
      <div id="page_view" title="此网站的总访量">
        <img src="@/assets/page_view_icon.svg" alt="page_view">
        <b>{{ pageView }}</b>
      </div>
      <div id="online_count" title="当前在线数">
        <p>在线:</p>
        <b>{{ onlineCount }}</b>
      </div>
      <div id="return_button" @click="openMoreContent">更多内容</div>
      <div id="download_button" @click="downloadIsmJson">下载数据</div>
      <input 
        id="search_input" 
        type="text" 
        placeholder="键入检索词"
        v-model="searchText"
      >
      <div id="ismism_main_cube">
        <div id="show_cube">
          <template v-for="x in 4" :key="`show-${x}`">
            <div 
              v-for="y in 4" 
              :key="`${5-x}-${y}`"
              class="show_xy ism"
              :style="{ '--x': 5-x, '--y': y, '--a': x == 1 ? 1 : 0.5, '--b': y == 4 ? 1 : 0.5 }"
              :ism_tag="`${5-x}-${y}`"
              :class="getIsmClass(`${5-x}-${y}`)"
              @mouseenter="selectISM(`${5-x}-${y}`)"
              @mouseleave="unselectISM()"
              @click="pinISM(`${5-x}-${y}`)"
            ></div>
          </template>
        </div>
        <div id="show_cube_name">
          <template v-for="x in 4" :key="`show-name-${x}`">
            <div 
              v-for="y in 4" 
              :key="`show-name-${x}-${y}`"
              class="show_xy_name"
            >
              <p
                class="ism_name" 
                :class="{ no_data: ismData && ismData[`${5-x}-${y}`] && ismData[`${5-x}-${y}`].en_name === '' }" 
                :style="{ fontSize: getIsmNameFontSize(getIsmName(`${5-x}-${y}`)) }">{{ getIsmName(`${5-x}-${y}`) }}
              </p>
            </div>
          </template>
        </div>
        <div 
          v-for="x in 4" 
          :key="`line-x-${x}`"
          class="line_x" 
          :style="{ '--x': x }"
        >
          <p>{{ x }}</p>
        </div>
        <div 
          v-for="y in 4" 
          :key="`line-y-${y}`"
          class="line_y" 
          :style="{ '--y': y }"
        >
          <p>{{ y }}</p>
        </div>
        <div id="show_cube_x">
          <div 
            v-for="i in 4" 
            :key="`${i}`"
            class="show_x ism" 
            :ism_tag="`${5-i}`"
            :class="getIsmClass(`${5-i}`)"
            @mouseenter="selectISM(`${5-i}`)"
            @mouseleave="unselectISM()"
            @click="pinISM(`${5-i}`)"
          >
            <p 
              class="ism_name" 
              :class="{ no_data: ismData && ismData[`${5-i}`] && ismData[`${5-i}`].en_name === '' }" 
              :style="{ fontSize: getIsmNameFontSize(getIsmName(`${5-i}`)) }">{{ getIsmName(`${5-i}`) }}
            </p>
          </div>
        </div>
        <div id="axis_x"></div>
        <div id="axis_y"></div>
        <div id="axis_z"></div>
      </div>
      <div id="axis_label">
        <p id="axis_label_x">场域论</p>
        <p id="axis_label_y">本体论</p>
        <p id="axis_label_z">认识论</p>
        <p id="axis_label_i">目的论</p>
      </div>
      <div id="ism_info">
        <div id="increase_fontsize_button" @click="increaseFontSize"></div>
        <div id="decrease_fontsize_button" @click="decreaseFontSize"></div>
        <div id="ism_info_content" v-html="content"></div>
      </div>
      <div id="size_adjuster">
        <div 
          id="size_indicator"
          @mousedown="setIndicatorActive"
          :style="{ top: sizeIndicatorRatio * 100 + '%' }"
        >
        </div>
      </div>
    </div>
  
    <div id="right_part">
      <div id="ismism_cube_box" :style="{ transform: `scale(${1 + sizeIndicatorRatio * 1.5})` }">
        <div 
          v-for="x in 4" 
          :key="`${x}`"
          class="ism_x" 
          :style="{ '--x': 4-x }"
        >
          <div 
            v-for="y in 4" 
            :key="`${x}-${y}`"
            class="ism_xy"
          >
            <div id="i"></div>
            <div id="z"></div>
            <div 
              v-for="z in 4" 
              :key="`${x}-${y}-${z}`"
              class="ism_xyz ism"
              :style="{ '--z': z }"
              :ism_tag="`${x}-${y}-${5-z}`"
              :class="getIsmClass(`${x}-${y}-${5-z}`)"
              @mouseover="selectISM(`${x}-${y}-${5-z}`)"
              @mouseout="unselectISM()"
              @click="pinISM(`${x}-${y}-${5-z}`)"
            >
              <p
                class="ism_name"
                :class="{ no_data: ismData && ismData[`${x}-${y}-${5-z}`] && ismData[`${x}-${y}-${5-z}`].en_name === '' }" 
                :style="{ fontSize: getIsmNameFontSize(getIsmName(`${x}-${y}-${5-z}`)) }">{{ getIsmName(`${x}-${y}-${5-z}`) }}
              </p>
              <div id="ism_xyz_label_column">{{ 5-z }}</div>
              <div 
                v-for="i in 4" 
                :key="`${x}-${y}-${5-z}-${i}`"
                class="ism_xyzi ism"
                :style="{ '--i': i }"
                :ism_tag="`${x}-${y}-${5-z}-${5-i}`"
                :class="getIsmClass(`${x}-${y}-${5-z}-${5-i}`)"
                @mouseover.stop="selectISM(`${x}-${y}-${5-z}-${5-i}`)"
                @mouseout.stop="unselectISM()"
                @click.stop="pinISM(`${x}-${y}-${5-z}-${5-i}`)"
              >
                <p 
                  class="ism_name" 
                  :class="{ no_data: ismData && ismData[`${x}-${y}-${5-z}-${5-i}`] && ismData[`${x}-${y}-${5-z}-${5-i}`].en_name === '' }" 
                  :style="{ fontSize: getIsmNameFontSize(getIsmName(`${x}-${y}-${5-z}-${5-i}`)) }">{{ getIsmName(`${x}-${y}-${5-z}-${5-i}`) }}
                </p>
                <div id="ism_xyz_label_row">{{ 5-i }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// 响应式数据
const ismData = ref<any>(null)
const axisColor = ["red", "green", "blue", "darkorange"]
const ismInfoFontSize = ref(1.0)
const pageView = ref(0)
const onlineCount = ref(1)
const searchText = ref('')
const sizeIndicatorRatio = ref(0)
const content = ref('')

// WebSocket连接
let socket: WebSocket | null = null
let reconnectTimer: number | null = null

// 路由
const route = useRoute()
const router = useRouter()

// WebSocket连接管理
const connectWebSocket = () => {
  try {
    // 根据当前页面协议自动选择 WebSocket 协议
    socket = new WebSocket((window.location.protocol === 'https:' ? 'wss:' : 'ws:') + "//" + window.location.host + "/ws/ismismcube_online")
    socket.addEventListener("open", () => {
      console.log("WebSocket连接成功")
      if (reconnectTimer) {
        clearTimeout(reconnectTimer)
        reconnectTimer = null
      }
    })
    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data)
        onlineCount.value = data.online_count
      } catch (error) {
        console.error("WebSocket消息解析失败:", error)
      }
    })
    socket.addEventListener("error", (error) => {
      console.error("WebSocket连接错误:", error)
    })
    socket.addEventListener("close", (event) => {
      console.log("WebSocket连接关闭:", event.code, event.reason)
      if (event.code !== 1000) {
        console.log("3秒后尝试重连WebSocket")
        reconnectTimer = setTimeout(() => {
          connectWebSocket()
        }, 3000)
      }
    })
  } catch (error) {
    console.error("WebSocket连接失败:", error)
    reconnectTimer = setTimeout(() => {
      connectWebSocket()
    }, 3000)
  }
}

const disconnectWebSocket = () => {
  // 清除重连定时器
  if (reconnectTimer) {
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }
  
  if (socket) {
    socket.close(1000, "页面卸载")
    socket = null
  }
}

// 计算属性
const getIsmClass = (ismTag: string) => {
  const classes = []
  const currentIsmTag = route.params.ismTag as string
  if (currentIsmTag && ismTag.startsWith(currentIsmTag)) {
    classes.push('pinned')
  }
  if (searchText.value && isSearchResult(ismTag)) {
    classes.push('searched')
  }
  return classes
}

const getIsmName = (ismTag: string) => {
  if (!ismData.value || !ismData.value[ismTag]) return ''
  const name = ismData.value[ismTag].ch_name.split('/')[0].replace('"', '"').replace('"', '"')
  return name
}

const getIsmNameFontSize = (text: string) => {
  return text.length > 4 ? '0.75rem' : '1rem'
}

// 总初始化
const initial = async () => {
  try {
    const response = await fetch('/ism.json')
    if (response.ok) {
      ismData.value = await response.json()
      handleRoute()
    } else {
      content.value = "<div style='text-align: center;'>数据加载失败\n\n请检测网络后重试\n或\n强制重新加载此页面(windows快捷键 Ctrl + F5)</div>"
    }
  } catch (error) {
    console.error('Failed to load ism.json:', error)
    content.value = "<div style='text-align: center;'>数据加载失败\n\n请检测网络后重试\n或\n强制重新加载此页面(windows快捷键 Ctrl + F5)</div>"
  }

  try {
    const response = await fetch('/api/page_view')
    if (response.ok) {
      const data = await response.json()
      pageView.value = data.page_view
    }
  } catch (error) {
    console.error('Failed to load page view:', error)
  }
}

const handleRoute = () => {
  const ismTag = route.params.ismTag as string
  if (!ismTag || ismTag === '') {
    document.title = "主义主义魔方"
    showIntroduction()
  } else if (ismData.value && ismData.value[ismTag]) {
    document.title = "主义主义魔方-" + ismData.value[ismTag].ch_name
    setISMInfo(ismTag)
  }
}

const selectISM = (ismTag: string) => {
  setISMInfo(ismTag)
  const ismNodes = document.querySelectorAll('.ism')
  for (const ismNode of ismNodes) {
    const nodeIsmTag = ismNode.getAttribute('ism_tag')
    if (nodeIsmTag && nodeIsmTag.startsWith(ismTag)) {
      ismNode.classList.add('selected')
    }
  }
}

const unselectISM = () => {
  const ismNodes = document.querySelectorAll('.ism')
  for (const ismNode of ismNodes) {
    ismNode.classList.remove('selected')
  }
  handleRoute()
}

const pinISM = (ismTag: string) => {
  const currentIsmTag = route.params.ismTag as string
  if (currentIsmTag === ismTag) {
    router.push('/')
  } else {
    router.push('/' + ismTag)
  }
}

const setISMInfo = (ismTag: string) => {
  if (!ismData.value || !ismData.value[ismTag]) return
  const ismTagData = ismData.value[ismTag]
  let contentHtml = `<div style='text-align: center;'>`
  if (ismTag.length >= 1) {
    contentHtml += `<p style='display: inline-block;width:${1.1*ismInfoFontSize.value}rem;height:${1.1*ismInfoFontSize.value}rem;line-height:${1.1*ismInfoFontSize.value}rem;color:red;border:solid black ${0.1*ismInfoFontSize.value}rem;'><b>${ismTag[0]}</b></p>`
  }
  if (ismTag.length >= 3) {
    contentHtml += `-<p style='display: inline-block;width:${1.1*ismInfoFontSize.value}rem;height:${1.1*ismInfoFontSize.value}rem;line-height:${1.1*ismInfoFontSize.value}rem;color:green;border:solid black ${0.1*ismInfoFontSize.value}rem;'><b>${ismTag[2]}</b></p>`
  }
  if (ismTag.length >= 5) {
    contentHtml += `-<p style='display: inline-block;width:${1.1*ismInfoFontSize.value}rem;height:${1.1*ismInfoFontSize.value}rem;line-height:${1.1*ismInfoFontSize.value}rem;color:blue;border:solid black ${0.1*ismInfoFontSize.value}rem;'><b>${ismTag[4]}</b></p>`
  }
  if (ismTag.length >= 7) {
    contentHtml += `-<p style='display: inline-block;width:${1.1*ismInfoFontSize.value}rem;height:${1.1*ismInfoFontSize.value}rem;line-height:${1.1*ismInfoFontSize.value}rem;color:darkorange;border:solid black ${0.1*ismInfoFontSize.value}rem;'><b>${ismTag[6]}</b></p>`
  }
  contentHtml += `\n<b>${ismTagData.ch_name}\n${ismTagData.en_name}</b></div>`
  const axisListData = ismTagData.axis_list
  contentHtml += `<div>`
  let colorCount = 0
  for (const i of axisListData) {
    contentHtml += `<b style='color:${axisColor[colorCount++]}'>${i.slice(0,3)}</b><p style='display:inline-block;text-align: center;width:${1.1*ismInfoFontSize.value}rem;height:${1.1*ismInfoFontSize.value}rem;line-height:${1.1*ismInfoFontSize.value}rem;border:solid black ${0.1*ismInfoFontSize.value}rem;'><b>${i.slice(3,4)}</b></p>${i.slice(4)}\n`
  }
  contentHtml += `</div><div>`
  const featureListData = ismTagData.feature_list
  for (const i of featureListData) {
    if (i !== '') {
      contentHtml += `<b>${i.slice(0,1)}</b>${i.slice(1)}\n`
    }
  }
  contentHtml += `</div><div style='text-align: center;'>`
  const relatedListData = ismTagData.related_list
  for (const i of relatedListData) {
    if (i !== '') {
      const splitIndex = i.indexOf('：') + 1
      if (i.search("http") === -1) {
        contentHtml += `<b>${i.slice(0,splitIndex)}</b>${i.slice(splitIndex)}\n`
      } else {
        contentHtml += `<b>${i.slice(0,splitIndex)}</b><a href='${i.slice(splitIndex)}' target='_blank'>${i.slice(splitIndex)}</a>\n`
      }
    }
  }
  contentHtml += `</div>`
  content.value = contentHtml
  
  if (searchText.value !== '') {
    renewInfo(searchText.value)
  }
}

const renewInfo = (target: string) => {
  const reg = new RegExp(target, 'gi')
  content.value = content.value.replace(reg, "<span style='background-color:rgb(225, 172, 39);'>$&</span>")
}

const isSearchResult = (ismTag: string) => {
  if (!ismData.value || !ismData.value[ismTag] || searchText.value === '') return false
  const ismTagData = ismData.value[ismTag]
  const reg = new RegExp(searchText.value, 'i')
  if (ismTagData.ch_name.search(reg) !== -1 || ismTagData.en_name.search(reg) !== -1) {
    return true
  }
  const axisListData = ismTagData.axis_list
  for (const i of axisListData) {
    if (i.search(reg) !== -1) {
      return true
    }
  }
  const featureListData = ismTagData.feature_list
  for (const i of featureListData) {
    if (i.search(reg) !== -1) {
      return true
    }
  }
  const relatedListData = ismTagData.related_list
  for (const i of relatedListData) {
    if (i.search(reg) !== -1) {
      return true
    }
  }
  return false
}

const showIntroduction = () => {
  if (!ismData.value || !ismData.value.introduction) return
  const introduction = ismData.value.introduction
  let contentHtml = `<div>`
  for (const i of introduction) {
    contentHtml += i
  }
  contentHtml += `\n<HR><p style='text-align:center'><a href='https://beian.miit.gov.cn/' target='_blank' style='font-style:normal;text-decoration:none'>京ICP备2024067574号-1</a>\n<a href='https://beian.mps.gov.cn/#/query/webSearch?code=11010802044945' target='_blank' style='font-style:normal;text-decoration:none'>京公网安备11010802044945</a><p>`
  contentHtml += `</div>`
  content.value = contentHtml
}

const increaseFontSize = () => {
  ismInfoFontSize.value += 0.1
  document.getElementById('ism_info')!.style.fontSize = ismInfoFontSize.value + 'rem'
  const currentIsmTag = route.params.ismTag as string
  if (currentIsmTag && currentIsmTag !== '') {
    setISMInfo(currentIsmTag)
  }
}

const decreaseFontSize = () => {
  ismInfoFontSize.value -= 0.1
  document.getElementById('ism_info')!.style.fontSize = ismInfoFontSize.value + 'rem'
  const currentIsmTag = route.params.ismTag as string
  if (currentIsmTag && currentIsmTag !== '') {
    setISMInfo(currentIsmTag)
  }
}

const openMoreContent = () => {
  window.open("https://www.maybered.com", "_blank")
}

const downloadIsmJson = async () => {
  try {
    const response = await fetch('/ism.json')
    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'ism.json'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      console.error('Failed to fetch ism.json')
    }
  } catch (error) {
    console.error('Error downloading ism.json:', error)
  }
}

const setIndicatorActive = () => {
  document.body.style.userSelect = "none"
  document.body.style.pointerEvents = "none"
  document.getElementById('size_indicator')!.style.pointerEvents = "auto"
  document.getElementById('size_indicator')!.style.backgroundColor = "gray"
  window.addEventListener("mouseup", setOverview)
  window.addEventListener("mousemove", changeSize)
  window.addEventListener("mouseup", closeIndicator)
}

const setOverview = () => {
  document.body.style.userSelect = ""
  document.body.style.pointerEvents = ""
  document.getElementById('size_indicator')!.style.backgroundColor = "rgb(200,200,200)"
  window.removeEventListener("mouseup", setOverview)
  window.removeEventListener("mousemove", changeSize)
  window.removeEventListener("mouseup", closeIndicator)
  const leftPart = document.getElementById('left_part')
  const rightPart = document.getElementById('right_part')
  if (leftPart && rightPart) {
    if (leftPart.classList.contains('left_part_close')) {
      leftPart.classList.remove("left_part_close")
      leftPart.classList.add("left_part_open")
      rightPart.classList.remove("right_part_close")
      rightPart.classList.add("right_part_open")
    } else {
      leftPart.classList.add("left_part_close")
      leftPart.classList.remove("left_part_open")
      rightPart.classList.add("right_part_close")
      rightPart.classList.remove("right_part_open")
    }
  }
}

const changeSize = (event: MouseEvent) => {
  window.removeEventListener("mouseup", setOverview)
  const max = document.getElementById('size_adjuster')!.offsetHeight
  sizeIndicatorRatio.value += event.movementY / max
  if (sizeIndicatorRatio.value < 0) sizeIndicatorRatio.value = 0
  else if (sizeIndicatorRatio.value > 1) sizeIndicatorRatio.value = 1
}

const closeIndicator = () => {
  document.body.style.userSelect = ""
  document.body.style.pointerEvents = ""
  document.getElementById('size_indicator')!.style.backgroundColor = "rgb(200,200,200)"
  window.removeEventListener("mouseup", setOverview)
  window.removeEventListener("mousemove", changeSize)
  window.removeEventListener("mouseup", closeIndicator)
}

// 监听路由变化
watch(() => route.params.ismTag, () => {
  handleRoute()
}, { immediate: true })

// 生命周期
onMounted(() => {
  document.documentElement.style.fontSize = Math.max(screen.width, screen.height) / 96 + "px"
  // 先执行数据初始化，不依赖WebSocket连接
  initial()
  // 然后尝试连接WebSocket（可选功能）
  connectWebSocket()
})

onUnmounted(() => {
  disconnectWebSocket()
})
</script>

<style scoped>
@import './ismismcube.css';
</style> 

<style module>
  a {
    font-style: italic;
    color: black;
  }
  a:hover {
    color: #795CB2;
  }
</style>

<style scoped>
.connection-status {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-left: 5px;
  vertical-align: middle;
}

.connection-status.connected {
  background-color: #4CAF50;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.6);
}

.connection-status.disconnected {
  background-color: #f44336;
  box-shadow: 0 0 4px rgba(244, 67, 54, 0.6);
}
</style>
