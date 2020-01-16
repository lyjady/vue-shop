<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row :gutter="20">
          <el-col :span="5">
            <div class="grid-content bg-purple">
              <el-input placeholder="请输入内容" v-model="queryInfo.mgName" class="input-with-select" clearable @clear="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"/>
              </el-input>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="grid-content bg-purple">
              <el-button type="primary" round @click="addUserDialog = true">添加用户</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table :data="userList" style="width: 100%" stripe border v-loading="loading">
          <el-table-column label="#" type="index"/>
          <el-table-column label="姓名" prop="mgName"/>
          <el-table-column label="邮箱" prop="mgEmail"/>
          <el-table-column label="电话" prop="mgMobile"/>
          <el-table-column label="角色" prop="role.roleName"/>
          <el-table-column label="状态">
            <template v-slot="scope">
              <el-switch v-model="scope.row.mgState" @change="updateStatus(scope.row)"/>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template v-slot="scope">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="openEditUserForm(scope.row.mgId)"/>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.mgId)"/>
              <el-tooltip class="item" effect="dark" content="分配权限" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"/>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background layout="total, sizes, prev, pager, next" :page-sizes="[1, 2, 5, 10]" :page-size="page.pageSize" :total="page.count" @size-change="sizeChange" @current-change="currentChange"/>
      </el-card>

      <el-dialog title="添加用户" width="30%" :visible.sync="addUserDialog">
        <el-form ref="addUserRef" :model="addUserInfo" :rules="userRules" label-width="60px" size="medium">
          <el-form-item label="姓名" prop="mgName">
            <el-input v-model="addUserInfo.mgName"/>
          </el-form-item>
          <el-form-item label="密码" prop="mgPwd">
            <el-input v-model="addUserInfo.mgPwd" type="password"/>
          </el-form-item>
          <el-form-item label="邮箱" prop="mgEmail">
            <el-input v-model="addUserInfo.mgEmail"/>
          </el-form-item>
          <el-form-item label="电话" prop="mgMobile">
            <el-input v-model="addUserInfo.mgMobile"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetAddUserForm">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="修改用户" width="30%" :visible.sync="editUserDialog">
        <el-form ref="editUserRef" :model="editUserInfo" :rules="userRules" label-width="60px" size="medium">
          <el-form-item label="姓名">
            <el-input v-model="editUserInfo.mgName" disabled/>
          </el-form-item>
          <el-form-item label="邮箱" prop="mgEmail">
            <el-input v-model="editUserInfo.mgEmail"/>
          </el-form-item>
          <el-form-item label="电话" prop="mgMobile">
            <el-input v-model="editUserInfo.mgMobile"/>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelEdit">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>

<script>
export default {
  name: 'User',
  data () {
    const checkEmail = (rule, value, callback) => {
      const emailReg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (emailReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }

    const checkMobile = (rule, value, callback) => {
      const mobileReg = /^1([38]\d|5[0-35-9]|7[3678])\d{8}$/
      if (mobileReg.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }

    return {
      userList: [],
      queryInfo: {
        mgName: '',
        pageNumber: 1,
        pageSize: 2
      },
      loading: true,
      page: {
        pageNumber: 0,
        pageSize: 0,
        count: 0
      },
      addUserDialog: false,
      editUserDialog: false,
      addUserInfo: {
        mgName: '',
        mgPwd: '',
        mgEmail: '',
        mgMobile: ''
      },
      editUserInfo: {
        mgId: '',
        mgName: '',
        mgEmail: '',
        mgMobile: ''
      },
      userRules: {
        mgName: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, message: '长度超过 3 个字符', trigger: 'blur' }
        ],
        mgPwd: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '长度超过 6 个字符', trigger: 'blur' }
        ],
        mgEmail: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mgMobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async getUserList () {
      const { data: response } = await this.$http({
        url: 'user/getUserList',
        method: 'post',
        data: this.queryInfo,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        this.userList = response.data
        this.count = response.count
        this.page.pageSize = response.pageSize
        this.page.count = response.count
        this.loading = false
        this.userList.forEach(item => {
          item.mgState = item.mgState === 1
        })
      }
    },
    sizeChange (currentSize) {
      this.queryInfo.pageSize = currentSize
      this.getUserList()
    },
    currentChange (currentPage) {
      this.queryInfo.pageNumber = currentPage
      this.getUserList()
    },
    async updateStatus (userInfo) {
      const { data: response } = await this.$http.put('user/updateStatus/' + userInfo.mgId + '/' + userInfo.mgState)
      if (response.status === 200) {
        return this.$message.success('修改用户状态成功')
      }
      return this.$message.error('修改用户状态失败')
    },
    resetAddUserForm () {
      this.$refs.addUserRef.resetFields()
      this.addUserDialog = false
    },
    addUser () {
      this.$refs.addUserRef.validate(async validate => {
        if (validate) {
          const { data: response } = await this.$http({
            url: 'user/addUser',
            method: 'post',
            data: this.addUserInfo,
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if (response.status === 200) {
            this.addUserDialog = false
            this.$refs.addUserRef.resetFields()
            this.getUserList()
            return this.$message.success('添加用户成功')
          }
          return this.$message.error('添加用户失败')
        }
      })
    },
    editUser () {
      this.$refs.editUserRef.validate(async validate => {
        if (validate) {
          const { data: response } = await this.$http({
            url: 'user/updateUser',
            method: 'put',
            data: this.editUserInfo,
            headers: {
              'Content-Type': 'application/json'
            }
          })
          if (response.status === 200) {
            this.getUserList()
            this.editUserDialog = false
            return this.$message.success('修改用户成功')
          }
          return this.$message.error('修改用户失败')
        }
      })
    },
    async openEditUserForm (id) {
      const { data: response } = await this.$http.get('user/findUser/' + id)
      if (response.status === 200) {
        this.editUserInfo = response.data
        this.editUserDialog = true
      }
    },
    cancelEdit () {
      this.$refs.editUserRef.resetFields()
      this.editUserDialog = false
    },
    async deleteUser (id) {
      const confirmResult = await this.$confirm('此操作将永久删除用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'confirm') {
        const { data: response } = await this.$http.delete('user/deleteUser/' + id)
        if (response.status === 200) {
          this.getUserList()
          this.$message.success('删除成功')
        } else {
          this.$message.success('删除失败')
        }
      } else if (confirmResult === 'cancel') {
        return this.$message.info('取消删除用户')
      }
    }
  },
  created () {
    this.getUserList()
  }
}
</script>

<style scoped>
  .box-card {
    margin-top: 20px;
  }

  .el-table {
    margin-top: 20px;
  }

  .el-pagination {
    margin-top: 20px;
    text-align: center;
  }
</style>
