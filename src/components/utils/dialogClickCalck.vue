<template>
    <div>
        <slot name="action"></slot>
    </div>
</template>

<script>
import { defineComponent } from "vue";
import { useDialog, useMessage } from "naive-ui";

export default defineComponent({
    props: {
        dialogTitle: {
            type: String,
            required: true,
            default: "Заголовок"
        },
        dialogContent: {
            type: String,
            required: true,
            default: "Контент диалога"
        },
        positiveText: {
            type: String,
            required: true,
            default: "ОК"
        },
        dialogType: {
            type: String,
            required: true,
            default: "warning" // Возможные значения: "info", "success", "warning", "error"
        },
        messageText: {
            type: String,
            required: false,
            default: "Сообщение для пользователя"
        },
        messageType: {
            type: String,
            required: false,
            default: "info" // Возможные значения: "info", "success", "warning", "error"
        },
        escMessageType: {
            type: String,
            required: false,
            default: "warning" // Возможные значения: "info", "success", "warning", "error"
        },
        escMessage: {
            type: String,
            required: false,
            default: "Нажимайте кнопку 'Хорошо' для закрытия диалога"
        }
    },
    setup(props) {
        const dialog = useDialog();
        const message = useMessage();

        const showDialog = () => {
            dialog[props.dialogType]({
                title: props.dialogTitle,
                content: props.dialogContent,
                positiveText: props.positiveText,
                maskClosable: false,
                closable: false,
                closeOnEsc: false,
                onPositiveClick: () => {
                    message[props.messageType](props.messageText);
                },
                onEsc: () => {
                    message[props.escMessageType](props.escMessage);
                },
                onMaskClick: () => {
                    message[props.escMessageType](props.escMessage);
                },
            });
        };

        return {
            showDialog
        };
    }
});
</script>