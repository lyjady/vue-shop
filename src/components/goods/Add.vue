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
        <el-steps  :active="parseInt(activeIndex)" align-center>
          <el-step title="基本信息" />
          <el-step title="商品参数" />
          <el-step title="商品属性" />
          <el-step title="商品图片" />
          <el-step title="商品内容" />
          <el-step title="完成" />
        </el-steps>
        <el-form :model="addGoods" :rules="addGoodsRule" ref="addGoodsRef" label-position="top">
          <el-tabs tab-position="left" v-model="activeIndex" :before-leave="checkLeave" @tab-click="tabToggle">
            <el-tab-pane label="基本信息" :name="'0'">
              <el-form-item label="商品名称" prop="goodsName">
                <el-input v-model="addGoods.goodsName"/>
              </el-form-item>
              <el-form-item label="商品价格" prop="goodsPrice">
                <el-input v-model="addGoods.goodsPrice" type="number"/>
              </el-form-item>
              <el-form-item label="商品重量" prop="goodsWeight">
                <el-input v-model="addGoods.goodsWeight" type="number"/>
              </el-form-item>
              <el-form-item label="商品数量" prop="goodsNumber">
                <el-input v-model="addGoods.goodsNumber" type="number"/>
              </el-form-item>
              <el-form-item label="商品分类" prop="cateId">
                <el-cascader :props="cateProps" clearable separator=" > " :options="cateList" v-model="selectedCateKey" @change="handleSelectCateKey"/>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" :name="'1'">
              <el-form-item :label="attr.attrName" v-for="attr in attrList" :key="attr.attrId">
                <el-checkbox-group v-model="attr.vals">
                  <el-checkbox :label="val" v-for="(val, index) in attr.vals" :key="index" border/>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" :name="'2'">商品属性</el-tab-pane>
            <el-tab-pane label="商品图片" :name="'3'">商品图片</el-tab-pane>
            <el-tab-pane label="商品内容" :name="'4'">
              <el-button @click="activeIndex = '5'">添加</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-card>
    </div>
</template>

<script>
export default {
  name: '',
  data () {
    return {
      activeIndex: 0,
      addGoods: {
        goodsName: '',
        goodsPrice: 0,
        goodsWeight: 0,
        goodsNumber: 0,
        catId: 0
      },
      addGoodsRule: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goodsPrice: [
          { required: true, message: '请输入商品价格', trigger: 'blur' }
        ],
        goodsWeight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' }
        ],
        goodsNumber: [
          { required: true, message: '请输入商品数量', trigger: 'blur' }
        ],
        cateId: [
          { required: true, message: '请选择商品类型', trigger: 'blur' }
        ]
      },
      cateList: [],
      selectedCateKey: [],
      cateProps: {
        value: 'catId',
        label: 'catName',
        children: 'children',
        expandTrigger: 'hover'
      },
      attrList: []
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
    handleSelectCateKey () {
      this.addGoods.catId = this.selectedCateKey[2]
    },
    checkLeave (newActive, oldActive) {
      if (newActive === '1' && oldActive === '0') {
        if (this.selectedCateKey.length !== 3) {
          this.$message.error('请选择三级分类')
          return false
        }
      }
    },
    async tabToggle (tab) {
      if (tab.index === '1' && this.selectedCateKey.length === 3) {
        const { data: response } = await this.$http.get('goods/findGoodsAttribute/' + this.selectedCateKey[2], { params: { type: 'many' } })
        if (response.status === 200) {
          this.attrList = response.data
          this.attrList.forEach(attr => {
            if (attr.attrVals.trim().length !== 0) {
              attr.vals = attr.attrVals.split(' ')
            }
          })
        }
      }
    }
  },
  created () {
    this.getCategoryList()
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

.el-checkbox {
  margin: 0 10px 0 0 !important;
}
</style>
