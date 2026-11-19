import DoubtSection from "../components/DoubtSection";
import { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import DraggableEquipment from "../components/DraggableEquipment";
import LabHeader from "../components/lab/LabHeader";
import ExperimentIntroModal from "../components/lab/ExperimentIntroModal";
import ExperimentCompletionModal from "../components/lab/ExperimentCompletionModal";
import { queueOfflineProgress } from "../utils/offlineSync";
import "../components/lab/LabStyles.css";
import "./ChemistryLab.css";

// ==========================================
// EQUIPMENT INFORMATION
// ==========================================

const equipmentInfo = {
  beaker: {
    name: "Beaker",
    emoji: "🥛",
    purpose: "Holding, mixing and observing liquids.",
    description: "A wide-mouthed laboratory container with a flat bottom.",
    use: "Used for preparing and observing mixtures.",
  },
  testtube: {
    name: "Test tube",
    emoji: "🧪",
    purpose: "Holding small liquid or solid samples.",
    description: "A narrow glass tube with a rounded bottom.",
    use: "Used for observing small samples.",
  },
  flask: {
    name: "Conical flask",
    emoji: "⚗️",
    purpose: "Holding and swirling liquid samples.",
    description: "A flask with a wide base and narrow neck.",
    use: "Useful for mixing liquids with less risk of splashing.",
  },
  cylinder: {
    name: "Measuring cylinder",
    emoji: "📏",
    purpose: "Measuring liquid volume.",
    description: "A tall graduated container used to measure liquid volume.",
    use: "Read the liquid level at eye level.",
  },
  funnel: {
    name: "Filter funnel",
    emoji: "🔻",
    purpose: "Guiding liquids and supporting filter paper.",
    description: "A cone-shaped tool with a narrow stem.",
    use: "Used in filtration and transferring liquids.",
  },
  dropper: {
    name: "Dropper",
    emoji: "💧",
    purpose: "Moving small amounts of liquid.",
    description: "A small tube used to transfer liquid one drop at a time.",
    use: "Useful when only a few drops are needed.",
  },
  thermometer: {
    name: "Thermometer",
    emoji: "🌡️",
    purpose: "Measuring temperature.",
    description: "An instrument that displays the temperature of a sample.",
    use: "Read the scale without touching the sample.",
  },
  microscope: {
    name: "Microscope",
    emoji: "🔬",
    purpose: "Magnifying very small objects.",
    description: "An optical instrument with lenses for viewing tiny specimens.",
    use: "Used to observe prepared slides.",
  },
  balance: {
    name: "Digital balance",
    emoji: "⚖️",
    purpose: "Measuring mass.",
    description: "An electronic instrument that measures the mass of an object.",
    use: "Place the sample on the weighing pan and read the display.",
  },
  washbottle: {
    name: "Wash bottle",
    emoji: "🧴",
    purpose: "Rinsing laboratory containers.",
    description: "A squeezable bottle with a narrow nozzle.",
    use: "Used for simulated rinsing and cleaning activities.",
  },
};

// ==========================================
// GUIDED FILTRATION EXPERIMENT
// ==========================================

const experimentSteps = [
  {
    equipment: "beaker",
    title: "Identify the mixture beaker",
    instruction:
      "Select the beaker containing the simulated sand-and-water mixture.",
    hint: "Look for the glass container with blue liquid on the left workbench.",
    success:
      "Correct! The beaker holds the mixture that we want to separate.",
  },
  {
    equipment: "funnel",
    title: "Choose the filter funnel",
    instruction:
      "Select the filter funnel. It represents the tool used to support filter paper.",
    hint: "Look for the cone-shaped laboratory funnel.",
    success:
      "Well done! The funnel guides liquid through the filter paper.",
  },
  {
    equipment: "cylinder",
    title: "Choose the measuring cylinder",
    instruction:
      "Select the measuring cylinder to represent collecting the filtered water.",
    hint: "Look for the tall, narrow graduated container.",
    success:
      "Excellent! The measuring cylinder represents the collection container.",
  },
];

// ==========================================
// REUSABLE BOX
// ==========================================

function Box({ position, size, color }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.72} />
    </mesh>
  );
}

// ==========================================
// LAB FLOOR
// ==========================================

function LabFloor() {
  return (
    <group>
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.08, 0]}
        receiveShadow
      >
        <planeGeometry args={[28, 24]} />
        <meshStandardMaterial color="#dce5ec" />
      </mesh>

      <gridHelper
        args={[28, 28, "#b6c4d0", "#e6edf2"]}
        position={[0, -0.065, 0]}
      />
    </group>
  );
}

// ==========================================
// LAB ARCHITECTURE
// ==========================================

