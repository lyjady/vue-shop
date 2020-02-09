<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-input v-model="goodsName" placeholder="请输入要搜索的内容">
              <el-button slot="append" icon="el-icon-search"/>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" round>添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodsList" v-loading="isLoading" border stripe>
          <el-table-column type="index" label="#"/>
          <el-table-column prop="goodsName" label="商品名称"/>
          <el-table-column width="95px " prop="goodsPrice" label="商品价格"/>
          <el-table-column width="70px " prop="goodsWeight" label="商品重量"/>
          <el-table-column width="140px" prop="addTime" label="创建时间"/>
          <el-table-column width="130px" label="操作">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" round size="mini"/>
              <el-button type="danger" icon="el-icon-delete" round size="mini"/>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      goodsName: '',
      queryInfo: {
        pageSize: 10,
        pageNumber: 1
      },
      count: 0,
      isLoading: false,
      goodsList: []
    }
  },
  methods: {
    async getGoodsList () {
      this.isLoading = true
      const { data: response } = await this.$http({
        url: 'goods/getGoodsList',
        method: 'post',
        data: this.queryInfo,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        this.goodsList = response.data
        this.count = response.count
        this.isLoading = false
      }
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style scoped>

</style>
