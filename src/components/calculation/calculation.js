// utils/calculatePumpEfficiency.js
import { useIndexStore } from "../../stores/index";
import { useOptionsStore } from "../../stores/options";

// Функция для получения данных о насосных станциях и параметрах трубопроводов
function collectPumpStationData() {
    const storePumpsStations = useIndexStore();
    const pumps_stations = storePumpsStations.getStations;

    const pumpIds = [];
    const pumpNumbers = [];
    const factRotationalSpeeds = [];
    const lengthPipeline = [];
    const diameterPipe = [];
    const wallThicknessPipe = [];
    const roughnessPipe = [];
    const pressurePipe = [];
    const densityLiquid = [];
    const viscosityLiquid = [];
    const consumptionStation = [];

    pumps_stations.forEach(station => {
        station.pumps.forEach(pump => {
            pumpIds.push(pump.id);
            pumpNumbers.push(pump.numOfPumps);
            factRotationalSpeeds.push(pump.rpm);
        });

        lengthPipeline.push(station.length);
        diameterPipe.push(station.pipeParameters.diameter / 1000);
        wallThicknessPipe.push(station.pipeParameters.wallThickness / 1000);
        roughnessPipe.push(station.pipeParameters.roughness / 1000);
        pressurePipe.push(station.pipeParameters.pressure);
        densityLiquid.push(station.liquidParameters.density);
        viscosityLiquid.push(station.liquidParameters.viscosity);
        consumptionStation.push(station.flow);
    });

    return {
        pumps_stations,
        pumpIds,
        pumpNumbers,
        factRotationalSpeeds,
        lengthPipeline,
        diameterPipe,
        wallThicknessPipe,
        roughnessPipe,
        pressurePipe,
        densityLiquid,
        viscosityLiquid,
        consumptionStation,
    };
}

// Функция для получения массива pumpstationids
function getPumpStationIds(pumps_stations) {
    return pumps_stations.map(station =>
        station.pumps.map(pump => pump.id)
    );
}

// Функция для выбора насосов на основе pumpstationids
function selectPumps(pumpstationids, getPumpsList) {
    return pumpstationids.map(stationIds =>
        stationIds.map(id => getPumpsList.find(pump => pump.id === id))
    );
}

// Функция для расчёта напора на каждой станции
function calculateDifferentialFlowRate(selectedPumps, pumps_stations, consumptionStation) {
    return selectedPumps.map((pumps, i) => 
        pumps.reduce((flowRate, pump, j) => {
            const numOfPumps = pumps_stations[i].pumps[j].numOfPumps;
            return flowRate + (pump.a_approc - pump.b_approc * Math.pow(consumptionStation[i], 2)) * numOfPumps;
        }, 0)
    );
}

// Функция для расчёта внутренних диаметров труб
function calculateInternalDiameters(diameterPipe, wallThicknessPipe) {
    return diameterPipe.map((diameter, i) => diameter - 2 * wallThicknessPipe[i]);
}
//Функция для расчёта скрость жидкости внутри трубы

function calculateSpeed(densityLiquid, viscosityLiquid, d_internal) { 
    
}

// Главная функция
export function calculatePumpEfficiency(flowRate, pressure, power) {
    const pumps = useOptionsStore();
    const getPumpsList = pumps.selectOptions.centrifugal_pumps;

    const {
        pumps_stations,
        pumpIds,
        pumpNumbers,
        factRotationalSpeeds,
        lengthPipeline,
        diameterPipe,
        wallThicknessPipe,
        roughnessPipe,
        pressurePipe,
        densityLiquid,
        viscosityLiquid,
        consumptionStation,
    } = collectPumpStationData();

    const pumpstationids = getPumpStationIds(pumps_stations);
    const selectedPumps = selectPumps(pumpstationids, getPumpsList);
    const differentialFlowRate = calculateDifferentialFlowRate(selectedPumps, pumps_stations, consumptionStation);
    const d_internal = calculateInternalDiameters(diameterPipe, wallThicknessPipe);

    console.log("d_internal", d_internal);
    console.log("Differential Flow Rate", differentialFlowRate);
}
