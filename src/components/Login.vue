<template>
  <div class="login-container">
    <div class="login-box">
      <div class="avatar-box">
        <!-- 登录图片 -->
        <img src="../assets/logo.png">
      </div>
      <!-- 登录表单区域 -->
      <el-form class="login-form" ref="loginForm" :rules="rules" :model="loginForm" label-width="0px">
        <!-- 用户名 -->
        <el-form-item>
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user"/>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima"/>
        </el-form-item>
        <!-- 按钮 -->
        <el-form class="login-btn">
          <el-button type="primary" round @click="login">登录</el-button>
          <el-button type="info" round @click="reset">重置</el-button>
        </el-form>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在6到15个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.loginForm.resetFields()
    },
    login () {
      this.$refs.loginForm.validate(result => {
        if (result) {
          this.$http({
            url: 'http://127.0.0.1:8011/login',
            method: 'post',
            data: this.loginForm,
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(response => {
            if (response.status === 200) {
              this.$message({
                message: '登录成功',
                type: 'success'
              })
              window.sessionStorage.setItem('token', response.data.data.token)
              this.$router.push('/home')
            } else {
              this.error({
                message: '账号或者密码错误',
                type: 'error'
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container {
    background-color: #2b4b6b;
    height: 100%;
  }

  .login-box {
    width: 470px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    padding-top: 10px;
    padding-bottom: 10px;
    .avatar-box {
      height: 130px;
      width: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #dddddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #ffffff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }

  .login-form {
    position: absolute;
    bottom: 10%;
    width: 80%;
    left: 50%;
    transform: translate(-50%);
  }

  .login-btn {
    display: flex;
    justify-content: flex-end;
  }
</style>
