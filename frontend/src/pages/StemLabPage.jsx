import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { getActivitiesForSubject, LAB_SUBJECTS } from "../data/labRegistry";
import ActivitySelectorBar from "../components/lab/ActivitySelectorBar";

// Mathematics Labs
import MathPolyhedronLab from "../components/lab/MathPolyhedronLab";
import MathNumberLineLab from "../components/lab/MathNumberLineLab";
import MathAlgebraLab from "../components/lab/MathAlgebraLab";
import MathGeometryCalcLab from "../components/lab/MathGeometryCalcLab";

// Physics Labs
import PhysicsCircuitLab from "../components/lab/PhysicsCircuitLab";
import PhysicsPendulumLab from "../components/lab/PhysicsPendulumLab";
import PhysicsReflectionLab from "../components/lab/PhysicsReflectionLab";
import PhysicsForceLab from "../components/lab/PhysicsForceLab";

// Chemistry Labs (Preserving ChemistryLab.jsx 100%!)
import ChemistryLab from "./ChemistryLab";
import ChemistryStatesLab from "../components/lab/ChemistryStatesLab";
import ChemistrySeparationLab from "../components/lab/ChemistrySeparationLab";
import ChemistryAcidsLab from "../components/lab/ChemistryAcidsLab";

// Biology Labs
import BiologyCellLab from "../components/lab/BiologyCellLab";
import BiologyPhotosynthesisLab from "../components/lab/BiologyPhotosynthesisLab";
import BiologyCirculationLab from "../components/lab/BiologyCirculationLab";

export default function StemLabPage() {
  const { subjectId: rawSubjectId, activityId } = useParams();
  const navigate = useNavigate();

  // Normalize subjectId ("mathematics" -> "math")
  const subjectId =
    rawSubjectId === "mathematics" ? "math" : (rawSubjectId || "").toLowerCase();

  const subjectMeta = LAB_SUBJECTS[subjectId];
  const activities = getActivitiesForSubject(subjectId);

  // Active activity determination: either from route param or fallback to first activity
  const activeActivityId =
    activityId && activities.some((a) => a.id === activityId)
      ? activityId
      : activities[0]?.id;

  const [completedMap, setCompletedMap] = useState({});

  // Fetch student progress for activity checkmarks
  useEffect(() => {
    let isMounted = true;

    async function loadProgress() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user?.id) return;

        const { data, error } = await supabase
          .from("learning_progress")
          .select("lesson_id, completed")
          .eq("user_id", session.user.id);

        if (!error && data && isMounted) {
          const map = {};
          data.forEach((row) => {
            if (row.completed) {
              map[row.lesson_id] = true;
            }
          });
          setCompletedMap(map);
        }
      } catch {}
    }

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [activeActivityId]);

  if (!subjectMeta || activities.length === 0) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSelectActivity = (newActId) => {
    navigate(`/stem-lab/${rawSubjectId}/${newActId}`);
  };

  // Render the selected activity
  const renderActivityComponent = () => {
    switch (activeActivityId) {
      // Mathematics
      case "math-euler":
        return <MathPolyhedronLab hideHeader />;
      case "math-number-line":
        return <MathNumberLineLab />;
      case "math-algebra":
        return <MathAlgebraLab />;
      case "math-geometry":
        return <MathGeometryCalcLab />;

      // Physics
      case "physics-circuit":
        return <PhysicsCircuitLab hideHeader />;
      case "physics-pendulum":
        return <PhysicsPendulumLab />;
      case "physics-reflection":
        return <PhysicsReflectionLab />;
      case "physics-force":
        return <PhysicsForceLab />;

      // Chemistry (ChemistryLab preserved 100%!)
      case "chemistry-filtration":
        return <ChemistryLab hideHeader />;
      case "chem-matter-kinetic":
        return <ChemistryStatesLab />;
      case "chem-separation":
        return <ChemistrySeparationLab />;
      case "chem-acids-bases":
        return <ChemistryAcidsLab />;

      // Biology
      case "biology-cell":
        return <BiologyCellLab hideHeader />;
      case "bio-photosynthesis":
        return <BiologyPhotosynthesisLab />;
      case "bio-circulation":
        return <BiologyCirculationLab />;

      default:
        return <MathPolyhedronLab />;
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F4F7F5", display: "flex", flexDirection: "column" }}>
      {/* Top Activity Switcher Bar */}
      <ActivitySelectorBar
        subjectId={subjectId}
        subjectName={subjectMeta.name}
        activities={activities}
        currentActivityId={activeActivityId}
        onSelectActivity={handleSelectActivity}
        completedMap={completedMap}
      />

      {/* Rendered Interactive Lab */}
      <div style={{ flex: 1 }}>{renderActivityComponent()}</div>
    </div>
  );
}
