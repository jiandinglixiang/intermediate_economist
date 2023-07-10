import { POST_BEHAVIOR } from "@/api"
import { httpRequest } from "@/utils/http"
import dayjs from "dayjs"

export function findFormEnd(arr, func) {
  let target
  for (let i = arr.length - 1; i >= 0; i--) {
    if (func(arr[i], i, arr)) {
      target = arr[i]
      break
    }
  }
  return target
}
export function findFormEndIndex(arr, func) {
  let index
  for (let i = arr.length - 1; i >= 0; i--) {
    if (func(arr[i], i, arr)) {
      index = i
      break
    }
  }
  return index
}

export function deepMergeObjects(obj1, obj2) {
  const merged = { ...obj1 } // 创建一个新的对象，初始值为 obj1 的拷贝

  // 遍历 obj2 的属性
  for (let key in obj2) {
    // 检查 obj2 的属性是否为对象类型
    if (typeof obj2[key] === "object" && obj2[key] !== null) {
      // 如果 merged 中没有对应的属性，则直接将 obj2 的属性赋值给 merged
      if (!merged.hasOwnProperty(key)) {
        merged[key] = obj2[key]
      } else {
        // 递归调用 deepMerge 函数进行深度合并，并将结果赋值给 merged 的对应属性
        merged[key] = deepMergeObjects(merged[key], obj2[key])
      }
    } else {
      // 直接将 obj2 的属性赋值给 merged
      merged[key] = obj2[key]
    }
  }

  return merged
}

export function getSystemInfoPromise() {
  return new Promise((resolve, reject) => {
    uni.getSystemInfo({
      success: resolve,
      fail: reject
    })
  })
}

export function funcToPromise(func, options = {}) {
  return new Promise((resolve, reject) =>
    func({
      success: resolve,
      fail: reject,
      ...options
    })
  )
}

export function formatNumber(number) {
  if (number > 10000) {
    const quotient = Math.floor(number / 10000) // 获取万位以上的整数部分
    const remainder = Math.floor((number % 10000) / 1000) // 获取万位以下的余数部分，并将其向下取整
    const formattedNumber = quotient + "." + remainder + "w" // 将余数部分转换为小数形式，并加上"w"
    return formattedNumber
  } else {
    return number?.toString() // 数字小于等于10000时直接返回原数字的字符串形式
  }
}

export function objectToQueryString(obj) {
  const keyValuePairs = []

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const encodedKey = encodeURIComponent(key)
      const encodedValue = encodeURIComponent(obj[key])
      keyValuePairs.push(`${encodedKey}=${encodedValue}`)
    }
  }

  return keyValuePairs.join("&")
}

export function setTitleNViewButtonStyle({ text, color }, onclick = undefined) {
  // #ifdef APP-PLUS
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  const webView = page.$getAppWebview()
  webView.setTitleNViewButtonStyle(0, {
    fontSrc: "/static/uni-icons/uniicons.ttf",
    ...(onclick && { onclick }),
    ...(color && { color }),
    ...(text && { text })
  })
  // #endif
  // #ifdef H5

  const ele = document.querySelector(
    ".uni-page-head .uni-page-head-ft .uni-page-head-btn .uni-btn-icon"
  )
  color && (ele.style.color = color)
  text && (ele.innerHTML = text)
  onclick && ele.addEventListener("click", onclick)
  return (
    onclick &&
    (() => {
      ele.removeEventListener("click", onclick)
    })
  )
  // #endif
}

export function openURL({ value: href }) {
  // #ifdef APP-PLUS
  // plus.runtime.openURL(href)
  uni.navigateTo({
    url: `/pages/webview/index?${objectToQueryString({ link: href })}`
  })
  // #endif
  // #ifdef H5
  window.open(href)
  // #endif
}
