<template>
    <n-layout class="not-found-layout">
        <div class="mt-14"></div>
        <n-layout-content class="not-found-content">
            <div class="icon-wrapper">
                <n-result status="404" title="404 Не найдено" description="Знаете, жизнь всегда немного нелепа.">
                </n-result>
            </div>
            <n-space vertical size="large" align="center">
                <n-text depth="3">Страница, которую вы ищете, не существует.</n-text>
                <router-link to="/menu">
                    <n-button type="primary" size="large">
                        Вернуться на главную
                    </n-button>
                </router-link>
            </n-space>
        </n-layout-content>
    </n-layout>
</template>

<script>
export default {
    name: "NotFound",
};
</script>

<style scoped>
.not-found-layout {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--n-color-body);
}

.not-found-content {
    max-width: 400px;
    text-align: center;
}

.not-found-card {
    padding: 24px;
}

.icon-wrapper {
    margin-bottom: 16px;
}
</style>
