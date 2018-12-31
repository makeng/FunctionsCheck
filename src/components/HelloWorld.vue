<template>
  <div class="hello">
    <van-collapse v-model="activeNames">
      <van-collapse-item
          v-for="(item, index) in list"
          v-model="activeNames"
          :name="index"
          :title="item.type"
      >
        <van-list>
          <van-cell v-for="subItem in item.options" :key="subItem" :title="subItem" />
        </van-list>
      </van-collapse-item>
    </van-collapse>
  </div>
</template>

<script>
  import { test } from "../utils/cron/test";

  export default {
    data() {
      return {
        activeNames: [0],
        list: [ // 功能列表
          {
            type: "字符处理",
            options: ["cron"]
          }
        ],
      }
    },
    /* ----------------------------------------- 生命周期 ----------------------------------------- */
    created() {
      test();
    },
    methods: {
      /* ----------------------------------------- 自定义函数 ----------------------------------------- */
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
