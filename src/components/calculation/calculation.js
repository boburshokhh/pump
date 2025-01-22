import { useIndexStore } from "../../stores/index";
import { useOptionsStore } from "../../stores/options";

/**
 * Функция для форматированного вывода массива значений
 * @param {string} title - Название параметра
 * @param {Array} array - Массив значений
 * @param {string} units - Единицы измерения
 */

/**
 * Расчет эффективности насосных станций
 * @param {number} flowRate - Расход
 * @param {number} pressure - Давление
 * @param {number} power - Мощность
 * @param {number} initialPressure - Начальное давление
 * @param {number} temperature - Температура
 */
export function calculatePumpEfficiency() {
    // Получение данных из хранилищ
    const storePumpsStations = useIndexStore();
    const pumps = useOptionsStore();
    const getPumpsList = pumps.selectOptions.centrifugal_pumps;
    const pumps_stations = storePumpsStations.getStations;

    // Инициализация массивов для хранения параметров
    const consumptionStation = [];     // Расход на станциях [м³/ч]
    const d_internal = [];            // Внутренний диаметр труб [м]
    const dh_pump = [];                  // Напор насосов [м]
    const lengthPipeline = [];        // Длина трубопровода [км]
    const diameterPipe = [];          // Наружный диаметр труб [м]
    const wallThicknessPipe = [];     // Толщина стенки труб [м]
    const roughnessPipe = [];         // Шероховатость труб [м]
    const densityLiquid = [];         // Плотность жидкости [кг/м³]
    const viscosityLiquid = [];       // Вязкость жидкости [сСт]
    const speed = [];                 // Скорость потока [м/с]

    // Константы
    const g = 9.81;                   // Ускорение свободного падения [м/с²]
    const dh_pns = 100;               // Подъём насоса [м]
    const h_inlet_first_pump = 10;    // Напор на входе первого насоса [м]

    // Массивы для промежуточных расчетов
    const lam = [];                   // Коэффициент гидравлического сопротивления
    const h_in = [];                  // Напор на входе станций [м]
    const h_out = [];                 // Напор на выходе станций [м]
    const head_loss = [];             // Потери напора [м]
    const Re = [];                    // Число Рейнольдса

    pumps_stations.forEach((station) => {
        consumptionStation.push(station.flow);
        lengthPipeline.push(station.length);
        diameterPipe.push(station.pipeParameters.diameter / 1000);
        wallThicknessPipe.push(station.pipeParameters.wallThickness / 1000);
        roughnessPipe.push(station.pipeParameters.roughness / 1000);
        densityLiquid.push(station.liquidParameters.density);
        viscosityLiquid.push(station.liquidParameters.viscosity);
    });

    // Определение насосов для каждой станции
    const pumpstationids = pumps_stations.map(station =>
        station.pumps.map(pump => pump.id)
    );

    const selectedPumps = pumpstationids.map(stationIds =>
        stationIds.map(id => getPumpsList.find(pump => pump.id === id))
    );

    // Расчёт напора для каждой станции
    h_in[0] = h_inlet_first_pump + dh_pns
    for (let i = 0; i < selectedPumps.length; i++) {
        let stationFlow = 0;

        selectedPumps[i].forEach((pump, j) => {
            const numOfPumps = pumps_stations[i].pumps[j].numOfPumps;
            const pumpFlow = (pump.a_approc - pump.b_approc * Math.pow(consumptionStation[i], 2)) * numOfPumps;
            stationFlow += pumpFlow;
        });

        dh_pump.push(stationFlow);
    }


    // Расчёт внутренних диаметров труб
    for (let i = 0; i < diameterPipe.length; i++) {
        d_internal.push(diameterPipe[i] - 2 * wallThicknessPipe[i]);
    }

    // Расчет скорости потока
    for (let i = 0; i < pumps_stations.length; i++) {
        speed.push(4 * consumptionStation[i] / (3600 * Math.PI * Math.pow(d_internal[i], 2)));
    }

    // Расчет гидравлических параметров
    for (let i = 0; i < pumps_stations.length; i++) {
        // Расчет числа Рейнольдса
        Re[i] = (speed[i] * d_internal[i]) / (viscosityLiquid[i] * 1e-6);

        // Определение коэффициента гидравлического сопротивления
        if (Re[i] < 2320) {
            lam[i] = 64 / Re[i];
        } else if (Re[i] >= 2320 && Re[i] <= 10000) {
            const gamma = 1 - Math.exp(-0.002 * (Re[i] - 2320));
            lam[i] = (64 / Re[i]) * (1 - gamma) + (0.3164 / Math.pow(Re[i], 0.25)) * gamma;
        } else if (Re[i] >= 10000 && Re[i] < 27 * Math.pow(roughnessPipe[i] / d_internal[i], -1.143)) {
            lam[i] = 0.3164 / Math.pow(Re[i], 0.25);
        } else {
            lam[i] = 0.11 * Math.pow(68 / Re[i] + roughnessPipe[i] / d_internal[i], 0.25);
        }

        // Расчет потерь напора
        head_loss[i] = lam[i] * ((lengthPipeline[i] * 1000) / d_internal[i]) * (Math.pow(speed[i], 2) / (2 * g));
    }


    for (let i = 0; i < pumps_stations.length; i++) {
        if (i == 0) {
            h_out[i] = h_in[0] + dh_pump[i]
        } else {
            h_in[i] = h_out[i - 1] - head_loss[i - 1]
            h_out[i] = h_in[i] + dh_pump[i]
        }
    }

    const lastIndex = pumps_stations.length - 1;
    h_in[lastIndex + 1] = h_out[lastIndex] - head_loss[lastIndex];

    return {
        head_loss,
        h_in,
        h_out,
        lengthPipeline,
        consumptionStation,
        speed,
        Re,
        dh_pump
    }
}

