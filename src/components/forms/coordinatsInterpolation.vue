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
        <!-- Warnings Section -->
        <div v-if="profileWarnings.length > 0" class="warnings-container">
          <n-alert
            v-for="(warning, index) in profileWarnings"
            :key="index"
            :type="warning.type"
            :title="warning.type === 'error' ? 'Ошибка' : 'Предупреждение'"
            closable
            class="mb-4"
          >
            {{ warning.message }}
          </n-alert>
        </div>

        <!-- Profile Analysis -->
        <n-card v-if="profileAnalysis" class="mb-4" size="small">
          <n-grid :cols="4" :x-gap="12">
            <n-grid-item>
              <div class="analysis-item">
                <div class="label">Общая длина</div>
                <div class="value">{{ profileAnalysis.totalDistance.toFixed(1) }} км</div>
              </div>
            </n-grid-item>
            <n-grid-item>
              <div class="analysis-item">
                <div class="label">Макс. высота</div>
                <div class="value">{{ profileAnalysis.maxHeight.toFixed(1) }} м</div>
              </div>
            </n-grid-item>
            <n-grid-item>
              <div class="analysis-item">
                <div class="label">Мин. высота</div>
                <div class="value">{{ profileAnalysis.minHeight.toFixed(1) }} м</div>
              </div>
            </n-grid-item>
            <n-grid-item>
              <div class="analysis-item">
                <div class="label">Макс. уклон</div>
                <div class="value">{{ (profileAnalysis.steepestGradient * 100).toFixed(1) }}%</div>
              </div>
            </n-grid-item>
          </n-grid>
        </n-card>

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
              @update:value="handleInputChange"
            />
            <n-input-number
              v-model:value="row.height"
              :min="0"
              :step="5"
              placeholder="Высота (м)"
              class="input-field"
              :status="row.height === null ? 'warning' : undefined"
              @update:value="handleInputChange"
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
          <n-button-group>
            <n-button
              secondary
              @click="undo"
              :disabled="!canUndo"
              class="history-btn"
            >
              <template #icon>
                <n-icon><ArrowUndoOutline /></n-icon>
              </template>
              Отменить
            </n-button>
            <n-button
              secondary
              @click="redo"
              :disabled="!canRedo"
              class="history-btn"
            >
              <template #icon>
                <n-icon><ArrowRedoOutline /></n-icon>
              </template>
              Повторить
            </n-button>
          </n-button-group>

          <n-button
            type="primary"
            secondary
            @click="addRow"
            :loading="coordinatesStore.isLoading"
            :disabled="!canAddNewPoint"
            class="ml-2"
          >
            <template #icon>
              <n-icon><AddCircleOutline /></n-icon>
            </template>
            Добавить точку
          </n-button>
        </div>
        <div class="right-actions">
          <n-button
            type="warning"
            secondary
            class="mr-2"
            @click="saveToStorage"
            :loading="isSaving"
          >
            <template #icon>
              <n-icon><SaveOutline /></n-icon>
            </template>
            Сохранить
          </n-button>
          <n-button
            type="primary"
            :disabled="!isFormValid || hasErrors"
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
import { ref, computed, onMounted, watch } from 'vue'
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
  DownloadOutline,
  ArrowUndoOutline,
  ArrowRedoOutline
} from '@vicons/ionicons5'
import { useCoordinatesStore } from '../../stores/coordinates'
import { useCalculationsStore } from '../../stores/calculations'
import { debounce } from 'lodash-es'
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
const coordinatesStore = useCoordinatesStore()
const calculationsStore = useCalculationsStore()

const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const formData = computed({
  get: () => coordinatesStore.coordinates,
  set: (value) => coordinatesStore.updateCoordinates(value)
})

const maxRows = 10
const dialogVisible = ref(false)
const indexToDelete = ref(null)
const sortAscending = ref(true)
const isFormValid = ref(true)

// Sorting logic
const sortedData = computed(() => formData.value)

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
const validateForm = () => {
  const totalPipelineLength = calculationsStore.pumpResults?.lengthPipeline?.reduce((sum, length) => sum + length, 0) || 0;
  
  const hasEmptyValues = formData.value.some(row => 
    row.section === null || row.section === undefined || 
    row.height === null || row.height === undefined
  );

  const exceedsTotalLength = formData.value.some(row => row.section > totalPipelineLength);
  const sortedPoints = [...formData.value].sort((a, b) => a.section - b.section);
  
  // Check if there's a point at section 0
  const hasZeroPoint = sortedPoints.some(point => point.section === 0);
  if (!hasZeroPoint) {
    message.error('Необходима точка в начале трубопровода (0 км)');
    isFormValid.value = false;
    return;
  }
  
  if (exceedsTotalLength) {
    message.error('Длина участка не может превышать общую длину трубопровода');
  }

  isFormValid.value = !hasEmptyValues && !exceedsTotalLength;
}

