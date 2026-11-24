import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MotionConfig } from "motion/react";
import App from "./App";
import { ConfiguratorProvider } from "@/context/ConfiguratorContext";
import { VehicleCameraProvider } from "@/context/VehicleCameraContext";
import { SoundProvider } from "@/context/SoundContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <SoundProvider>
        <ConfiguratorProvider>
          <VehicleCameraProvider>
            <App />
          </VehicleCameraProvider>
        </ConfiguratorProvider>
      </SoundProvider>
    </MotionConfig>
  </StrictMode>
);