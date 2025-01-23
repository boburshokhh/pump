<template>
  <n-layout-footer class="footer">
    <!-- Анимированные волны -->
    <div class="waves">
      <div class="wave wave1"></div>
      <div class="wave wave2"></div>
      <div class="wave wave3"></div>
    </div>

    <n-card class="footer-card">
      <n-grid :x-gap="24" :y-gap="24" cols="1 s:3" responsive="screen">
        <!-- Социальные сети -->
        <n-grid-item>
          <n-h3 class="section-title">
            <n-text type="primary">Мы в соцсетях</n-text>
          </n-h3>
          <n-space justify="start">
            <n-tooltip v-for="social in socials" 
                      :key="social.name" 
                      trigger="hover" 
                      :placement="social.name">
              <template #trigger>
                <n-button quaternary circle 
                          class="social-btn"
                          tag="a" 
                          :href="social.link" 
                          target="_blank">
                  <template #icon>
                    <n-icon size="24">
                      <component :is="social.icon" />
                    </n-icon>
                  </template>
                </n-button>
              </template>
              {{ social.name }}
            </n-tooltip>
          </n-space>
        </n-grid-item>

        <!-- Контакты -->
        <n-grid-item>
          <n-h3 class="section-title">
            <n-text type="primary">Контакты</n-text>
          </n-h3>
          <n-space vertical>
            <n-button text tag="a" href="tel:+74995078888" class="contact-link">
              <template #icon>
                <n-icon><Call /></n-icon>
              </template>
              +7 (499) 507-88-88
            </n-button>
            <n-button text tag="a" href="mailto:com@gubkin.ru" class="contact-link">
              <template #icon>
                <n-icon><Mail /></n-icon>
              </template>
              com@gubkin.ru
            </n-button>
          </n-space>
        </n-grid-item>

        <!-- Адрес -->
        <n-grid-item>
          <n-h3 class="section-title">
            <n-text type="primary">Адрес</n-text>
          </n-h3>
          <div class="address-container">
            <n-button text class="address-text">
              <template #icon>
                <n-icon><Location /></n-icon>
              </template>
              119991, г. Москва, проспект Ленинский, д. 65, корп. 1
            </n-button>
            <!-- Добавить мини-карту -->
            <div class="map-preview" @click="openMap">
              <!-- <img src="path-to-map-preview.jpg" alt="Карта" /> -->
              <div class="map-overlay">
                <span>Открыть карту</span>
              </div>
            </div>
          </div>
        </n-grid-item>
      </n-grid>

      <n-divider class="divider" />

      <!-- Копирайт -->
      <n-text class="copyright" depth="3">
        © {{ new Date().getFullYear() }} РГУ нефти и газа (НИУ) имени И.М. Губкина. Все права защищены
      </n-text>
    </n-card>

    <n-button circle class="scroll-top" @click="scrollToTop">
      <template #icon>
        <n-icon><ArrowUp /></n-icon>
      </template>
    </n-button>
  </n-layout-footer>
</template>

<script setup>
import { LogoYoutube, LogoInstagram, Call, Mail, Location, ArrowUp } from '@vicons/ionicons5'
import { ref } from 'vue'

const socials = ref([
  {
    name: 'YouTube',
    icon: LogoYoutube,
    link: 'https://www.youtube.com/@user-gubkinvideo'
  },
  {
    name: 'Instagram',
    icon: LogoInstagram,
    link: 'https://www.instagram.com/gubkin_university'
  }
])

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}
</script>

<style scoped>
.footer {
  position: relative;
  padding: 24px 0;
  background: linear-gradient(-45deg, #4169E1, #0047AB, #1E90FF, #4682B4);
  background-size: 400% 400%;
  animation: gradientBG 15s ease infinite;
  overflow: hidden;
  min-height: 300px;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Стили для волн */
.waves {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.wave {
  position: absolute;
  width: 200%;
  height: 100%;
  background-repeat: repeat-x;
  background-position: 0 bottom;
  transform-origin: center bottom;
}

.wave1 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgba(255, 255, 255, 0.1)'/%3E%3C/svg%3E");
  animation: wave 12s linear infinite;
  z-index: 1;
}

.wave2 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgba(255, 255, 255, 0.07)'/%3E%3C/svg%3E");
  animation: wave 18s linear infinite;
  z-index: 2;
}

.wave3 {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgba(255, 255, 255, 0.05)'/%3E%3C/svg%3E");
  animation: wave 24s linear infinite;
  z-index: 3;
}

@keyframes wave {
  0% {
    transform: translateX(0) translateZ(0) scaleY(1);
  }
  50% {
    transform: translateX(-25%) translateZ(0) scaleY(0.55);
  }
  100% {
    transform: translateX(-50%) translateZ(0) scaleY(1);
  }
}

.footer-card {
  position: relative;
  z-index: 4;
  max-width: 1200px;
  margin: 0 auto;
  background: transparent !important;
  border: none;
  animation: fadeInUp 0.6s ease-out;
}

.section-title {
  margin-bottom: 16px;
}

.section-title :deep(.n-text) {
  color: #ffffff !important;
  font-weight: 500;
  font-size: 1.2rem;
}

.social-btn {
  position: relative;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.social-btn:hover {
  transform: translateY(-3px);
  background: rgba(255, 255, 255, 0.2) !important;
  box-shadow: 0 8px 25px rgba(255, 255, 255, 0.2);
}

.contact-link {
  transition: all 0.3s ease;
  font-size: 14px;
  color: #ffffff !important;
}

.contact-link:hover {
  transform: translateX(5px);
  opacity: 0.8;
}

.address-text {
  text-align: left;
  white-space: normal;
  height: auto;
  line-height: 1.5;
  font-size: 14px;
  color: #ffffff !important;
}

.copyright {
  display: block;
  text-align: center;
  margin-top: 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8) !important;
}

.divider {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

:deep(.n-icon) {
  color: #ffffff !important;
}

/* Добавить пульсацию для иконок */
@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.social-btn:hover .n-icon {
  animation: pulse 1s infinite;
}

/* Эффект свечения для контактов */
.contact-link::before {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -2px;
  left: 0;
  background: rgba(255, 255, 255, 0.6);
  transition: width 0.3s ease;
}

.contact-link:hover::before {
  width: 100%;
}

/* Адаптивность */
@media (max-width: 640px) {
  .footer {
    padding: 16px;
  }

  .section-title {
    text-align: center;
  }

  .n-space {
    justify-content: center;
  }

  .address-text {
    text-align: center;
  }
}

.address-container {
  position: relative;
}

.map-preview {
  margin-top: 12px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.map-preview img {
  width: 100%;
  height: 120px;
  object-fit: cover;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.map-preview:hover {
  transform: translateY(-3px);
}

.map-preview:hover .map-overlay {
  opacity: 1;
}

.scroll-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  background: rgba(255, 255, 255, 0.1) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 100;
  transition: all 0.3s ease;
}

.scroll-top:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2) !important;
}

/* Добавить плавное появление элементов при загрузке */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Добавить эффект ripple для кнопок */
.n-button {
  position: relative;
  overflow: hidden;
}

.n-button::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  background-image: radial-gradient(circle, rgba(255, 255, 255, .7) 10%, transparent 10.01%);
  background-repeat: no-repeat;
  background-position: 50%;
  transform: scale(10, 10);
  opacity: 0;
  transition: transform .5s, opacity 1s;
}

.n-button:active::after {
  transform: scale(0, 0);
  opacity: .3;
  transition: 0s;
}
</style>