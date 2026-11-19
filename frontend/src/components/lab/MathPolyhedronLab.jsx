import React, { useState, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  ChevronLeft,
  ChevronRight,
  Award,
  Calculator
} from "lucide-react";
import { supabase } from "../../supabaseClient";
import LabHeader from "./LabHeader";
import ExperimentIntroModal from "./ExperimentIntroModal";
import ExperimentCompletionModal from "./ExperimentCompletionModal";
import { queueOfflineProgress } from "../../utils/offlineSync";
import "./LabStyles.css";

const polyhedrons = [
  {
    id: "cube",
    name: "Regular Cube (Hexahedron)",
    faces: 6,
    vertices: 8,
    edges: 12,
    color: "#2D7FF9",
    description: "6 square faces meeting at right angles.",
  },
  {
    id: "prism",
    name: "Triangular Prism",
    faces: 5,
    vertices: 6,
    edges: 9,
    color: "#D5D52B",
    description: "2 parallel triangular bases and 3 rectangular sides.",
  },
  {
    id: "octahedron",
    name: "Regular Octahedron",
    faces: 8,
    vertices: 6,
    edges: 12,
    color: "#6655D9",
    description: "8 equilateral triangular faces meeting at 6 vertices.",
  },
  {
    id: "tetrahedron",
    name: "Regular Tetrahedron (Triangular Pyramid)",
    faces: 4,
    vertices: 4,
    edges: 6,
    color: "#EF991F",
    description: "4 equilateral triangular faces; simplest polyhedron.",
  },
];

function RotatingMesh({ shapeId, color }) {
  const meshRef = useRef();

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      meshRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <mesh ref={meshRef}>
      {shapeId === "cube" && <boxGeometry args={[2.2, 2.2, 2.2]} />}
      {shapeId === "prism" && <cylinderGeometry args={[1.5, 1.5, 2.4, 3]} />}
      {shapeId === "octahedron" && <octahedronGeometry args={[1.8]} />}
      {shapeId === "tetrahedron" && <tetrahedronGeometry args={[2]} />}
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} wireframe={false} />
      {/* Wireframe overlay */}
      <lineSegments>
        {shapeId === "cube" && <edgesGeometry args={[new THREE.BoxGeometry(2.21, 2.21, 2.21)]} />}
        {shapeId === "prism" && <edgesGeometry args={[new THREE.CylinderGeometry(1.51, 1.51, 2.41, 3)]} />}
        {shapeId === "octahedron" && <edgesGeometry args={[new THREE.OctahedronGeometry(1.81)]} />}
        {shapeId === "tetrahedron" && <edgesGeometry args={[new THREE.TetrahedronGeometry(2.01)]} />}
        <lineBasicMaterial color="#FFFFFF" linewidth={2} />
      </lineSegments>
    </mesh>
  );
}

const mathSteps = [
  {
    title: "Inspect 3D Solid Geometry",
    instruction: "Drag in the 3D viewport to rotate the solid shape and observe its faces and corners.",
    explanation: "Polyhedrons are 3D solids whose surfaces are composed entirely of 2D polygons.",
  },
  {
    title: "Count Faces, Vertices & Edges",
    instruction: "Switch between different polyhedrons (Cube, Prism, Octahedron, Tetrahedron).",
    explanation: "Count the flat boundary planes (Faces), intersection lines (Edges), and meeting points (Vertices).",
  },
  {
    title: "Verify Euler's Polyhedral Formula",
    instruction: "Observe how F + V - E dynamically evaluates to exactly 2 across all convex polyhedrons.",
    explanation: "Leonhard Euler proved that every simple polyhedron satisfies the topological invariant F + V - E = 2.",
  },
];

