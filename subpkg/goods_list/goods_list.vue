<template>
  <view>
    <view class="goods-list">
      <view v-for="(goods, index) in goodsList" :key="index" @click="gotoDetail(goods)">
        <!-- 为 my-goods 组件动态绑定 goods 属性的值 -->
        <my-goods :goods="goods"></my-goods>
      </view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 请求参数对象
        queryObj: {
          // 查询关键词
          query: '',
          // 商品分类Id
          cid: '',
          // 页码值
          pagenum: 1,
          // 每页显示多少条数据
          pagesize: 10
        },
        // 商品列表的数据
        goodsList: [],
        // 总数量，用来实现分页
        total: 0,
        // 节流标记
        isLoading: false
      };
    },
    onLoad(options) {
      // 将页面参数转存到 this.queryObj 对象中
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''

      this.getGoodsList()
    },
    methods: {
      // 获取商品列表数据的方法
      async getGoodsList(cb) {
        this.isLoading = true
        // 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
        // 请求完成 直接重置
        this.isLoading = false
        // 数据请求完成 直接关闭下拉刷新
        cb && cb()
        if (res.meta.status !== 200) return uni.$showMsg()
        // 为数据赋值
        this.total = res.message.total
        this.goodsList.push(...res.message.goods)
      },
      gotoDetail(goods) {
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
        })
      }
    },

    onReachBottom() {
      //数据已加载完
      if (this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('所有商品已加载')
      // 节流处理
      if (this.isLoading) return
      this.queryObj.pagenum += 1
      this.getGoodsList()
    },
    onPullDownRefresh() {
      // 重置参数
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []

      this.getGoodsList(() => uni.stopPullDownRefresh())
    }
  }
</script>

<style lang="scss">
</style>
