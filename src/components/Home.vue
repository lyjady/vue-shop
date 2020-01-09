<template>
    <el-container class="home-container">
      <el-header>
        <div class="header-left">
          <img src="../assets/heima.png">
          <span>电商后台管理系统</span>
        </div>
        <el-button type="info" round @click="logout">退出</el-button>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu style="width: 200px" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item index="1-1">
                <template>
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
              </el-menu-item>
              <el-menu-item index="1-2">
                <template>
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
              <el-menu-item index="2-1">
                <template>
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
              </el-menu-item>
              <el-menu-item index="2-2">
                <template>
                  <i class="el-icon-location"></i>
                  <span>导航一</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
</template>

<script>
export default {
  name: '',
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
  .home-container {
    height: 100%;
  }

  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #ffffff;
    font-size: 20px;
  }

  .header-left {
    display: flex;
    align-items: center;
  }

  .el-aside {
    background-color: #333744;
  }

  .el-main {
    background-color: #EAEDF1;
  }
</style>
