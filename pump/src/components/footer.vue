<template>
    <n-layout-footer bordered class="footer">
      <div class="footer-content">
        <span>© 2024 РГУ нефти и газа (НИУ) имени И.М. Губкина. Все права защищены.</span>
        <n-space align="center">
          <n-button text type="primary" @click="navigateTo('terms')">Условия использования</n-button>
          <n-button text type="primary" @click="navigateTo('privacy')">Политика конфиденциальности</n-button>
          <n-button text type="primary" @click="navigateTo('contact')">Контакты</n-button>
        </n-space>
      </div>
    </n-layout-footer>
  </template>
  
  <script>
  export default {
    name: "FooterComponent",
    methods: {
      navigateTo(route) {
        this.$router.push({ name: route });
      },
    },
  };
  </script>
  
  <style scoped>
  .footer {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f5f5f5;
    padding: 16px;
  }
  
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .footer-content span {
    margin-bottom: 8px;
    color: #606266;
  }
  
  .n-space {
    margin-top: 8px;
  }
  </style>
  