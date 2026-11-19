// ==========================================================================
// EDUSPARK STEM VIRTUAL LABS REGISTRY
// Standardized metadata for all interactive activities across Classes 6 to 10
// Mathematics, Physics, Chemistry, Biology
// ==========================================================================

export const LAB_SUBJECTS = {
  math: {
    id: "math",
    name: "Mathematics",
    title: "Mathematics Virtual Laboratory",
    color: "#2D7FF9",
    accentBg: "rgba(45, 127, 249, 0.12)",
    icon: "Shapes",
  },
  physics: {
    id: "physics",
    name: "Physics",
    title: "Physics Virtual Laboratory",
    color: "#EF991F",
    accentBg: "rgba(239, 153, 31, 0.12)",
    icon: "Zap",
  },
  chemistry: {
    id: "chemistry",
    name: "Chemistry",
    title: "Chemistry Virtual Laboratory",
    color: "#6655D9",
    accentBg: "rgba(102, 85, 217, 0.12)",
    icon: "FlaskConical",
  },
  biology: {
    id: "biology",
    name: "Biology",
    title: "Biology Virtual Laboratory",
    color: "#16A34A",
    accentBg: "rgba(22, 163, 74, 0.12)",
    icon: "Microscope",
  },
};

// Aliasing canonical 'mathematics' to 'math' for dual route and lookup support
LAB_SUBJECTS.mathematics = LAB_SUBJECTS.math;