const getNextSectionValue = () => {
  if (formData.value.length === 0) return 0
  const lastSection = Math.max(...formData.value.map(item => item.section || 0))
  return lastSection + 5 // Увеличиваем на 5 км
}

const addRow = () => {
  const totalPipelineLength = calculationsStore.pumpResults?.lengthPipeline?.reduce((sum, length) => sum + length, 0) || 0;
  const sortedPoints = [...formData.value].sort((a, b) => a.section - b.section);
  
  // Если нет точек, добавляем в начало (0 км)
  if (sortedPoints.length === 0) {
    formData.value.push({
      section: 0,
      height: 150
    });
    validateForm();
    return;
  }

  // Проверяем, достигли ли мы конца трубопровода
  const lastPoint = sortedPoints[sortedPoints.length - 1];
  if (lastPoint.section >= totalPipelineLength) {
    message.warning('Достигнута полная длина трубопровода');
    return;
  }

  // Находим самый большой промежуток между точками
  let maxGap = { start: 0, end: 0, size: 0 };
  
  // Проверяем промежуток в начале, если первая точка не в 0
    if (sortedPoints[0].section > 0) {
    maxGap = { start: 0, end: sortedPoints[0].section, size: sortedPoints[0].section };
    }
    
  // Проверяем промежутки между точками
    for (let i = 0; i < sortedPoints.length - 1; i++) {
      const gap = sortedPoints[i + 1].section - sortedPoints[i].section;
    if (gap > maxGap.size) {
      maxGap = {
          start: sortedPoints[i].section,
        end: sortedPoints[i + 1].section,
        size: gap
      };
    }
  }

  // Проверяем промежуток в конце
  const endGap = totalPipelineLength - lastPoint.section;
  if (endGap > maxGap.size) {
    maxGap = {
      start: lastPoint.section,
      end: totalPipelineLength,
      size: endGap
    };
  }

  // Вычисляем позицию новой точки
  let newSection;
  if (maxGap.start === 0) {
    newSection = 0;
  } else if (maxGap.end === totalPipelineLength) {
    newSection = Math.min(maxGap.start + 5, totalPipelineLength);
  } else {
    newSection = maxGap.start + (maxGap.end - maxGap.start) / 2;
  }

  // Вычисляем высоту на основе ближайших точек
  let newHeight = 150;
      const nearestPoint = sortedPoints.reduce((nearest, point) => {
        const distance = Math.abs(point.section - newSection);
        return distance < Math.abs(nearest.section - newSection) ? point : nearest;
      }, sortedPoints[0]);
  newHeight = nearestPoint.height;

  // Добавляем новую точку
    formData.value.push({
      section: Math.round(newSection * 100) / 100,
    height: Math.round(newHeight)
    });
    validateForm();
}

const confirmRemoveRow = (index) => {
  indexToDelete.value = index
  dialogVisible.value = true
}

const handleConfirmDelete = () => {
  if (indexToDelete.value !== null) {
    const pointToDelete = formData.value[indexToDelete.value];
    if (pointToDelete.section === 0) {
      message.warning('Нельзя удалить начальную точку (0 км)');
      dialogVisible.value = false;
      indexToDelete.value = null;
      return;
    }
    
    formData.value.splice(indexToDelete.value, 1);
    message.success('Строка удалена');
    dialogVisible.value = false;
    indexToDelete.value = null;
    validateForm();
  }
}

// Storage methods
const isSaving = ref(false);

const saveToStorage = async () => {
  try {
    isSaving.value = true;
    
    // Sort before saving, preserve zero values
    const sortedFormData = [...formData.value]
      .filter(point => {
        return (point.section !== null && point.section !== undefined && 
                point.height !== null && point.height !== undefined);
      })
      .sort((a, b) => a.section - b.section);

    // Check if there's a point at section 0
    if (!sortedFormData.some(point => point.section === 0)) {
      message.error('Необходима точка в начале трубопровода (0 км)');
      return;
    }

    // Check if last point reaches total length
    const totalPipelineLength = calculationsStore.pumpResults?.lengthPipeline?.reduce((sum, length) => sum + length, 0) || 0;
    const lastPoint = sortedFormData[sortedFormData.length - 1];
    
    if (!lastPoint || lastPoint.section < totalPipelineLength) {
      message.error(`Последняя точка (${lastPoint?.section || 0}км) не достигает конца трубопровода (${totalPipelineLength}км)`);
      return;
    }

    formData.value = sortedFormData;
    localStorage.setItem('heightData', JSON.stringify(sortedFormData));
    message.success('Данные успешно сохранены');
  } catch (error) {
    message.error('Ошибка при сохранении данных: ' + error.message);
  } finally {
    isSaving.value = false;
  }
};

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
    message.error('Пожалуйста, проверьте введенные данные');
    return;
  }

  // Sort before submitting
  formData.value = [...formData.value].sort((a, b) => a.section - b.section);
  
  coordinatesStore.interpolatePoints();
  show.value = false;
  message.success('Форма успешно отправлена');
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

