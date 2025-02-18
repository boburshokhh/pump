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
  </n-card>
</template>

<script>
import {
  defineComponent,
  ref,
  onMounted,
  reactive,
  watch,
  shallowRef,
} from "vue";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import { useCalculationsStore } from "../../stores/calculations";
import { useCoordinatesStore } from "../../stores/coordinates";

Chart.register(zoomPlugin);

export default defineComponent({
  name: "PumpChart",
  props: {
    pumpResults: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const chartCanvas = ref(null);
    const chartInstance = shallowRef(null);
    const calculationsStore = useCalculationsStore();
    const coordinatesStore = useCoordinatesStore();

    // Watch for changes in pump results
    watch(
      () => calculationsStore.calculateClicked,
      (newValue) => {
        if (newValue && chartInstance.value && calculationsStore.pumpResults) {
          updateChart();
          calculationsStore.setCalculateClicked(false);
        }
      }
    );

    // Watch for changes in coordinates
    watch(
      () => coordinatesStore.interpolatedPoints,
      () => {
        if (chartInstance.value) {
          updateChart();
        }
      },
      { deep: true }
    );

    const processData = (data) => {
      if (!data || !data.lengthPipeline || !data.h_in || !data.h_out) {
        console.error("Invalid data format passed to processData:", data);
        return [];
      }
      const points = [];
      let currentLength = 0;

      for (let i = 0; i < data.lengthPipeline.length; i++) {
        points.push({
          x: currentLength,
          y: data.h_in[i],
        });

        points.push({
          x: currentLength,
          y: data.h_out[i],
        });

        currentLength += data.lengthPipeline[i];

        if (i === data.lengthPipeline.length - 1) {
          points.push({
            x: currentLength,
            y: data.h_in[i + 1],
          });
        }
      }
      return points;
    };

    const updateChart = () => {
      if (!chartInstance.value) return;

      const hydraulicData = processData(calculationsStore.pumpResults);
      const heightData = coordinatesStore.interpolatedPoints.map(point => ({
        x: point.x,
        y: point.y
      }));

      chartInstance.value.data.datasets[0].data = hydraulicData;
      chartInstance.value.data.datasets[1].data = heightData;

      // Update axis limits
      const maxX = Math.max(
        ...hydraulicData.map(p => p.x),
        ...heightData.map(p => p.x)
      );
      const minY = Math.min(
        ...hydraulicData.map(p => p.y),
        ...heightData.map(p => p.y)
      ) * 0.9;
      const maxY = Math.max(
        ...hydraulicData.map(p => p.y),
        ...heightData.map(p => p.y)
      ) * 1.1;

      chartInstance.value.options.scales.x.max = maxX;
      chartInstance.value.options.scales.y.min = minY;
      chartInstance.value.options.scales.y.max = maxY;

      chartInstance.value.update('active');
    };

    onMounted(() => {
      const ctx = chartCanvas.value.getContext("2d");
      chartInstance.value = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "Гидравлический уклон",
              data: processData(calculationsStore.pumpResults),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0,
              fill: false,
            },
            {
              label: "Высотные отметки трубы",
              data: coordinatesStore.interpolatedPoints.map(point => ({
                x: point.x,
                y: point.y
              })),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              tension: 0.3,
              fill: false,
              cubicInterpolationMode: 'monotone',
              borderWidth: 1.5,
              pointRadius: 1,
              pointHoverRadius: 3,
              pointBackgroundColor: "rgba(255, 99, 132, 0.8)",
              pointBorderColor: "rgba(255, 99, 132, 1)",
              pointHoverBackgroundColor: "rgba(255, 99, 132, 1)",
              pointHoverBorderColor: "rgba(255, 255, 255, 1)",
              pointBorderWidth: 1,
              spanGaps: true
            },
          ],
        },
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
              intersect: true,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
              titleFont: {
                size: 14,
                weight: "bold",
              },
              bodyFont: {
                size: 13,
              },
              padding: 12,
              displayColors: false,
              callbacks: {
                title: (items) => {
                  if (!items.length) return "";
                  const item = items[0];
                  return `Участок ${Math.floor(item.dataIndex / 2) + 1}`;
                },
                label: (context) => {
                  if (!context || !context.raw) return null;
                  const labels = [
                    `Напор: ${context.raw.y.toFixed(2)} м`,
                    `Протяженность трубопровода: ${context.raw.x.toFixed(
                      2
                    )} км`,
                  ];
                  return labels;
                },
              },
            },

            zoom: {
              pan: {
                enabled: true,
                mode: "xy",
                modifierKey: "shift",
                speed: 10,
                threshold: 10,
              },
              zoom: {
                wheel: {
                  enabled: true,
                  speed: 0.1,
                  modifierKey: "ctrl",
                },
                pinch: {
                  enabled: true,
                },
                mode: "xy",
                drag: {
                  enabled: true,
                  backgroundColor: "rgba(75, 192, 192, 0.3)",
                  borderColor: "rgba(75, 192, 192, 0.8)",
                  borderWidth: 1,
                },
                limits: {
                  x: { min: "original", max: "original" },
                  y: { min: "original", max: "original" },
                },
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
              min: Math.min(...calculationsStore.pumpResults.h_in) * 0.9,
              max: Math.max(...calculationsStore.pumpResults.h_out) * 1.1,
            },
          },
          animation: {
            duration: 750,
            easing: "easeInOutQuart",
            mode: "active",
            animations: {
              numbers: {
                type: "number",
                duration: 1000,
              },
              x: {
                type: "number",
                from: 0,
                duration: 1000,
              },
              y: {
                type: "number",
                from: 0,
                duration: 1000,
              },
            },
            onProgress: function (animation) {
              // Можно добавить действия во время анимации
            },
            onComplete: function (animation) {
              // Можно добавить действия после завершения анимации
            },
          },
          transitions: {
            active: {
              animation: {
                duration: 100,
              },
            },
            resize: {
              animation: {
                duration: 200,
              },
            },
            show: {
              animations: {
                y: {
                  from: 0,
                },
              },
            },
            hide: {
              animations: {
                y: {
                  to: 0,
                },
              },
            },
          },
          responsiveAnimationDuration: 0,
          hover: {
            animationDuration: 0,
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

    return {
      chartCanvas,
      saveChartAsImage,
      resetZoom,
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
