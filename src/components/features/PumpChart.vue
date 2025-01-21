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
import { calculatePumpEfficiency } from "../calculation/calculation";

Chart.register(zoomPlugin);

export default defineComponent({
  name: "PumpChart",
  setup() {
    const chartCanvas = ref(null);
    const chartInstance = ref(null);
    const calculationsStore = calculatePumpEfficiency();
    
    const processData = (data) => {
      const points = [];
      let currentLength = 0;
      
      for (let i = 0; i < data.lengthPipeline.length; i++) {
        points.push({
          x: currentLength,
          y: data.h_in[i]
        });
        
        points.push({
          x: currentLength,
          y: data.h_out[i]
        });
        
        currentLength += data.lengthPipeline[i];
        
        if (i < data.lengthPipeline.length - 1) {
          points.push({
            x: currentLength,
            y: data.h_in[i + 1]
          });
        }
      }
      return points;
    };

    const originalData = reactive({
      datasets: [
        {
          label: "Гидравлический уклон",
          data: processData(calculationsStore),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0,
          fill: false
        }
      ]
    });

    const range = ref([0, 600]);

    const filterData = () => {
      const minIndex = Math.floor(
        (range.value[0] / 600) * originalData.labels.length
      );
      const maxIndex = Math.ceil(
        (range.value[1] / 600) * originalData.labels.length
      );

      originalData.labels = originalData.labels.slice(minIndex, maxIndex);
      originalData.datasets = originalData.datasets.map((dataset) => ({
        ...dataset,
        data: dataset.data.slice(minIndex, maxIndex),
      }));
    };

    const updateChart = () => {
      if (chartInstance.value) {
        originalData.datasets[0].data = processData(calculationsStore);
        chartInstance.value.update();
      }
    };

    watch(
      () => ({
        h_in: [...calculationsStore.h_in],
        h_out: [...calculationsStore.h_out],
        lengthPipeline: [...calculationsStore.lengthPipeline],
        head_loss: [...calculationsStore.head_loss]
      }),
      () => {
        console.log(calculationsStore.h_in);
        updateChart();
      },
      { deep: true }
    );

    onMounted(() => {
      const ctx = chartCanvas.value.getContext("2d");

      chartInstance.value = new Chart(ctx, {
        type: "line",
        data: originalData,
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
                  return `Высота: ${context.raw.y} м`;
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
              type: "linear",
              title: {
                display: true,
                text: "Длина трубопровода (км)",
              },
            },
            y: {
              type: "linear",
              title: {
                display: true,
                text: "Напор (м)",
              },
              min: Math.min(...calculationsStore.h_in) * 0.9,
              max: Math.max(...calculationsStore.h_out) * 1.1,
            },
          },
          animation: {
            duration: 500 
          }
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
      updateChart 
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
