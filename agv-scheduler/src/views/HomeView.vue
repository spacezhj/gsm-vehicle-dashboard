<template>
  <div class="home-view">
    <el-header class="header">
      <h1>无人牵引车调度系统 - 阶段一：单车选点发车</h1>
      <el-menu mode="horizontal" :default-active="activeMenu" class="menu">
        <el-menu-item index="1" @click="$router.push('/')">单车调度</el-menu-item>
        <el-menu-item index="2" disabled>云端派单</el-menu-item>
        <el-menu-item index="3" disabled>多车调度</el-menu-item>
      </el-menu>
    </el-header>

    <el-main class="main-content">
      <el-row :gutter="20">
        <!-- 左侧控制面板 -->
        <el-col :span="6">
          <el-card class="control-panel">
            <template #header>
              <span>操作面板</span>
            </template>
            
            <!-- 选择车辆 -->
            <el-form label-position="top">
              <el-form-item label="选择车辆">
                <el-select 
                  v-model="selectedAgvId" 
                  placeholder="请选择车辆"
                  style="width: 100%"
                  @change="onAgvSelect"
                >
                  <el-option
                    v-for="agv in agvStore.agvs"
                    :key="agv.id"
                    :label="`${agv.name} (电量：${agv.battery}%)`"
                    :value="agv.id"
                  />
                </el-select>
              </el-form-item>
              
              <!-- 选择目标点 -->
              <el-form-item label="选择目标点">
                <el-select 
                  v-model="selectedTargetId" 
                  placeholder="请选择目标点"
                  style="width: 100%"
                  @change="onTargetSelect"
                >
                  <el-option
                    v-for="point in agvStore.taskPoints"
                    :key="point.id"
                    :label="`${point.name} (${point.type === 'pickup' ? '取货' : point.type === 'dropoff' ? '卸货' : '充电'})`"
                    :value="point.id"
                  />
                </el-select>
              </el-form-item>
              
              <!-- 操作按钮 -->
              <el-form-item>
                <el-button 
                  type="primary" 
                  :loading="isDispatching"
                  :disabled="!selectedAgvId || !selectedTargetId"
                  @click="handleDispatch"
                  style="width: 100%"
                >
                  {{ isDispatching ? '发车中...' : '执行发车' }}
                </el-button>
              </el-form-item>
              
              <el-form-item>
                <el-button @click="handleReset" style="width: 100%">
                  重置选择
                </el-button>
              </el-form-item>
            </el-form>
            
            <!-- 状态信息 -->
            <el-divider>状态信息</el-divider>
            <el-descriptions :column="1" size="small">
              <el-descriptions-item label="选中车辆">
                {{ selectedAgvName || '未选择' }}
              </el-descriptions-item>
              <el-descriptions-item label="目标点">
                {{ selectedTargetName || '未选择' }}
              </el-descriptions-item>
              <el-descriptions-item label="车辆状态">
                <el-tag :type="getStatusType(currentAgvStatus)">
                  {{ getStatusText(currentAgvStatus) }}
                </el-tag>
              </el-descriptions-item>
            </el-descriptions>
          </el-card>
          
          <!-- 图例说明 -->
          <el-card class="legend-panel" style="margin-top: 20px">
            <template #header>
              <span>图例说明</span>
            </template>
            <div class="legend-item">
              <span class="legend-dot pickup"></span> 取货点
            </div>
            <div class="legend-item">
              <span class="legend-dot dropoff"></span> 卸货点
            </div>
            <div class="legend-item">
              <span class="legend-dot charge"></span> 充电站
            </div>
            <div class="legend-item">
              <span class="legend-dot agv"></span> AGV 车辆
            </div>
            <div class="legend-item">
              <span class="legend-line"></span> 行驶路径
            </div>
          </el-card>
        </el-col>
        
        <!-- 右侧画布区域 -->
        <el-col :span="18">
          <el-card class="canvas-card">
            <template #header>
              <span>监控画布</span>
            </template>
            <AGVCanvas />
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAGVStore } from '@/stores/agvStore'
import AGVCanvas from '@/components/AGVCanvas.vue'

const agvStore = useAGVStore()
const activeMenu = ref('1')
const isDispatching = ref(false)

const selectedAgvId = computed({
  get: () => agvStore.selectedAgvId,
  set: (val) => val && agvStore.selectAgv(val)
})

const selectedTargetId = computed({
  get: () => agvStore.selectedTargetPointId,
  set: (val) => val && agvStore.selectTargetPoint(val)
})

const selectedAgvName = computed(() => {
  return agvStore.selectedAgv?.name || ''
})

const selectedTargetName = computed(() => {
  return agvStore.selectedTargetPoint?.name || ''
})

const currentAgvStatus = computed(() => {
  return agvStore.selectedAgv?.status || 'idle'
})

// 选择车辆
function onAgvSelect() {
  // 自动触发 watch
}

// 选择目标点
function onTargetSelect() {
  // 自动触发 watch
}

// 执行发车
async function handleDispatch() {
  if (!selectedAgvId.value || !selectedTargetId.value) return
  
  isDispatching.value = true
  
  try {
    await agvStore.dispatchAgv(selectedAgvId.value, selectedTargetId.value)
  } finally {
    isDispatching.value = false
  }
}

// 重置选择
function handleReset() {
  agvStore.resetSelection()
}

// 获取状态类型
function getStatusType(status: string) {
  const types: Record<string, any> = {
    idle: 'success',
    moving: 'primary',
    working: 'warning',
    error: 'danger'
  }
  return types[status] || 'info'
}

// 获取状态文本
function getStatusText(status: string) {
  const texts: Record<string, string> = {
    idle: '空闲',
    moving: '移动中',
    working: '作业中',
    error: '故障'
  }
  return texts[status] || '未知'
}
</script>

<style scoped>
.home-view {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.header {
  background-color: #409EFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.header h1 {
  color: #fff;
  font-size: 24px;
  margin: 0;
}

.menu {
  background-color: transparent;
  border: none;
}

.menu .el-menu-item {
  color: #fff;
}

.menu .el-menu-item:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}

.control-panel,
.legend-panel,
.canvas-card {
  margin-bottom: 0;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  font-size: 14px;
}

.legend-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 10px;
  display: inline-block;
}

.legend-dot.pickup {
  background-color: #409EFF;
}

.legend-dot.dropoff {
  background-color: #67C23A;
}

.legend-dot.charge {
  background-color: #E6A23C;
}

.legend-dot.agv {
  background-color: #909399;
}

.legend-line {
  width: 30px;
  height: 3px;
  background-color: #F56C6C;
  margin-right: 10px;
  display: inline-block;
}
</style>
