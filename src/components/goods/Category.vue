<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" round>添加分类</el-button>
      <zk-table :data="categoryList" :columns="columns" :selection-type="false" :expand-type="false" border index-text="#" :show-index="true"></zk-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      queryInfo: {
        pageNumber: 1,
        pageSize: 5
      },
      total: 0,
      categoryList: [],
      columns: [
        {
          label: '分类名称',
          prop: 'catName'
        }
      ]
    }
  },
  methods: {
    async getCategory () {
      const { data: response } = await this.$http({
        url: 'goods/getGoodsCategoryTree',
        method: 'post',
        data: this.queryInfo,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        this.categoryList = response.data
      }
    },

    async getCategoryCount () {
      const { data: response } = await this.$http.get('goods/categoryCount')
      this.count = response
    }
  },
  created () {
    this.getCategory()
    this.getCategoryCount()
  }
}
</script>

<style scoped>
  .box-card {
    margin-top: 20px;
  }
</style>