// Initialize default coordinates when component is mounted
onMounted(() => {
  if (calculationsStore.pumpResults && calculationsStore.pumpResults.lengthPipeline) {
    const totalLength = calculationsStore.pumpResults.lengthPipeline.reduce((sum, length) => sum + length, 0)
    if (formData.value.length === 0) {
      coordinatesStore.initializeDefaultCoordinates(totalLength)
    }
  }
})

// Watch for changes in pump results to update coordinates if needed
watch(
  () => calculationsStore.pumpResults,
  (newResults) => {
    if (newResults && newResults.lengthPipeline) {
      const totalLength = newResults.lengthPipeline.reduce((sum, length) => sum + length, 0)
      if (formData.value.length === 0) {
        coordinatesStore.initializeDefaultCoordinates(totalLength)
      }
    }
  }
)

// Computed properties for new features
const profileAnalysis = computed(() => {
  const points = [...formData.value].sort((a, b) => a.section - b.section);
  if (points.length < 2) return null;

  const totalPipelineLength = calculationsStore.pumpResults?.lengthPipeline?.reduce((sum, length) => sum + length, 0) || 0;

  const analysis = {
    totalDistance: totalPipelineLength,
    maxHeight: Math.max(...points.map(p => p.height)),
    minHeight: Math.min(...points.map(p => p.height)),
    totalElevationGain: 0,
    steepestGradient: 0,
    remainingLength: totalPipelineLength - points[points.length - 1].section,
    warnings: []
  };

  for (let i = 1; i < points.length; i++) {
    const elevationDiff = Math.abs(points[i].height - points[i-1].height);
    const distance = Math.abs(points[i].section - points[i-1].section);
    
    if (points[i].height > points[i-1].height) {
      analysis.totalElevationGain += elevationDiff;
    }
    
    if (distance > 0) {
      const gradient = elevationDiff / (distance * 1000); // Convert km to m for correct gradient
      analysis.steepestGradient = Math.max(analysis.steepestGradient, gradient);
    }
  }

  // Warnings
  if (analysis.steepestGradient > Math.tan(Math.PI * 45 / 180)) {
    analysis.warnings.push({
      type: 'error',
      message: `Обнаружен слишком крутой уклон (>${(analysis.steepestGradient * 100).toFixed(1)}%)`
    });
  }

  if (analysis.maxHeight - analysis.minHeight > 200) {
    analysis.warnings.push({
      type: 'warning',
      message: `Большой перепад высот (${(analysis.maxHeight - analysis.minHeight).toFixed(1)}м)`
    });
  }

  if (points[points.length - 1].section < totalPipelineLength) {
    analysis.warnings.push({
      type: 'warning',
      message: `Не заполнен участок ${points[points.length - 1].section}км - ${totalPipelineLength}км`
    });
  }

  return analysis;
});

const profileWarnings = computed(() => profileAnalysis.value?.warnings || [])
const hasErrors = computed(() => profileWarnings.value.some(w => w.type === 'error'))
const canUndo = computed(() => coordinatesStore.canUndo)
const canRedo = computed(() => coordinatesStore.canRedo)

// Debounced input handler
const handleInputChange = debounce(() => {
  validateForm()
}, 300)

// History methods
const undo = () => {
  if (coordinatesStore.undo()) {
    message.info('Действие отменено')
  }
}

const redo = () => {
  if (coordinatesStore.redo()) {
    message.info('Действие повторено')
  }
}

// Computed property for checking if new point can be added
const canAddNewPoint = computed(() => {
  const totalPipelineLength = calculationsStore.pumpResults?.lengthPipeline?.reduce((sum, length) => sum + length, 0) || 0;
  const lastPoint = sortedData.value[sortedData.value.length - 1];
  
  return !coordinatesStore.isLoading && 
         formData.value.length < maxRows && 
         (!lastPoint || lastPoint.section < totalPipelineLength);
});
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

.warnings-container {
  margin-bottom: 16px;
}

.analysis-item {
  text-align: center;
  padding: 8px;
}

.analysis-item .label {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.analysis-item .value {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.history-btn {
  min-width: 100px;
}

.mb-4 {
  margin-bottom: 16px;
}
</style>