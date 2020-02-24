<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card class="box-card">
        <el-row>
          <el-col :span="6">
            <el-input v-model="queryInfo.orderNumber" placeholder="请输入要搜索的内容" clearable>
              <el-button slot="append" icon="el-icon-search"/>
            </el-input>
          </el-col>
        </el-row>
        <el-table :data="orderList" stripe border v-loading="loading">
          <el-table-column label="#" type="index"/>
          <el-table-column label="订单编号" prop="orderNumber"/>
          <el-table-column label="订单价格" prop="orderPrice"/>
          <el-table-column label="是否付款">
            <template v-slot="scope">
              <el-tag type="danger" v-if="scope.row.payStatus === '0'">未付款</el-tag>
              <el-tag type="success" v-else>已付款</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="是否发货" prop="isSend"/>
          <el-table-column label="下单时间">
            <template v-slot="scope">
              {{ scope.row.createTime * 1000 | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template>
              <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditAddress = true"/>
              <el-button type="success" size="mini" icon="el-icon-location" @click="showLogisticsInfo"/>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pageNumber" :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="count"/>
        <el-dialog title="修改地址" :visible.sync="showEditAddress">
          <el-form :model="editAddress" ref="editAddressRef" :rules="editAddressRule">
            <el-form-item label="省市区">
              <el-cascader :options="cityData"/>
            </el-form-item>
            <el-form-item label="详细地址" prop="detailAddress">
              <el-input v-model="editAddress.detailAddress"/>
            </el-form-item>
          </el-form>
          <div slot="footer">
            <el-button type="primary" @click="closeEditAddress">取消</el-button>
            <el-button type="primary" @click="showEditAddress = false">确定</el-button>
          </div>
        </el-dialog>
        <el-dialog title="物流信息" :visible.sync="showLogistics">
          <el-timeline>
            <el-timeline-item v-for="(activity, index) in logisticsInfo" :key="index" :timestamp="activity.deleteTime | dateFormat">
              {{ activity.cgnAddress }}
            </el-timeline-item>
          </el-timeline>
        </el-dialog>
      </el-card>
    </div>
</template>

<script>
import cityData from '../../assets/js/citydata.js'
export default {
  name: '',
  data () {
    return {
      orderList: [],
      count: 0,
      queryInfo: {
        pageNumber: 1,
        pageSize: 10,
        orderNumber: ''
      },
      loading: true,
      showEditAddress: false,
      editAddress: {
        detailAddress: '',
        pcd: ''
      },
      editAddressRule: {
        detailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityData,
      showLogistics: false,
      logisticsInfo: []
    }
  },
  methods: {
    async getOrderList () {
      const { data: response } = await this.$http({
        url: 'order/findAll',
        data: this.queryInfo,
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (response.status === 200) {
        this.orderList = response.data
        this.count = response.count
        this.loading = false
      } else {
        this.$message.error('获取数据失败')
      }
    },
    handleSizeChange (pageSize) {
      this.loading = true
      this.queryInfo.pageSize = pageSize
      this.getOrderList()
    },
    handleCurrentChange (pageNumber) {
      this.loading = true
      this.queryInfo.pageNumber = pageNumber
      this.getOrderList()
    },
    closeEditAddress () {
      this.showEditAddress = false
      this.$refs.editAddressRef.resetFields()
    },
    async showLogisticsInfo () {
      this.showLogistics = true
      const { data: response } = await this.$http.get('order/getLogistics')
      if (response.status === 200) {
        this.logisticsInfo = response.data
      }
    }
  },
  created () {
    this.getOrderList()
  }
}
</script>

<style scoped>
.el-cascader {
  width: 100%;
}
</style>
