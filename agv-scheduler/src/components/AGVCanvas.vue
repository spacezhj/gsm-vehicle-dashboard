<template>
  <div class="canvas-container">
    <canvas ref="canvasRef" width="800" height="600"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useAGVStore } from '@/stores/agvStore'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const agvStore = useAGVStore()

// 绘制画布
function drawCanvas() {
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  
  // 绘制背景网格
  drawGrid(ctx, canvas.width, canvas.height)
  
  // 绘制任务点
  drawTaskPoints(ctx)
  
  // 绘制路径
  drawPath(ctx)
  
  // 绘制 AGV 车辆
  drawAGVs(ctx)
}

// 绘制网格
function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.strokeStyle = '#e0e0e0'
  ctx.lineWidth = 1
  
  // 垂直线
  for (let x = 0; x <= width; x += 50) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
    ctx.stroke()
  }
  
  // 水平线
  for (let y = 0; y <= height; y += 50) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
    ctx.stroke()
  }
}

// 绘制任务点
function drawTaskPoints(ctx: CanvasRenderingContext2D) {
  agvStore.taskPoints.forEach(point => {
    // 绘制圆形
    ctx.beginPath()
    ctx.arc(point.x, point.y, 15, 0, Math.PI * 2)
    
    // 根据类型设置颜色
    switch (point.type) {
      case 'pickup':
        ctx.fillStyle = '#409EFF'
        break
      case 'dropoff':
        ctx.fillStyle = '#67C23A'
        break
      case 'charge':
        ctx.fillStyle = '#E6A23C'
        break
    }
    
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 绘制文字
    ctx.fillStyle = '#fff'
    ctx.font = '12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(point.name, point.x, point.y)
  })
}

// 绘制路径
function drawPath(ctx: CanvasRenderingContext2D) {
  if (agvStore.currentPath.length === 0) return
  
  ctx.beginPath()
  ctx.strokeStyle = '#F56C6C'
  ctx.lineWidth = 3
  ctx.setLineDash([5, 5])
  
  const path = agvStore.currentPath
  ctx.moveTo(path[0].x, path[0].y)
  
  for (let i = 1; i < path.length; i++) {
    ctx.lineTo(path[i].x, path[i].y)
  }
  
  ctx.stroke()
  ctx.setLineDash([])
}

// 绘制 AGV 车辆
function drawAGVs(ctx: CanvasRenderingContext2D) {
  agvStore.agvs.forEach(agv => {
    const isSelected = agv.id === agvStore.selectedAgvId
    
    // 绘制车辆矩形
    ctx.fillStyle = isSelected ? '#E6A23C' : '#909399'
    ctx.fillRect(agv.x - 20, agv.y - 15, 40, 30)
    
    // 边框
    ctx.strokeStyle = isSelected ? '#F56C6C' : '#606266'
    ctx.lineWidth = isSelected ? 3 : 2
    ctx.strokeRect(agv.x - 20, agv.y - 15, 40, 30)
    
    // 绘制车辆名称
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 12px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(agv.name, agv.x, agv.y)
    
    // 绘制状态指示器
    const statusColors = {
      idle: '#67C23A',
      moving: '#409EFF',
      working: '#E6A23C',
      error: '#F56C6C'
    }
    
    ctx.beginPath()
    ctx.arc(agv.x + 25, agv.y - 20, 8, 0, Math.PI * 2)
    ctx.fillStyle = statusColors[agv.status]
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 2
    ctx.stroke()
    
    // 绘制电量
    ctx.fillStyle = agv.battery > 30 ? '#67C23A' : '#F56C6C'
    ctx.font = '10px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(`${agv.battery}%`, agv.x, agv.y + 25)
  })
}

// 监听状态变化，重新绘制
watch([() => agvStore.agvs, () => agvStore.currentPath, () => agvStore.selectedAgvId], drawCanvas, { deep: true })

onMounted(() => {
  drawCanvas()
})
</script>

<style scoped>
.canvas-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 20px;
}

canvas {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
