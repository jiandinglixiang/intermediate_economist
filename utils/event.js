import { onHide, onShow, onUnload } from "@dcloudio/uni-app"

export const LIVE_STATUS_UPDATE = "LIVE_STATUS_UPDATE"
// 直播状态更新
export function useSubscribeLiveStatusUpdate(func) {
  let args = []
  onShow(async () => {
    args.length && (await func(args))
    args = []
  })
  onHide(() => {
    uni.$on(LIVE_STATUS_UPDATE, handle)
  })
  onUnload(() => {
    uni.$off(LIVE_STATUS_UPDATE, handle)
  })
  function handle(arg) {
    args.push(arg)
  }
}
