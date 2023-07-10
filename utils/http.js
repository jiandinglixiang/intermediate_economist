import { deepMergeObjects } from "@/utils/func"
import { USER_TOKEN_DATA } from "@/utils/consts"
import { APP_ID } from "@/config"

const typeOfMethod = ["GET", "POST"]
export const ErrorCodes = ["100000"]

export const config = {
  baseUrl: "https://apigateway.pxo.cn/ztApp",
  header: {
    token: uni.getStorageSync(USER_TOKEN_DATA)?.token ?? "",
    appid: APP_ID
  }
}

export function httpRequest(path = "", method = "GET", data = {}, newConfigs = {}) {
  // #ifdef H5
  if (!typeOfMethod.includes(method)) {
    new Error("Method not enabled")
  }
  // #endif
  return new Promise((resolve, reject) => {
    const config2 = deepMergeObjects(config, newConfigs)
    // 以newConfigs为优先合并config
    uni.request({
      ...config2,
      url: `${config2.baseUrl}${path}`,
      method,
      data,
      success: resolve,
      fail: reject
    })
  })
    .then((res) => {
      return res.data
    })
    .then((res) => {
      if (ErrorCodes.includes(res.code)) {
        console.error(res)
        return Promise.reject(res)
      }
      return res
    })
    .catch((err) => {
      if (err.errMsg !== "request:fail") {
        return Promise.reject(err)
      }
      return new Promise((resolve, reject) => {
        uni.getNetworkType({
          success({ networkType }) {
            console.log(networkType)
            reject(["unknown", "none"].includes(networkType) ? { ...err, noNetwork: true } : err)
          },
          fail() {
            reject(err)
          }
        })
      })
    })
}
