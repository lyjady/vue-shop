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
          <el-menu style="width: 200px" class="el-menu-vertical-demo" background-color="#333744" text-color="#fff" active-text-color="#409EFF">
            <el-submenu :index="menu.psId + ''" v-for="menu in menuList" :key="menu.psId">
              <template slot="title">
                <i :class="iconObj[menu.psId]"></i>
                <span>{{ menu.psName }}</span>
              </template>
              <el-menu-item :index="item.psId + ''" v-for="item in menu.subMenuList" :key="item.psId">
                <template>
                  <i class="el-icon-menu"></i>
                  <span>{{ item.psName }}</span>
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
  data () {
    return {
      menuList: [],
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      }
    }
  },
  methods: {
    logout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenuList () {
      this.$http.get('getMenuList').then(response => {
        if (response.status === 200) {
          this.menuList = response.data.data
        }
        console.log(this.menuList.subMenuList)
      })
    }
  },
  created () {
    this.getMenuList()
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

  .iconfont {
    margin-right: 10px;
  }
</style>
