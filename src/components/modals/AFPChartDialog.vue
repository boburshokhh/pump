<template>
  <n-modal
    :show="show"
    @update:show="$emit('update:show', $event)"
    preset="card"
    style="max-width: 700px; width: 90%"
    :title="stationName"
    :bordered="false"
    size="medium"
  >
    <div class="dialog-content">
      <div class="info-grid">
        <div class="info-item">
          <span class="label">Расход:</span>
          <span class="value">{{ flow }} м³/ч</span>
        </div>
        <div class="info-item">
          <span class="label">Концентрация ПТП:</span>
          <span class="value">{{ currentValue }} ppm</span>
        </div>
        <div class="info-item">
          <span class="label">Эффективность:</span>
          <span class="value highlight">{{ calculateEfficiency(currentValue, flow).toFixed(1) }}%</span>
        </div>
      </div>
      
      <div class="chart-wrapper">
        <AFPEfficiencyChart
          :afp-data="{
            concentration: currentValue,
            flow: flow
          }"
        />
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { NModal } from 'naive-ui'
import AFPEfficiencyChart from '../charts/AFPEfficiencyChart.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  stationName: {
    type: String,
    required: true
  },
  currentValue: {
    type: Number,
    required: true
  },
  flow: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update:show'])

function calculateEfficiency(concentration, flow) {
  const baseEfficiency = concentration * Math.sqrt(flow/1000) * 5
  const maxEfficiency = 45
  
  const threshold = 2
  let efficiency
  if (concentration < threshold) {
    efficiency = baseEfficiency * (0.8 + 0.2 * (concentration / threshold))
  } else {
    efficiency = baseEfficiency
  }
  
  return Math.min(maxEfficiency, efficiency)
}
</script>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 4px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 12px;
  color: #666;
}

.value {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.value.highlight {
  color: #2B9F3E;
}

.chart-wrapper {
  margin: 0 -24px -24px;
}

@media (max-width: 640px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  
  .chart-wrapper {
    margin: 0;
  }
}
</style> 