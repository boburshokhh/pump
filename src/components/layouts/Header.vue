<template>
    <div class="header-wrapper">
        <!-- Добавляем оверлей для закрытия меню при клике вне -->
        <div v-if="drawer" 
             class="drawer-overlay" 
             @click="closeDrawer"></div>

        <!-- Анимированные волны -->
        <div class="waves">
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
        </div>

        <v-app-bar app elevation="0" class="header-bar">
            <v-app-bar-nav-icon @click="drawer = !drawer" class="hidden-md-and-up burger-icon"
                :class="{ 'is-active': drawer }">
                <span class="burger-line"></span>
            </v-app-bar-nav-icon>

            <v-toolbar-title class="text-h5 font-weight-bold">
                Название сайта
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <!-- Desktop Menu -->
            <div class="hidden-sm-and-down">
                <v-btn text to="/" class="mx-1 nav-btn">
                    <v-icon left>mdi-home</v-icon>
                    Главная
                </v-btn>
                <v-btn text to="/about" class="mx-1 nav-btn">
                    <v-icon left>mdi-information</v-icon>
                    О нас
                </v-btn>
                <v-btn text to="/services" class="mx-1 nav-btn">
                    <v-icon left>mdi-tools</v-icon>
                    Услуги
                </v-btn>
                <v-btn text to="/contact" class="mx-1 nav-btn">
                    <v-icon left>mdi-phone</v-icon>
                    Контакты
                </v-btn>
            </div>
        </v-app-bar>

        <!-- Mobile Navigation Drawer -->
        <v-navigation-drawer v-model="drawer" 
                           app 
                           temporary 
                           class="mobile-drawer"
                           :class="{ 'drawer-open': drawer }">
            <div class="drawer-content">
                <!-- <div class="menu-header">
                    <span class="menu-title-main">Меню</span>
                    <n-button circle class="close-btn" @click="closeDrawer">
                        <template #icon>
                            <n-icon><Close /></n-icon>
                        </template>
                    </n-button>
                </div> -->

                <v-list>
                    <v-list-item v-for="(item, index) in menuItems" 
                                :key="index" 
                                :to="item.path" 
                                link 
                                class="menu-item"
                                :style="{ animationDelay: `${index * 0.1}s` }"
                                @click="closeDrawer">
                        <div class="menu-item-content">
                            <div class="icon-wrapper">
                                <n-icon size="20" class="menu-icon">
                                    <component :is="getIcon(item.icon)" />
                                </n-icon>
                            </div>
                            <span class="menu-title">{{ item.title }}</span>
                        </div>
                    </v-list-item>
                </v-list>
            </div>
        </v-navigation-drawer>
    </div>
</template>

<script>
import { 
    Home,
    InformationCircle, 
    Construct,
    Call,
    Close
} from '@vicons/ionicons5'

export default {
    name: "Header",
    components: {
        Home,
        InformationCircle,
        Construct,
        Call,
        Close
    },
    data() {
        return {
            drawer: false,
            menuItems: [
                { title: "Главная", icon: "home", path: "/" },
                { title: "О нас", icon: "information", path: "/about" },
                { title: "Услуги", icon: "tools", path: "/services" },
                { title: "Контакты", icon: "phone", path: "/contact" },
            ],
        };
    },
    methods: {
        getIcon(name) {
            const icons = {
                'home': Home,
                'information': InformationCircle,
                'tools': Construct,
                'phone': Call
            }
            return icons[name]
        },
        closeDrawer() {
            this.drawer = false;
        },
    },
    watch: {
        $route() {
            this.drawer = false;
        },
    },
    mounted() {
        // Закрывать меню при нажатии Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.drawer) {
                this.closeDrawer();
            }
        });
    },
    beforeDestroy() {
        document.removeEventListener('keydown');
    }
};
</script>

<style scoped>
.header-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    height: 64px;
    width: 100%;
    z-index: 100;
    overflow: hidden;
}

/* Основной градиентный фон */
.header-wrapper::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #1a237e, #1565c0, #0288d1, #0277bd);
    z-index: -2;
}

/* Эффект мерцающих частиц */
.header-wrapper::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background-image: 
        radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 10%),
        radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 10%),
        radial-gradient(circle at 90% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 10%),
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 10%),
        radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 10%);
    background-size: 30px 30px, 40px 40px, 35px 35px, 45px 45px, 50px 50px;
    animation: sparkleMove 8s linear infinite;
    z-index: -1;
}

@keyframes sparkleMove {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* Стили для header-bar */
.header-bar {
    background: transparent !important;
    backdrop-filter: blur(5px);
    box-shadow: none;
}

/* Обновленные стили для кнопок навигации */
.nav-btn {
    position: relative;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    padding: 0 16px;
    height: 36px;
    transition: all 0.3s ease;
    color: rgba(255, 255, 255, 0.9) !important;
}

.nav-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
    );
    transition: 0.5s;
}

.nav-btn:hover::before {
    left: 100%;
}

.nav-btn:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

/* Обновленные стили для заголовка */
.v-toolbar-title {
    font-weight: 600;
    color: white !important;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    position: relative;
}

.v-toolbar-title::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    transform: scaleX(0);
    transition: transform 0.3s ease;
}

.v-toolbar-title:hover::after {
    transform: scaleX(1);
}

/* Оверлей для закрытия меню */
.drawer-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    z-index: 98;
    opacity: 0;
    animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
    to { opacity: 1; }
}

