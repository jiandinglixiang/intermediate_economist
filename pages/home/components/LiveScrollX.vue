<script setup>
import { GET_LIVE_LIST } from "@/api"
import LiveCardItem from "@/components/live/LiveCardItem.vue"
import { useSubscribeLiveStatusUpdate } from "@/utils/event"
import { httpRequest } from "@/utils/http"
import { onShow } from "@dcloudio/uni-app"
import { ref } from "vue"

const scrollId = ref("")
const list = ref([])
useSubscribeLiveStatusUpdate((args) => {
  if (list.value.some((i) => args.some((j) => i.id === j.id))) {
    getList()
  }
})

getList()

async function getList() {
  const res = await httpRequest(GET_LIVE_LIST, "POST", { type: 1, rows: 5 })
  list.value = res.data.result
}

onShow(() => {
  setTimeout(() => {
    scrollId.value = "id-scroll-home"
    setTimeout(() => {
      scrollId.value = ""
    }, 1000)
  }, 300)
})
</script>

<template>
  <scroll-view
    :enable-flex="true"
    :scroll-into-view="scrollId"
    :scroll-x="true"
    :show-scrollbar="false"
    class="scroll-view"
    scroll-left="120"
  >
    <view id="id-scroll-home" class="scroll-view-content">
      <live-card-item v-for="item in list" :key="item.id" :item-data="item" />
    </view>
  </scroll-view>
</template>

<style lang="scss" scoped>
.scroll-view {
  height: 444rpx;
}

.scroll-view-content {
  display: flex;
  align-items: flex-start;
  flex-flow: row nowrap;
}
</style>
