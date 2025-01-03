  <template>
    <v-footer
      class="bg-indigo-lighten-1 text-center d-flex flex-column"
    >
      <div>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-4"
          variant="text"
        ></v-btn>
      </div>
      <div class="pt-0">
        © 2024 РГУ нефти и газа (НИУ) имени И.М. Губкина. Все права защищены
      </div>
      <v-divider></v-divider>
    </v-footer>
  </template>

  <script>
  export default {
    data: () => ({
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ],
    }),
  }
</script>