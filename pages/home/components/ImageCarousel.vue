<script setup>
import { GET_AD_CLIENT_BANNER } from "@/api"
import NoticeBar from "@/components/notice-bar/NoticeBar.vue"
import { pushBehavior } from "@/utils/behavior"
import { objectToQueryString } from "@/utils/func"
import { httpRequest } from "@/utils/http"
import { onMounted, ref } from "vue"

const dotsStyles = {
  border: "none",
  selectedBorder: "none",
  backgroundColor: "rgba(255, 255, 255, 0.5)",
  selectedBackgroundColor: "rgba(255, 255, 255, 1)"
}
const list = ref([])
const current = ref(0)
const notice = ref([])

function change(event) {
  current.value = event.detail.current
}

function handleClick(item) {
  jumpCenter(item.targetid, {
    title: item.title,
    url: item.url
  })
  pushBehavior({
    action: "点击 banner\t318\t用户查看 {banner名称} \n",
    onceDay: true,
    replaceValue: item.title,
    isCallback: false
  })
}

onMounted(async () => {
  const [res1, res2] = await Promise.allSettled([
    httpRequest(GET_AD_CLIENT_BANNER, "POST", { typeid: 1 }),
    httpRequest(GET_AD_CLIENT_BANNER, "POST", { typeid: 2 })
  ])
  list.value = res1.value.data
  notice.value = res2.value.data
})

function jumpCenter(targetid, { id, url: link, title }) {
  link && (link = decodeURIComponent(link))
  switch (targetid) {
    case 2: //体验课
    case 3: //正课
    case 4: //干货
    case 5: //教辅
    case 6: //直播
    case 7: //题库
    case 8: //资料
    case 1: //H5
    default:
      uni.navigateTo({
        url: `/pages/webview/index?${objectToQueryString({ id, link, title })}`
      })
  }
}
</script>

<template>
  <uni-swiper-dot
    :current="current"
    :dotsStyles="dotsStyles"
    :info="list"
    class="uni-swiper-dot-box"
    mode="round"
  >
    <swiper
      :current="current"
      autoplay
      circular
      class="swiper-box"
      next-margin="16px"
      previous-margin="16px"
      @change="change"
    >
      <swiper-item v-for="item in list" :key="item.id" @click="handleClick(item)">
        <view class="swiper-item">
          <image :src="item.pic" class="swiper-img"></image>
        </view>
      </swiper-item>
    </swiper>
  </uni-swiper-dot>
  <notice-bar :list="notice" show-detail vertical @noticeClick="handleClick" />
</template>

<style lang="scss" scoped>
.uni-swiper-dot-box {
  margin-bottom: 32rpx;
}

.swiper-box {
  height: 300rpx;
}

.swiper-item {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 300rpx;
  padding: 0 8px;
}

.swiper-img {
  overflow: hidden;
  flex: 1 1 auto;
  width: 100%;
  border-radius: 16rpx;
}
</style>
