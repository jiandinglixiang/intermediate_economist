<script setup>
import { POST_VIDEO_LIST } from "@/api"
import CourseLineCardItem from "@/components/course/CourseLineCardItem.vue"
import { PAGES_VIDEO_DETAIL } from "@/utils/consts"
import { httpRequest } from "@/utils/http"
import { onMounted, onUnmounted, ref } from "vue"

const list = ref([])

onMounted(async () => {
  const res = await httpRequest(POST_VIDEO_LIST, "POST")
  list.value = res.data.map((item) => {
    return {
      ...item,
      src: item.file,
      title: item.title,
      number: item.star
    }
  })
  uni.$on("/pages/video/detail", handleCollect)
})
onUnmounted(() => {
  uni.$off("/pages/video/detail", handleCollect)
})

function handleCollect(action, params) {
  console.log(action, params)
  if (action === "collect") {
    list.value.some((item) => {
      if (item.id === params.id) {
        item.collect = params.collect
        return true
      }
      return false
    })
  }
}

function handleClick(item) {
  uni.setStorageSync(PAGES_VIDEO_DETAIL, item)
  uni.navigateTo({
    url: "/pages/video/detail"
  })
}
</script>

<template>
  <course-line-card-item
    v-for="item in list"
    :key="item.id"
    :item-data="item"
    @click="handleClick(item)"
  />
  <view style="height: 32rpx"></view>
</template>

<style lang="scss" scoped></style>
