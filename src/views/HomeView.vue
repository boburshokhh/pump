<template>
  <div>
    <PumpChart />
    <BaseTable />
  </div>
</template>

<script>
import BaseTable from "../components/base/BaseTable.vue";
import PumpChart from "../components/features/PumpChart.vue";
export default {
  components: {
    BaseTable,
    PumpChart,
  },
};

</script>

<style></style>