<script setup>
const props = defineProps({
  type: String
})
const emits = defineEmits(["handleClick"])
</script>

<template>
  <movable-area class="movable-area">
    <movable-view class="movable-view" direction="vertical" y="350" @click="emits('handleClick')">
      <image
        v-if="props.type === 'teaching'"
        class="fixed-fab"
        src="/static/information/teaching-materials.png"
      />
      <image
        v-else-if="props.type === 'information'"
        class="fixed-fab"
        src="/static/information/information-spree.png"
      />
      <image v-else class="fixed-fab2" src="/static/information/add-group.png" />
    </movable-view>
  </movable-area>
</template>

<style lang="scss" scoped>
.movable-area {
  position: fixed;
  z-index: 3;
  top: 700rpx;
  right: 0;
  width: 188rpx;
  height: 450rpx;
  pointer-events: none;
}

.movable-view {
  pointer-events: auto;
}

.fixed-fab {
  width: 156rpx;
  height: 140rpx;
}

.fixed-fab2 {
  width: 188rpx;
  height: 147rpx;
}
</style>
