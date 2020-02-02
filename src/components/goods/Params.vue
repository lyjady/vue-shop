<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品参数</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-alert type="warning" :closable="false" show-icon title="注意: 只允许为第三级分类设置相关参数"/>
        <div class="cat-opt">
          <span>选择商品分类: </span>
          <el-cascader :options="cateList" clearable separator=" > " :props="cateProps" v-model="selectedCateKey" @change="handleCateChange"/>
        </div>
        <el-tabs v-model="activeName" @tab-click="handleTabsClick">
          <el-tab-pane label="动态参数" name="dynamicParams">
            <el-button type="primary" round :disabled="isEnableAddParamsBtn">添加参数</el-button>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="staticAttribute">
            <el-button type="primary" round :disabled="isEnableAddParamsBtn">添加参数</el-button>
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
      },
      selectedCateKey: [],
      activeName: 'dynamicParams'
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
    },
    handleCateChange () {
      console.log(this.selectedCateKey)
    },
    handleTabsClick (tab, event) {
      console.log(this.activeName)
    }
  },
  created () {
    this.getCategoryList()
  },
  computed: {
    isEnableAddParamsBtn () {
      return this.selectedCateKey.length === 0
    }
  }
}
</script>

<style lang="less" scoped>
  .cat-opt {
    display: flex;
    align-items: center;
    margin: 15px 0;
    span {
      margin-right: 10px;
    }

    .el-cascader {
      width: 12%;
    }
  }
</style>