function LabArchitecture() {
  return (
    <group>
      <Box position={[0, 4, -10]} size={[28, 8, 0.25]} color="#eaf1f6" />
      <Box position={[-14, 4, 0]} size={[0.25, 8, 20]} color="#eaf1f6" />
      <Box position={[14, 4, 0]} size={[0.25, 8, 20]} color="#eaf1f6" />

      <Box position={[0, 5.1, -9.82]} size={[10, 1.8, 0.08]} color="#d1e7f2" />

      {[-8, -3, 3, 8].map((x) => (
        <group key={x}>
          <Box position={[x, 4.5, -9.78]} size={[2.3, 2.5, 0.06]} color="#8ed2e8" />
          <Box position={[x, 4.5, -9.7]} size={[0.07, 2.7, 0.08]} color="#71899c" />
          <Box position={[x, 4.5, -9.7]} size={[2.4, 0.07, 0.08]} color="#71899c" />
          <Box position={[x, 4.5, -9.65]} size={[0.06, 2.5, 0.08]} color="#71899c" />
        </group>
      ))}

      {[-7, 0, 7].map((x) => (
        <Box
          key={x}
          position={[x, 7.85, 0]}
          size={[0.16, 0.12, 18]}
          color="#c6d3de"
        />
      ))}

      {[-7, 0, 7].map((x) => (
        <group key={x}>
          <Box position={[x, 7.55, 0]} size={[3.1, 0.12, 0.55]} color="#ffffff" />
          <pointLight position={[x, 7.15, 0]} intensity={0.7} distance={12} />
        </group>
      ))}

      <Box position={[0, 6.55, -9.55]} size={[5.5, 0.8, 0.16]} color="#1e4967" />

      <Html position={[0, 6.55, -9.42]} center distanceFactor={12} transform>
        <div className="lab-3d-sign">
          EduSpark
          <small>CHEMISTRY • EXPLORE • DISCOVER</small>
        </div>
      </Html>
    </group>
  );
}

// ==========================================
// WORKBENCH
// ==========================================

function Workbench({ position, width = 6 }) {
  return (
    <group position={position}>
      <Box position={[0, 1.55, 0]} size={[width, 0.22, 2.25]} color="#795b45" />
      <Box position={[0, 1.42, 0]} size={[width - 0.15, 0.06, 2.1]} color="#b28a65" />

      {[-width / 2 + 0.25, width / 2 - 0.25].map((x) =>
        [-0.85, 0.85].map((z) => (
          <Box
            key={`${x}-${z}`}
            position={[x, 0.75, z]}
            size={[0.18, 1.5, 0.18]}
            color="#526477"
          />
        ))
      )}

      <Box position={[0, 0.85, -0.05]} size={[width - 1, 0.95, 0.12]} color="#e8edf1" />

      {[-1.1, 1.1].map((x) => (
        <Box
          key={x}
          position={[x, 0.88, 0.03]}
          size={[0.06, 0.22, 0.04]}
          color="#64748b"
        />
      ))}
    </group>
  );
}

// ==========================================
// BEAKER
// ==========================================

function BeakerModel({ position, selected, onSelect, onDragChange, showLiquid = false }) {
  return (
    <DraggableEquipment
      objectId="beaker"
      position={position}
      onSelect={onSelect}
      onDragChange={onDragChange}
    >
      <group>
        <mesh position={[0, 0.42, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.25, 0.8, 32, 1, true]} />
          <meshPhysicalMaterial
            color={selected ? "#f2bf50" : "#b9e8f4"}
            transparent
            opacity={0.42}
            roughness={0.1}
            side={2}
          />
        </mesh>

        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.05, 32]} />
          <meshStandardMaterial color="#b9e8f4" />
        </mesh>

        {showLiquid && (
          <mesh position={[0, 0.25, 0]}>
            <cylinderGeometry args={[0.24, 0.24, 0.32, 32]} />
            <meshStandardMaterial color="#61c6dc" transparent opacity={0.7} />
          </mesh>
        )}

        <mesh position={[0, 0.82, 0]}>
          <torusGeometry args={[0.29, 0.025, 8, 32]} />
          <meshStandardMaterial color="#b9e8f4" />
        </mesh>

        {[-0.12, 0, 0.12].map((y) => (
          <Box
            key={y}
            position={[0.27, 0.4 + y, 0]}
            size={[0.09, 0.018, 0.025]}
            color="#ffffff"
          />
        ))}
      </group>
    </DraggableEquipment>
  );
}

// ==========================================
// TEST TUBE
// ==========================================

function TestTubeModel({ selected }) {
  return (
    <group>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.105, 0.105, 0.58, 24, 1, true]} />
        <meshPhysicalMaterial
          color={selected ? "#f2bf50" : "#b9e8f4"}
          transparent
          opacity={0.58}
          side={2}
        />
      </mesh>

      <mesh position={[0, 0.025, 0]}>
        <sphereGeometry args={[0.105, 20, 16]} />
        <meshStandardMaterial color="#b9e8f4" />
      </mesh>

      <mesh position={[0, 0.62, 0]}>
        <cylinderGeometry args={[0.11, 0.11, 0.035, 24]} />
        <meshStandardMaterial color="#d8e9ef" />
      </mesh>
    </group>
  );
}

// ==========================================
// FLASK
// ==========================================

function FlaskModel({ selected }) {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <cylinderGeometry args={[0.1, 0.42, 0.58, 32]} />
        <meshPhysicalMaterial
          color={selected ? "#f2bf50" : "#a8dfe9"}
          transparent
          opacity={0.62}
        />
      </mesh>

      <mesh position={[0, 0.68, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 0.3, 24]} />
        <meshPhysicalMaterial color="#b9e8f4" transparent opacity={0.62} />
      </mesh>

      <mesh position={[0, 0.84, 0]}>
        <torusGeometry args={[0.105, 0.02, 8, 24]} />
        <meshStandardMaterial color="#b9e8f4" />
      </mesh>
    </group>
  );
}

// ==========================================
// MEASURING CYLINDER
// ==========================================

