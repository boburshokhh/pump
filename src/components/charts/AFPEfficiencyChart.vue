<template>
  <n-card size="small" :bordered="false" class="chart-card">
    <div class="chart-header">
      <span class="chart-title">График эффективности АФП</span>
      <div class="chart-controls">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              circle
              size="small"
              @click="resetZoom"
              type="info"
              class="mr-2"
            >
              <template #icon>
                <n-icon><RefreshOutline /></n-icon>
              </template>
            </n-button>
          </template>
          Сбросить масштаб
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              circle
              size="small"
              @click="downloadChart"
              type="success"
            >
              <template #icon>
                <n-icon><DownloadOutline /></n-icon>
              </template>
            </n-button>
          </template>
          Скачать график
        </n-tooltip>
      </div>
    </div>

    <div class="chart-container">
      <Line
        ref="chartRef"
        :data="chartData"
        :options="chartOptions"
        class="chart"
      />
      <div class="chart-tooltip" v-if="showTooltip">
        <div class="tooltip-content">
          <div class="tooltip-row">
            <span class="tooltip-label">Концентрация:</span>
            <span class="tooltip-value">{{ afpData.concentration.toFixed(1) }} ppm</span>
          </div>
          <div class="tooltip-row">
            <span class="tooltip-label">Эффективность:</span>
            <span class="tooltip-value">{{ calculateEfficiency(afpData.concentration) }}%</span>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script setup>
import { ref, computed } from 'vue'
import { NCard, NButton, NTooltip, NIcon } from 'naive-ui'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { RefreshOutline, DownloadOutline } from '@vicons/ionicons5'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
)

const props = defineProps({
  afpData: {
    type: Object,
    required: true
  }
})

const showTooltip = ref(true)
const chartRef = ref(null)

function calculateEfficiency(concentration) {
  return Math.round(Math.pow(concentration, 0.5) * 100) / 10
}

const chartData = computed(() => {
  const points = Array.from({ length: 301 }, (_, i) => i * 0.1) // 0 to 30 с шагом 0.1
  
  return {
    labels: points,
    datasets: [
      {
        label: 'Эффективность АФП',
        data: points.map(x => calculateEfficiency(x)),
        borderColor: '#22c55e',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2
      },
      {
        label: 'Текущая точка',
        data: [{
          x: props.afpData.concentration,
          y: calculateEfficiency(props.afpData.concentration)
        }],
        borderColor: '#1890ff',
        backgroundColor: '#fff',
        pointRadius: 6,
        pointBorderWidth: 2,
        pointHoverRadius: 8,
        showLine: false
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'nearest',
    intersect: false
  },
  plugins: {
    zoom: {
      zoom: {
        wheel: {
          enabled: true,
          modifierKey: 'ctrl'
        },
        pinch: {
          enabled: true
        },
        mode: 'xy',
        drag: {
          enabled: true,
          backgroundColor: 'rgba(34, 197, 94, 0.1)',
          borderColor: 'rgba(34, 197, 94, 0.4)'
        }
      },
      pan: {
        enabled: true,
        mode: 'xy'
      }
    },
    legend: {
      display: false
    },
    tooltip: {
      enabled: true,
      backgroundColor: '#fff',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (items) => `Концентрация: ${Number(items[0].parsed.x).toFixed(1)} ppm`,
        label: (item) => `Эффективность: ${item.parsed.y.toFixed(1)}%`
      }
    }
  },
  scales: {
    x: {
      type: 'linear',
      title: {
        display: true,
        text: 'Концентрация АФП, ppm',
        color: '#666',
        font: {
          size: 12,
          weight: 'bold'
        }
      },
      min: 0,
      max: 30,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        drawBorder: false,
        lineWidth: 0.5
      },
      ticks: {
        color: '#666',
        font: {
          size: 11
        },
        stepSize: 5
      }
    },
    y: {
      title: {
        display: true,
        text: 'Эффективность, %',
        color: '#666',
        font: {
          size: 12,
          weight: 'bold'
        }
      },
      min: 0,
      max: 60,
      grid: {
        color: 'rgba(0, 0, 0, 0.1)',
        drawBorder: false,
        lineWidth: 0.5
      },
      ticks: {
        color: '#666',
        font: {
          size: 11
        },
        stepSize: 10
      }
    }
  }
}

const resetZoom = () => {
  if (chartRef.value) {
    chartRef.value.chart.resetZoom()
  }
}

const downloadChart = () => {
  if (chartRef.value) {
    const link = document.createElement('a')
    link.download = 'эффективность-афп.png'
    link.href = chartRef.value.chart.toBase64Image()
    link.click()
  }
}
</script>

<style scoped>
.chart-card {
  background: #fff;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-title {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.chart-controls {
  display: flex;
  gap: 8px;
}

.chart-container {
  position: relative;
  height: 400px;
  width: 100%;
  background: rgba(34, 197, 94, 0.05);
  border-radius: 4px;
  padding: 16px;
}

.chart {
  height: 100%;
  width: 100%;
}

.chart-tooltip {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.98);
  padding: 12px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.2);
  z-index: 10;
}

.tooltip-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tooltip-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.tooltip-label {
  color: #666;
  font-size: 12px;
}

.tooltip-value {
  color: #22c55e;
  font-weight: 500;
  font-size: 12px;
}

.mr-2 {
  margin-right: 8px;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px;
    padding: 12px;
  }
  
  .chart-tooltip {
    position: relative;
    top: -8px;
    right: 0;
    margin: 0 12px;
  }
}
</style> 