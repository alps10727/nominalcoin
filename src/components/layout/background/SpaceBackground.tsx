
import React from "react";
import { BaseGradient } from "./BaseGradient";
import { NebulaOverlay } from "./NebulaOverlay";
import { ConstellationPattern } from "./ConstellationPattern";
import { StarField } from "./StarField";
import { DustClouds } from "./DustClouds";

export const SpaceBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0">
      {/* Base gradient background */}
      <BaseGradient />
      
      {/* Enhanced nebula overlay */}
      <NebulaOverlay />
      
      {/* Constellation pattern */}
      <ConstellationPattern />
      
      {/* Enhanced starfield with more stars */}
      <StarField />
      
      {/* Deep space dust clouds */}
      <DustClouds />
    </div>
  );
};
