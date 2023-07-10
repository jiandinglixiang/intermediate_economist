<template>
  <web-view :src="link" :webview-styles="webviewStyles" class="webView" />
</template>

<script setup>
import { onBackPress, onLoad } from "@dcloudio/uni-app"
import { ref } from "vue"

const system = uni.getSystemInfoSync()
const webviewStyles = {
  height: `${system.windowHeight}px`,
  width: `${system.screenWidth}px`
}
const link = ref("")

// 定义一个函数，接受一个url字符串作为参数
function decodeUrl(url) {
  // 判断url是否为空或者不是字符串，如果是则返回原值
  if (!url || typeof url !== "string") {
    return url
  }
  // 使用正则表达式匹配url中的参数部分，即以?或#开头的部分
  let match = url.match(/[\?#].*/)
  // 如果没有匹配到参数部分，则直接对整个url进行解码并返回
  if (!match) {
    return decodeURIComponent(url)
  }
  // 否则，将url分割为两部分，前半部分为基础部分，后半部分为参数部分
  let base = url.slice(0, match.index)
  let query = url.slice(match.index)
  // 对基础部分进行解码，保留参数部分不变，并拼接返回
  return decodeURIComponent(base) + query
}

onLoad((options) => {
  if (options.noDecodeLinkQuery) {
    // 不对link参数解码
    link.value = decodeUrl(options.link)
    console.log(link.value)
  } else {
    link.value = decodeURIComponent(options.link)
    console.log(link.value)
  }

  if (options.title) {
    setTimeout(() => {
      uni.setNavigationBarTitle({
        title: options.title
      })
    }, 1000)
  }
})
onBackPress(() => {
  // eslint-disable-next-line no-undef
  if (getCurrentPages?.()?.length === 1) {
    // 当前页面是页面栈唯一页面
    uni.reLaunch({ url: "" })
    return true
  }
})
</script>
<style>
.webView {
  flex: 1;
}
</style>
