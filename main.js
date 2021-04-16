import Vue from 'vue'
import App from './App'

// 按需导入 $http 对象
import { $http } from '@escook/request-miniprogram'

uni.$http = $http
// 基准路径
// $http.baseUrl = 'https://www.uinav.com'
$http.baseUrl = 'https://api-hmugo-web.itheima.net'

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
}

uni.$showMsg = function (title="获取数据失败!", duration = 1500) {
  return uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

// 请求完成之后做一些事情
$http.afterRequest  = function () {
  uni.hideLoading()
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
