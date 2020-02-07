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
            <el-button type="primary" round :disabled="isEnableAddParamsBtn" @click="enableUpdateDialog = true">添加参数</el-button>
            <el-table :data="dynamicData" border stripe v-loading="loading">
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag type="primary" v-for="(tag, index) in scope.row.vals" :key="index" closable>
                    {{ tag }}
                  </el-tag>
                  <el-input style="height: 30px" class="input-new-tag" ref="saveTagInput" size="small" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" @keypress.enter.native="addVals(scope.row)" @blur="addVals(scope.row)"/>
                  <el-button class="button-new-tag" v-else size="small" @click="showTagInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"/>
              <el-table-column label="参数名称" prop="attrName"/>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button type="warning" icon="el-icon-edit" round @click="edit(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" round @click="removeAttribute(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="静态属性" name="only">
            <el-button type="primary" round :disabled="isEnableAddParamsBtn" @click="enableUpdateDialog = true">添加参数</el-button>
            <el-table :data="staticData" border stripe v-loading="loading">
              <el-table-column type="expand">
                <template v-slot="scope">
                  <el-tag type="primary" v-for="(tag, index) in scope.row.vals" :key="index" closable>
                    {{ tag }}
                  </el-tag>
                  <el-input style="height: 30px" class="input-new-tag" ref="saveTagInput" size="small" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" @keypress.enter.native="addVals(scope.row)" @blur="addVals(scope.row)"/>
                  <el-button class="button-new-tag" v-else size="small" @click="showTagInput(scope.row)">+ New Tag</el-button>
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"/>
              <el-table-column label="参数名称" prop="attrName"/>
              <el-table-column label="操作">
                <template v-slot="scope">
                  <el-button type="warning" icon="el-icon-edit" round @click="edit(scope.row)">编辑</el-button>
                  <el-button type="danger" icon="el-icon-delete" round @click="removeAttribute(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <el-dialog :title="'添加' + titleText" :visible.sync="enableUpdateDialog" @close="closeUpdateDialog">
          <el-form :model="addParams" ref="addParamsRef" :rules="addParamsRule">
            <el-form-item :label="titleText" prop="attrName">
              <el-input v-model="addParams.attrName"/>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeUpdateDialog">取 消</el-button>
            <el-button type="primary" @click="addAttribute">确 定</el-button>
          </span>
        </el-dialog>
        <el-dialog :title="'添加' + titleText" :visible.sync="enableEditDialog" @close="closeEditDialog">
          <el-form :model="editAttribute" ref="editAttributeRef" :rules="editAttributeRule">
            <el-form-item :label="titleText" prop="attrName">
              <el-input v-model="editAttribute.attrName"/>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="closeEditDialog">取 消</el-button>
            <el-button type="primary" @click="commitEditAttribute">确 定</el-button>
          </span>
        </el-dialog>
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
      loading: false,
      enableUpdateDialog: false,
      enableEditDialog: false,
      addParams: {
        attrName: ''
      },
      editAttribute: {},
      addParamsRule: {
        attrName: [
          { required: true, message: '请输参数名', trigger: 'blur' }
        ]
      },
      editAttributeRule: {
        attrName: [
          { required: true, message: '请输参数名', trigger: 'blur' }
        ]
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
          response.data.forEach(attr => {
            attr.inputVisible = false
            attr.inputValue = ''
            if (attr.attrVals) {
              attr.vals = attr.attrVals.split(' ')
            }
          })
          this.dynamicData = response.data
        } else {
          response.data.forEach(attr => {
            if (attr.attrVals) {
              attr.vals = attr.attrVals.split(' ')
            }
            attr.inputVisible = false
            attr.inputValue = ''
          })
          this.staticData = response.data
        }
      }
    },
    closeUpdateDialog () {
      this.$refs.addParamsRef.resetFields()
      this.enableUpdateDialog = false
    },
    closeEditDialog () {
      this.$refs.editAttributeRef.resetFields()
      this.enableEditDialog = false
    },
    // eslint-disable-next-line vue/no-dupe-keys
    addAttribute () {
      this.$refs.addParamsRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post('goods/addAttribute', {
            attrName: this.addParams.attrName,
            attrSel: this.activeName,
            catId: this.selectedCateKey[2]
          })
          if (response.status === 200) {
            this.$message.success('添加成功')
            this.getGoodsAttribute()
          } else {
            this.$message.error('添加失败')
          }
          this.enableUpdateDialog = false
        }
      })
    },
    async edit (attribute) {
      const { data: response } = await this.$http.get('goods/findAttr/' + attribute.attrId)
      if (response.status === 200) {
        this.editAttribute = response.data
      }
      this.enableEditDialog = true
    },
    commitEditAttribute () {
      this.$refs.editAttributeRef.validate(async valid => {
        if (valid) {
          const { data: response } = await this.$http.post('goods/editAttribute', this.editAttribute)
          console.log(response)
          if (response.status === 200) {
            this.$message.success('更新成功')
            this.getGoodsAttribute()
          } else {
            this.$message.error('更新失败')
          }
          this.enableEditDialog = false
        }
      })
    },
    async removeAttribute (attr) {
      const confirm = await this.$confirm('是否永久删除该属性?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).catch(err => err)
      if (confirm === 'confirm') {
        const { data: response } = await this.$http.delete('goods/removeAttr/' + attr.attrId)
        if (response.status === 200) {
          this.getGoodsAttribute()
          this.$message.success('删除成功')
        } else {
          this.$message.error('删除失败')
        }
      } else {
        this.$message.info('删除取消')
      }
    },
    async addVals (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }
      row.vals.push(row.inputValue)
      row.attrVals += ' ' + row.inputValue
      let attribute = {
        attrId: row.attrId,
        attrVals: row.attrVals
      }
      const { data: response } = await this.$http.post('goods/addValue', attribute)
      if (response.status === 200) {
        this.$message.success('添加成功')
      } else {
        this.$message.error('添加失败')
      }
      row.inputValue = ''
      row.inputVisible = false
    },
    showTagInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  },
  created () {
    this.getCategoryList()
  },
  computed: {
    isEnableAddParamsBtn () {
      return this.selectedCateKey.length === 0
    },
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
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

  .el-tag {
    margin-right: 20px;
    height: 32px;
    margin-bottom: 20px;
  }

  .button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 90px;
    margin-left: 10px;
    /*vertical-align: bottom;*/
    height: 30px;
  }
</style>
