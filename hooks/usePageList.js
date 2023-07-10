import { onUnload } from "@dcloudio/uni-app"
import { onUnmounted, ref } from "vue"

export function usePageList({ rows = 10, requestFunc }) {
  const loading = ref("")
  const list = ref([])

  return {
    key: "",
    loading,
    list,
    getList() {
      return getList({ loading, list, requestFunc, rows })
    },
    loadMore() {
      if (loading.value !== "more") {
        return
      }
      return getList({ loading, list, requestFunc, rows })
    },
    refresh() {
      list.value = []
      loading.value = ""
      return getList({ loading, list, requestFunc, rows })
    }
  }
}
async function getList({ loading, list, requestFunc, rows }) {
  loading.value = "loading"
  try {
    const page = list.value.length / rows + 1
    const res = await requestFunc({ page, rows, loading, list })
    const { data } = res
    const nList = list.value.concat(data.result)
    list.value = nList
    const len = data.result.length
    if (!nList.length) {
      loading.value = "nodata"
    } else {
      loading.value = len && Number.isInteger(len / rows) ? "more" : "nomore"
    }
  } catch (err) {
    if (list.length) {
      loading.value = "loaderror"
    } else {
      loading.value = err?.noNetwork ? "networkerror" : "error"
    }
    console.error(err)
    throw err
  }
}

export function useTimeCount(second) {
  const time = ref(second || 60)
  let endCallback
  let t
  const start = () => {
    if (time.value === 0) {
      endCallback?.()
      reset()
      return
    }
    t = setTimeout(() => {
      time.value--
      start()
    }, 1000)
  }
  const reset = () => {
    time.value = second
    clearTimeout(t)
  }
  onUnmounted(() => {
    clearTimeout(t)
  })
  onUnload(() => {
    clearTimeout(t)
  })
  return {
    time,
    start,
    reset,
    endCallback(func) {
      endCallback = func
    }
  }
}
