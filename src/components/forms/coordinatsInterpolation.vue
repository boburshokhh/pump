<template>
  <n-modal
    v-model:show="show"
    preset="card"
    :style="{ 
      width: '90vw',
      maxWidth: '1100px',
      height: 'auto',
      maxHeight: '90vh',
      overflow: 'auto'
    }"
  >
    <template #header>
      <div class="header">
        <n-icon size="24" class="mr-2" color="#2080f0">
          <MapOutline />
        </n-icon>
        <span>Высотные отметки</span>
      </div>
    </template>

    <div class="content">
      <div class="scrollable-content">
        <!-- Form Section -->
        <div class="form-container">
          <div class="form-header">
            <div class="section-header">Участок (км)</div>
            <div class="height-header">Высота (м)</div>
            <div class="action-header"></div>
          </div>
          <div v-for="(row, index) in sortedData" :key="index" class="form-row">
            <n-input-number
              v-model:value="row.section"
              :min="0"
              :step="5"
              placeholder="Участок (км)"
              class="input-field"
              :status="row.section === null ? 'warning' : undefined"
              @update:value="validateForm"
            />
            <n-input-number
              v-model:value="row.height"
              :min="0"
              :step="5"
              placeholder="Высота (м)"
              class="input-field"
              :status="row.height === null ? 'warning' : undefined"
              @update:value="validateForm"
            />
            <n-button
              circle
              type="error"
              secondary
              size="small"
              @click="confirmRemoveRow(index)"
              class="delete-btn"
            >
              <template #icon>
                <n-icon><TrashOutline /></n-icon>
              </template>
            </n-button>
          </div>

          <n-alert
            v-if="formData.length >= maxRows"
            type="warning"
            class="mt-4"
          >
            Достигнуто максимальное количество строк ({{ maxRows }})
          </n-alert>
        </div>

        <!-- Chart Section -->
        <div class="chart-container">
          <div class="chart-header">
            <span class="chart-title">График высотных отметок</span>
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
          <div class="chart-legend">
            <div class="legend-item">
              <div class="legend-color height-color"></div>
              <span>Высотные отметки трубы</span>
            </div>
          </div>
          <Line
            ref="chartRef"
            :data="chartData"
            :options="chartOptions"
            class="height-chart"
          />
        </div>
      </div>

      <!-- Fixed Action Buttons -->
      <div class="fixed-actions">
        <div class="left-actions">
          <n-button
            type="primary"
            secondary
            @click="addRow"
            :disabled="formData.length >= maxRows"
          >
            <template #icon>
              <n-icon><AddCircleOutline /></n-icon>
            </template>
            Добавить строку
          </n-button>
          <n-button
            type="default"
            secondary
            @click="toggleSort"
            class="ml-2"
          >
            <template #icon>
              <n-icon>
                <component :is="sortAscending ? ArrowUpOutline : ArrowDownOutline" />
              </n-icon>
            </template>
            Сортировка
          </n-button>
        </div>
        <div class="right-actions">
          <n-button
            type="warning"
            secondary
            class="mr-2"
            @click="saveToStorage"
          >
            <template #icon>
              <n-icon><SaveOutline /></n-icon>
            </template>
            Сохранить
          </n-button>
          <n-button
            type="primary"
            :disabled="!isFormValid"
            @click="submitForm"
          >
            <template #icon>
              <n-icon><CheckmarkCircleOutline /></n-icon>
            </template>
            Применить
          </n-button>
        </div>
      </div>
    </div>
  </n-modal>

  <!-- Delete Confirmation Dialog -->
  <n-modal v-model:show="dialogVisible" preset="dialog">
    <template #header>
      <div class="header">
        <n-icon size="24" class="mr-2" color="#f0a020">
          <AlertCircleOutline />
        </n-icon>
        <span>Подтверждение удаления</span>
      </div>
    </template>
    <span>Вы уверены, что хотите удалить эту строку?</span>
    <template #action>
      <n-button type="default" @click="dialogVisible = false">
        Отмена
      </n-button>
      <n-button type="error" class="ml-2" @click="handleConfirmDelete">
        Удалить
      </n-button>
    </template>
  </n-modal>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { Line } from 'vue-chartjs'
