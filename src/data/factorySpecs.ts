/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VINData } from '../types/automotive';

export const VEHICLE_REGISTRY: Record<string, VINData> = {
  "JT123SUPRA30": {
    vin: "JT123SUPRA30",
    make: "TOYOTA",
    model: "GR SUPRA",
    year: 2024,
    trim: "3.0 PREMIUM",
    engine: {
      displacement: "3.0L",
      cylinders: 6,
      fuelType: "93 OCTANE",
      forcedInduction: "SINGLE TURBO (B58)"
    },
    chassis: {
      driveType: "RWD",
      bodyStyle: "COUPE",
      wheelbase: "97.2 IN"
    }
  },
  "WBS123M2COMPETITION": {
    vin: "WBS123M2COMPETITION",
    make: "BMW",
    model: "M2",
    year: 2023,
    trim: "COMPETITION",
    engine: {
      displacement: "3.0L",
      cylinders: 6,
      fuelType: "93 OCTANE",
      forcedInduction: "TWIN TURBO (S58)"
    },
    chassis: {
      driveType: "RWD",
      bodyStyle: "COUPE",
      wheelbase: "108.1 IN"
    }
  },
  "WP0123GT3RS": {
    vin: "WP0123GT3RS",
    make: "PORSCHE",
    model: "911 GT3 RS",
    year: 2024,
    trim: "992",
    engine: {
      displacement: "4.0L",
      cylinders: 6,
      fuelType: "93 OCTANE",
      forcedInduction: "NATURALLY ASPIRATED"
    },
    chassis: {
      driveType: "RWD",
      bodyStyle: "COUPE",
      wheelbase: "96.7 IN"
    }
  }
};

export const PART_REGISTRY = [
  { 
    id: 'intake-v3', 
    name: 'Eventuri Carbon Intake', 
    category: 'INTAKE', 
    massKg: -2.3, 
    hpGain: 12, 
    torqueGain: 8,
    torqueSpec: "35 NM",
    tools: ["10MM SOCKET", "T25 TORX"],
    compatibility: ["TOYOTA", "BMW"]
  },
  { 
    id: 'exhaust-ti', 
    name: 'Akrapovic Evolution', 
    category: 'EXHAUST', 
    massKg: -15.4, 
    hpGain: 18, 
    torqueGain: 14,
    torqueSpec: "45 NM",
    tools: ["13MM DEEP SOCKET", "BREAKER BAR"],
    compatibility: ["PORSCHE", "BMW"]
  },
  { 
    id: 'ecu-flash', 
    name: 'DYNAMICS Stage 2+', 
    category: 'TUNER', 
    massKg: 0, 
    hpGain: 65, 
    torqueGain: 80,
    torqueSpec: "N/A",
    tools: ["OBDII INTERFACE"],
    compatibility: ["TOYOTA", "BMW", "PORSCHE"]
  },
  { 
    id: 'aero-wing', 
    name: 'GT4 High-Downforce Wing', 
    category: 'AERO', 
    massKg: 12.0, 
    hpGain: -2, 
    torqueGain: 0,
    torqueSpec: "25 NM",
    tools: ["4MM HEX", "BLUE LOCTITE"],
    compatibility: ["PORSCHE", "TOYOTA"]
  },
];
