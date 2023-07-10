"use strict"
const fs = require("fs")
const path = require("path")

exports.main = async (event, context) => {
  //event为客户端上传的参数
  const { access_token, openid, appid, DCloudAppid, url } = event
  let phone = ""

  try {
    const phoneRes = await uniCloud.getPhoneNumber({
      provider: "univerify",
      apiKey: "588badfa93630d75b522ab3f757f2798",
      apiSecret: "3de31c7b8e8acfb8050ad637ec7c04e4",
      appid: DCloudAppid, // DCloud appid
      access_token,
      openid
    })
    const { code, phoneNumber } = phoneRes
    if (code === 0 && phoneNumber) {
      phone = phoneNumber
    }
  } catch (error) {
    console.log("云函数", error)

    return Promise.reject({
      error,
      code: 500,
      msg: "获取手机号失败，请使用其他方式登录。"
    })
  }

  if (!phone) {
    console.log("云函数", phone)
    return Promise.reject({
      code: 500,
      msg: "获取手机号失败，请使用其他方式登录。"
    })
  }

  console.log("云函数获取手机号", phone)

  //返回数据给客户端
  const res = await uniCloud.httpclient.request(url, {
    method: "POST",
    data: {
      phone,
      openid,
      access_token,
      appid: DCloudAppid
    }, // 请求内容
    headers: {
      appid // 10
    }, // 请求头
    contentType: "json",
    dataType: "json" // 此处指定为json表示将此请求的返回值解析为json
  })

  console.log("云函数", res)
  return res
}
