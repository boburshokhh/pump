<template>
    <div>
        <v-app-bar app color="primary" dark elevation="4">
            <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up"></v-app-bar-nav-icon>
            
            <v-toolbar-title class="text-h5 font-weight-bold">
                Название сайта
            </v-toolbar-title>
            
            <v-spacer></v-spacer>

            <!-- Desktop Menu -->
            <div class="hidden-sm-and-down">
                <v-btn text to="/" class="mx-1 text-button">
                    <v-icon left>mdi-home</v-icon>
                    Главная
                </v-btn>
                <v-btn text to="/about" class="mx-1 text-button">
                    <v-icon left>mdi-information</v-icon>
                    О нас
                </v-btn>
                <v-btn text to="/services" class="mx-1 text-button">
                    <v-icon left>mdi-tools</v-icon>
                    Услуги
                </v-btn>
                <v-btn text to="/contact" class="mx-1 text-button">
                    <v-icon left>mdi-phone</v-icon>
                    Контакты
                </v-btn>
            </div>

            <v-btn icon class="ml-2">
                <v-icon>mdi-magnify</v-icon>
            </v-btn>
            <v-btn icon class="ml-2">
                <v-icon>mdi-account-circle</v-icon>
            </v-btn>
        </v-app-bar>

        <!-- Mobile Navigation Drawer -->
        <v-navigation-drawer
            v-model="drawer"
            app
            temporary
            dark
        >
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="text-h6">
                            Меню
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-divider></v-divider>

                <v-list-item to="/" link>
                    <v-list-item-icon>
                        <v-icon>mdi-home</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Главная</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item to="/about" link>
                    <v-list-item-icon>
                        <v-icon>mdi-information</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>О нас</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item to="/services" link>
                    <v-list-item-icon>
                        <v-icon>mdi-tools</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Услуги</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item to="/contact" link>
                    <v-list-item-icon>
                        <v-icon>mdi-phone</v-icon>
                    </v-list-item-icon>
                    <v-list-item-content>
                        <v-list-item-title>Контакты</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>

<script>
export default {
    name: "Header",
    data() {
        return {
            drawer: false,
        };
    },
    watch: {
        // Закрываем drawer при изменении маршрута
        '$route'() {
            this.drawer = false;
        }
    }
};
</script>

<style scoped>
.text-button {
    text-transform: none;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.v-toolbar-title {
    background: linear-gradient(45deg, #2196F3, #1976D2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-family: 'Roboto', sans-serif;
}

.v-btn {
    transition: transform 0.2s;
}

.v-btn:hover {
    transform: translateY(-2px);
}
</style>