function CylinderModel({ selected }) {
  return (
    <group>
      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 1.05, 24, 1, true]} />
        <meshPhysicalMaterial
          color={selected ? "#f2bf50" : "#b9e8f4"}
          transparent
          opacity={0.52}
          side={2}
        />
      </mesh>

      <mesh position={[0, 0.055, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.08, 24]} />
        <meshStandardMaterial color="#b9e8f4" />
      </mesh>

      {Array.from({ length: 7 }, (_, i) => (
        <Box
          key={i}
          position={[0.12, 0.25 + i * 0.1, 0]}
          size={[0.07, 0.012, 0.018]}
          color="#ffffff"
        />
      ))}
    </group>
  );
}

// ==========================================
// FUNNEL
// ==========================================

function FunnelModel({ selected }) {
  return (
    <group>
      <mesh position={[0, 0.42, 0]}>
        <coneGeometry args={[0.38, 0.58, 32, 1, true]} />
        <meshPhysicalMaterial
          color={selected ? "#f2bf50" : "#b9e8f4"}
          transparent
          opacity={0.6}
          side={2}
        />
      </mesh>

      <mesh position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.48, 20]} />
        <meshPhysicalMaterial color="#b9e8f4" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}

// ==========================================
// DROPPER
// ==========================================

function DropperModel({ selected }) {
  return (
    <group rotation={[0, 0, -0.35]}>
      <mesh position={[0, 0.28, 0]}>
        <cylinderGeometry args={[0.055, 0.055, 0.5, 20]} />
        <meshPhysicalMaterial
          color={selected ? "#f2bf50" : "#b9e8f4"}
          transparent
          opacity={0.65}
        />
      </mesh>

      <mesh position={[0, 0.58, 0]}>
        <sphereGeometry args={[0.09, 20, 16]} />
        <meshStandardMaterial color="#e6a0a0" />
      </mesh>

      <mesh position={[0, -0.03, 0]}>
        <coneGeometry args={[0.045, 0.16, 16]} />
        <meshStandardMaterial color="#a9d9e8" />
      </mesh>
    </group>
  );
}

// ==========================================
// THERMOMETER
// ==========================================

function ThermometerModel({ selected }) {
  return (
    <group>
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.045, 0.045, 0.85, 16]} />
        <meshStandardMaterial color={selected ? "#f2bf50" : "#edf5f8"} />
      </mesh>

      <mesh position={[0, 0.02, 0]}>
        <sphereGeometry args={[0.09, 20, 16]} />
        <meshStandardMaterial color="#e65f64" />
      </mesh>

      <mesh position={[0, 0.35, 0.045]}>
        <cylinderGeometry args={[0.012, 0.012, 0.45, 12]} />
        <meshStandardMaterial color="#e65f64" />
      </mesh>
    </group>
  );
}

// ==========================================
// MICROSCOPE
// ==========================================

function MicroscopeModel({ selected }) {
  return (
    <group>
      <Box position={[0, 0.08, 0]} size={[0.9, 0.14, 0.55]} color="#475569" />

      <mesh position={[0, 0.58, 0]}>
        <cylinderGeometry args={[0.13, 0.2, 0.85, 24]} />
        <meshStandardMaterial color={selected ? "#f2bf50" : "#d6e0e8"} />
      </mesh>

      <mesh position={[0, 1.02, 0]} rotation={[0, 0, -0.5]}>
        <cylinderGeometry args={[0.1, 0.1, 0.52, 20]} />
        <meshStandardMaterial color="#334e68" />
      </mesh>

      <mesh position={[0, 1.28, 0.12]}>
        <cylinderGeometry args={[0.11, 0.11, 0.16, 20]} />
        <meshStandardMaterial color="#172f45" />
      </mesh>

      <Box position={[0, 0.35, 0.2]} size={[0.55, 0.08, 0.5]} color="#64748b" />
    </group>
  );
}

// ==========================================
// DIGITAL BALANCE
// ==========================================

function BalanceModel({ selected }) {
  return (
    <group>
      <Box
        position={[0, 0.18, 0]}
        size={[0.9, 0.34, 0.75]}
        color={selected ? "#f2bf50" : "#e5eaf0"}
      />

      <mesh position={[0, 0.38, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 32]} />
        <meshStandardMaterial color="#aab7c5" />
      </mesh>

      <Box position={[0, 0.35, 0.39]} size={[0.35, 0.12, 0.04]} color="#18354b" />
    </group>
  );
}

// ==========================================
// WASH BOTTLE
// ==========================================

function WashBottleModel({ selected }) {
  return (
    <group>
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.2, 0.23, 0.55, 24]} />
        <meshStandardMaterial
          color={selected ? "#f2bf50" : "#75c9db"}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh position={[0, 0.64, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.12, 20]} />
        <meshStandardMaterial color="#dbe8ee" />
      </mesh>

      <mesh position={[0.1, 0.77, 0]} rotation={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.025, 0.025, 0.3, 12]} />
        <meshStandardMaterial color="#dbe8ee" />
      </mesh>
    </group>
  );
}

// ==========================================
// STORAGE AREA
// ==========================================

