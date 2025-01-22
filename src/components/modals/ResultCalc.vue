<template>
    <div class="pa-4">
        <v-btn 
            @click="dialog = true" 
            variant="tonal" 
            color="primary"
            class="px-4"
        >
            <v-icon icon="mdi-chart-box" start size="20" class="mr-2"></v-icon>
            Результаты
            <v-tooltip activator="parent" location="top">
                Просмотр результатов расчета
            </v-tooltip>
        </v-btn>

        <v-dialog 
            v-model="dialog" 
            max-width="800"
            max-height="95%"
            scrollable
        >
            <v-card class="rounded-lg">
                <v-card-title class="header-container">
                    <div class="title-text">
                        Расчет эффективности насосных станций
                    </div>
                    <v-btn
                        icon="mdi-close"
                        variant="text"
                        size="small"
                        @click="close"
                        class="close-button"
                    ></v-btn>
                </v-card-title>
                
                <v-divider></v-divider>
                
                <v-card-text>
                    <v-card flat>
                        <BaseCalculation ref="baseCalculation" />
                    </v-card>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pa-3">
                    <v-spacer></v-spacer>

                    <v-btn
                        color="primary"
                        variant="tonal"
                        @click="close"
                    >
                        Закрыть
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import BaseCalculation from "../calculation/BaseCanculationInfoGet.vue";

export default {
    name: "ResultCalc",
    components: {
        BaseCalculation,
    },
    data() {
        return {
            dialog: false,
        };
    },
    methods: {
        close() {
            this.dialog = false;
        },
    }
};
</script>

<style scoped>
.v-card__underlay {
    display: none;
}

.header-container {
    position: relative;
    padding: 12px 16px;
    padding-right: 48px; /* Место для кнопки закрытия */
    min-height: 48px;
    display: flex;
    align-items: center;
}

.title-text {
    font-size: 1.25rem;
    line-height: 1.4;
    font-weight: 500;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
}

.close-button {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
}

@media (max-width: 600px) {
    .header-container {
        padding: 10px 40px 10px 12px;
        min-height: 44px;
    }

    .title-text {
        font-size: 1.1rem;
        line-height: 1.3;
    }

    .close-button {
        right: 4px;
    }
}
</style>