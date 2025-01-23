<template>
    <div class="pa-4 text-center">
        <v-btn-group color="#b2d7ef" density="comfortable" rounded="pill" divided>
            <v-btn variant="flat" class="btn-hover-effect">
                <v-icon icon="mdi-open-in-new" size="large"></v-icon>
                <v-dialog activator="parent" :max-width="$vuetify.display.mdAndDown ? '95%' : '80%'" transition="dialog-bottom-transition">
                        <template v-slot:default="{ isActive }">
                            <v-card rounded="lg" class="dialog-card" elevation="8">
                                <v-card-title class="d-flex justify-space-between align-center pa-4">
                                    <div class="text-h6 font-weight-medium primary--text">
                                        Параметры
                                    </div>
                                    <v-btn icon="mdi-close" variant="text" @click="isActive.value = false" 
                                           class="close-btn" color="grey">
                                    </v-btn>
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text class="pa-4">
                                    <div class="tables-container">
                                        <div class="table-section">
                                            <div class="text-h6 mb-4 primary--text">
                                                Параметры жидкости
                                            </div>
                                            <liquidInfoTable :parameters="parameters.liquidParameters"/>
                                        </div>
                                        <div class="table-section mt-6">
                                            <div class="text-h6 mb-4 primary--text">
                                                Параметры трубы
                                            </div>
                                            <pipeInfoTable :parameters="parameters.pipeParameters"/>
                                        </div>
                                    </div>
                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions class="pa-4 d-flex justify-end">
                                    <v-btn class="text-none close-button" 
                                           color="primary" 
                                           variant="tonal" 
                                           rounded="xl" 
                                           text="Закрыть"
                                           @click="isActive.value = false">
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                </v-dialog>
            </v-btn>
        </v-btn-group>
    </div>
</template>
<script>
import liquidInfoTable from './liquidInfoTable.vue';
import pipeInfoTable from './pipeInfoTable.vue';
export default {
    components: {
        liquidInfoTable,
        pipeInfoTable
    },
    props: {
        parameters: {
            type: Object,
            required: true
        }
    },
    data() {
        return {

        }
    }
}
</script>
<style scoped>
.dialog-card {
    transition: all 0.3s ease;
}

.tables-container {
    max-width: 100%;
}

.table-section {
    width: 100%;
}

.btn-hover-effect {
    transition: transform 0.2s ease;
}

.btn-hover-effect:hover {
    transform: scale(1.05);
}

.close-btn {
    transition: all 0.2s ease;
}

.close-btn:hover {
    transform: rotate(90deg);
}

.close-button {
    transition: all 0.2s ease;
}

.close-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

@media (max-width: 600px) {
    .v-card-title {
        font-size: 1.25rem;
    }
    
    .text-h6 {
        font-size: 1.1rem;
    }

    .table-section {
        overflow-x: auto;
    }
}
</style>