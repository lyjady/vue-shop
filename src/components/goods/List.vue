<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-input v-model="queryInfo.goodsName" placeholder="请输入要搜索的内容" clearable @clear="getGoodsList">
              <el-button slot="append" icon="el-icon-search" @click="getGoodsList"/>
            </el-input>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" round @click="jumpAddGoodsPage">添加商品</el-button>
          </el-col>
        </el-row>
        <el-table :data="goodsList" v-loading="isLoading" border stripe>
          <el-table-column type="index" label="#"/>
          <el-table-column prop="goodsName" label="商品名称"/>
          <el-table-column width="95px " prop="goodsPrice" label="商品价格"/>
          <el-table-column width="70px " prop="goodsWeight" label="商品重量"/>
          <el-table-column width="160px" label="创建时间">
            <template v-slot="scope">
              {{ scope.row.addTime | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column width="130px" label="操作">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" round size="mini"/>
              <el-button type="danger" icon="el-icon-delete" round size="mini" @click="removeGoods"/>
            </template>
          </el-table-column>
        </el-table>
        <div class="block">
          <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNumber" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count"/>
        </div>
      </el-card>
    </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      queryInfo: {
        pageSize: 10,
        pageNumber: 1,
        goodsName: ''
      },
      count: 0,
      isLoading: false,
      goodsList: []
    }
  },
  created () {
    this.getGoodsList()
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
    },
    handleSizeChange (pageSize) {
      this.queryInfo.pageSize = pageSize
      this.getGoodsList()
    },
    handleCurrentChange (pageNumber) {
      this.queryInfo.pageNumber = pageNumber
      this.getGoodsList()
    },
    async removeGoods () {
      const confirm = await this.$confirm('是否要删除这件商品?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (confirm === 'confirm') {
        this.$message.success('删除成功')
      } else {
        this.$message.info('取消删除')
      }
    },
    jumpAddGoodsPage () {
      this.$router.push('goods/add')
    }
  }
}
</script>

<style scoped>

</style>
