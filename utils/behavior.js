import { POST_BEHAVIOR } from "@/api"
import { BEHAVIOR_RECORDS } from "@/utils/consts"
import { findFormEndIndex } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import dayjs from "dayjs"
import { BundleId } from "@/config"

const onceDayCache = (() => {
  const cache =
    uni.getStorageSync(BEHAVIOR_RECORDS)?.filter?.((item) => dayjs().isSame(item.expire, "day")) ||
    []
  // 过滤出过期的并更新
  uni.setStorageSync(BEHAVIOR_RECORDS, cache)
  return cache
})()

/**
 * 推送行为数据
 * @param {Object} options - 选项对象
 * @param {string} options.action - 行为名称
 * @param {string} [options.replaceValue] - 替换的值
 * @param {boolean} [options.onceDay=false] - 是否仅在一天内执行一次
 * @param {boolean} [options.isCallback=false] - 是否使用回调函数
 * @returns {*} - 根据 isCallback 的值返回回调函数的结果或回调函数本身
 */
export function pushBehavior({
  action = "",
  replaceValue = "",
  onceDay = false,
  isCallback = false
}) {
  const callback = (replaceValue2) => {
    if (replaceValue2) {
      replaceValue = replaceValue2
    }
    const cacheKey = replaceValue + action
    if (onceDay) {
      const index = findFormEndIndex(onceDayCache, (item) => item.key === cacheKey)
      // 找到缓存 不执行
      if (index !== undefined) {
        if (dayjs().isSame(onceDayCache[index].expire, "day")) {
          console.log("不上报，每天一次", action)
          return
        }
        spliceOnceDayCache(index, 1) // 删除缓存并继续上报
      }
    }
    // action = "登录\t710\t用户登录 {AP名称} APP"
    const contents = action.split(/\t|\n/)
    if (replaceValue) {
      contents[2] = replaceBracketsContent(contents[2], replaceValue.split(","))
    }
    httpRequest(POST_BEHAVIOR, "POST", {
      behavior_id: contents[1],
      content: contents[2],
      bundle_id: BundleId
    })
      .then(() => {
        onceDay && spliceOnceDayCache(onceDayCache.length, 0, { key: cacheKey, expire: Date.now() })
        // console.log("上报", contents)
        // if (contents[2].includes("{")) {
        //   console.error("上报", contents)
        // }
      })
      .catch((err) => {
        console.error("上报失败", action, err)
      })
  }
  return isCallback ? callback : callback()
}

export function spliceOnceDayCache(start, deleteCount, ...add) {
  onceDayCache.splice(start, deleteCount, ...add)
  uni.setStorageSync(BEHAVIOR_RECORDS, onceDayCache)
  return onceDayCache
}

function replaceBracketsContent(str, replacements) {
  let index = 0
  return str.replace(/\{([^}]+)\}/g, (match, placeholder) => {
    if (index < replacements.length) {
      const replacement = replacements[index]
      index++
      return replacement
    }
    return match
  })
}
