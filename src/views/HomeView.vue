<template>
  <div>
    <PumpChart />
    <BaseTable />
  </div>
</template>

<script>
import BaseTable from "../components/base/BaseTable.vue";
import PumpChart from "../components/features/PumpChart.vue";
import { calculatePumpEfficiency } from "../components/calculation/calculation";
export default {
  components: {
    BaseTable,
    PumpChart,
  },
  mounted(){
    const calculation=calculatePumpEfficiency()
  }
};

</script>

<style></style>