import { 
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { 
  MapOutline, 
  AddCircleOutline, 
  SaveOutline, 
  CheckmarkCircleOutline,
  AlertCircleOutline,
  TrashOutline,
  ArrowUpOutline,
  ArrowDownOutline,
  RefreshOutline,
  DownloadOutline
} from '@vicons/ionicons5'

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
  modelValue: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:modelValue', 'save'])
const message = useMessage()

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formData = ref([
  { section: 0, height: 100 },
  { section: 5, height: 50 },
  { section: 10, height: 300 }
])

const maxRows = 10
const dialogVisible = ref(false)
const indexToDelete = ref(null)
const sortAscending = ref(true)
const isFormValid = ref(true)

// Sorting logic
const sortedData = computed(() => {
  return [...formData.value].sort((a, b) => a.section - b.section)
})

// Chart data
const chartRef = ref(null)
const chartData = computed(() => ({
  labels: sortedData.value.map(item => `${item.section} км`),
  datasets: [{
    label: 'Высота (м)',
    data: sortedData.value.map(item => item.height),
    borderColor: '#ff6b6b',
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderWidth: 2,
    tension: 0.4,
    fill: true,
    pointBackgroundColor: '#ff6b6b',
    pointBorderColor: '#fff',
    pointBorderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6
  }]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
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
          backgroundColor: 'rgba(32, 128, 240, 0.1)',
          borderColor: 'rgba(32, 128, 240, 0.4)'
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
      position: 'nearest',
      backgroundColor: '#fff',
      titleColor: '#333',
      bodyColor: '#666',
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      titleFont: {
        size: 13,
        weight: 'bold'
      },
      bodyFont: {
        size: 12
      },
      callbacks: {
        title: (tooltipItems) => {
          return `Участок: ${tooltipItems[0].label}`;
        },
        label: (context) => {
          return `Высота: ${context.parsed.y} м`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Высота (м)',
        font: {
          size: 12,
          weight: 'bold'
        }
      },
      grid: {
        color: '#f0f0f0'
      }
    },
    x: {
      title: {
        display: true,
        text: 'Расстояние (км)',
        font: {
          size: 12,
          weight: 'bold'
        }
      },
      grid: {
        color: '#f0f0f0'
      }
    }
  }
}

// Form methods
const toggleSort = () => {
  sortAscending.value = !sortAscending.value
}

const validateForm = () => {
  isFormValid.value = !formData.value.some(row => 
    row.section === null || 
    row.height === null || 
    row.section === '' || 
    row.height === ''
  )
}

const getNextSectionValue = () => {
  if (formData.value.length === 0) return 0
  const lastSection = Math.max(...formData.value.map(item => item.section || 0))
  return lastSection + 5 // Увеличиваем на 5 км
}

const addRow = () => {
  if (formData.value.length < maxRows) {
    const nextSection = getNextSectionValue()
    formData.value.push({
      section: nextSection,
      height: null
    })
  }
}

const confirmRemoveRow = (index) => {
  indexToDelete.value = index
  dialogVisible.value = true
}

const handleConfirmDelete = () => {
  if (indexToDelete.value !== null) {
    formData.value.splice(indexToDelete.value, 1)
    message.success('Строка удалена')
    dialogVisible.value = false
    indexToDelete.value = null
    validateForm()
  }
}

// Storage methods
const saveToStorage = () => {
  try {
    localStorage.setItem('heightData', JSON.stringify(formData.value))
    message.success('Данные успешно сохранены')
  } catch (error) {
    message.error('Ошибка при сохранении данных')
  }
}

const loadFromStorage = () => {
  try {
    const saved = localStorage.getItem('heightData')
    if (saved) {
      formData.value = JSON.parse(saved)
      validateForm()
      message.success('Данные успешно загружены')
    }
  } catch (error) {
    message.error('Ошибка при загрузке данных')
  }
}

const submitForm = () => {
  if (!isFormValid.value) {
    message.error('Пожалуйста, заполните все поля')
    return
  }
  
  emit('save', formData.value)
  show.value = false
  message.success('Форма успешно отправлена')
}

// New functions
const resetZoom = () => {
  if (chartRef.value) {
    chartRef.value.chart.resetZoom()
  }
}

const downloadChart = () => {
  if (chartRef.value) {
    const link = document.createElement('a')
    link.download = 'высотные-отметки.png'
    link.href = chartRef.value.chart.toBase64Image()
    link.click()
  }
}

onMounted(() => {
  loadFromStorage()
})
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.content {
  display: flex;
  flex-direction: column;
  height: calc(90vh - 120px); /* Учитываем высоту заголовка и отступы */
  position: relative;
}

.scrollable-content {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px; /* Место для фиксированных кнопок */
}

.fixed-actions {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  z-index: 1;
}

.form-container {
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.form-header {
  display: flex;
  gap: 12px;
  padding: 0 8px;
  margin-bottom: 8px;
  font-weight: 500;
  color: #606266;
}

.section-header,
.height-header {
  flex: 1;
}

.action-header {
  width: 32px;
}

.form-row {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.form-row:hover {
  background-color: #f9f9f9;
}

.input-field {
  flex: 1;
}

.chart-container {
  height: 400px;
  margin: 0;
  padding: 16px;
  background: white;
  border: 1px solid #eee;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
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

.chart-legend {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.height-color {
  background-color: rgba(255, 107, 107, 0.2);
  border: 2px solid #ff6b6b;
}

.height-chart {
  flex: 1;
  min-height: 0;
}

.left-actions,
.right-actions {
  display: flex;
  gap: 8px;
}

@media (max-width: 600px) {
  .fixed-actions {
    flex-direction: column;
    gap: 8px;
    padding: 8px;
  }

  .left-actions,
  .right-actions {
    width: 100%;
    justify-content: center;
  }

  .content {
    height: calc(90vh - 80px);
  }

  .scrollable-content {
    padding-bottom: 120px; /* Больше места для кнопок на мобильных */
  }
}

.mr-2 {
  margin-right: 8px;
}

.ml-2 {
  margin-left: 8px;
}

.mt-4 {
  margin-top: 16px;
}
</style>