function StorageArea() {
  return (
    <group position={[0, 0, -7.7]}>
      <Box position={[0, 3.9, 0]} size={[9, 0.16, 0.85]} color="#795b45" />
      <Box position={[0, 2.45, 0]} size={[9, 0.16, 0.85]} color="#795b45" />

      {[-4.3, 0, 4.3].map((x) => (
        <Box key={x} position={[x, 3.15, 0]} size={[0.14, 1.5, 0.8]} color="#795b45" />
      ))}

      {[-3.4, -2.3, -1.2, 0.2, 1.3, 2.4, 3.5].map((x, i) => (
        <mesh key={x} position={[x, 2.85, 0]}>
          <cylinderGeometry args={[0.15, 0.18, 0.65, 20]} />
          <meshStandardMaterial
            color={["#75c9db", "#d7a75b", "#80bc91", "#a3a7db"][i % 4]}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}

      <Box position={[0, 0.72, -0.15]} size={[9, 1.35, 0.7]} color="#dce5ec" />

      {[-3, -1, 1, 3].map((x) => (
        <group key={x}>
          <Box position={[x, 0.72, 0.23]} size={[0.035, 1.2, 0.04]} color="#71879a" />
          <Box position={[x + 0.38, 0.75, 0.27]} size={[0.07, 0.18, 0.05]} color="#71879a" />
        </group>
      ))}
    </group>
  );
}

// ==========================================
// SAFETY POSTER
// ==========================================

function SafetyPoster({ position }) {
  return (
    <group position={position}>
      <Box position={[0, 0, 0]} size={[1.8, 1.4, 0.08]} color="#ffffff" />

      <Html position={[0, 0, 0.06]} center transform distanceFactor={7}>
        <div className="lab-safety-poster">
          <strong>LAB SAFETY</strong>
          <span>✓ Wear safety glasses</span>
          <span>✓ Follow instructions</span>
          <span>✓ Keep your workspace clean</span>
          <span>✓ Ask for help when unsure</span>
        </div>
      </Html>
    </group>
  );
}

// ==========================================
// EQUIPMENT STATIONS
// ==========================================

function EquipmentStations({
  onSelect,
  selectedEquipment,
  onEquipmentDragChange,
}) {
  const wrap = (id, position, model) => (
    <DraggableEquipment
      key={`${id}-${position.join("-")}`}
      objectId={id}
      position={position}
      onSelect={() => onSelect(id)}
      onDragChange={onEquipmentDragChange}
    >
      {model}
    </DraggableEquipment>
  );

  return (
    <>
      <Workbench position={[-5, 0, -2]} width={7} />
      <Workbench position={[4.5, 0, -2]} width={7} />
      <Workbench position={[0, 0, 4.2]} width={9} />

      <BeakerModel
        position={[-7, 1.68, -2]}
        selected={selectedEquipment === "beaker"}
        onSelect={() => onSelect("beaker")}
        onDragChange={onEquipmentDragChange}
        showLiquid
      />

      {wrap("testtube", [-5.5, 1.68, -2.1], <TestTubeModel selected={selectedEquipment === "testtube"} />)}
      {wrap("testtube", [-5.05, 1.68, -2.1], <TestTubeModel selected={selectedEquipment === "testtube"} />)}
      {wrap("flask", [-3.6, 1.68, -2], <FlaskModel selected={selectedEquipment === "flask"} />)}

      {wrap("cylinder", [2.5, 1.68, -2], <CylinderModel selected={selectedEquipment === "cylinder"} />)}
      {wrap("funnel", [4, 1.68, -2], <FunnelModel selected={selectedEquipment === "funnel"} />)}
      {wrap("dropper", [5.3, 1.68, -2], <DropperModel selected={selectedEquipment === "dropper"} />)}
      {wrap("thermometer", [6.2, 1.68, -2], <ThermometerModel selected={selectedEquipment === "thermometer"} />)}

      {wrap("microscope", [-3, 1.68, 4.2], <MicroscopeModel selected={selectedEquipment === "microscope"} />)}
      {wrap("balance", [0, 1.68, 4.2], <BalanceModel selected={selectedEquipment === "balance"} />)}
      {wrap("washbottle", [2.5, 1.68, 4.2], <WashBottleModel selected={selectedEquipment === "washbottle"} />)}
      {wrap("flask", [4.2, 1.68, 4.2], <FlaskModel selected={selectedEquipment === "flask"} />)}
    </>
  );
}

// ==========================================
// INTERACTIVE FILTRATION DISPLAY
// ==========================================

function ExperimentDisplay({ pouring, completed, onComplete }) {
  const waterRef = useRef();
  const streamRef = useRef();
  const streamMaterialRef = useRef();
  const elapsed = useRef(0);
  const finished = useRef(false);

  useFrame((_, delta) => {
    const streamTop = 1.22;

    if (completed) {
      if (waterRef.current) {
        waterRef.current.scale.y = 1;
        waterRef.current.position.y = 0.505;
      }

      if (streamRef.current) {
        streamRef.current.visible = false;
      }

      return;
    }

    if (!pouring) {
      elapsed.current = 0;
      finished.current = false;

      if (waterRef.current) {
        waterRef.current.scale.y = 0.001;
        waterRef.current.position.y = 0.28;
      }

      if (streamRef.current) {
        streamRef.current.visible = false;
        streamRef.current.scale.y = 0.001;
      }

      return;
    }

    elapsed.current += delta;

    const progress = Math.min(elapsed.current / 4, 1);
    const waterHeight = 0.45 * progress;
    const waterTop = 0.28 + waterHeight;

    if (waterRef.current) {
      waterRef.current.scale.y = Math.max(progress, 0.001);
      waterRef.current.position.y = 0.28 + waterHeight / 2;
    }

    if (streamRef.current) {
      const streamLength = Math.max(streamTop - waterTop, 0.01);
      streamRef.current.visible = progress < 1;
      streamRef.current.position.y = (streamTop + waterTop) / 2;
      streamRef.current.scale.y = streamLength;
    }

    if (streamMaterialRef.current) {
      streamMaterialRef.current.opacity = 0.85;
    }

    if (progress >= 1 && !finished.current) {
      finished.current = true;
      onComplete?.();
    }
  });

  return (
    <group position={[0, 0, -5.2]}>
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[4.5, 0.2, 1.5]} />
        <meshStandardMaterial color="#36566d" />
      </mesh>

      <mesh position={[0.8, 0.85, 0]}>
        <cylinderGeometry args={[0.3, 0.25, 1.2, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#b9e8f4"
          transparent
          opacity={0.4}
          side={2}
        />
      </mesh>

      <mesh
        ref={waterRef}
        position={[0.8, 0.28, 0]}
        scale={[1, 0.001, 1]}
      >
        <cylinderGeometry args={[0.23, 0.23, 0.45, 32]} />
        <meshStandardMaterial
          color="#42b9df"
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>

      <mesh position={[0.8, 1.82, 0]}>
        <coneGeometry args={[0.42, 0.58, 32, 1, true]} />
        <meshPhysicalMaterial
          color="#b9e8f4"
          transparent
          opacity={0.6}
          side={2}
        />
      </mesh>

      <mesh position={[0.8, 1.42, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.4, 20]} />
        <meshStandardMaterial color="#b9e8f4" />
      </mesh>

      <mesh position={[0.8, 2.12, 0]}>
        <circleGeometry args={[0.31, 32]} />
        <meshStandardMaterial color="#ffffff" side={2} />
      </mesh>

      {[
        [-0.12, 0, 0],
        [0.08, 0, 0.1],
        [0.15, 0, -0.08],
        [-0.04, 0, -0.12],
        [0.02, 0, 0.03],
      ].map((p, i) => (
        <mesh key={i} position={[0.8 + p[0], 2.16, p[2]]}>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshStandardMaterial color="#b58a51" />
        </mesh>
      ))}

      <mesh
        ref={streamRef}
        position={[0.8, 0.75, 0]}
        scale={[1, 0.001, 1]}
        visible={false}
      >
        <cylinderGeometry args={[0.055, 0.055, 1, 20]} />
        <meshStandardMaterial
          ref={streamMaterialRef}
          color="#20bce9"
          transparent
          opacity={0.85}
          depthWrite={false}
          side={2}
        />
      </mesh>

      <Html position={[0, 2.7, 0]} center distanceFactor={9}>
        <div
          style={{
            background: "rgba(20, 48, 68, 0.94)",
            color: "white",
            padding: "9px 14px",
            borderRadius: "8px",
            fontSize: "12px",
            whiteSpace: "nowrap",
            textAlign: "center",
          }}
        >
          {completed
            ? "Filtration completed!"
            : pouring
              ? "Filtration in progress..."
              : "Filtration experiment"}
        </div>
      </Html>
    </group>
  );
}

// ==========================================
// COMPLETE 3D LAB ROOM
// ==========================================

function LabRoom({
  onSelect,
  selectedEquipment,
  onEquipmentDragChange,
  pouring,
  filtrationComplete,
  onFiltrationComplete,
}) {
  return (
    <>
      <ambientLight intensity={0.8} />
      <directionalLight
        position={[5, 10, 5]}
        intensity={1.3}
        castShadow
      />

      <LabFloor />
      <LabArchitecture />
      <StorageArea />

      <SafetyPoster position={[-10, 4, -9.7]} />

      <EquipmentStations
        onSelect={onSelect}
        selectedEquipment={selectedEquipment}
        onEquipmentDragChange={onEquipmentDragChange}
      />

      <ExperimentDisplay
        pouring={pouring}
        completed={filtrationComplete}
        onComplete={onFiltrationComplete}
      />
    </>
  );
}

// ==========================================
// MAIN CHEMISTRY LAB PAGE
// ==========================================

export default function ChemistryLab({ hideHeader = false }) {
  const navigate = useNavigate();

  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [isEquipmentDragging, setIsEquipmentDragging] = useState(false);

  const [experimentActive, setExperimentActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [pouring, setPouring] = useState(false);
  const [filtrationComplete, setFiltrationComplete] = useState(false);

  // Supabase completion states
  const [completionSaving, setCompletionSaving] = useState(false);
  const [completionSaved, setCompletionSaved] = useState(false);
  const [completionError, setCompletionError] = useState("");

  // Modals state
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const [feedback, setFeedback] = useState({
    type: "info",
    message: "Welcome! Start the guided experiment to begin.",
  });

  const selectedInfo = selectedEquipment
    ? equipmentInfo[selectedEquipment]
    : null;

  const equipmentSetupComplete = stepIndex >= experimentSteps.length;
  const experimentComplete = filtrationComplete;
  const currentStep = experimentSteps[stepIndex];

  // ========================================
  // EQUIPMENT SELECTION
  // ========================================

  const handleEquipmentSelect = (equipmentId) => {
    setSelectedEquipment(equipmentId);

    if (!experimentActive || experimentComplete || equipmentSetupComplete) {
      return;
    }

    const step = experimentSteps[stepIndex];

    if (equipmentId === step.equipment) {
      setStepIndex((previous) => previous + 1);

      setFeedback({
        type: "success",
        message: step.success,
      });
    } else {
      setFeedback({
        type: "error",
        message: `Not quite! ${step.hint}`,
      });
    }
  };

  // ========================================
  // START EXPERIMENT
  // ========================================

  const startExperiment = () => {
    setSelectedEquipment(null);
    setExperimentActive(true);
    setStepIndex(0);
    setPouring(false);
    setFiltrationComplete(false);

    setCompletionSaved(false);
    setCompletionError("");
    setCompletionSaving(false);

    setFeedback({
      type: "info",
      message: "Let's begin! Select the beaker containing the mixture.",
    });
  };

  // ========================================
  // RESET EXPERIMENT
  // ========================================

  const resetExperiment = () => {
    setSelectedEquipment(null);
    setExperimentActive(false);
    setStepIndex(0);
    setPouring(false);
    setFiltrationComplete(false);
    setShowCompletionModal(false);

    setCompletionSaved(false);
    setCompletionError("");
    setCompletionSaving(false);

    setFeedback({
      type: "info",
      message: "Experiment reset. Start again whenever you are ready.",
    });
  };

  // ========================================
  // START FILTRATION
  // ========================================

  const startFiltration = () => {
    if (!equipmentSetupComplete || pouring || filtrationComplete) {
      return;
    }

    setPouring(true);

    setFeedback({
      type: "info",
      message:
        "Watch the water pass through the filter while the sand is retained.",
    });
  };

  // ========================================
  // SAVE FILTRATION COMPLETION
  // ========================================

  const completeFiltration = async () => {
    if (completionSaving || completionSaved || filtrationComplete) {
      return;
    }

    setPouring(false);
    setFiltrationComplete(true);
    setShowCompletionModal(true);
    setCompletionSaving(true);
    setCompletionError("");

    setFeedback({
      type: "success",
      message:
        "Excellent! Filtration is complete. The sand remains in the filter while the filtered water collects in the measuring cylinder.",
    });

    try {
      // Get logged-in student
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error(
          "Please log in to save your experiment progress."
        );
      }

      // Check if device is offline: save to local offline queue
      if (!navigator.onLine) {
        queueOfflineProgress({
          userId: user.id,
          lessonId: "chemistry-filtration",
          progressPercent: 100,
          completed: true,
        });
        setCompletionSaved(true);
        return;
      }

      // Save experiment progress
      const { error } = await supabase
        .from("learning_progress")
        .upsert(
          {
            user_id: user.id,
            lesson_id: "chemistry-filtration",
            progress_percent: 100,
            completed: true,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "user_id,lesson_id",
          }
        );

      if (error) {
        throw error;
      }

      setCompletionSaved(true);
    } catch (error) {
      console.error("Experiment progress saving error:", error);

      // If network failure, queue offline locally
      const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: {} }));
      if (user?.id) {
        queueOfflineProgress({
          userId: user.id,
          lessonId: "chemistry-filtration",
          progressPercent: 100,
          completed: true,
        });
        setCompletionSaved(true);
      } else {
        setCompletionError(
          error.message || "Could not save experiment completion."
        );
      }
    } finally {
      setCompletionSaving(false);
    }
  };

  // ========================================
  // PAGE UI
  // ========================================

  return (
    <main className="chemistry-lab-page">
      {!hideHeader && (
        <LabHeader
          subject="Chemistry"
          grade="Class 9"
          chapter="Separation of Substances"
          experimentTitle="Filtration of Sand-Water Suspension"
          onOpenIntro={() => setShowIntroModal(true)}
          onReset={resetExperiment}
        />
      )}

      <header className="chemistry-lab-header">
        <div>
          <p className="chemistry-lab-eyebrow">
            EduSpark · VIRTUAL SCIENCE
          </p>

          <h1>Explore the Chemistry Laboratory</h1>

          <p>
            Discover laboratory equipment, explore the 3D room,
            and learn through guided simulated experiments.
          </p>
        </div>

        <div className="chemistry-header-status">
          <span className="status-dot" />
          Interactive 3D Lab
        </div>
      </header>

      <section className="chemistry-feature-strip">
        <div>
          <span>🔬</span>
          <strong>Explore equipment</strong>
          <small>Learn what each tool does</small>
        </div>

        <div>
          <span>🧭</span>
          <strong>Guided experiments</strong>
          <small>Follow step-by-step instructions</small>
        </div>

        <div>
          <span>💡</span>
          <strong>Learn from mistakes</strong>
          <small>Get hints and corrections</small>
        </div>

        <div>
          <span>📱</span>
          <strong>Mobile friendly</strong>
          <small>Touch and explore</small>
        </div>
      </section>

      <section className="chemistry-lab-layout">
        <div className="chemistry-left-column">
          <div className="chemistry-scene">
            <Canvas
              shadows
              camera={{
                position: [12, 10, 17],
                fov: 48,
              }}
              dpr={[1, 1.5]}
              gl={{
                antialias: true,
                powerPreference: "high-performance",
              }}
            >
              <color attach="background" args={["#dce7f0"]} />

              <LabRoom
                onSelect={handleEquipmentSelect}
                selectedEquipment={selectedEquipment}
                onEquipmentDragChange={setIsEquipmentDragging}
                pouring={pouring}
                filtrationComplete={filtrationComplete}
                onFiltrationComplete={completeFiltration}
              />

              <OrbitControls
                makeDefault
                enabled={!isEquipmentDragging}
                target={[0, 1.7, 0]}
                enableRotate
                enableZoom
                enablePan={false}
                minDistance={8}
                maxDistance={25}
                minPolarAngle={0.25}
                maxPolarAngle={Math.PI / 2 + 0.2}
                rotateSpeed={0.55}
                zoomSpeed={0.65}
                enableDamping
                dampingFactor={0.08}
              />
            </Canvas>

            <div className="chemistry-scene-help">
              <span>↻</span>
              Drag empty space to look around
              <span>·</span>
              Scroll or pinch to zoom
              <span>·</span>
              Select equipment
            </div>
          </div>

          <section className="chemistry-experiment-card">
            <div className="experiment-card-heading">
              <div>
                <span className="chemistry-experiment-kicker">
                  GUIDED EXPERIMENT · 01
                </span>

                <h2>Separation of sand and water</h2>
              </div>

              <span className="experiment-icon">🧪</span>
            </div>

            <p className="experiment-description">
              Learn how filtration separates an insoluble solid
              from a liquid using a filter funnel and filter paper.
              This is a safe visual simulation.
            </p>

            <div className="chemistry-experiment-steps">
              {["Beaker", "Funnel", "Measure"].map((label, index) => (
                <div
                  key={label}
                  className={
                    index < stepIndex
                      ? "chemistry-experiment-step done"
                      : index === stepIndex && experimentActive
                        ? "chemistry-experiment-step current"
                        : "chemistry-experiment-step"
                  }
                >
                  <span>{index < stepIndex ? "✓" : index + 1}</span>
                  <small>{label}</small>
                </div>
              ))}
            </div>

            <div className="chemistry-guidance-box">
              <div className="guidance-icon">
                {experimentComplete ? "🎉" : "🧭"}
              </div>

              <div>
                <strong>
                  {experimentComplete
                    ? "Experiment completed!"
                    : experimentActive
                      ? equipmentSetupComplete
                        ? "Equipment ready — start filtration"
                        : `Step ${stepIndex + 1}: ${currentStep.title}`
                      : "Your laboratory guide"}
                </strong>

                <p>
                  {experimentComplete
                    ? "You successfully completed the simulated filtration. The sand remains in the filter while water collects in the measuring cylinder."
                    : experimentActive
                      ? equipmentSetupComplete
                        ? "You selected all the required equipment. Press Start filtration to watch the simulation."
                        : currentStep.instruction
                      : "Start the guided experiment. The lab will tell you which equipment to select and help you if you make a mistake."}
                </p>
              </div>
            </div>

            <div
              className={`chemistry-feedback ${feedback.type}`}
              role="status"
              aria-live="polite"
            >
              <strong>
                {feedback.type === "success"
                  ? "Correct!"
                  : feedback.type === "error"
                    ? "Try again"
                    : "Lab assistant"}
              </strong>

              <p>{feedback.message}</p>
            </div>

            {experimentActive && !equipmentSetupComplete && (
              <div style={{ display: "flex", gap: "8px", marginTop: "12px", marginBottom: "14px" }}>
                <button
                  type="button"
                  className="chemistry-reset-button"
                  style={{ flex: 1, padding: "8px 12px", fontSize: "12px", borderRadius: "8px" }}
                  disabled={stepIndex === 0}
                  onClick={() => {
                    const prevIdx = Math.max(0, stepIndex - 1);
                    setStepIndex(prevIdx);
                    setFeedback({
                      type: "info",
                      message: `Step ${prevIdx + 1}: ${experimentSteps[prevIdx].instruction}`,
                    });
                  }}
                >
                  ← Previous Step
                </button>
                <button
                  type="button"
                  className="chemistry-reset-button"
                  style={{ flex: 1, padding: "8px 12px", fontSize: "12px", borderRadius: "8px" }}
                  disabled={stepIndex >= experimentSteps.length - 1}
                  onClick={() => {
                    const nextIdx = Math.min(experimentSteps.length - 1, stepIndex + 1);
                    setStepIndex(nextIdx);
                    setFeedback({
                      type: "info",
                      message: `Step ${nextIdx + 1}: ${experimentSteps[nextIdx].instruction}`,
                    });
                  }}
                >
                  Next Step →
                </button>
              </div>
            )}

            <div className="chemistry-experiment-actions">
              {!experimentActive ? (
                <button
                  type="button"
                  className="chemistry-experiment-action"
                  onClick={startExperiment}
                >
                  Start guided experiment
                  <span>→</span>
                </button>
              ) : experimentComplete ? (
                <button
                  type="button"
                  className="chemistry-experiment-action"
                  onClick={startExperiment}
                >
                  Try experiment again
                  <span>↻</span>
                </button>
              ) : equipmentSetupComplete ? (
                <button
                  type="button"
                  className="chemistry-experiment-action"
                  onClick={startFiltration}
                  disabled={pouring}
                >
                  {pouring ? "Filtration in progress..." : "Start filtration"}
                  <span>→</span>
                </button>
              ) : (
                <button
                  type="button"
                  className="chemistry-reset-button"
                  onClick={resetExperiment}
                >
                  Reset experiment
                </button>
              )}
            </div>

            {/* ======================================
                EXPERIMENT COMPLETION AND QUIZ
            ====================================== */}

            {experimentComplete && (
              <div className="chemistry-experiment-result">
                <strong>What did you learn?</strong>

                <p>
                  Filtration separates an insoluble solid from a liquid.
                  The filter retains sand while water passes through.
                </p>

                <span>✓ Guided activity completed</span>

                {completionSaving && (
                  <p>Saving your experiment progress...</p>
                )}

                {completionSaved && (
                  <p>
                    ✓ Experiment completion saved successfully!
                  </p>
                )}

                {completionError && (
                  <p role="alert">
                    {completionError}
                  </p>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "12px" }}>
                  <button
                    type="button"
                    className="chemistry-experiment-action"
                    style={{ backgroundColor: "#313E3B" }}
                    onClick={() => setShowCompletionModal(true)}
                  >
                    View Scientific Lab Report
                    <span>📊</span>
                  </button>

                  {completionSaved && (
                    <button
                      type="button"
                      className="chemistry-experiment-action"
                      onClick={() => navigate("/quiz/chemistry_filtration")}
                    >
                      Take Filtration Quiz
                      <span>→</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </section>

          <div style={{ marginTop: "24px" }}>
            <DoubtSection />
          </div>
        </div>

        <aside className="chemistry-equipment-panel">
          <div className="equipment-panel-heading">
            <div>
              <span className="chemistry-experiment-kicker">
                LAB TOOLKIT
              </span>

              <h2>Equipment collection</h2>
            </div>

            <span className="equipment-count">
              {Object.keys(equipmentInfo).length} items
            </span>
          </div>

          <p className="equipment-panel-description">
            Select equipment here or click it inside the 3D room.
            Your lab guide will help you choose the right tool.
          </p>

          <div className="chemistry-equipment-list">
            {Object.entries(equipmentInfo).map(([id, item]) => (
              <button
                type="button"
                key={id}
                className={
                  selectedEquipment === id
                    ? "chemistry-equipment-button active"
                    : "chemistry-equipment-button"
                }
                onClick={() => handleEquipmentSelect(id)}
              >
                <span className="equipment-emoji">{item.emoji}</span>
                <span className="equipment-name">{item.name}</span>
                <span className="equipment-arrow">›</span>
              </button>
            ))}
          </div>

          <div className="chemistry-equipment-detail">
            {selectedInfo ? (
              <>
                <span className="equipment-detail-emoji">
                  {selectedInfo.emoji}
                </span>

                <h3>{selectedInfo.name}</h3>

                <strong>Purpose</strong>
                <p>{selectedInfo.purpose}</p>

                <strong>About this equipment</strong>
                <p>{selectedInfo.description}</p>

                <strong>How it is used</strong>
                <p>{selectedInfo.use}</p>
              </>
            ) : (
              <>
                <span className="equipment-detail-emoji">🔬</span>

                <h3>Explore your toolkit</h3>

                <p>
                  Select any equipment to learn its purpose,
                  description and common use.
                </p>
              </>
            )}
          </div>

          <div className="chemistry-safety-note">
            <span>🛡️</span>

            <div>
              <strong>Virtual lab safety</strong>

              <p>
                All activities here are simulations. Follow
                teacher guidance for real laboratory work.
              </p>
            </div>
          </div>
        </aside>
      </section>

      {/* Experiment Introduction Modal */}
      <ExperimentIntroModal
        isOpen={showIntroModal}
        onClose={() => setShowIntroModal(false)}
        onStart={() => {
          setShowIntroModal(false);
          startExperiment();
        }}
        subject="Chemistry"
        grade="Class 9"
        chapter="Separation of Substances"
        title="Separation of Sand and Water via Filtration"
        objective="Understand how heterogeneous solid-liquid mixtures are separated using porous filter paper and laboratory funnels based on particle size differentiation."
        materials={[
          "250 mL Glass Beaker with Sand-Water Suspension",
          "60° Conical Filter Funnel with Circular Filter Paper",
          "100 mL Graduated Measuring Cylinder (Receiver)",
          "Solid Laboratory Workbench & Equipment Toolkit",
        ]}
        safetyNotes={[
          "Handle glassware with caution to prevent cracks or sharp edge hazards.",
          "Ensure the filter paper is folded properly into a quadrant cone before seating.",
          "Pour liquids steadily along the inner wall to prevent overflow outside the funnel cone.",
        ]}
      />

      {/* Experiment Completion Modal */}
      <ExperimentCompletionModal
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
        onRestart={() => {
          setShowCompletionModal(false);
          resetExperiment();
        }}
        quizRoute="/quiz/chemistry_filtration"
        subject="Chemistry"
        grade="Class 9"
        experimentTitle="Separation of Sand and Water via Filtration"
        conceptExplanation="Filtration is a mechanical separation process that separates insoluble solid particles from a liquid medium by passing the suspension through a porous membrane (filter paper). The liquid passes through the pores due to smaller molecular dimensions, while solid particles larger than the pore diameter are trapped on the paper."
        observations={[
          "The muddy sand-and-water suspension is decanted into the funnel.",
          "Coarse insoluble sand particles are trapped inside the filter paper cone as 'residue'.",
          "Clear, transparent water droplets percolate into the receiving measuring cylinder as 'filtrate'.",
        ]}
        result="Complete separation achieved. Residue (Sand) collected on filter cone; Filtrate (Water) collected in graduated measuring cylinder."
        saving={completionSaving}
        saved={completionSaved}
        error={completionError}
      />
    </main>
  );
}