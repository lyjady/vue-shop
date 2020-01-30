<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" v-loading="loading">
      <el-button type="primary" round @click="addGoodsCategory">添加分类</el-button>
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
    <el-dialog title="添加分类" :visible.sync="enableAddCategoryDialog">
      <el-form ref="addCategoryRef" :rules="addCategoryRule" :model="addCategory" size="medium">
        <el-form-item label="分类名称:" prop="catName">
          <el-input v-model="addCategory.catName"/>
        </el-form-item>
        <el-form-item label="父分类:">
          <el-cascader style="width: 100%" :options="categoryWithoutThird" :props="categoryCascader" @change="categoryChange" clearable separator=" > " v-model="selectKey"></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="enableAddCategoryDialog = false">取 消</el-button>
        <el-button type="primary" @click="commitAddCategory">确 定</el-button>
      </span>
    </el-dialog>
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
      loading: true,
      enableAddCategoryDialog: false,
      addCategoryRule: {
        catName: [
          { required: true, message: '请输入分类名', trigger: 'blur' }
        ]
      },
      addCategory: {
        catName: '',
        catPid: 0,
        catLevel: 0
      },
      categoryWithoutThird: [],
      categoryCascader: {
        value: 'catId',
        label: 'catName',
        children: 'child',
        expandTrigger: 'hover',
        checkStrictly: true
      },
      selectKey: []
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
    },
    async addGoodsCategory () {
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
      this.categoryWithoutThird = response.data
      this.categoryWithoutThird.forEach(first => {
        first.child = first.children
      })
      this.enableAddCategoryDialog = true
    },
    commitAddCategory () {
      console.log(this.addCategory)
      this.enableAddCategoryDialog = false
    },
    categoryChange () {
      if (this.selectKey.length > 0) {
        this.addCategory.catPid = this.selectKey[this.selectKey.length - 1]
        this.addCategory.catLevel = this.selectKey.length
      }
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
