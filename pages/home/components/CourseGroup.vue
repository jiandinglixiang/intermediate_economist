<script setup>
import { GET_VCOURSE_LIST } from "@/api"
import CourseCardItem from "@/components/course/CourseCardItem.vue"
import { httpRequest } from "@/utils/http"
import { onMounted, ref } from "vue"

const list = ref([])
onMounted(async () => {
  const res = await httpRequest(GET_VCOURSE_LIST, "POST", { type: 0 })
  list.value = res.data.result
})

function handleClick(item) {
  uni.navigateTo({
    url: "/pages/course/detail?id=" + item.id
  })
}
</script>

<template>
  <view class="course-group">
    <course-card-item
      v-for="item in list"
      :key="item.id"
      :item-data="item"
      @click="handleClick(item)"
    />
  </view>
</template>

<style lang="scss" scoped>
.course-group {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  margin: 0 32rpx;
}
</style>
