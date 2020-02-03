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
          <el-tab-pane label="动态参数" name="many">
            <el-button type="primary" round :disabled="isEnableAddParamsBtn">添加参数</el-button>
            <el-table :data="dynamicData" border stripe v-loading="loading">
              <el-table-column type="expand"/>
              <el-table-column type="index" label="#"/>
              <el-table-column label="参数名称" prop="attrName"/>
              <el-table-column label="操作">
                <template>
                  <el-button type="warning" icon="el-icon-edit" round>编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" round>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" round :disabled="isEnableAddParamsBtn">添加参数</el-button>
            <el-table :data="staticData" border stripe v-loading="loading">
              <el-table-column type="expand"/>
              <el-table-column type="index" label="#"/>
              <el-table-column label="参数名称" prop="attrName"/>
              <el-table-column label="操作">
                <template>
                  <el-button type="warning" icon="el-icon-edit" round>编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" round>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
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
      activeName: 'many',
      dynamicData: [],
      staticData: [],
      loading: false
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
      if (this.selectedCateKey.length === 3) {
        this.getGoodsAttribute()
      }
    },
    handleTabsClick (tab, event) {
      if (this.selectedCateKey.length === 3) {
        this.getGoodsAttribute()
      }
    },
    async getGoodsAttribute () {
      this.loading = true
      const { data: response } = await this.$http.get('goods/findGoodsAttribute/' + this.selectedCateKey[2], { params: { type: this.activeName } })
      if (response.status === 200) {
        this.loading = false
        if (this.activeName === 'many') {
          this.dynamicData = response.data
        } else {
          this.staticData = response.data
        }
      }
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
