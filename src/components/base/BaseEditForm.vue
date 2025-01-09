<template>
    <div class="text-center pa-4">
        <v-dialog
            v-model="localDialog"
            transition="dialog-bottom-transition"
            fullscreen
            @update:modelValue="closeDialog"
        >
            <v-card>
                <v-toolbar>
                    <v-btn icon="mdi-close" @click="closeDialog"></v-btn>
                    <v-toolbar-title>Settings</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn text="Save" variant="text" @click="closeDialog">Save</v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                <n-scrollbar style="max-height: 100%">
                    <v-sheet class="mx-auto pa-4" style="max-width: 80%">
                        <formAddPump :editMode="true"  :stationData="station"/>
                    </v-sheet>
                </n-scrollbar>
            </v-card>
        </v-dialog>
    </div>
</template>


<script>
import formAddPump from "../base/BaseForm.vue";

export default {
    components: {
        formAddPump
    },
    props: {
        dialog: {
            type: Boolean,
            default: false,
            required: false
        },
        index:{
            type:Number,
            required:false
        },
        station:{
            type:Object,
            default:{},
            required:true
        }
    },
    data() {
        return {
            localDialog: this.dialog // Локальное состояние диалога
        };
    },
    watch: {
        dialog(newVal) {
            this.localDialog = newVal;
        },
        station(newVal) {
            console.log("station:",newVal)
        },
        localDialog(newVal) {
            this.$emit("update:dialog", newVal); // Уведомление родителя
        }
    },
    methods: {
        closeDialog() {
            this.localDialog = false; // Закрытие диалога
        }
    }
};
</script>

