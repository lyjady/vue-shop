<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary" round>添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" style="width: 100%" border stripe v-loading="loading">
        <el-table-column type="expand">
          <template v-slot="scope">
            <el-row v-for="(first, index) in scope.row.permissions" :key="first.psId" :class="['bottom-border', index === 0 ? 'top-border' : '']" >
              <el-col :span="5">
                <el-tag type="primary" :key="first.psId" closable @close="removeRight(scope.row.roleId, first.psId, first.psLevel)">
                  {{ first.psName }}
                </el-tag>
                <i class="el-icon-caret-right"/>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(second, index) in first.children" :key="second.psId" :class="[index === 0 ? '' : 'top-border']">
                  <el-col :span="6">
                    <el-tag type="success" :key="second.psId" closable @close="removeRight(scope.row.roleId, second.psId, second.psLevel)">
                      {{ second.psName }}
                    </el-tag>
                    <i class="el-icon-caret-right"/>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="third in second.children" :key="third.psId" type="warning" closable @close="removeRight(scope.row.roleId, third.psId, third.psLevel)">
                      {{ third.psName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index"/>
        <el-table-column label="角色名称" prop="roleName"/>
        <el-table-column label="角色描述" prop="roleDesc"/>
        <el-table-column label="操作">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini" @click="distributionRight(scope.row.roleId)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="distributionRightDialog">
      <el-tree :data="treePermissionList" show-checkbox node-key="psId" :props="defaultProps" default-expand-all :default-checked-keys="expandedKey"/>
      <span slot="footer" class="dialog-footer">
        <el-button @click="distributionRightDialog = false">取 消</el-button>
        <el-button type="primary" @click="distributionRightDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      loading: true,
      distributionRightDialog: false,
      defaultProps: {
        children: 'children',
        label: 'psName'
      },
      treePermissionList: [],
      expandedKey: []
    }
  },
  methods: {
    async getRoleList () {
      const { data: response } = await this.$http.get('role/getRoleList')
      if (response.status === 200) {
        this.loading = false
        this.roleList = response.data
      }
    },
    async removeRight (roleId, rightId, level) {
      const { data: response } = await this.$http.get('permission/removeRight/roleId/' + roleId + '/rightId/' + rightId + '/level/' + level)
      if (response.status === 200) {
        response.data.forEach(role => {
          // eslint-disable-next-line eqeqeq
          if (roleId == role.roleId) {
            this.roleList.forEach(list => {
              list.permissions = role.permissions
            })
          }
        })
      }
    },
    async distributionRight (roleId) {
      this.distributionRightDialog = true
      this.expandedKey = []
      const { data: response } = await this.$http.get('permission/getTreePermissionList')
      if (response.status === 200) {
        this.treePermissionList = response.data
        this.roleList.forEach(role => {
          if (roleId === role.roleId) {
            role.permissions.forEach(first => {
              first.children.forEach(second => {
                second.children.forEach(third => {
                  this.expandedKey.push(third.psId)
                })
              })
            })
          }
        })
      }
    }
  },
  created () {
    this.getRoleList()
  }
}
</script>

<style scoped>
  .top-border {
    border-top: 1px solid #eeeeee;
  }

  .bottom-border {
    border-bottom: 1px solid #eeeeee;
  }

  .el-tag {
    margin: 10px;
  }

  .el-row {
    display: flex;
    align-items: center;
  }
</style>
