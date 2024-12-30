<template>
  <v-data-table
    :style="{ backgroundColor: '#F5F5F5' }"
    v-model:expanded="expanded"
    :headers="dessertHeaders"
    :items="desserts" 
    item-value="name"
  >
    <template v-slot:expanded-row="{ item }">
      <td :colspan="dessertHeaders.length">
        <v-table :style="{ backgroundColor: 'rgba(155, 148, 162, 1)' }">
          <thead>
            <tr> 
              <th class="text-left">Тип</th>
              <th class="text-left">Ротор</th>
              <th class="text-left">Кол-во насосов</th>
              <th class="text-left">Обороты</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(pump, index) in item.pumps" :key="index">
              <td>{{ pump.type }}</td>
              <td>{{ pump.rotor }}</td>
              <td>{{ pump.numOfPumps }}</td>
              <td>{{ pump.rpm }}</td>
            </tr>
          </tbody>
        </v-table>
      </td>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      expanded: [],
      dessertHeaders: [
        {
          title: "Dessert (100g serving)",
          align: "start",
          sortable: false,
          key: "name",
        },
        { title: "Calories", key: "calories" },
        { title: "Fat (g)", key: "fat" },
        { title: "Carbs (g)", key: "carbs" },
        { title: "Protein (g)", key: "protein" },
        { title: "Iron (%)", key: "iron" },
        { title: "", key: "data-table-expand" },
      ],
      desserts: [
        {
          name: "Frozen Yogurt",
          calories: 159,
          fat: 6.0,
          carbs: 24,
          protein: 4.0,
          iron: 1,
          pumps: [
            { type: "ПНС", rotor: "D-56(ПУУМ)", numOfPumps: 2, rpm: 980 },
            { type: "МНС", rotor: "D-475", numOfPumps: 0, rpm: 2980 },
          ],
        },
        {
          name: "Ice cream sandwich",
          calories: 237,
          fat: 9.0,
          carbs: 37,
          protein: 4.3,
          iron: 1,
          pumps: [
            { type: "ПНС", rotor: "D-56(ПУУМ)", numOfPumps: 2, rpm: 980 },
            { type: "МНС", rotor: "D-475", numOfPumps: 0, rpm: 2980 },
          ],
        },
      ],
    };
  },
};
</script>