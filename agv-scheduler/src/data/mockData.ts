// 静态模拟数据 - AGV车辆信息
export interface AGV {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  status: 'idle' | 'moving' | 'working' | 'error';
  battery: number;
  currentTask?: string;
}

export const mockAGVs: AGV[] = [
  {
    id: 'agv-001',
    name: '牵引车 001',
    x: 100,
    y: 100,
    z: 0,
    status: 'idle',
    battery: 95
  },
  {
    id: 'agv-002',
    name: '牵引车 002',
    x: 300,
    y: 200,
    z: 0,
    status: 'idle',
    battery: 88
  },
  {
    id: 'agv-003',
    name: '牵引车 003',
    x: 500,
    y: 150,
    z: 0,
    status: 'idle',
    battery: 72
  }
];

// 静态模拟数据 - 任务点
export interface TaskPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  type: 'pickup' | 'dropoff' | 'charge';
}

export const mockTaskPoints: TaskPoint[] = [
  { id: 'tp-001', name: '取货点 A', x: 150, y: 300, z: 0, type: 'pickup' },
  { id: 'tp-002', name: '卸货点 B', x: 400, y: 350, z: 0, type: 'dropoff' },
  { id: 'tp-003', name: '充电站 C', x: 600, y: 100, z: 0, type: 'charge' },
  { id: 'tp-004', name: '取货点 D', x: 200, y: 450, z: 0, type: 'pickup' },
  { id: 'tp-005', name: '卸货点 E', x: 550, y: 400, z: 0, type: 'dropoff' }
];

// 静态模拟数据 - 任务
export interface Task {
  id: string;
  name: string;
  fromPointId: string;
  toPointId: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed';
  assignedAgvId?: string;
  createdAt: string;
}

export const mockTasks: Task[] = [
  {
    id: 'task-001',
    name: '运输任务 001',
    fromPointId: 'tp-001',
    toPointId: 'tp-002',
    status: 'pending',
    createdAt: new Date().toISOString()
  }
];

// 路径点类型
export interface PathPoint {
  x: number;
  y: number;
}
