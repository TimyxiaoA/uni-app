<template>
  <view>
    <view class="search-box">
      <uni-search-bar @input="input" :radius="100" clearButton="auto" cancelButton="none"></uni-search-bar>
    </view>

    <!-- 搜索建议列表 -->
    <view class="sugg-list" v-if="searchResults.length">
      <view class="sugg-item" v-for="(item, index) in searchResults" :key="index" @click="gotoDetail(item)">
        <view class="text">{{item.goods_name}}</view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>

    <!-- 搜索历史 -->
    <view class="history-box" v-else>
      <!-- 标题区域 -->
      <view class="history-title">
        <text>搜索历史</text>
        <uni-icons type="trash" size="16" @click="clearHistory"></uni-icons>
      </view>
      <!-- 列表区域 -->
      <view class="history-list">
        <uni-tag :text="item" v-for="(item, index) in historyList" :key="index" @click="gotoGoodsList(item)"></uni-tag>
      </view>
    </view>
  </view>


</template>

<script>
  export default {
    data() {
      return {
        timer: null,
        keywords: '', // 搜索关键字
        searchResults: [], // 搜索列表
        // 搜索关键词的历史记录
        historyList: ['a', 'app', 'apple']
      };
    },
    onLoad() {
      this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
    },
    methods: {
      input(e) {
        // 清除 timer
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.keywords = e
          // 根据关键字 查询搜索建议列表
          this.getSearchList()
        }, 500)
      },
      async getSearchList() {
        if (!this.keywords.trim().length) {
          this.searchResults = []
          return
        }
        // 发起请求
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/goods/qsearch', {
          query: this.keywords
        })
        if (res.meta.status !== 200) return uni.$showMsg()
        this.searchResults = res.message

        this.saveSearchHistory()
      },
      gotoDetail(item) {
        uni.navigateTo({
          // 指定详情页面的 URL 地址，并传递 goods_id 参数
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods_id
        })
      },
      // 保存历史搜索
      saveSearchHistory() {
        // 2.1 直接把搜索关键词 push 到 historyList 数组中
        this.historyList.unshift(this.keywords)
        this.historyList = Array.from(new Set(this.historyList))
        console.log(this.historyList)
        // 调用 uni.setStorageSync(key, value) 将搜索历史记录持久化存储到本地
        uni.setStorageSync('kw', JSON.stringify(this.historyList))
      },
      // 清空搜索历史记录
      clearHistory() {
        // 清空搜索历史和本地储存
         this.historyList = []
         uni.setStorageSync('kw', '[]')
      },
      // 点击跳转到商品列表页面
      gotoGoodsList(kw) {
        uni.navigateTo({
          url: '/subpkg/goods_list/goods_list?query=' + kw
        })
      }
    }
  }
</script>

<style lang="scss">
  .sugg-list {
    padding: 0 5px;

    .sugg-item {
      font-size: 12px;
      padding: 14px 0;
      border-bottom: 1px solid #efefef;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-right: 3px;
      }
    }
  }

  .history-box {
    padding: 0 5px;

    .history-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      font-size: 13px;
      border-bottom: 1px solid #efefef;
    }

    .history-list {
      display: flex;
      flex-wrap: wrap;

      .uni-tag {
        margin-top: 5px;
        margin-right: 5px;
      }
    }
  }
</style>
