<template>
    <div class="text-center">
        <v-dialog v-model="localDialog" class="custom-dialog" transition="dialog-bottom-transition" fullscreen
            @update:modelValue="closeDialog">
            <v-card>
                <v-toolbar>
                    <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
                    <v-toolbar-title>Редактировать параметры станции</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn text variant="primary" @click="saveDialog">Сохранить</v-btn>
                    </v-toolbar-items>
                </v-toolbar>
                <n-scrollbar style="max-height: 100%">
                    <v-sheet class="mx-auto pa-4" style="max-width: 80%">
                        <formAddPump ref="formAddPumpRef" :pumpStationIndex="pumpStationIndex" :editMode="true"
                            :stationData="station" />
                    </v-sheet>
                </n-scrollbar>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import formAddPump from "../base/BaseForm.vue";
import { useIndexStore } from "/src/stores/index";

export default {
    components: {
        formAddPump,
    },
    props: {
        dialog: {
            type: Boolean,
            default: false,
            required: false,
        },
        pumpStationIndex: {
            type: Number,
            required: false,
        },
        station: {
            type: Object,
            default: () => ({}),
            required: true,
        },
    },
    data() {
        return {
            localDialog: this.dialog,
        };
    },
    watch: {
        dialog(newVal) {
            this.localDialog = newVal;
        },
        station(newVal) {
            console.log("station:", newVal);
        },
        localDialog(newVal) {
            this.$emit("update:dialog", newVal);
        },
    },
    methods: {
        updateStation(item) {
            const store = useIndexStore();
            store.updateStation(item);
        },
        closeDialog() {
            this.localDialog = false;
        },
        saveDialog() {

            const validateForm = this.$refs.formAddPumpRef.validateForm()
            const validatePumps = this.$refs.formAddPumpRef.validatePumps()
            this.$refs.formAddPumpRef.submitForm()
            if (validateForm && validatePumps) {
                this.closeDialog()
            }

        },
        handleSaveData(data) {
            this.updateStation(data);
            this.closeDialog();
        },
    },
};
</script>

<style>
.custom-dialog{
    z-index: 2000 !important;
}
</style>