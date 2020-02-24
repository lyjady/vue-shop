<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <div id="chart" style="width: 600px;height: 400px"></div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  name: '',
  mounted () {
    const chart = echarts.init(document.getElementById('chart'))
    const option = {
      title: {
        text: 'ECharts 入门示例'
      },
      type: 'pie',
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }
    chart.setOption(option)
  }
}
</script>

<style scoped>

</style>