/* Обновляем стили для мобильного меню */
.mobile-drawer {
    background: linear-gradient(135deg, #1a237e 0%, #0277bd 100%);
    margin-top: 0 !important;
    padding: 0;
    border: none !important; /* Убираем границу drawer */
}

.drawer-open {
    transform: translateX(0);
}

.drawer-content {
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
}

.menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    background: rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.menu-title-main {
    color: white;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 1px;
}

.close-btn {
    color: white !important;
    background: rgba(255, 255, 255, 0.1) !important;
    transition: all 0.3s ease;
}

.close-btn:hover {
    background: rgba(255, 255, 255, 0.2) !important;
    transform: rotate(90deg);
}

/* Обновляем стили для пунктов меню */
.menu-item {
    margin: 8px 16px;
    border-radius: 12px;
    overflow: hidden;
    animation: slideInRight 0.5s ease forwards;
    opacity: 0;
    transform: translateX(-20px);
    background: rgba(255, 255, 255, 0.08); /* Более тонкий фон */
    border: 1px solid rgba(255, 255, 255, 0.1); /* Тонкая граница */
}

.menu-item-content {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    transition: all 0.3s ease;
}

/* Обновляем стили для иконок */
.icon-wrapper {
    position: relative;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    border: none; /* Убираем границу */
}

/* Обновляем цвета и эффекты */
.menu-icon {
    color: rgba(255, 255, 255, 0.9) !important;
    transition: all 0.3s ease;
}

.menu-title {
    color: rgba(255, 255, 255, 0.9) !important;
    font-size: 0.95rem;
    font-weight: 400;
    letter-spacing: 0.3px;
}

/* Эффекты при наведении */
.menu-item:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(8px);
    border-color: rgba(255, 255, 255, 0.2);
}

.menu-item:hover .icon-wrapper {
    background: rgba(255, 255, 255, 0.15);
    transform: rotate(360deg);
}

.menu-item:hover .menu-icon {
    color: white !important;
    transform: scale(1.1);
    filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.5));
}

.menu-item:hover .menu-title {
    color: white !important;
    transform: translateX(4px);
}

/* Убираем ненужные границы и тени */
.v-list {
    background: transparent !important;
    padding: 8px 0 !important;
    border: none !important;
}

.v-list-item {
    border: none !important;
}

/* Активный пункт меню */
.router-link-active .menu-item {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
}

.router-link-active .menu-title {
    color: white !important;
    font-weight: 500;
}

.router-link-active .icon-wrapper {
    background: rgba(255, 255, 255, 0.2);
}

/* Убираем ненужные стили */
.v-list-item__overlay {
    display: none !important;
}

/* Обновляем стили для ripple эффекта */
.v-ripple__container {
    display: none !important;
}

/* Анимация появления */
@keyframes slideInRight {
    from {
        opacity: 0;
        transform: translateX(-20px);
    }
    to {
        opacity: 1;
        transform: translateX(0);
    }
}

/* Добавляем плавную тень для выделения активного элемента */
.menu-item {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
}

.menu-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Обновленные стили для burger icon */
.burger-line,
.burger-line::before,
.burger-line::after {
    background: white;
}

/* Burger Icon Animation */
.burger-icon {
    position: relative;
    transition: all 0.3s ease;
}

.burger-line,
.burger-line::before,
.burger-line::after {
    width: 24px;
    height: 2px;
    position: absolute;
    left: 12px;
    transition: all 0.3s ease;
}

.burger-line::before {
    content: "";
    top: -8px;
}

.burger-line::after {
    content: "";
    top: 8px;
}

.burger-icon.is-active .burger-line {
    background: transparent;
}

.burger-icon.is-active .burger-line::before {
    transform: rotate(45deg);
    top: 0;
}

.burger-icon.is-active .burger-line::after {
    transform: rotate(-45deg);
    top: 0;
}

/* Drawer Styles */
.mobile-drawer {
    margin-top: 64px; /* Отступ равный высоте header */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.menu-icon {
    transition: all 0.3s ease;
    position: relative;
    z-index: 1;
}

.menu-item:hover .menu-icon {
    transform: scale(1.2) rotate(5deg);
    color: #2196f3;
}

.menu-title {
    position: relative;
    z-index: 1;
    transition: all 0.3s ease;
    padding: 8px 0;
}

.menu-item:hover .menu-title {
    color: #2196f3;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.menu-item:hover .menu-title::after {
    width: 100%;
}

.menu-title::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: linear-gradient(45deg, #1976d2, #2196f3);
    transition: width 0.3s ease;
}

/* Ripple Effect */
.v-ripple__container {
    opacity: 0.2;
    border-radius: 12px;
}

.waves {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 64px;
    overflow: hidden;
    z-index: 101;
}

.header-wrapper::before {
    z-index: 99;
}

/* Стили для волн */
.wave {
    position: absolute;
    width: 200%;
    height: 100%;
    background-repeat: repeat-x;
    background-position: 0 -50px; /* Подкорректировано положение волн */
    transform-origin: center bottom;
}

.wave1 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgba(255, 255, 255, 0.1)'/%3E%3C/svg%3E");
    animation: wave 12s linear infinite;
}

.wave2 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgba(255, 255, 255, 0.07)'/%3E%3C/svg%3E");
    animation: wave 18s linear infinite;
}

.wave3 {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 88.7'%3E%3Cpath d='M800 56.9c-155.5 0-204.9-50-405.5-49.9-200 0-250 49.9-394.5 49.9v31.8h800v-.2-31.6z' fill='rgba(255, 255, 255, 0.05)'/%3E%3C/svg%3E");
    animation: wave 24s linear infinite;
}

@keyframes wave {
    0% {
        transform: translateX(0) translateZ(0) scaleY(1);
    }
    50% {
        transform: translateX(-25%) translateZ(0) scaleY(0.55);
    }
    100% {
        transform: translateX(-50%) translateZ(0) scaleY(1);
    }
}
</style>
