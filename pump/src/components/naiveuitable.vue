<template>
  <n-space vertical :size="12">
    <n-space>
      <n-button @click="downloadCsv"> Export CSV (original data) </n-button>
      <n-button @click="exportSorterAndFilterCsv">
        Export CSV (displayed data)
      </n-button>
    </n-space>
  </n-space>
  <n-data-table
    :columns="columns"
    :data="data"
    :cascade="false"
    @load="onLoad"
    :get-csv-cell="getCsvCell"
    :get-csv-header="getCsvHeader"
  />
</template>
  
  <script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  setup() {
    const tableRef = ref();
    const columns = [
      { type: "selection" },
      { key: "example", title: "Example" },
    ];
    const dataRef = ref([
      { key: "p1", example: "p1", isLeaf: false },
      { key: "p2", example: "p2", isLeaf: false },
      { key: "p3", example: "p3", isLeaf: false },
    ]);
    const downloadCsv = () =>
      tableRef.value?.downloadCsv({ fileName: "data-table" });

    const exportSorterAndFilterCsv = () =>
      tableRef.value?.downloadCsv({
        fileName: "sorter-filter",
        keepOriginalData: false,
      });

    const getCsvCell = (value, _, column) => {
      if (column.key === "age") {
        return `${value} years old`;
      }
      return value;
    };
    const getCsvHeader = (col) => {
      if (typeof col.title === "function") {
        return col.key === "age" ? "Age" : "Unknown";
      } else {
        return col.title || "Unknown";
      }
    };
    return {
      columns,
      data: dataRef,
      tableRef,
      getCsvCell,
      getCsvHeader,
      downloadCsv,
      onLoad(row) {
        return new Promise((resolve) => {
          setTimeout(() => {
            row.children = [{ key: `${row.key}-1`, example: `${row.key}-1` }];
            resolve();
          }, 1e3);
        });
      },
    };
  },
});
</script>