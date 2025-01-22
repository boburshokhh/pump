<template>
  <div>
    <PumpChart/>
    <!-- <BaseCanculationInfoGet/> -->
    <BaseTable/>
    
  </div>
</template>

<script>

import BaseCanculationInfoGet from "../components/calculation/BaseCanculationInfoGet.vue";
import PumpChart from "../components/features/PumpChart.vue";
import BaseTable from "../components/base/BaseTable.vue";
export default {
  components: {
    BaseCanculationInfoGet,
    PumpChart,
    BaseTable
  },
};
</script>

<style></style>
