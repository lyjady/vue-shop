<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" v-loading="loading">
      <el-button type="primary" round>添加分类</el-button>
      <zk-table :data="categoryList" :columns="columns" :selection-type="false" :expand-type="false" border
                index-text="#" :show-index="true" :show-row-hover="false">
        <template v-slot:isDeleted="scope">
          <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.catDeleted === 0"/>
          <i class="el-icon-error" style="color: red" v-else/>
        </template>
        <template v-slot:order="scope">
          <el-tag v-if="scope.row.catLevel === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.catLevel === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template v-slot:option="scope">
          <div class="option">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
          </div>
        </template>
      </zk-table>
      <el-pagination @size-change="handleChangePageSize" @current-change="handleChangePageNumber"
                     :current-page="queryInfo.pageNumber" :page-sizes="[3, 5, 10, 15]" :page-size="queryInfo.pageSize"
                     :total="total" layout="total, sizes, prev, pager, next, jumper" background/>
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
        },
        {
          label: '是否有效',
          prop: 'catDeleted',
          type: 'template',
          template: 'isDeleted'
        },
        {
          label: '排序',
          prop: 'catLevel',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          type: 'template',
          template: 'option'
        }
      ],
      loading: true
    }
  },
  created () {
    this.getCategory()
    this.getCategoryCount()
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
        this.loading = false
        this.categoryList = response.data
      }
    },

    async getCategoryCount () {
      const { data: response } = await this.$http.get('goods/categoryCount')
      this.total = response
    },
    handleChangePageSize (newSize) {
      this.queryInfo.pageSize = newSize
      this.getCategory()
    },
    handleChangePageNumber (newNumber) {
      this.queryInfo.pageNumber = newNumber
      this.getCategory()
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin-top: 20px;
  }

  .el-button {
    margin-bottom: 15px;
  }
</style>
