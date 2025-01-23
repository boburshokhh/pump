<template>
    <v-container fluid class="not-found-layout">
        <v-row align="center" justify="center" class="fill-height">
            <v-col cols="12" sm="8" md="6" lg="4">
                <v-card
                    class="not-found-card"
                    elevation="0"
                    :style="{ backgroundColor: 'transparent' }"
                >
                    <v-card-text class="text-center">
                        <v-scale-transition>
                            <div class="text-h1 font-weight-bold primary--text mb-6">
                                404
                            </div>
                        </v-scale-transition>
                        
                        <v-fade-transition>
                            <div class="text-h4 mb-6">
                                Страница не найдена
                            </div>
                        </v-fade-transition>
                        
                        <v-fade-transition>
                            <div class="text-subtitle-1 mb-8 text-medium-emphasis">
                                Знаете, жизнь всегда немного нелепа. Но не волнуйтесь, вы можете вернуться на главную страницу.
                            </div>
                        </v-fade-transition>

                        <v-hover v-slot="{ isHovering, props }">
                            <router-link to="/" class="text-decoration-none">
                                <v-btn
                                    v-bind="props"
                                    size="large"
                                    color="primary"
                                    :elevation="isHovering ? 4 : 1"
                                    class="px-8"
                                    :class="{ 'scale-button': isHovering }"
                                >
                                    Вернуться на главную
                                    <v-icon end icon="mdi-arrow-right" class="ml-2"></v-icon>
                                </v-btn>
                            </router-link>
                        </v-hover>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: "NotFound",
};
</script>

<style scoped>
.not-found-layout {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

.scale-button {
    transform: scale(1.05);
    transition: all 0.3s ease;
}

.v-scale-transition-enter-active,
.v-scale-transition-leave-active,
.v-fade-transition-enter-active,
.v-fade-transition-leave-active {
    transition: all 0.5s ease;
}

.v-scale-transition-enter-from,
.v-scale-transition-leave-to {
    opacity: 0;
    transform: scale(0.5);
}

.v-fade-transition-enter-from,
.v-fade-transition-leave-to {
    opacity: 0;
    transform: translateY(20px);
}
</style>
