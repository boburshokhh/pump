<template>
    <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>Название сайта</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text to="/">Главная</v-btn>
        <v-btn text to="/about">О нас</v-btn>
        <v-btn text to="/services">Услуги</v-btn>
        <v-btn text to="/contact">Контакты</v-btn>
        <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-btn icon>
            <v-icon>mdi-account-circle</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script>
export default {
    name: "Header",
};
</script>