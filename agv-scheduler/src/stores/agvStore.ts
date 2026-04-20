import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { AGV, TaskPoint, Task, PathPoint } from '@/data/mockData'
import { mockAGVs, mockTaskPoints, mockTasks } from '@/data/mockData'

export const useAGVStore = defineStore('agv', () => {
  // 状态
  const agvs = ref<AGV[]>([...mockAGVs])
  const taskPoints = ref<TaskPoint[]>([...mockTaskPoints])
  const tasks = ref<Task[]>([...mockTasks])
  
  // 选中的车辆
  const selectedAgvId = ref<string | null>(null)
  
  // 选中的目标点
  const selectedTargetPointId = ref<string | null>(null)
  
  // 当前路径
  const currentPath = ref<PathPoint[]>([])
  
  // 计算属性
  const selectedAgv = computed(() => {
    return agvs.value.find(agv => agv.id === selectedAgvId.value) || null
  })
  
  const selectedTargetPoint = computed(() => {
    return taskPoints.value.find(tp => tp.id === selectedTargetPointId.value) || null
  })
  
  // 方法：选择车辆
  function selectAgv(id: string) {
    selectedAgvId.value = id
  }
  
  // 方法：选择目标点
  function selectTargetPoint(id: string) {
    selectedTargetPointId.value = id
  }
  
  // 方法：生成路径（简单的直线插值）
  function generatePath(startX: number, startY: number, endX: number, endY: number): PathPoint[] {
    const points: PathPoint[] = []
    const steps = 50 // 路径点数
    
    for (let i = 0; i <= steps; i++) {
      const ratio = i / steps
      points.push({
        x: startX + (endX - startX) * ratio,
        y: startY + (endY - startY) * ratio
      })
    }
    
    return points
  }
  
  // 方法：执行发车（模拟移动）
  async function dispatchAgv(agvId: string, targetPointId: string) {
    const agv = agvs.value.find(a => a.id === agvId)
    const target = taskPoints.value.find(tp => tp.id === targetPointId)
    
    if (!agv || !target) return false
    
    // 生成路径
    currentPath.value = generatePath(agv.x, agv.y, target.x, target.y)
    
    // 更新车辆状态
    agv.status = 'moving'
    agv.currentTask = `前往 ${target.name}`
    
    // 模拟移动过程
    for (let i = 0; i < currentPath.value.length; i++) {
      agv.x = currentPath.value[i].x
      agv.y = currentPath.value[i].y
      await new Promise(resolve => setTimeout(resolve, 50)) // 50ms 每帧
    }
    
    // 到达目的地
    agv.status = 'idle'
    agv.currentTask = undefined
    
    return true
  }
  
  // 方法：重置选择
  function resetSelection() {
    selectedAgvId.value = null
    selectedTargetPointId.value = null
    currentPath.value = []
  }
  
  return {
    agvs,
    taskPoints,
    tasks,
    selectedAgvId,
    selectedTargetPointId,
    currentPath,
    selectedAgv,
    selectedTargetPoint,
    selectAgv,
    selectTargetPoint,
    generatePath,
    dispatchAgv,
    resetSelection
  }
})