export const LAB_ACTIVITIES = {
  // =========================================================================
  // MATHEMATICS ACTIVITIES
  // =========================================================================
  "math-euler": {
    id: "math-euler",
    subjectId: "math",
    subjectName: "Mathematics",
    title: "3D Polyhedrons & Euler's Formula",
    subtitle: "Explore 3D solid geometry and verify F + V - E = 2",
    classLevel: "Classes 7–8",
    chapter: "Visualising Solid Shapes",
    lessonId: "math-euler",
    quizId: "math_shapes",
    quizRoute: "/quiz/math_shapes",
    is3D: true,
    objectives: [
      "Understand what makes a three-dimensional solid a polyhedron.",
      "Identify and count faces, vertices, and edges of standard polyhedrons.",
      "Experiment with 3D rotation, inspection, and perspective zoom.",
      "Verify that Euler's polyhedral formula (F + V - E = 2) holds true for all convex polyhedrons.",
    ],
    materials: [
      "Interactive 3D WebGL / Three.js viewport",
      "Regular Cube (Hexahedron) 3D mesh",
      "Triangular Prism 3D mesh",
      "Regular Octahedron 3D mesh",
      "Regular Tetrahedron 3D mesh",
    ],
    safetyGuidelines: [
      "Use click-and-drag mouse or touch controls to smoothly rotate the 3D solid.",
      "Scroll or pinch to zoom in and examine vertices and edges closely.",
      "Observe face boundaries marked in distinct edge wireframes.",
    ],
    scientificConcept:
      "A polyhedron is a 3D solid bounded by flat polygonal faces meeting at straight edges and sharp vertices. Swiss mathematician Leonhard Euler discovered the topological relationship F + V - E = 2, which states that for any convex polyhedron, the number of faces (F) plus vertices (V) minus edges (E) always equals 2.",
    observations: [
      "Cube: 6 faces + 8 vertices - 12 edges = 2.",
      "Triangular Prism: 5 faces + 6 vertices - 9 edges = 2.",
      "Octahedron: 8 faces + 6 vertices - 12 edges = 2.",
      "Tetrahedron: 4 faces + 4 vertices - 6 edges = 2.",
    ],
    result:
      "Euler's polyhedral formula F + V - E = 2 was successfully confirmed across all tested convex 3D solids.",
  },

  "math-number-line": {
    id: "math-number-line",
    subjectId: "math",
    subjectName: "Mathematics",
    title: "Integer Number Line & Arithmetic",
    subtitle: "Visualize positive and negative integers, absolute value, and integer addition",
    classLevel: "Class 6",
    chapter: "Integers & Number Systems",
    lessonId: "math-fractions",
    quizId: "math_fractions",
    quizRoute: "/quiz/math_fractions",
    is3D: false,
    objectives: [
      "Understand the visual representation of positive and negative numbers on a continuous line.",
      "Explore the origin point (0) as the reference dividing positive rightward and negative leftward values.",
      "Perform integer addition and subtraction by moving along the number line.",
      "Determine absolute value as the geometric distance from zero.",
    ],
    materials: [
      "Calibrated integer line from -10 to +10",
      "Interactive draggable and step marker",
      "Directional jump vectors for addition and subtraction",
      "Dynamic distance and value readout panel",
    ],
    safetyGuidelines: [
      "Remember that numbers to the right are always greater than numbers to the left.",
      "Subtracting a negative number is equivalent to moving rightward (adding).",
    ],
    scientificConcept:
      "A number line is a 1-dimensional coordinate system. Zero is the origin. Positive integers extend infinitely to the right, and negative integers extend infinitely to the left. Addition of a positive integer shifts position to the right, while addition of a negative integer shifts position to the left.",
    observations: [
      "Starting at 0 and moving 4 units right reaches +4.",
      "Adding -6 from +4 moves 6 units left to -2.",
      "The distance between -4 and +3 is | -4 - 3 | = 7 units.",
    ],
    result:
      "Integer positions, directional displacements, and arithmetic operations were demonstrated geometrically on the number line.",
  },

  "math-algebra": {
    id: "math-algebra",
    subjectId: "math",
    subjectName: "Mathematics",
    title: "Algebraic Equation Balancing Scale",
    subtitle: "Solve linear equations visually by keeping a dual-pan balance in equilibrium",
    classLevel: "Classes 7–8",
    chapter: "Linear Equations in One Variable",
    lessonId: "math-algebra",
    quizId: "math_shapes",
    quizRoute: "/quiz/math_shapes",
    is3D: false,
    objectives: [
      "Understand equations as a condition of exact equilibrium between left and right sides.",
      "Perform equal inverse operations (addition, subtraction, division) on both sides.",
      "Isolate the unknown variable x step-by-step.",
      "Verify the solution by substituting x back into the original expression.",
    ],
    materials: [
      "Animated dual-pan balance scale with tilt physics",
      "Variable weight blocks (x)",
      "Standard 1kg and 5kg calibration weights",
      "Step operation calculator (+, -, ×, ÷)",
    ],
    safetyGuidelines: [
      "Whatever operation is performed on the left side must also be applied identically to the right side to maintain balance.",
    ],
    scientificConcept:
      "An algebraic equation represents a balance between two mathematical expressions. To solve for an unknown variable x, one applies inverse operations equally to both sides of the equation. This preserves equality while isolating x.",
    observations: [
      "Given 2x + 3 = 11, removing 3 from both pans yields 2x = 8.",
      "Dividing both pans by 2 yields x = 4.",
      "Substituting x = 4 confirms 2(4) + 3 = 11, keeping the balance perfectly horizontal.",
    ],
    result:
      "The unknown variable x was successfully isolated and verified using the balance scale principle.",
  },

  "math-geometry": {
    id: "math-geometry",
    subjectId: "math",
    subjectName: "Mathematics",
    title: "2D Geometry: Area & Perimeter",
    subtitle: "Manipulate rectangles, triangles, and circles with dynamic dimension sliders",
    classLevel: "Classes 6–8",
    chapter: "Mensuration & Geometry",
    lessonId: "math-mensuration",
    quizId: "math_shapes",
    quizRoute: "/quiz/math_shapes",
    is3D: false,
    objectives: [
      "Distinguish between perimeter (boundary length) and area (enclosed 2D surface).",
      "Manipulate rectangle length and width to observe quadratic area scaling.",
      "Vary triangle base and height to understand Area = 1/2 × base × height.",
      "Explore circles to understand Circumference = 2πr and Area = πr².",
    ],
    materials: [
      "Interactive SVG 2D geometry canvas with dimension indicators",
      "Continuous dimension sliders for length, width, base, height, and radius",
      "Live mathematical formula substitution engine",
      "Grid overlay for visual square unit counting",
    ],
    safetyGuidelines: [
      "Ensure dimensions remain within realistic positive scalar values.",
    ],
    scientificConcept:
      "Perimeter measures the 1-dimensional boundary enclosing a 2D shape (measured in linear units: cm or m). Area measures the amount of 2-dimensional space enclosed within the boundary (measured in square units: cm² or m²).",
    observations: [
      "Doubling both dimensions of a rectangle quadruples its area (2² = 4).",
      "A triangle with base 6cm and height 4cm has an area of 12 cm².",
      "A circle's area scales with the square of its radius (A = πr²).",
    ],
    result:
      "Formulas for perimeter, circumference, and area were dynamically validated across rectangular, triangular, and circular geometries.",
  },

  // =========================================================================
  // PHYSICS ACTIVITIES
  // =========================================================================
  "physics-circuit": {
    id: "physics-circuit",
    subjectId: "physics",
    subjectName: "Physics",
    title: "Virtual Electric Circuits & Conductors",
    subtitle: "Assemble battery, switch, wires, and bulb; test conductors vs insulators",
    classLevel: "Classes 6–8",
    chapter: "Electricity and Circuits",
    lessonId: "physics-circuit",
    quizId: "physics_circuit",
    quizRoute: "/quiz/physics_circuit",
    is3D: false,
    objectives: [
      "Understand the four essential components of an electric circuit: power source, wires, switch, load.",
      "Distinguish between closed (complete) and open (broken) electrical loops.",
      "Observe animated electron flow when current circulates.",
      "Test different materials to classify them as electrical conductors or insulators.",
    ],
    materials: [
      "1.5V / 3.0V DC chemical cell battery",
      "Single-pole knife switch",
      "Incandescent filament light bulb load",
      "Insulated copper connecting wires",
      "Material test specimens (Copper, Iron, Graphite, Plastic, Rubber)",
    ],
    safetyGuidelines: [
      "Never directly connect the positive and negative terminals of a battery without a load (short circuit).",
    ],
    scientificConcept:
      "An electric circuit requires a continuous unbroken conducting pathway for electrical current to flow from the high-potential positive terminal to the low-potential negative terminal. Conductors contain free mobile valence electrons that carry charge, whereas insulators tightly bind electrons and block current.",
    observations: [
      "When the switch is open, the circuit loop is broken and the bulb remains dark.",
      "When the switch is closed with copper, iron, or graphite in the gap, the circuit completes and the bulb illuminates.",
      "When plastic or rubber is inserted, current is blocked and the bulb stays off.",
    ],
    result:
      "The laws of circuit continuity and the conductive properties of metallic and non-metallic materials were experimentally validated.",
  },

  "physics-pendulum": {
    id: "physics-pendulum",
    subjectId: "physics",
    subjectName: "Physics",
    title: "Simple Pendulum Motion & Periodic Time",
    subtitle: "Investigate oscillations, string length, gravity, and the formula T = 2π√(L/g)",
    classLevel: "Classes 7–9",
    chapter: "Motion and Time",
    lessonId: "phys-motion-time",
    quizId: "physics_circuit",
    quizRoute: "/quiz/physics_circuit",
    is3D: false,
    objectives: [
      "Understand periodic motion and simple harmonic oscillation.",
      "Define amplitude, mean position, extreme positions, and one complete oscillation.",
      "Determine how string length (L) influences the time period (T).",
      "Observe how celestial gravitational acceleration (Earth, Moon, Jupiter) alters oscillation frequency.",
    ],
    materials: [
      "Rigid support stand with low-friction pivot point",
      "Light, inextensible string with adjustable length (0.2m to 2.0m)",
      "Spherical metallic pendulum bob",
      "Digital stopwatch with millisecond precision",
      "Oscillation counter and velocity vector display",
    ],
    safetyGuidelines: [
      "Keep initial displacement angles under 20° to maintain valid small-angle simple harmonic motion.",
    ],
    scientificConcept:
      "A simple pendulum consists of a concentrated mass (bob) suspended from a fixed point by a light string. When displaced and released, gravity acts as a restoring force, producing periodic oscillatory motion. For small amplitudes, the time period is governed by T = 2π√(L/g), independent of the bob's mass.",
    observations: [
      "A 1.0m pendulum on Earth (g = 9.8 m/s²) has a measured period of approximately 2.01 seconds.",
      "Shortening the string to 0.25m halves the period to approximately 1.00 second.",
      "On the Moon (g = 1.62 m/s²), the same 1.0m pendulum swings much more slowly, with T ≈ 4.94 seconds.",
    ],
    result:
      "The theoretical formula T = 2π√(L/g) was confirmed, showing period depends directly on the square root of length and inversely on the square root of gravity.",
  },

  "physics-reflection": {
    id: "physics-reflection",
    subjectId: "physics",
    subjectName: "Physics",
    title: "Ray Optics: Laws of Light Reflection",
    subtitle: "Direct a laser ray at a plane mirror and verify Angle of Incidence = Angle of Reflection",
    classLevel: "Classes 7–10",
    chapter: "Light, Shadows and Reflection",
    lessonId: "phys-light-shadows",
    quizId: "physics_circuit",
    quizRoute: "/quiz/physics_circuit",
    is3D: false,
    objectives: [
      "Understand the rectilinear propagation of light rays.",
      "Identify the incident ray, reflected ray, point of incidence, and the normal line.",
      "Measure the angle of incidence (i) and angle of reflection (r) relative to the normal.",
      "Verify the 1st Law of Reflection: Angle of incidence equals angle of reflection (∠i = ∠r).",
    ],
    materials: [
      "High-precision collimated optical laser source",
      "Polished silvered plane mirror barrier",
      "Virtual circular 360° protractor with 1° angle graduations",
      "Normal line reference guide perpendicular to the mirror surface",
    ],
    safetyGuidelines: [
      "Virtual lasers are eye-safe; in physical labs, never look directly into a laser aperture.",
    ],
    scientificConcept:
      "When a ray of light strikes a smooth, polished plane mirror, it bounces back into the same optical medium. The 1st Law of Reflection states that the angle of incidence (∠i) is always strictly equal to the angle of reflection (∠r), both measured with respect to the normal perpendicular to the reflecting plane.",
    observations: [
      "At 30° incidence, the reflected ray emerges at exactly 30° on the opposite side of the normal.",
      "At 45° incidence, the reflected ray is observed at 45°.",
      "A ray striking normal to the surface (0°) reflects back along its own incident path (0°).",
    ],
    result:
      "The Law of Reflection ∠i = ∠r was experimentally verified across all angles from 0° to 80°.",
  },

  "physics-force": {
    id: "physics-force",
    subjectId: "physics",
    subjectName: "Physics",
    title: "Newton's Second Law of Motion (F = ma)",
    subtitle: "Accelerate a laboratory cart along a low-friction track and measure a = F / m",
    classLevel: "Classes 8–9",
    chapter: "Force, Pressure and Laws of Motion",
    lessonId: "phys-force-pressure",
    quizId: "physics_circuit",
    quizRoute: "/quiz/physics_circuit",
    is3D: false,
    objectives: [
      "Understand how unbalanced net force causes acceleration of a physical mass.",
      "Investigate how increasing force (F) increases acceleration for a constant mass.",
      "Investigate how increasing mass (m) reduces acceleration for a constant applied force.",
      "Verify Newton's Second Law of Motion: a = F / m or F = m × a.",
    ],
    materials: [
      "Low-friction wheeled laboratory dynamics cart",
      "Linear horizontal track with distance measurement markers",
      "Continuous force generator slider (0 to 20 N)",
      "Stackable mass plates (1 kg to 5 kg)",
      "Real-time digital speedometer, accelerometer, and timer",
    ],
    safetyGuidelines: [
      "Ensure the stop buffer is engaged at the end of the linear track.",
    ],
    scientificConcept:
      "Newton's Second Law of Motion states that the acceleration (a) of an object is directly proportional to the net force (F) acting upon it and inversely proportional to its mass (m). Expressed mathematically: F = ma or a = F / m.",
    observations: [
      "Applying 10 N to a 2 kg cart produces an acceleration of 5.0 m/s².",
      "Doubling the force to 20 N on the same 2 kg cart doubles the acceleration to 10.0 m/s².",
      "Increasing the cart mass to 4 kg with 10 N force reduces acceleration by half to 2.5 m/s².",
    ],
    result:
      "The linear relationship a = F / m was confirmed through dynamic multi-variable trials.",
  },

  // =========================================================================
  // CHEMISTRY ACTIVITIES
  // =========================================================================
  "chemistry-filtration": {
    id: "chemistry-filtration",
    subjectId: "chemistry",
    subjectName: "Chemistry",
    title: "3D Virtual Filtration Laboratory",
    subtitle: "Separate sand from water using conical funnel, filter paper, and beakers in full 3D",
    classLevel: "Classes 6–8",
    chapter: "Separation of Substances",
    lessonId: "chemistry-filtration",
    quizId: "chemistry_filtration",
    quizRoute: "/quiz/chemistry_filtration",
    is3D: true,
    objectives: [
      "Understand mechanical separation of insoluble solid particles from a liquid suspension.",
      "Manipulate 3D laboratory glassware: beakers, filter funnel, filter paper, and collection cylinder.",
      "Perform the step-by-step filtration procedure in a real-time 3D simulated room.",
      "Examine how porous filter paper allows liquid filtrate through while trapping solid residue.",
    ],
    materials: [
      "Beaker containing sand and water suspension",
      "Conical glass filter funnel mounted on ring stand",
      "Porous circular filter paper folded into a cone",
      "Graduated measuring cylinder for filtrate collection",
      "Interactive 3D laboratory workbench stations",
    ],
    safetyGuidelines: [
      "Wear virtual laboratory safety goggles.",
      "Avoid simulated glass collisions by moving apparatus with steady cursor motions.",
    ],
    scientificConcept:
      "Filtration is a mechanical separation technique used to separate insoluble solid particles from a liquid. The mixture is poured through a porous medium (filter paper). The liquid passes through the pores due to smaller molecular dimensions and gravity (filtrate), while larger solid particles are retained on top (residue).",
    observations: [
      "The initial mixture is turbid and cloudy with suspended brown sand particles.",
      "As the suspension is poured into the funnel, clear water drops steadily into the measuring cylinder.",
      "Insoluble sand particles remain trapped as residue on the filter paper.",
      "The collected liquid in the measuring cylinder is clear, transparent water filtrate.",
    ],
    result:
      "The sand and water mixture was cleanly separated into solid residue and liquid filtrate via mechanical filtration.",
  },

  "chem-matter-kinetic": {
    id: "chem-matter-kinetic",
    subjectId: "chemistry",
    subjectName: "Chemistry",
    title: "States of Matter & Particle Kinetics",
    subtitle: "Simulate particle lattices in solids, liquids, and gases with interactive heat control",
    classLevel: "Classes 6–9",
    chapter: "Matter in Our Surroundings",
    lessonId: "chem-matter-kinetic",
    quizId: "chemistry_atoms",
    quizRoute: "/quiz/chemistry_atoms",
    is3D: false,
    objectives: [
      "Explore the kinetic molecular theory of matter.",
      "Compare particle arrangements in Solid, Liquid, and Gas phases.",
      "Observe intermolecular spacing, forces of attraction, and particle velocity.",
      "Adjust temperature (-50°C to 150°C) to witness phase transitions (melting and vaporisation).",
    ],
    materials: [
      "Simulated sealed containment vessel with animated particles",
      "Continuous thermal burner control slider (-50°C to 150°C)",
      "Phase state selector (Solid, Liquid, Gas)",
      "Kinetic energy thermometer and pressure gauge",
    ],
    safetyGuidelines: [
      "Thermal expansion in sealed vessels increases pressure; observe safety thresholds.",
    ],
    scientificConcept:
      "According to kinetic molecular theory, all matter consists of constantly moving particles. In solids, particles are tightly packed in fixed lattices with low kinetic energy and strong intermolecular bonds. In liquids, particles have higher energy and slide past each other. In gases, particles possess high kinetic energy, large intermolecular spaces, and move freely in all directions.",
    observations: [
      "At low temperatures (-10°C): Particles lock into a rigid crystal lattice with slight vibrations (Solid Ice).",
      "At 25°C: Thermal energy breaks rigid lattice; particles flow dynamically around each other (Liquid Water).",
      "Above 100°C: Particles overcome intermolecular attraction completely, moving rapidly at high speeds (Water Vapor Gas).",
    ],
    result:
      "Kinetic behavior, intermolecular spacing, and temperature-driven phase transitions were visually validated.",
  },

  "chem-separation": {
    id: "chem-separation",
    subjectId: "chemistry",
    subjectName: "Chemistry",
    title: "Separation of Diverse Mixtures",
    subtitle: "Match mixtures with the correct physical separation method: Filtration, Evaporation, Magnetic, Sieving",
    classLevel: "Classes 6–8",
    chapter: "Separation of Substances",
    lessonId: "chemistry-filtration",
    quizId: "chemistry_filtration",
    quizRoute: "/quiz/chemistry_filtration",
    is3D: false,
    objectives: [
      "Identify the distinct physical properties that enable mixture separation.",
      "Differentiate between soluble and insoluble mixtures.",
      "Select the optimal technique: Filtration (solubility/size), Evaporation (boiling point), Magnetism (magnetic susceptibility), Sieving (particle size).",
      "Observe animated separation workflows for each mixture type.",
    ],
    materials: [
      "Mixture test tubes: Sand+Water, Salt+Water, Iron Filings+Sand, Flour+Rice",
      "Separation apparatus: Filter Funnel, Bunsen Burner Evaporation Dish, Bar Magnet, Wire Mesh Sieve",
      "Interactive technique selector and step-by-step observation animator",
    ],
    safetyGuidelines: [
      "Handle heating apparatus with simulated heat-resistant gloves.",
    ],
    scientificConcept:
      "Substances in a mixture retain their individual physical properties (such as particle size, density, boiling point, and magnetic attraction). Separation techniques exploit these differences without causing chemical reactions.",
    observations: [
      "Sand and Water: Insoluble solid in liquid -> separated by Filtration.",
      "Salt and Water: Soluble solid in liquid -> separated by Evaporation (water vaporises, leaving salt crystals).",
      "Iron Filings and Sand: Ferromagnetic solid in non-magnetic solid -> separated by Magnetic Attraction.",
      "Flour and Rice: Different solid particle sizes -> separated by Sieving through mesh.",
    ],
    result:
      "Appropriate physical separation techniques were successfully matched and verified based on inherent physical properties.",
  },

  "chem-acids-bases": {
    id: "chem-acids-bases",
    subjectId: "chemistry",
    subjectName: "Chemistry",
    title: "Acids, Bases & Natural Indicators",
    subtitle: "Test everyday substances with Blue Litmus, Red Litmus, Turmeric, and Phenolphthalein",
    classLevel: "Classes 7–10",
    chapter: "Acids, Bases and Salts",
    lessonId: "chem-acids-bases",
    quizId: "chemistry_acids",
    quizRoute: "/quiz/chemistry_acids",
    is3D: false,
    objectives: [
      "Classify common substances into acidic, neutral, and basic categories.",
      "Test solutions using natural indicators (Turmeric, Litmus) and synthetic indicators (Phenolphthalein).",
      "Observe vivid color transitions indicating hydrogen ion (pH) concentration.",
      "Understand the chemical basis of acid-base neutralisation.",
    ],
    materials: [
      "Test solutions: Lemon Juice (pH 2.2), Vinegar (pH 2.9), Pure Water (pH 7.0), Baking Soda (pH 8.5), Soap Water (pH 10.0)",
      "Indicator reagents: Blue Litmus paper, Red Litmus paper, Natural Turmeric extract, Phenolphthalein solution",
      "Color comparison chart and interactive digital pH meter",
    ],
    safetyGuidelines: [
      "Never taste or touch laboratory acids and bases; use chemical indicators for identification.",
    ],
    scientificConcept:
      "Acids produce hydrogen ions (H+) in aqueous solutions and turn blue litmus red. Bases produce hydroxide ions (OH-), taste bitter, feel slippery, and turn red litmus blue. Natural indicators like turmeric contain curcumin, which turns deep reddish-brown in basic media.",
    observations: [
      "Lemon juice & Vinegar: Turn blue litmus RED; turmeric remains yellow; phenolphthalein remains colorless (Acidic).",
      "Distilled water: No change in blue litmus, red litmus, or turmeric (Neutral, pH 7.0).",
      "Baking soda & Soap solution: Turn red litmus BLUE; turn yellow turmeric REDDISH-BROWN; turn phenolphthalein PINK (Basic).",
    ],
    result:
      "Distinct acidic and basic chemical behaviors were demonstrated and mapped across multiple indicator reagents.",
  },

  // =========================================================================
  // BIOLOGY ACTIVITIES
  // =========================================================================
  "biology-cell": {
    id: "biology-cell",
    subjectId: "biology",
    subjectName: "Biology",
    title: "Plant & Animal Cell Explorer",
    subtitle: "Toggle between Plant and Animal cells, inspect organelles, and compare cellular structures",
    classLevel: "Classes 8–9",
    chapter: "Cell — Structure & Functions",
    lessonId: "biology-cell",
    quizId: "biology_cell",
    quizRoute: "/quiz/biology_cell",
    is3D: false,
    objectives: [
      "Understand the cell as the fundamental structural and functional unit of all living organisms.",
      "Compare eukaryotic plant cells (rigid cell wall, chloroplasts, large vacuole) and animal cells (flexible membrane, lysosomes, small vacuoles).",
      "Click and inspect major organelles: Cell Wall, Membrane, Nucleus, Chloroplast, Mitochondria, Central Vacuole.",
      "Understand the specialised physiological role of each cellular organelle.",
    ],
    materials: [
      "High-magnification virtual compound microscope simulator",
      "Interactive SVG biological cell diagrams with clickable organelle zones",
      "Toggle switch between Plant Cell (Onion Peel) and Animal Cell (Human Cheek Cell)",
      "Organelle fact panel with magnification controls (10x, 40x, 100x)",
    ],
    safetyGuidelines: [
      "Simulate fine focus adjustment slowly to avoid breaking virtual cover slips.",
    ],
    scientificConcept:
      "Both plant and animal cells are eukaryotic cells sharing common organelles like the nucleus, cell membrane, cytoplasm, and mitochondria. However, plant cells possess a rigid cellulose cell wall for structural support, chloroplasts for photosynthesis, and a large central vacuole, all of which are absent in animal cells.",
    observations: [
      "Plant cells have a defined rectangular geometry bounded by an outer rigid cell wall.",
      "Animal cells have an irregular, flexible spherical shape bounded only by the plasma membrane.",
      "Chloroplasts are vibrant green organelles present exclusively in plant cells.",
      "The plant cell nucleus is pushed to the periphery by the large central vacuole, while the animal cell nucleus is centrally positioned.",
    ],
    result:
      "Key anatomical differences between plant and animal cells and their organelle functions were thoroughly examined and verified.",
  },

  "bio-photosynthesis": {
    id: "bio-photosynthesis",
    subjectId: "biology",
    subjectName: "Biology",
    title: "Photosynthesis Process & Rate Visualizer",
    subtitle: "Explore sunlight, water, and CO2 conversion into glucose and oxygen with rate controls",
    classLevel: "Classes 6–10",
    chapter: "Nutrition in Plants & Life Processes",
    lessonId: "bio-photosynthesis",
    quizId: "biology_plants",
    quizRoute: "/quiz/biology_plants",
    is3D: false,
    objectives: [
      "Understand how autotrophic green plants synthesize organic food using inorganic raw materials.",
      "Trace the intake of water (via xylem from roots), CO2 (via stomata from air), and solar energy (via chlorophyll).",
      "Simulate the production of glucose (chemical energy) and release of oxygen gas (O2).",
      "Adjust light intensity and CO2 levels to observe real-time changes in photosynthesis rate and oxygen bubbling.",
    ],
    materials: [
      "Submerged aquatic plant (Hydrilla / Elodea) inside water beaker and inverted test tube",
      "Sunlight intensity slider (0 to 100%)",
      "Dissolved CO2 concentration slider (Low to High)",
      "Real-time oxygen gas bubble generator and rate graph",
      "Stomatal guard cell opening/closing microscope visualizer",
    ],
    safetyGuidelines: [
      "In physical labs, avoid overheating aquatic plants with high-wattage incandescent lamps.",
    ],
    scientificConcept:
      "Photosynthesis is the photochemical process by which green plants convert light energy into chemical energy. The balanced chemical equation is: 6CO2 + 6H2O + Light Energy -> C6H12O6 + 6O2. Chlorophyll inside leaf chloroplasts absorbs photon energy, splitting water molecules (photolysis) to reduce CO2 into glucose while releasing oxygen.",
    observations: [
      "In darkness (0% light), no oxygen bubbles are produced; the rate of photosynthesis is zero.",
      "As light intensity increases to 75%, oxygen bubble emission increases proportionally.",
      "When both light intensity and CO2 availability are high, maximum bubble production is achieved.",
    ],
    result:
      "The requirements and outputs of photosynthesis, and the direct dependence of its rate on light and CO2, were experimentally confirmed.",
  },

  "bio-circulation": {
    id: "bio-circulation",
    subjectId: "biology",
    subjectName: "Biology",
    title: "Human Heart & Double Circulatory System",
    subtitle: "Trace oxygenated and deoxygenated blood flow across the 4-chambered heart, lungs, and body",
    classLevel: "Classes 9–10",
    chapter: "Life Processes — Transportation in Animals",
    lessonId: "bio-circulation",
    quizId: "biology_cell",
    quizRoute: "/quiz/biology_cell",
    is3D: false,
    objectives: [
      "Understand the four internal chambers of the human heart: Right Atrium, Right Ventricle, Left Atrium, Left Ventricle.",
      "Trace pulmonary circulation (heart -> lungs -> heart) for oxygenation of blood.",
      "Trace systemic circulation (heart -> body tissues -> heart) for oxygen delivery.",
      "Observe rhythmic cardiac cycle (systole and diastole) and adjust heart rate (BPM).",
    ],
    materials: [
      "Interactive anatomical cross-section of the 4-chambered muscular heart",
      "Dual circulatory circuit diagram: Pulmonary Loop (lungs) and Systemic Loop (body organs)",
      "Animated blood particle flow: Deoxygenated (blue) vs Oxygenated (red)",
      "Heart rate controller slider (40 to 140 BPM) and cardiac cycle phase tracker",
    ],
    safetyGuidelines: [
      "Recognize that anatomical diagrams are oriented in mirror view (the patient's right is on your left).",
    ],
    scientificConcept:
      "Humans possess a double circulatory system, meaning blood passes through the heart twice during each complete circuit. Deoxygenated blood from body tissues enters the Right Atrium, moves to the Right Ventricle, and is pumped via the pulmonary artery to the lungs for oxygenation. Oxygen-rich blood returns to the Left Atrium, enters the Left Ventricle, and is pumped under high pressure through the aorta to all body tissues.",
    observations: [
      "Deoxygenated blue blood enters via Vena Cava -> Right Atrium -> Right Ventricle -> Pulmonary Artery -> Lungs.",
      "In the lungs, blood absorbs O2 and releases CO2, turning bright red.",
      "Oxygenated red blood returns via Pulmonary Veins -> Left Atrium -> Left Ventricle -> Aorta -> Body Tissues.",
      "The muscular wall of the Left Ventricle is significantly thicker than the Right Ventricle because it must pump blood throughout the entire body.",
    ],
    result:
      "The pathway of double circulation and the coordination of the four cardiac chambers were dynamically verified.",
  },
};

// Helper to get activities for a given subject ID
export function getActivitiesForSubject(subjectId) {
  const normId = subjectId === "mathematics" ? "math" : subjectId;
  return Object.values(LAB_ACTIVITIES).filter(
    (act) => act.subjectId === normId
  );
}

// Helper to get a specific activity by ID
export function getActivityById(activityId) {
  return LAB_ACTIVITIES[activityId] || null;
}
