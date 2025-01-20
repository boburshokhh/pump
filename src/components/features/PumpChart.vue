<template>
  <n-card>
    <div style="position: relative">
      <canvas id="pumpChart" ref="chartCanvas" />
      <v-btn
        icon="mdi mdi-file-download-outline"
        @click="saveChartAsImage"
        style="position: absolute; top: 10px; right: 10px"
      />

      <v-btn
        icon="mdi mdi-magnify-minus-outline"
        @click="resetZoom"
        style="position: absolute; top: 10px; left: 10px"
      >
      </v-btn>
    </div>

    <!-- <n-space vertical>
      <n-slider v-model:value="range" range :step="1" />
      <n-space  justify="center">
        <n-input-number v-model:value="range[0]" size="small" />
        <n-input-number v-model:value="range[1]" size="small" />
      </n-space>
    </n-space> -->
  </n-card>
</template>

<script>
import { defineComponent, ref, onMounted, reactive, watch } from "vue";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";

Chart.register(zoomPlugin);

export default defineComponent({
  name: "PumpChart",
  setup() {
    const chartCanvas = ref(null); // Реф для canvas элемента
    const chartInstance = ref(null);

    // Исходные данные
    const originalData = reactive({
      labels: [
        "100 км",
        "200 км",
        "300 км",
        "400 км",
        "500 км",
        "600 км",
        "700 км",
        "800 км",
        "900 км",
        "1000 км",
        "1100 км",
        "1200 км",
        "1300 км",
        "1400 км",
        "1500 км",
      ],
      datasets: [
        {
          label: "Гидравлический уклон",
          data: [
            500, 400, 300, 200, 100, 500, 400, 300, 200, 100, 500, 400, 300,
            200, 100,
          ],
          data: [
            { x: 0, y: 500 }, // Точка 1
            { x: 200, y: 400 }, // Точка 2
            { x: 200, y: 300 }, // Точка 3
            { x: 500, y: 200 }, // Точка 4
            { x: 500, y: 100 },
            { x: 500, y: 500 }, // Точка 1+
          ],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0,
        },
        {
          label: "Напор насоса",
          data: [30, 35, 45, 51, 55, 50],
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          tension: 0,
        },
        {
          label: "Статическая линия",
          data: [50, 50, 50, 50, 50, 50],
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          tension: 0,
        },
      ],
    });

    const filteredData = reactive({
      labels: [...originalData.labels],
      datasets: originalData.datasets.map((dataset) => ({
        ...dataset,
        data: [...dataset.data],
      })),
    });

    const range = ref([0, 600]);

    const filterData = () => {
      const minIndex = Math.floor(
        (range.value[0] / 600) * originalData.labels.length
      );
      const maxIndex = Math.ceil(
        (range.value[1] / 600) * originalData.labels.length
      );

      filteredData.labels = originalData.labels.slice(minIndex, maxIndex);
      filteredData.datasets = originalData.datasets.map((dataset) => ({
        ...dataset,
        data: dataset.data.slice(minIndex, maxIndex),
      }));
    };

    onMounted(() => {
      const ctx = chartCanvas.value.getContext("2d");

      chartInstance.value = new Chart(ctx, {
        type: "line",
        data: filteredData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            tooltip: {
              enabled: true,
              mode: "nearest",
              intersect: false,
              callbacks: {
                label: (context) => {
                  const value = context.raw;
                  return `Значение: ${value}`;
                },
              },
            },
            zoom: {
              pan: {
                enabled: true,
                mode: "xy",
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: "xy",
              },
            },
          },
          scales: {
            x: {
              type: "linear", // Включение линейной шкалы для оси X
              title: {
                display: true,
                text: "Позиция (км)",
              },
            },
            y: {
              type: "linear", // Линейная шкала для оси Y
              title: {
                display: true,
                text: "Значение давления (м)",
              },
              min: 0, // Минимальное значение (регулируйте при необходимости)
              max: 600, // Максимальное значение (регулируйте в зависимости от данных)
            },
          },
        },
      });
    });

    const resetZoom = () => {
      if (chartInstance.value) {
        chartInstance.value.resetZoom();
      }
    };

    const saveChartAsImage = () => {
      if (chartCanvas.value) {
        const canvas = chartCanvas.value;
        const image = canvas.toDataURL("image/png");

        const link = document.createElement("a");
        link.href = image;
        link.download = "chart.png";
        link.click();
      }
    };
    watch(range, () => {
      filterData();
      if (chartInstance.value) {
        chartInstance.value.update();
      }
    });

    return {
      chartCanvas,
      saveChartAsImage,
      resetZoom,
      range,
    };
  },
});
</script>

<style scoped>
canvas {
  width: 100%;
  height: 300px;
}

.v-btn {
  cursor: pointer;
}
</style>
