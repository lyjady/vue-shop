<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-table :data="permissionList" border stripe v-loading="loading">
          <el-table-column label="#" type="index"/>
          <el-table-column label="权限名称" prop="psName"/>
          <el-table-column label="路径">
            <template v-slot="scope">
              {{ scope.row.permissionApi.psApiPath }}
            </template>
          </el-table-column>
          <el-table-column label="权限等级">
            <template v-slot="scope">
              <el-tag v-if="scope.row.psLevel === '0'" type="primary">一级</el-tag>
              <el-tag v-else-if="scope.row.psLevel === '1'" type="success">二级</el-tag>
              <el-tag v-else type="warning">三级</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
    </div>
</template>

<script>
export default {
  data () {
    return {
      permissionList: [],
      loading: true
    }
  },
  methods: {
    async getPermissionList () {
      const { data: response } = await this.$http.get('permission/getPermissionList')
      if (response.status === 200) {
        this.loading = false
        this.permissionList = response.data
      }
    }
  },
  created () {
    this.getPermissionList()
  }
}
</script>

<style scoped>

</style>
