import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useCalculationsStore } from './calculations';

export const useCoordinatesStore = defineStore('coordinates', () => {
  const coordinates = ref([]);
  const interpolatedPoints = ref([]);
  const defaultPointsCount = 4;
  const pipelineLength = ref(0);
  const isLoading = ref(false);
  const calculationsStore = useCalculationsStore();
  
  // История изменений
  const history = ref([]);
  const historyIndex = ref(-1);
  const maxHistoryLength = 20;

  // Валидация и анализ
  const validatePoint = (point) => {
    if (point.section === null || point.section === undefined || 
        point.height === null || point.height === undefined) {
      return false;
    }

    const totalPipelineLength = calculationsStore.pumpResults?.lengthPipeline?.reduce((sum, length) => sum + length, 0) || 0;
    if (point.section < 0 || point.section > totalPipelineLength) {
      return false;
    }

    return true;
  };

  const profileAnalysis = computed(() => {
    const points = sortedCoordinates.value;
    if (points.length < 2) return null;

    const analysis = {
      totalDistance: points[points.length - 1].section - points[0].section,
      maxHeight: Math.max(...points.map(p => p.height)),
      minHeight: Math.min(...points.map(p => p.height)),
      totalElevationGain: 0,
      steepestGradient: 0,
      remainingLength: pipelineLength.value - points[points.length - 1].section,
      warnings: []
    };

    for (let i = 1; i < points.length; i++) {
      const elevationDiff = points[i].height - points[i-1].height;
      const distance = points[i].section - points[i-1].section;
      
      if (elevationDiff > 0) {
        analysis.totalElevationGain += elevationDiff;
      }
      
      const gradient = Math.abs(elevationDiff / distance);
      analysis.steepestGradient = Math.max(analysis.steepestGradient, gradient);
    }

    // Анализ предупреждений
    if (analysis.steepestGradient > 0.45) {
      analysis.warnings.push({
        type: 'error',
        message: 'Обнаружен слишком крутой уклон (>45%)'
      });
    }

    if (analysis.maxHeight - analysis.minHeight > 200) {
      analysis.warnings.push({
        type: 'warning',
        message: 'Большой перепад высот (>200м)'
      });
    }

    if (points[points.length - 1].section < pipelineLength.value) {
      analysis.warnings.push({
        type: 'warning',
        message: `Не заполнен участок ${points[points.length - 1].section}км - ${pipelineLength.value}км`
      });
    }

    return analysis;
  });

  const sortedCoordinates = computed(() => {
    return [...coordinates.value].sort((a, b) => a.section - b.section);
  });

  const canAddPoint = computed(() => {
    if (coordinates.value.length === 0) return true;
    const lastPoint = sortedCoordinates.value[sortedCoordinates.value.length - 1];
    return lastPoint.section < pipelineLength.value;
  });

  const totalLength = computed(() => {
    if (coordinates.value.length === 0) return 0;
    return Math.max(...coordinates.value.map(point => point.section));
  });

  // Функции истории
  const saveToHistory = () => {
    if (historyIndex.value < history.value.length - 1) {
      history.value = history.value.slice(0, historyIndex.value + 1);
    }
    
    history.value.push(JSON.stringify(coordinates.value));
    if (history.value.length > maxHistoryLength) {
      history.value.shift();
    }
    historyIndex.value = history.value.length - 1;
  };

  const validateTotalLength = () => {
    const totalPipelineLength = calculationsStore.pumpResults?.lengthPipeline?.reduce((sum, length) => sum + length, 0) || 0;
    const lastPoint = sortedCoordinates.value[sortedCoordinates.value.length - 1];
    
    if (!lastPoint || lastPoint.section < totalPipelineLength) {
      throw new Error(`Последняя точка (${lastPoint?.section || 0}км) не достигает конца трубопровода (${totalPipelineLength}км)`);
    }
  };

  const undo = () => {
    if (historyIndex.value > 0) {
      historyIndex.value--;
      coordinates.value = JSON.parse(history.value[historyIndex.value]);
      interpolatePoints();
      return true;
    }
    return false;
  };

  const redo = () => {
    if (historyIndex.value < history.value.length - 1) {
      historyIndex.value++;
      coordinates.value = JSON.parse(history.value[historyIndex.value]);
      interpolatePoints();
      return true;
    }
    return false;
  };

  // Улучшенная интерполяция
  const interpolatePoints = () => {
    const points = sortedCoordinates.value;
    if (points.length < 2) return;

    const result = [];
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const segmentLength = next.section - current.section;
      
      // 4 точки на километр для плавности
      const pointsPerKm = 4;
      const steps = Math.max(segmentLength * pointsPerKm, 1);

      for (let j = 0; j <= steps; j++) {
        const x = current.section + (j / pointsPerKm);
        
        // Улучшенная сплайн-интерполяция с натуральной кривизной
        const t = j / steps;
        const t2 = t * t;
        const t3 = t2 * t;
        const h1 = 2*t3 - 3*t2 + 1;
        const h2 = -2*t3 + 3*t2;
        const h3 = t3 - 2*t2 + t;
        const h4 = t3 - t2;

        // Добавляем натуральную кривизну
        const y = current.height * h1 + next.height * h2 + 
                 (next.height - current.height) * (h3 + h4);

        result.push({ x, y });
      }
    }

    // Добавляем последнюю точку
    const lastPoint = points[points.length - 1];
    if (!result.find(p => Math.abs(p.x - lastPoint.section) < 0.01)) {
      result.push({ x: lastPoint.section, y: lastPoint.height });
    }

    interpolatedPoints.value = result;
  };

  const initializeDefaultCoordinates = async (totalPipelineLength) => {
    if (!totalPipelineLength) return;
    
    try {
      isLoading.value = true;
      pipelineLength.value = totalPipelineLength;
      const step = totalPipelineLength / (defaultPointsCount - 1);
      
      coordinates.value = Array.from({ length: defaultPointsCount }, (_, i) => {
        const section = Math.round(i * step);
        const baseHeight = 150;
        const variation = Math.sin(i / (defaultPointsCount - 1) * Math.PI) * 20;
        const randomNoise = (Math.random() - 0.5) * 10;
        const trend = (i / (defaultPointsCount - 1)) * 15;
        
        const height = baseHeight + variation + randomNoise + trend;
        
        return { 
          section, 
          height: Math.round(Math.max(0, height))
        };
      });

      saveToHistory();
      interpolatePoints();
    } finally {
      isLoading.value = false;
    }
  };

  const updateCoordinates = (newCoordinates) => {
    try {
      const validCoordinates = newCoordinates.filter(point => validatePoint(point));
      
      const hasZeroPoint = validCoordinates.some(point => point.section === 0);
      if (!hasZeroPoint) {
        throw new Error('Необходима точка в начале трубопровода (0 км)');
      }

      validateTotalLength();

      const sortedCoordinates = [...validCoordinates].sort((a, b) => a.section - b.section);
      
      saveToHistory();
      coordinates.value = sortedCoordinates;
      interpolatePoints();
    } catch (error) {
      console.error('Error updating coordinates:', error);
      throw error;
    }
  };

  const setPipelineLength = (length) => {
    pipelineLength.value = length;
  };

  const resetStore = () => {
    coordinates.value = [];
    interpolatedPoints.value = [];
    history.value = [];
    historyIndex.value = -1;
  };

  return {
    coordinates,
    interpolatedPoints,
    defaultPointsCount,
    sortedCoordinates,
    profileAnalysis,
    canAddPoint,
    pipelineLength,
    totalLength,
    isLoading,
    interpolatePoints,
    initializeDefaultCoordinates,
    updateCoordinates,
    setPipelineLength,
    resetStore,
    undo,
    redo,
    canUndo: computed(() => historyIndex.value > 0),
    canRedo: computed(() => historyIndex.value < history.value.length - 1)
  };
});