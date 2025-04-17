
import React from "react";
import { StarField } from "./StarField";
import { BaseGradient } from "./BaseGradient";
import { NebulaOverlay } from "./NebulaOverlay";
import { DustClouds } from "./DustClouds";
import { ConstellationPattern } from "./ConstellationPattern";

export const SpaceBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden -z-10">
      <BaseGradient />
      <NebulaOverlay />
      <DustClouds />
      <ConstellationPattern />
      <StarField />
    </div>
  );
};
