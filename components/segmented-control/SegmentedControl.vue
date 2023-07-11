<script setup>
import { ref } from "vue"

const props = defineProps({
  list: {
    type: Array,
    default() {
      return ["AAAAAsa", "AAA", "AAAAA"]
    }
  },
  current: Number,
  fixed: Boolean
})
const emits = defineEmits(["change"])
const current = ref(props.current || 0)

function onChange(index) {
  current.value = index
  emits("change", index)
}
</script>

<template>
  <view :class="fixed && 'fixed-top'">
    <view class="segmented-control-list">
      <view
        v-for="(item, index) in list"
        :class="current === index && 'active'"
        class="segmented-control-item"
        @click="onChange(index)"
      >
        <text>{{ item }}</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.fixed-top {
  flex: 1;
  height: 120rpx;

  .segmented-control-list {
    position: fixed;
    z-index: 2;
    top: 0;
    // #ifdef H5
    top: 44px;
    // #endif
    right: 0;
    left: 0;
  }
}

.segmented-control-list {
  display: flex;
  align-items: center;
  flex: 1;
  flex-flow: row nowrap;
  justify-content: center;
  height: 88rpx;
  margin-bottom: 32rpx;
  background-color: #fff;
}

.segmented-control-item {
  display: flex;
  align-items: center;
  flex: 1 0 auto;
  flex-flow: column nowrap;
  max-width: 33.33%;

  text {
    font-size: 28rpx;
    font-weight: 500;
    line-height: 32rpx;
    position: relative;
    color: rgba(51, 51, 51, 1);
  }

  &.active text {
    font-size: 28rpx;
    font-weight: 700;
    line-height: 32rpx;
    color: rgba(48, 93, 218, 1);

    &:after {
      position: absolute;
      right: 0;
      bottom: -20rpx;
      left: 0;
      height: 8rpx;
      content: "";
      border-radius: 4rpx;
      background: #5200F5;
    }
  }
}
</style>
