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
    const getPumpsList = {
        ...pumps.selectOptions.centrifugal_pumps,
        ...pumps.selectOptions.powerful_pumps
    };
    const pumps_stations = storePumpsStations.getStations;

    // Инициализация массивов для хранения параметров
    const consumptionStation = [];    // Расход на станциях [м³/ч]
    const d_internal = [];            // Внутренний диаметр труб [м]
    const dh_pump = [];               // Напор насосов [м]
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
    const h_inlet_first_pump = 60;    // Напор на входе первого насоса [м]

    // Массивы для промежуточных расчетов
    const lam = [];                   // Коэффициент гидравлического сопротивления
    const h_in = [];                  // Напор на входе станций [м]
    const h_out = [];                 // Напор на выходе станций [м]
    const head_loss = [];             // Потери напора [м]
    const Re = [];                    // Число Рейнольдса
    const afp_conc = [];             // Концентрация ПТП [ppm]
    const afp_efficiency = [];        // Эффективность ПТП [%]

    pumps_stations.forEach((station) => {
        consumptionStation.push(station.flow);
        lengthPipeline.push(station.length);
        diameterPipe.push(station.pipeParameters.diameter / 1000);
        wallThicknessPipe.push(station.pipeParameters.wallThickness / 1000);
        roughnessPipe.push(station.pipeParameters.roughness / 1000);
        densityLiquid.push(station.liquidParameters.density);
        viscosityLiquid.push(station.liquidParameters.viscosity);
        afp_conc.push(station.afp_consumption);
        // Новая формула эффективности ПТП с учетом нелинейности и насыщения
        const efficiency = Math.min(45, station.afp_consumption * Math.sqrt(station.flow/1000) * 5);
        afp_efficiency.push(efficiency);
    });

    // Определение насосов для каждой станции
    const pumpstationids = pumps_stations.map(station =>
        station.pumps.map(pump => pump.id)
    );

    const selectedPumps = pumpstationids.map(stationIds =>
        stationIds.map(id => {
            // Ищем насос сначала в обычных, потом в мощных насосах
            const pump = pumps.selectOptions.centrifugal_pumps.find(p => p.id === id) ||
                        pumps.selectOptions.powerful_pumps.find(p => p.id === id);
            
            if (!pump) {
                console.warn(`Насос с ID ${id} не найден`);
                return null;
            }
            return pump;
        }).filter(pump => pump !== null) // Убираем null значения
    );

    // Расчёт напора для каждой станции
    h_in[0] = h_inlet_first_pump + dh_pns;
    for (let i = 0; i < selectedPumps.length; i++) {
        let stationFlow = 0;
        
        selectedPumps[i].forEach((pump, j) => {
            if (!pump) return; // Пропускаем, если насос не найден

            const nominal_rotation_speed = pump.nominal_rotation_speed;
            const fact_rotation_speed = pumps_stations[i].pumps[j].fact_rpm;
            const numOfPumps = pumps_stations[i].pumps[j].numOfPumps;
            
            let Q_single_pump;
            console.log("pump_stations[i].connectionType:",pumps_stations[i].connectionType)
            if (pumps_stations[i].connectionType === 'serial') {
                
                Q_single_pump = consumptionStation[i];
            } else {
                Q_single_pump = consumptionStation[i] / numOfPumps;
            }
            
            const dh_single_pump = pump.a_approc * Math.pow(fact_rotation_speed/nominal_rotation_speed, 2) 
                                  - pump.b_approc * Math.pow(Q_single_pump, 2);
            
            if (pumps_stations[i].connectionType === 'serial') {
                stationFlow += dh_single_pump * numOfPumps;
            } else {
                if (j === 0) {
                    stationFlow = dh_single_pump;
                }
            }
        });
        
        dh_pump.push(stationFlow);
    }
    // console.log("dh_pump:",dh_pump)


    // Расчёт внутренних диаметров труб
    for (let i = 0; i < diameterPipe.length; i++) {
        d_internal.push(diameterPipe[i] - 2 * wallThicknessPipe[i]);
    }

    // Расчет скорости потока
    for (let i = 0; i < pumps_stations.length; i++) {
        speed.push(4 * consumptionStation[i] / (3600 * Math.PI * Math.pow(d_internal[i], 2)));
    }

    // Расчет гидравлических параметров с учетом ПТП
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

        // Применение эффекта ПТП к коэффициенту гидравлического сопротивления
        if (afp_conc[i] > 0) {
            lam[i] = lam[i] * (1 - afp_efficiency[i] / 100);
        }

        // Расчет потерь напора с учетом ПТП
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

    const N_potreb = []
    // Интеграция расчета эффективности насосов
    const pumpPerformanceResults = pumps_stations.map((station, index) => {
        const stationPumpsResults = station.pumps.map((pumpStation, pumpIndex) => {
            const selectedPump = pumps.selectOptions.centrifugal_pumps.find(p => p.id === pumpStation.id) ||
                               pumps.selectOptions.powerful_pumps.find(p => p.id === pumpStation.id);

            if (!selectedPump) {
                console.warn(`Насос с ID ${pumpStation.id} не найден`);
                return null;
            }

            const nominal_rpm = selectedPump.nominal_rotation_speed;
            const fact_rpm = pumpStation.fact_rpm;
            const numOfPumps = pumpStation.numOfPumps;
            const efficiency = selectedPump.efficiency_percent;
            
            let Q_single_pump;
            if (station.connectionType === 'serial') {
                Q_single_pump = consumptionStation[index];
            } else {
                Q_single_pump = consumptionStation[index] / numOfPumps;
            }
            
            const dh_single = selectedPump.a_approc * Math.pow(fact_rpm / nominal_rpm, 2) 
                             - selectedPump.b_approc * Math.pow(Q_single_pump, 2);
            
            const N = densityLiquid[index] * g * (Q_single_pump / 3600) * dh_single;
            const N_potreb = N / (efficiency / 100);
            
            return {
                pumpId: pumpStation.id,
                name: pumpStation.name,
                head: dh_single,
                power: N_potreb,
                totalPower: N_potreb * numOfPumps,
            };
        }).filter(result => result !== null); // Убираем null значения
        
        const totalStationPower = stationPumpsResults.reduce((sum, pumpResult) => 
            sum + pumpResult.totalPower, 0);
        
        return {
            pumps: stationPumpsResults,
            totalPower: totalStationPower,
        };
    });
    

    let dataObject = {
        head_loss,
        h_in,
        h_out,
        lengthPipeline,
        consumptionStation,
        speed,
        Re,
        dh_pump,
        pumpPerformanceResults,
        afp_conc,
        afp_efficiency
    };
    console.log("dataObject:",dataObject)
    return dataObject;
}
