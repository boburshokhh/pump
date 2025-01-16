<template>
  <div class="notification-container">
    <component :is="titleTag" :class="titleClass">
      {{ title }}
    </component>
    <component :is="messageTag" :class="messageClass">
      {{ message }}
    </component>
  </div>
</template>

<script>
export default {
  created() {
    console.log(this.$props);
  },
  props: {
    title: {
      type: String,
      required: true, // Уведомление без заголовка не должно быть допустимым
    },
    message: {
      type: String,
      required: true, // Уведомление без сообщения также не должно быть допустимым
    },
    titleTag: {
      type: String,
      default: "h2", // Тег для заголовка
    },
    messageTag: {
      type: String,
      default: "p", // Тег для текста сообщения
    },
    titleClass: {
      type: String,
      default: "text-h5", // Класс для стилизации заголовка
    },
    messageClass: {
      type: String,
      default: "text-body-2", // Класс для стилизации текста
    },
  },
};
</script>

<style scoped>
.notification-container {
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.text-h5 {
  font-size: 1.25rem;
  font-weight: 600;
}

.text-body-2 {
  font-size: 0.875rem;
  color: #666;
}
</style>
