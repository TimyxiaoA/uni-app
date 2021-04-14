<template>
  <view class="search-container" :style="{'background-color': bgcolor}" @click="searchBoxHandler">
    <view class="search-box" :style="{'border-radius': radius +'px'}">
      <!-- 图标 -->
      <uni-icons type="search" size="18"></uni-icons>
      <!-- 文字 -->
      <text>搜索</text>
    </view>
  </view>
</template>

<script>
  export default {
    name: "my-search",
    props: {
      bgcolor: {
        type: String,
        default: '#c00'
      },
      radius: {
        type: Number,
        default: 18
      }
    },
    data() {
      return {

      };
    },
    methods: {
      searchBoxHandler(e) {
        console.log(1111)
        this.$emit('click', e)
      }
    }
  }
</script>

<style lang="scss">
  .search-container {
    height: 50px;
    // background-color: #c00;
    padding: 0 15px;
    display: flex;
    justify-content: center;
    align-items: center;

    .search-box {
      height: 36px;
      width: 100%;
      background-color: #fff;
      // border-radius: 15px;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    text {
      font-size: 16px;
      margin-left: 6px;
    }
  }
</style>
