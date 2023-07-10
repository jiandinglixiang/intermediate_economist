<script setup>
import { GET_ARTICLE_DETAIL, POST_ARTICLE_COLLECT, POST_ARTICLE_COLLECT_STATUS } from "@/api"
import PopupIndex from "@/components/popup/PopupIndex.vue"
import { LOGIN_TIPS_POPUP } from "@/components/popup/popupKeyMap"
import { pushBehavior } from "@/utils/behavior"
import { NoticeStatus } from "@/pinia/notice"
import { PopupStatus } from "@/pinia/popup"
import { USER_TOKEN_DATA } from "@/utils/consts"
import { openURL } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import { onLoad } from "@dcloudio/uni-app"
import dayjs from "dayjs"
import { computed, ref } from "vue"

const noLogin = ref(!uni.getStorageSync(USER_TOKEN_DATA)?.token)
const storePopup = PopupStatus()
const storeNotice = NoticeStatus()
const detail = ref({
  keywords: "",
  arcurl: "",
  topid: 6,
  channel: 1,
  description: "",
  title: "",
  body: "",
  typeurl: "",
  typeid: 269,
  litpic: "",
  aid: -1,
  typename: "",
  pubdate: -1
})
const collect = ref(0)
uni.setNavigationBarTitle({ title: " " })

onLoad(async ({ id, domain }) => {
  httpRequest(
    GET_ARTICLE_DETAIL.replace("{id}", id),
    "GET",
    {},
    {
      baseUrl: "https://apigateway.pxo.cn",
      header: {
        g: encodeURIComponent(domain)
      }
    }
  ).then((res) => {
    detail.value = res.data
    pushBehavior({
      action: "资讯列表 点击 资讯数据\t712\t用户查看 {资讯名称}\n",
      onceDay: true,
      replaceValue: detail.value.title,
      isCallback: false
    })
  })
  if (noLogin.value) {
    return
  }
  const res = await httpRequest(POST_ARTICLE_COLLECT_STATUS, "POST", { aid: id })
  collect.value = res.data.collect
})

const content = computed(() => detail.value.body)

async function handleCollect() {
  if (noLogin.value) {
    gotoLogin()
    return
  }
  const { aid, title, pubdate, litpic: pic } = detail.value
  await httpRequest(POST_ARTICLE_COLLECT, "POST", { aid, title, pubdate, pic })
  collect.value = collect.value ? 0 : 1
  uni.showToast({ title: collect.value ? "收藏成功" : "取消收藏", icon: "none" })
}

function gotoLogin() {
  storePopup[LOGIN_TIPS_POPUP]?.open({
    title: "提示",
    tips: "收藏功能需要您登录后，我们才能为您保存相应的收藏内容",
    buttonText: "去登录",
    handleClick(action) {
      if (action === "btn") {
        uni.navigateTo({ url: "/pages/login/index" })
      }
    }
  })
}

function buryThePoint(name = "") {
  pushBehavior({
    action: "资讯详情页底部按钮\t712\t用户点击 {资讯名称} 内 {按钮名称}\n",
    onceDay: true,
    replaceValue: [detail.value.title, name].join(","),
    isCallback: false
  })
}

function pubdate(pubdate) {
  return dayjs(pubdate * 1000).format("YYYY-MM-DD")
}

function onLinkTap(res) {
  // 跳转忽略
  res?.ignore?.()
}
</script>

<template>
  <view>
    <view class="information-title">{{ detail.title }}</view>
    <view class="desc">
      <text class="dec-info">来源：互联网</text>
      <text class="dec-info">小编：CPA</text>
      <text class="dec-info">{{ pubdate(detail.pubdate) }}</text>
    </view>
    <view class="rich-text-box">
      <uv-parse :content="content" :copy-link="false" @linktap="onLinkTap"></uv-parse>
    </view>
    <view class="fixed-bottom">
      <view class="fixed-bottom-content">
        <view
          :class="collect && 'collected'"
          class="collect"
          @click="handleCollect(), buryThePoint('收藏')"
        >
          收藏
        </view>
        <view
          class="free-information"
          @click="openURL(storeNotice.miniApp.find((i) => i.id === 7)), buryThePoint('免费资料')"
        >
          免费资料
        </view>
        <view
          class="btn"
          @click="openURL(storeNotice.onlineConsultation[0]), buryThePoint('在线咨询')"
        >
          在线咨询
        </view>
      </view>
    </view>
    <popup-index
      v-if="noLogin"
      :ref="(r) => PopupStatus().setPopupRef(LOGIN_TIPS_POPUP, r)"
      :popup-key="LOGIN_TIPS_POPUP"
    />
  </view>
</template>
<style lang="scss" scoped>
.rich-text-box {
  display: flex;
  width: 686rpx;
  margin: 0 32rpx 48rpx;

  * {
    max-width: 100%;
    max-height: 100%;
  }
}

.information-title {
  font-size: 40rpx;
  font-weight: 500;
  line-height: 64rpx;
  margin: 16rpx 32rpx 0;
  margin-bottom: 32rpx;
  color: rgba(51, 51, 51, 1);
}

.desc {
  margin-bottom: 32rpx;
}

.dec-info {
  font-size: 24rpx;
  font-weight: 400;
  line-height: 24rpx;
  display: inline-block;
  margin-left: 32rpx;
  color: rgba(153, 153, 153, 1);
}

.fixed-bottom {
  height: 98rpx;
}

.fixed-bottom-content {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  height: 98rpx;
  padding: 0 32rpx;
  background: #ffffff;

  .collect,
  .free-information {
    font-size: 20rpx;
    line-height: 20rpx;
    flex: 0 0 100rpx;
    padding-top: 52rpx;
    text-align: center;
    color: rgba(102, 102, 102, 1);
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 44rpx 44rpx;
  }

  .collect {
    background-image: url("/static/information/collect2@2x.png");

    &.collected {
      background-image: url("/static/information/collect1@2x.png");
    }
  }

  .free-information {
    background-image: url("/static/information/icon_kczx@2x.png");
  }

  .btn {
    font-size: 32rpx;
    font-weight: 500;
    line-height: 88rpx;
    flex: 1 1 auto;
    min-width: 360rpx;
    height: 88rpx;
    margin-left: 32rpx;
    text-align: center;
    color: rgba(255, 255, 255, 1);
    border-radius: 200rpx;
    background: linear-gradient(135deg, rgba(97, 139, 255, 1) 0%, rgba(48, 93, 217, 1) 100%);
  }
}
</style>
