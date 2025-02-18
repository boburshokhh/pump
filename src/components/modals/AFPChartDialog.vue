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
</script>

<style scoped>
.dialog-content {
  display: flex;
  flex-direction: column;
}

.chart-wrapper {
  margin: 0 -24px -24px;
}

@media (max-width: 640px) {
  .chart-wrapper {
    margin: 0;
  }
}
</style> 