/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Schema for Part Impact Analysis.
 * Used to calculate the "Performance Delta" and "Physical Tolerance"
 * when swapping components across vehicles.
 */
export interface PartImpactAnalysis {
  partId: string;
  sourceVehicleId: string;
  targetVehicleId: string;
  timestamp: string;
  
  performanceDelta: {
    horsepower: {
      originalValue: number;
      projectedValue: number;
      gain: number;
      confidenceInterval: number; // 0 to 1
    };
    torque: {
      originalValue: number;
      projectedValue: number;
      gain: number;
      confidenceInterval: number;
    };
    weightChange: {
      deltaKg: number;
      impactOnCenterOfGravity: {
        x: number;
        y: number;
        z: number;
      };
    };
  };
  
  physicalTolerance: {
    boltPatternMatch: boolean;
    threadPitchMatch: boolean;
    clearanceCheck: {
      status: 'PASS' | 'FAIL' | 'WARNING';
      minimumClearanceMm: number;
      criticalInterferencePoints: string[]; // e.g. ["Brake Caliper", "Strut Tower"]
    };
    structuralIntegrity: {
      maxStressPass: boolean;
      safetyFactor: number;
      loadRatingKg: number;
    };
  };
  
  simulationMetadata: {
    feaEngine: string; // e.g. "PRO-SPEC:FEA v2.1"
    cfdEngine: string;
    iterations: number;
  };
}

/**
 * VIN Decode Response (simplified mapping from NHTSA vPIC)
 */
export interface VINData {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim: string;
  engine: {
    displacement: string;
    cylinders: number;
    fuelType: string;
    forcedInduction: string;
  };
  chassis: {
    driveType: string;
    bodyStyle: string;
    wheelbase: string;
  };
}
