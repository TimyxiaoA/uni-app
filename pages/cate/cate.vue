<template>
  <view>
    <!-- 上方搜索按钮 -->
    <my-search @click="gotoSearch"></my-search>

    <view class="scroll-view-container">
      <!-- 左侧的滚动视图区域 -->
      <scroll-view class="left-scroll-view" scroll-y :style="{height: wh + 'px'}">
        <view v-for="(item, index) in cateList" :key="index"
          :class="['left-scroll-view-item', index==active? 'active' : '']" @click="changeActive(index)">
          {{item.cat_name}}
        </view>
      </scroll-view>
      <!-- 右侧的滚动视图区域 -->
      <scroll-view class="right-scroll-view" scroll-y :style="{height: wh + 'px'}" :scroll-top="scrollTop">
        <!-- 二级分类 -->
        <view class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="index2">
          <!-- 二级分类 title -->
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 二级分类下的三级分类 -->
          <view class="cate-lv3-list">
            <!-- 三级分类 item项 -->
            <view class="cate-lv3-item" v-for="(item3, index3) in item2.children" :key="item3">
              <image :src="item3.cat_icon"></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>

      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 窗口的可用高度 = 屏幕高度 - navigationBar高度 - tabBar 高度
        wh: 0,
        //分类列表
        cateList: [],
        // 当前激活项
        active: 0,
        // 二级分类列表
        cateLevel2: [],
        // 滚动条距离顶部距离
        scrollTop: 0
      };
    },
    onLoad() {
      // 获取当前系统的信息 
      const sysInfo = uni.getSystemInfoSync()
      // 为 wh 窗口可用高度动态赋值
      this.wh = sysInfo.windowHeight - 50

      this.getCateList()
    },
    methods: {
      // 获取分类列表
      async getCateList() {
        const {
          data: res
        } = await uni.$http.get('/api/public/v1/categories')
        if (res.meta.status !== 200) return uni.$showMsg()
        this.cateList = res.message
        // 给二级分类列表赋值
        this.cateLevel2 = res.message[0].children
      },
      // 左侧一级分类切换
      changeActive(index) {
        this.active = index
        this.cateLevel2 = this.cateList[index].children
        // 让 scrollTop 的值在 0 与 1 之间切换
        this.scrollTop = this.scrollTop === 0 ? 1 : 0
      },
      gotoSearch(e) {
        console.log(e)
        uni.navigateTo({
          url: '/subpkg/search/search'
        })
      }
    }
  }
</script>

<style lang="scss">
  .scroll-view-container {
    display: flex;

    .left-scroll-view {
      width: 120px;

      .left-scroll-view-item {
        line-height: 60px;
        background-color: #f7f7f7;
        text-align: center;
        font-size: 12px;
      }

      .active {
        background-color: #fff;
        position: relative;

        &::before {
          content: ' ';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }

    .cate-lv2-title {
      font-size: 12px;
      font-weight: bold;
      text-align: center;
      padding: 15px 0;
    }
  }

  .cate-lv3-list {
    display: flex;
    flex-wrap: wrap;

    .cate-lv3-item {
      width: 33.33%;
      margin-bottom: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      image {
        width: 60px;
        height: 60px;
      }

      text {
        font-size: 12px;
      }
    }
  }
</style>
