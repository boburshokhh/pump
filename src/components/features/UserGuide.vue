<template>
  <v-card class="user-guide-card">
    <v-stepper v-model="currentStep" class="user-guide-stepper">
      <v-stepper-header>
        <template v-for="n in steps.length" :key="n">
          <v-stepper-item
            :value="n"
            :complete="currentStep > n"
            :title="steps[n-1].title"
          />
          <v-divider
            v-if="n !== steps.length"
            :key="`${n}-divider`"
          />
        </template>
      </v-stepper-header>

      <v-stepper-window v-model="currentStep">
        <v-stepper-window-item
          v-for="(step, index) in steps"
          :key="index"
          :value="index + 1"
        >
          <v-card-text class="guide-content">
            <v-fade-transition>
              <div class="guide-step">
                <div class="guide-image-container">
                  <v-img
                    :src="step.image"
                    :alt="step.title"
                    class="guide-image"
                    contain
                    max-height="400"
                  >
                    <!-- Indicators for buttons/important elements -->
                    <template v-for="(indicator, idx) in step.indicators" :key="idx">
                      <div
                        class="indicator-dot"
                        :style="{
                          left: `${indicator.x}%`,
                          top: `${indicator.y}%`
                        }"
                      >
                        <v-tooltip
                          :text="indicator.text"
                          location="top"
                        >
                          <template v-slot:activator="{ props }">
                            <div class="dot-pulse" v-bind="props"></div>
                          </template>
                        </v-tooltip>
                      </div>
                    </template>
                  </v-img>
                </div>
                <div class="guide-description">
                  <h3 class="text-h5 mb-4">{{ step.title }}</h3>
                  <p class="text-body-1">{{ step.description }}</p>
                </div>
              </div>
            </v-fade-transition>
          </v-card-text>
        </v-stepper-window-item>
      </v-stepper-window>

      <v-card-actions class="guide-actions">
        <v-btn
          variant="text"
          :disabled="currentStep === 1"
          @click="currentStep--"
        >
          Назад
        </v-btn>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          :text="currentStep === steps.length ? 'Завершить' : 'Далее'"
          @click="currentStep === steps.length ? closeGuide() : currentStep++"
        >
        </v-btn>
      </v-card-actions>
    </v-stepper>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const currentStep = ref(1)

// Example steps data structure
const steps = ref([
  {
    title: 'Добро пожаловать',
    description: 'Добро пожаловать в руководство по использованию нашего приложения. Мы покажем вам все основные функции и возможности.',
    image: 'https://cdn.vuetifyjs.com/docs/images/featured/feature-1.png', // Путь к изображению
    indicators: [] // Пока нет индикаторов для первого шага
  },
  {
    title: 'Основной интерфейс',
    description: 'Познакомьтесь с основным интерфейсом приложения. Здесь вы можете найти все необходимые инструменты.',
    image: 'https://cdn.vuetifyjs.com/docs/images/featured/feature-1.png',
    indicators: [
      { x: 20, y: 30, text: 'Главное меню' },
      { x: 50, y: 60, text: 'Панель управления' }
    ]
  }
  // Добавьте больше шагов по необходимости
])

const closeGuide = () => {
  // Здесь можно добавить логику закрытия руководства
  // Например, emit события для родительского компонента
}
</script>

<style scoped>
.user-guide-card {
  max-width: 900px;
  margin: 0 auto;
}

.guide-content {
  padding: 24px;
}

.guide-step {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guide-image-container {
  position: relative;
  width: 100%;
}

.guide-image {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.guide-description {
  text-align: center;
}

.indicator-dot {
  position: absolute;
  width: 24px;
  height: 24px;
  transform: translate(-50%, -50%);
}

.dot-pulse {
  position: relative;
  width: 24px;
  height: 24px;
  background: rgba(var(--v-theme-primary), 0.8);
  border-radius: 50%;
  cursor: pointer;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(var(--v-theme-primary), 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(var(--v-theme-primary), 0);
  }
}

.guide-actions {
  padding: 16px 24px;
}

/* Анимация перехода между шагами */
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
  transition: opacity 0.3s ease;
}

.v-fade-transition-enter-from,
.v-fade-transition-leave-to {
  opacity: 0;
}
</style>