export default function MathPolyhedronLab({ hideHeader = false }) {
  const [activeShape, setActiveShape] = useState(polyhedrons[0]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [shapesInspected, setShapesInspected] = useState(1);

  // Modals
  const [isIntroOpen, setIsIntroOpen] = useState(false);
  const [isCompletionOpen, setIsCompletionOpen] = useState(false);

  // Supabase Save Status
  const [savingStatus, setSavingStatus] = useState("idle");
  const [savingError, setSavingError] = useState("");

  const handleSelectShape = (shape) => {
    setActiveShape(shape);
    setShapesInspected((prev) => Math.min(polyhedrons.length, prev + 1));
    if (shapesInspected >= 3) {
      handleExperimentComplete();
    }
  };

  const handleExperimentComplete = async () => {
    if (savingStatus === "saved" || savingStatus === "saving") return;

    setSavingStatus("saving");
    setSavingError("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!session) {
        setSavingStatus("error");
        setSavingError("Log in to save your lab progress to Supabase.");
        return;
      }

      if (!navigator.onLine) {
        queueOfflineProgress({
          userId: session.user.id,
          lessonId: "math-euler",
          progressPercent: 100,
          completed: true,
        });
        setSavingStatus("saved");
        return;
      }

      const { error: saveError } = await supabase
        .from("learning_progress")
        .upsert(
          {
            user_id: session.user.id,
            lesson_id: "math-euler",
            progress_percent: 100,
            completed: true,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,lesson_id" }
        );

      if (saveError) throw saveError;
      setSavingStatus("saved");
    } catch (err) {
      const { data: { session } } = await supabase.auth.getSession().catch(() => ({ data: {} }));
      if (session?.user?.id) {
        queueOfflineProgress({
          userId: session.user.id,
          lessonId: "math-euler",
          progressPercent: 100,
          completed: true,
        });
        setSavingStatus("saved");
      } else {
        setSavingStatus("error");
        setSavingError(err.message || "Could not save progress.");
      }
    }
  };

  const eulerCalculated = activeShape.faces + activeShape.vertices - activeShape.edges;
  const currentStep = mathSteps[currentStepIndex];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F4F7F5", display: "flex", flexDirection: "column" }}>
      {/* Top Header */}
      {!hideHeader && (
        <LabHeader
          subjectId="math"
          subjectName="Mathematics"
          experimentTitle="Understanding 3D Polyhedrons & Euler's Formula"
          classLevel="Class 8 · Chapter: Visualising Solid Shapes"
          onOpenIntro={() => setIsIntroOpen(true)}
        />
      )}

      {/* Main Workspace Layout */}
      <main style={{ maxWidth: "1320px", width: "100%", margin: "0 auto", padding: "24px", boxSizing: "border-box" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "24px", alignItems: "start" }}>
          {/* Left Column: 3D Polyhedron Canvas */}
          <div>
            <div
              style={{
                backgroundColor: "#172238",
                borderRadius: "14px",
                height: "460px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                position: "relative",
                overflow: "hidden",
                border: "2px solid #313E3B",
              }}
            >
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <ambientLight intensity={0.9} />
                <directionalLight position={[10, 10, 5]} intensity={1.5} />
                <directionalLight position={[-10, -10, -5]} intensity={0.5} />
                <RotatingMesh shapeId={activeShape.id} color={activeShape.color} />
                <OrbitControls enableZoom enableRotate enablePan={false} />
              </Canvas>

              {/* 3D Instruction Tag */}
              <div
                style={{
                  position: "absolute",
                  bottom: "16px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(0,0,0,0.65)",
                  color: "#FFFFFF",
                  fontSize: "12px",
                  padding: "6px 16px",
                  borderRadius: "20px",
                  backdropFilter: "blur(4px)",
                  whiteSpace: "nowrap",
                }}
              >
                ↻ Drag with mouse/touch to rotate 3D solid · Scroll to zoom
              </div>
            </div>

            {/* Guided Step Walkthrough & Feedback Panel */}
            <div
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                padding: "24px",
                marginTop: "20px",
                border: "1px solid #E8ECE9",
                boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#D5D52B", backgroundColor: "#313E3B", padding: "4px 10px", borderRadius: "4px" }}>
                  STEP {currentStepIndex + 1} OF {mathSteps.length}
                </span>
                <span style={{ fontSize: "12px", color: "#71807D" }}>
                  {shapesInspected} of {polyhedrons.length} Polyhedrons Inspected
                </span>
              </div>

              <h3 style={{ fontSize: "18px", margin: "0 0 6px", color: "#313E3B" }}>{currentStep.title}</h3>
              <p style={{ fontSize: "14px", color: "#4A5653", margin: "0 0 10px", lineHeight: "1.5" }}>
                {currentStep.instruction}
              </p>
              <p style={{ fontSize: "12.5px", color: "#71807D", margin: "0 0 16px", fontStyle: "italic" }}>
                Mathematical Theorem: {currentStep.explanation}
              </p>

              {/* Step Navigation Controls */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid #D9E0DD",
                    backgroundColor: "#FFFFFF",
                    color: "#313E3B",
                    cursor: currentStepIndex === 0 ? "not-allowed" : "pointer",
                    opacity: currentStepIndex === 0 ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                  }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                {shapesInspected >= 3 && (
                  <button
                    onClick={() => setIsCompletionOpen(true)}
                    style={{
                      padding: "8px 18px",
                      borderRadius: "6px",
                      border: "none",
                      backgroundColor: "#16A34A",
                      color: "#FFFFFF",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "13px",
                    }}
                  >
                    <Award size={16} /> View Proof & Results
                  </button>
                )}

                <button
                  disabled={currentStepIndex >= mathSteps.length - 1}
                  onClick={() => setCurrentStepIndex((prev) => Math.min(mathSteps.length - 1, prev + 1))}
                  style={{
                    padding: "8px 14px",
                    borderRadius: "6px",
                    border: "1px solid #D9E0DD",
                    backgroundColor: "#FFFFFF",
                    color: "#313E3B",
                    cursor: currentStepIndex >= mathSteps.length - 1 ? "not-allowed" : "pointer",
                    opacity: currentStepIndex >= mathSteps.length - 1 ? 0.5 : 1,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "13px",
                  }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Euler's Formula Live Calculator */}
          <aside
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "10px",
              padding: "24px",
              border: "1px solid #E8ECE9",
              boxShadow: "0 4px 14px rgba(0,0,0,0.03)",
            }}
          >
            <h4 style={{ fontSize: "16px", margin: "0 0 6px", color: "#313E3B" }}>Select 3D Polyhedron</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px" }}>
              {polyhedrons.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectShape(p)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: "6px",
                    border: activeShape.id === p.id ? "2px solid #313E3B" : "1px solid #E8ECE9",
                    backgroundColor: activeShape.id === p.id ? "#F8FAF9" : "#FFFFFF",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <strong style={{ display: "block", fontSize: "13px", color: "#313E3B" }}>{p.name}</strong>
                    <small style={{ color: "#71807D", fontSize: "11px" }}>{p.description}</small>
                  </div>
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: p.color,
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Live Euler Equation Board */}
            <div
              style={{
                backgroundColor: "#1E2826",
                color: "#FFFFFF",
                borderRadius: "10px",
                padding: "20px",
                border: "2px solid #D5D52B",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                <Calculator size={16} color="#D5D52B" />
                <span style={{ fontSize: "11px", fontWeight: 800, color: "#D5D52B", letterSpacing: "0.08em" }}>
                  EULER'S FORMULA PROOF
                </span>
              </div>

              <div style={{ textAlign: "center", margin: "16px 0" }}>
                <div style={{ fontSize: "20px", fontWeight: 800, fontFamily: "monospace" }}>
                  F + V - E = 2
                </div>
                <div style={{ fontSize: "22px", fontWeight: 800, color: "#D5D52B", marginTop: "6px" }}>
                  {activeShape.faces} + {activeShape.vertices} - {activeShape.edges} = {eulerCalculated}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: "12px" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", display: "block" }}>Faces (F)</span>
                  <strong style={{ fontSize: "18px" }}>{activeShape.faces}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", display: "block" }}>Vertices (V)</span>
                  <strong style={{ fontSize: "18px" }}>{activeShape.vertices}</strong>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)", display: "block" }}>Edges (E)</span>
                  <strong style={{ fontSize: "18px" }}>{activeShape.edges}</strong>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Intro Modal */}
      <ExperimentIntroModal
        isOpen={isIntroOpen}
        onClose={() => setIsIntroOpen(false)}
        experimentName="Understanding 3D Polyhedrons & Euler's Formula"
        subject="Mathematics"
        classLevel="Class 8"
        chapter="Visualising Solid Shapes"
        objectives={[
          "Inspect vertices, straight edges, and polygonal faces of solid polyhedrons in 3D.",
          "Differentiate between prisms, pyramids, cubes, and octahedrons.",
          "Prove and verify Euler's polyhedral formula: Faces + Vertices - Edges = 2.",
        ]}
        materials={[
          "Interactive 3D Virtual Polyhedron Viewport",
          "Solid geometric models: Cube, Triangular Prism, Octahedron, Tetrahedron",
          "Topological edge and vertex live counter",
        ]}
        safetyGuidelines={[
          "Rotate 3D shapes slowly to clearly count hidden rear faces and internal vertices.",
          "Note that curved surfaces (spheres, cylinders, cones) are not polyhedrons.",
        ]}
      />

      {/* Completion Modal */}
      <ExperimentCompletionModal
        isOpen={isCompletionOpen}
        onClose={() => setIsCompletionOpen(false)}
        experimentTitle="Understanding 3D Polyhedrons & Euler's Formula"
        subject="Mathematics"
        scientificConcept="Euler's formula F + V - E = 2 is a fundamental theorem of topology and discrete geometry. For any simple convex polyhedron, the number of faces plus vertices minus edges always equals 2, regardless of how many polygons bound the shape."
        observations={[
          "For a cube: 6 faces + 8 vertices - 12 edges = 2.",
          "For a triangular prism: 5 faces + 6 vertices - 9 edges = 2.",
          "For an octahedron: 8 faces + 6 vertices - 12 edges = 2.",
          "For a tetrahedron: 4 faces + 4 vertices - 6 edges = 2.",
        ]}
        result="Euler's Formula F + V - E = 2 was conclusively proven and verified across all tested 3D polyhedrons."
        quizRoute="/quiz/math_shapes"
        quizTitle="Take 3D Shapes Quiz"
        savingStatus={savingStatus}
        savingError={savingError}
      />
    </div>
  );
}
