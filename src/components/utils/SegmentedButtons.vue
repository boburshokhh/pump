<template>
  <v-slide-y-transition>
    <div class="segmented-control-wrapper">
      <div class="segmented-control" :class="{ 'dark-theme': isDark }">
        <div class="segment-container">
          <div 
            class="sliding-segment" 
            :style="{ transform: `translateX(${modelValue === 'serial' ? '0' : '100%'})` }"
          ></div>
          
          <button
            v-for="option in options"
            :key="option.value"
            class="segment-button text-no-wrap"
            :class="{ 'active': modelValue === option.value }"
            @click="$emit('update:modelValue', option.value)"
          >
            <component :is="option.icon" class="segment-icon" />
            <span class="button-text">{{ option.label }}</span>
          </button>
        </div>
      </div>
    </div>
  </v-slide-y-transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { GitCompare, GitMerge } from '@vicons/ionicons5'

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  },
  isDark: {
    type: Boolean,
    default: false
  }
})

defineEmits(['update:modelValue'])

const options = [
  { 
    value: 'serial', 
    label: 'Последовательное',
    icon: GitCompare
  },
  { 
    value: 'parallel', 
    label: 'Параллельное',
    icon: GitMerge
  }
]
</script>

<style scoped>
.segmented-control-wrapper {
  width: 100%;
  padding: 1rem;
}

.segmented-control {
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  padding: 0.25rem;
  background: #f0f0f0;
  border-radius: 0.75rem;
  position: relative;
}

@media (max-width: 600px) {
  .segmented-control {
    max-width: 100%;
  }
  
  .button-text {
    font-size: 0.75rem;
  }
  
  .segment-icon {
    width: 1rem !important;
    height: 1rem !important;
  }
}

@media (min-width: 601px) and (max-width: 960px) {
  .segmented-control {
    max-width: 400px;
  }
}

.segment-container {
  position: relative;
  display: flex;
  width: 100%;
  height: 2.5rem;
}

.sliding-segment {
  position: absolute;
  width: 50%;
  height: 100%;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;
}

.segment-button {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  height: 100%;
  border: none;
  background: transparent;
  color: #666;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  white-space: nowrap;
  padding: 0 0.5rem;
}

.text-no-wrap {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.segment-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.button-text {
  transition: all 0.3s ease;
}

.segment-button:hover .button-text {
  transform: scale(1.05);
}

.segment-button.active {
  color: #1976D2;
}

/* Анимация появления */
.v-slide-y-transition-enter-active {
  transition: all 0.3s ease-out;
}

.v-slide-y-transition-leave-active {
  transition: all 0.3s ease-in;
}

.v-slide-y-transition-enter-from,
.v-slide-y-transition-leave-to {
  transform: translateY(20px);
  opacity: 0;
}

.dark-theme {
  background: #333;
}

.dark-theme .sliding-segment {
  background: #444;
}

.dark-theme .segment-button {
  color: #999;
}

.dark-theme .segment-button.active {
  color: #90CAF9;
}
</style>