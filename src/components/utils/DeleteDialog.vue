<template>
    <n-space>
        <v-btn :icon="icon" :color="color" @click="showDialog   ">
            <v-icon>{{icon}}</v-icon>
        </v-btn>
    </n-space>
</template>

<script>
import { useDialog, useMessage } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
    name: "CustomDialog",
    props: {
        icon: {
            type: String,
            default: "mdi-delete", 
        },
        color: {
            type: String,
            default: "red", 
        },
        dialogType: {
            type: String,
            default: "warning", 
        },
        dialogTitle: {
            type: String,
            default: "Default Title",
        },
        dialogContent: {
            type: String,
            default: "Default Content",
        },
        positiveText: {
            type: String,
            default: "Confirm",
        },
        negativeText: {
            type: String,
            default: "Cancel",
        },
        onPositiveClick: {
            type: Function,
            required: false,
        },
        onNegativeClick: {
            type: Function,
            required: false,
        },
    },
    setup(props) {
        const dialog = useDialog();
        const message = useMessage();

        const showDialog = () => {
            dialog[props.dialogType]({
                title: props.dialogTitle,
                content: props.dialogContent,
                positiveText: props.positiveText,
                negativeText: props.negativeText,
                draggable: true,
                onPositiveClick: () => {
                    if (props.onPositiveClick) {
                        props.onPositiveClick();
                    }
                    message.success("Успешно выполнена!");
                },
                onNegativeClick: () => {
                    if (props.onNegativeClick) {
                        props.onNegativeClick();
                    }
                    message.error("Отрицательное действие выполнено!");
                },
            });
        };

        return {
            showDialog,
        };
    },
});
</script>

<style scoped>
/* Добавьте стили, если необходимо */
</style>