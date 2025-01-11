<template>
    <div class="notification-container">
        <component :is="titleTag" :class="titleClass">
            {{ title }}
        </component>
        <component :is="messageTag" :class="messageClass">
            {{ message }}
        </component>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        titleTag: {
            type: String,
            default: "h2",
        },
        messageTag: {
            type: String,
            default: "p",
        },
        titleClass: {
            type: String,
            default: "text-h5",
        },
        messageClass: {
            type: String,
            default: "text-body-2",
        },
    },
};
</script>

<style scoped>
.notification-container {
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.text-h5 {
    font-size: 1.25rem;
    font-weight: 600;
}

.text-body-2 {
    font-size: 0.875rem;
    color: #666;
}
</style>