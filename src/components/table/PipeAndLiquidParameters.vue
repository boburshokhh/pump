<template>
    <div class="pa-4 text-center">
        <v-btn-group color="#b2d7ef" density="comfortable" rounded="pill" divided>
            <v-btn variant="flat">
                <v-icon icon="mdi-open-in-new" size="large"></v-icon>
                <v-dialog activator="parent" max-width="50%" >
                        <template v-slot:default="{ isActive }">
                            <v-card rounded="lg">
                                <v-card-title  class="d-flex justify-space-between align-center">
                                    <div class="text-medium-emphasis ps-2">
                                        Параметры
                                    </div>
                                    <v-btn icon="mdi-close" variant="text" @click="isActive.value = false"></v-btn>
                                </v-card-title>
                                <v-divider class="mb-4"></v-divider>
                                <v-card-text>
                                    <v-row>
                                        <v-col cols="12">
                                                <div class="text-h6 ">
                                                    Параметры жидкости
                                                </div>
                                            <liquidInfoTable :parameters ="parameters.liquidParameters"/>
                                        </v-col>
                                        <v-col cols="12">
                                            <div class="text-h6 ">
                                                Параметры трубы
                                            </div>
                                            <pipeInfoTable  :parameters ="parameters.pipeParameters"/>
                                        </v-col>
                                    </v-row>
                                </v-card-text>
                                <v-divider class="mt-2"></v-divider>
                                <v-card-actions class="my-2 d-flex justify-end">
                                    <v-btn class="text-none" variant="tonal" rounded="xl" text="Отмена"
                                        @click="isActive.value = false"></v-btn>
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