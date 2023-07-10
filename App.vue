<script setup>
import { NoticeStatus } from "@/pinia/notice"
import { onLaunch } from "@dcloudio/uni-app"
import { nextTick } from "vue"
import { AppAuditStatus } from "@/pinia/audit"

onLaunch(async () => {

  await nextTick()
  setTimeout(() => {
    NoticeStatus().getCommonData()
    // 获取跳转数据
    AppAuditStatus().getAppAuditStatus()
    // 获取审核状态
  }, 100)
})
</script>

<style lang="scss">
/*每个页面公共css */
#app {
  font-family: PingFangSC-Regular, sans-serif;
  touch-action: pan-y;
}

body {
  background-color: transparent;
}

page {
  box-sizing: border-box;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
