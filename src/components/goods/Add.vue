<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{path: '/goods'}">商品列表</el-breadcrumb-item>
        <el-breadcrumb-item>商品添加</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
        <el-alert title="添加商品信息" type="info" show-icon :closable="false" center/>
        <el-form :model="addGoods" :rules="addGoodsRule" ref="addGoodsRef" label-position="top">
          <el-steps  :active="activeIndex" align-center>
            <el-step title="基本信息" />
            <el-step title="商品参数" />
            <el-step title="商品属性" />
            <el-step title="商品图片" />
            <el-step title="商品内容" />
            <el-step title="完成" />
          </el-steps>
        </el-form>
        <el-tabs tab-position="left" v-model="activeIndex">
          <el-tab-pane label="基本信息" :name="0">基本信息</el-tab-pane>
          <el-tab-pane label="商品参数" :name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" :name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" :name="3">商品图片</el-tab-pane>
          <el-tab-pane label="商品内容" :name="4">
            <el-button @click="activeIndex = 5">添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      activeIndex: 0,
      addGoods: {},
      addGoodsRule: {}
    }
  }
}
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 20px;
}
.el-steps {
  margin: 15px 0;
}

.el-step__title {
  font-size: 12px;
}
</style>
