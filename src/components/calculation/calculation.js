// utils/calculatePumpEfficiency.js
import { useIndexStore } from "../../stores/index";
import { useOptionsStore } from "../../stores/options";

export function calculatePumpEfficiency(flowRate, pressure, power) {
    const storePumpsStations = useIndexStore();
    const pumps = useOptionsStore();
    const getPumpsList = pumps.selectOptions.centrifugal_pumps;
    const pumps_stations = storePumpsStations.getStations;

    // Define arrays to store pump parameters
    const aApprocPump = [];
    const bApprocPump = [];
    const pumpNumbers = [];
    const nominalRotationalSpeeds = [];
    const factRotationalSpeeds = [];
    const pumpIds = [];

    //Pipe parameters
    const lengthPipeline = [];
    const diameterPipe = [];
    const wallThicknessPipe = [];
    const roughnessPipe = [];
    const afpConcentration = [];
    const pressurePipe = [];

    //Liquid parameters
    const densityLiquid = [];
    const viscosityLiquid = [];

    //consumption
    const consumptionStation = [];
    const h_inlet_first_pump = 10;
    // Collect pump IDs and their parameters from pump stations
    pumps_stations.forEach(station => {
        station.pumps.forEach(pump => {
            pumpIds.push(pump.id); // Store pump IDs
            pumpNumbers.push(pump.numOfPumps); // Store number of pumps
            factRotationalSpeeds.push(pump.rpm); // Store nominal rotational speed
        });
        //Pipe parameters store
        lengthPipeline.push(station.length); // Store length of pipeline
        diameterPipe.push(station.pipeParameters.diameter/1000); // Store diameter of pipe
        wallThicknessPipe.push(station.pipeParameters.wallThickness/1000); // Store wall thickness of pipe
        roughnessPipe.push(station.pipeParameters.roughness/1000); // Store roughness of pipe
        pressurePipe.push(station.pipeParameters.pressure); // Store pressure of pipe

        //Liquid parameters store
        densityLiquid.push(station.liquidParameters.density); // Store density of liquid
        viscosityLiquid.push(station.liquidParameters.viscosity); // Store viscosity of liquid
        
        //Consumption station parameters store
        consumptionStation.push(station.flow);
    });

    // Filter the pumps that are in the selected pump list
    const selectedPumps = getPumpsList.filter(pump => pumpIds.includes(pump.id));

    // Extract `a_approc` and `b_approc` parameters from the selected pumps
    selectedPumps.forEach(pump => {
        aApprocPump.push(pump.a_approc);
        bApprocPump.push(pump.b_approc);
        nominalRotationalSpeeds.push(pump.max_rpm);
    });

    // Log the result for `a_approc` parameter
    // console.log("lengthPipeline",lengthPipeline)
    // console.log("diameterPipe",diameterPipe)
    // console.log("wallThicknessPipe",wallThicknessPipe)
    // console.log("roughnessPipe",roughnessPipe)
    // console.log("afpConcentration",afpConcentration)
    // console.log("pressurePipe",pressurePipe);
    
    // console.log("liquidDensity",densityLiquid,"liquidViscosity",viscosityLiquid);
    // console.log("consumption",consumptionStation);

    // console.log("aApprocPump",aApprocPump);
    // console.log("bApprocPump",bApprocPump);
    // console.log("nominalRotationalSpeeds",nominalRotationalSpeeds);
}
