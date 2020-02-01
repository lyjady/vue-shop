<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品参数</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-alert type="warning" :closable="false" show-icon title="注意: 只允许为第三级分类设置相关参数"/>
        <el-row class="cat-opt" type="flex" align="middle">
          <el-col :span="3">
            <span>选择商品分类: </span>
          </el-col>
          <el-col :span="5">
            <el-cascader style="width: 100%" :options="cateList" clearable separator=" > " :props="cateProps"/>
          </el-col>
        </el-row>
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
      cateList: [],
      cateProps: {
        value: 'catId',
        label: 'catName',
        children: 'children',
        expandTrigger: 'hover'
      }
    }
  },
  methods: {
    async getCategoryList () {
      const { data: response } = await this.$http({
        url: 'goods/getGoodsCategoryTree',
        method: 'post',
        data: {
          pageNumber: null,
          pageSize: null
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        this.cateList = response.data
      }
    }
  },
  created () {
    this.getCategoryList()
  }
}
</script>

<style lang="less" scoped>
  .cat-opt {
    margin: 15px 0;
  }
</style>
