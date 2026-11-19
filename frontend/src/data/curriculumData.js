// ==========================================================================
// EDUSPARK STEM CURRICULUM DATA (CLASSES 6 TO 10)
// Mathematics, Physics, Chemistry, Biology
// ==========================================================================

export const KANNADA = "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1";

export const languageNames = {
  en: "English",
  kn: KANNADA,
  hi: "हिन्दी",
  ta: "தமிழ்",
};

export const curriculumData = {
  chemistry: {
    id: "chemistry",
    name: "Chemistry",
    tagline: "Explore atoms, molecules, separation techniques, and chemical reactions.",
    icon: "FlaskConical",
    color: "#6655D9",
    accentBg: "rgba(102, 85, 217, 0.12)",
    image: "/crafto/demo-elearning-courses-04.jpg",
    classes: {
      "Class 6": [
        {
          id: "chem-6-1",
          chapter: "Separation of Substances",
          topic: "Filtration & Sedimentation",
          description: "Separate insoluble solids like sand from liquids using filter paper, funnels, and measuring cylinders in a real 3D room.",
          type: "3D Virtual Lab",
          lessonId: "chemistry-filtration",
          quizId: "chemistry_filtration",
          is3D: true,
          route: "/chemistry-lab",
          quizRoute: "/quiz/chemistry_filtration",
        },
        {
          id: "chem-6-2",
          chapter: "Sorting Materials into Groups",
          topic: "Atoms & Molecules Fundamentals",
          description: "All ordinary matter is made of tiny particles called atoms. Atoms join to form molecules.",
          type: "Interactive Lesson",
          lessonId: "chemistry-atoms",
          lesson: {
            id: "chemistry-atoms",
            title: "Introduction to Atoms and Molecules",
            introduction:
              "All ordinary matter is made of tiny particles called atoms. Atoms can join together to form molecules.",
            points: [
              "An atom is the basic unit of a chemical element.",
              "The centre of an atom is called the atomic nucleus.",
              "The nucleus contains protons and neutrons.",
              "Electrons orbit around the nucleus.",
              "A water molecule contains two hydrogen atoms and one oxygen atom (H2O).",
            ],
            question: "What is the chemical formula of a water molecule?",
            options: ["CO2", "O2", "H2O", "NaCl"],
            correctAnswer: 2,
            explanation:
              "H2O represents a water molecule containing two hydrogen atoms bonded to one oxygen atom.",
          },
        },
      ],
      "Class 7": [
        {
          id: "chem-7-1",
          chapter: "Acids, Bases and Salts",
          topic: "Indicators & pH Neutralisation",
          description: "Learn how litmus paper, turmeric, and phenolphthalein identify acidic and basic solutions.",
          type: "Interactive Activity",
          lessonId: "chem-acids-bases",
          lesson: {
            id: "chem-acids-bases",
            title: "Acids, Bases and Natural Indicators",
            introduction:
              "Substances that taste sour are generally acidic (like lemon juice), while substances that feel soapy and taste bitter are basic. Indicators change colour in acids and bases.",
            points: [
              "Blue litmus turns red in an acidic solution.",
              "Red litmus turns blue in a basic solution.",
              "Turmeric turns reddish-brown in basic solutions (like soap).",
              "When an acid reacts with a base, they neutralise each other to form salt and water.",
            ],
            question: "What happens when blue litmus paper is dipped into lemon juice?",
            options: [
              "It turns red",
              "It turns green",
              "It remains blue",
              "It turns yellow",
            ],
            correctAnswer: 0,
            explanation:
              "Lemon juice is acidic (contains citric acid), so it turns blue litmus paper red.",
          },
        },
        {
          id: "chem-7-2",
          chapter: "Physical and Chemical Changes",
          topic: "Reversible vs Irreversible Changes",
          description: "Explore the difference between melting ice (physical) and rusting of iron (chemical).",
          type: "Guided Activity",
          lessonId: "chem-changes",
          lesson: {
            id: "chem-changes",
            title: "Physical vs Chemical Transformations",
            introduction:
              "In a physical change, no new substance is formed. In a chemical change, one or more entirely new substances are produced.",
            points: [
              "Melting of ice and dissolving salt in water are physical changes.",
              "Rusting of iron requires both oxygen and water moisture.",
              "Burning magnesium ribbon produces a new white powder: magnesium oxide.",
              "Chemical changes are generally irreversible by simple physical means.",
            ],
            question: "Which of the following is a chemical change?",
            options: [
              "Tearing a sheet of paper",
              "Melting of wax",
              "Rusting of an iron nail",
              "Freezing water into ice",
            ],
            correctAnswer: 2,
            explanation:
              "Rusting produces iron oxide (a brand-new substance), making it a chemical change.",
          },
        },
      ],
      "Class 8": [
        {
          id: "chem-8-1",
          chapter: "Combustion and Flame",
          topic: "Ignition Temperature & Fire Triangle",
          description: "Understand the three requirements for combustion: fuel, oxygen, and ignition temperature.",
          type: "Interactive Activity",
          lessonId: "chem-combustion",
          lesson: {
            id: "chem-combustion",
            title: "The Science of Combustion and Flames",
            introduction:
              "A chemical process in which a substance reacts with oxygen to give off heat is called combustion. The lowest temperature at which a substance catches fire is its ignition temperature.",
            points: [
              "Combustion requires three elements: fuel, air (oxygen), and heat (ignition temperature).",
              "A candle flame has three distinct zones: innermost dark zone, middle luminous zone, and outermost blue non-luminous zone.",
              "The outermost zone is the hottest part of a flame.",
              "Water should never be used on electrical or oil fires.",
            ],
            question: "Which part of a candle flame is the hottest?",
            options: [
              "Innermost dark zone",
              "Middle yellow zone",
              "Outermost non-luminous blue zone",
              "All zones have the same temperature",
            ],
            correctAnswer: 2,
            explanation:
              "The outermost zone gets the maximum supply of oxygen, resulting in complete combustion and the highest temperature.",
          },
        },
      ],
      "Class 9": [
        {
          id: "chem-9-1",
          chapter: "Matter in Our Surroundings",
          topic: "Kinetic Theory & Latent Heat",
          description: "Analyze particles in solids, liquids, and gases and learn why evaporation causes cooling.",
          type: "Simulation Lesson",
          lessonId: "chem-matter-kinetic",
          lesson: {
            id: "chem-matter-kinetic",
            title: "States of Matter & Particle Motion",
            introduction:
              "Matter is composed of particles that possess kinetic energy and exert intermolecular attraction on each other.",
            points: [
              "Particles in solids are tightly packed with minimal kinetic space.",
              "Particles in gases move randomly at high speeds with large intermolecular spaces.",
              "Sublimation is the transition directly from solid to gas (e.g. camphor, dry ice).",
              "Evaporation takes heat energy from the surrounding surface, causing a cooling effect.",
            ],
            question: "What is the direct phase change from solid to gas called?",
            options: ["Condensation", "Sublimation", "Evaporation", "Fusion"],
            correctAnswer: 1,
            explanation:
              "Sublimation occurs when a solid turns directly into vapour without passing through the liquid state.",
          },
        },
      ],
      "Class 10": [
        {
          id: "chem-10-1",
          chapter: "Chemical Reactions & Equations",
          topic: "Types of Reactions & Balancing",
          description: "Balance redox, combination, decomposition, displacement, and precipitation reactions.",
          type: "Interactive Lesson",
          lessonId: "chem-reactions-equations",
          lesson: {
            id: "chem-reactions-equations",
            title: "Types of Chemical Reactions",
            introduction:
              "Chemical reactions involve the breaking and making of chemical bonds to produce new substances. The Law of Conservation of Mass dictates that mass cannot be created or destroyed.",
            points: [
              "Combination: Two or more reactants combine to form a single product.",
              "Decomposition: A single reactant breaks down into simpler products.",
              "Displacement: A more reactive metal displaces a less reactive metal from its salt solution.",
              "Oxidation is the gain of oxygen or loss of electrons; Reduction is the loss of oxygen or gain of electrons.",
            ],
            question: "What type of reaction is: Zn + CuSO4 → ZnSO4 + Cu?",
            options: [
              "Combination reaction",
              "Displacement reaction",
              "Decomposition reaction",
              "Neutralisation reaction",
            ],
            correctAnswer: 1,
            explanation:
              "Zinc is more reactive than copper and displaces copper from copper sulphate solution, making it a single displacement reaction.",
          },
        },
      ],
    },
  },
  physics: {
    id: "physics",
    name: "Physics",
    tagline: "Understand electric circuits, light, forces, energy, and motion.",
    icon: "Zap",
    color: "#EF991F",
    accentBg: "rgba(239, 153, 31, 0.12)",
    image: "/crafto/demo-elearning-courses-02.jpg",
    classes: {
      "Class 6": [
        {
          id: "phys-6-1",
          chapter: "Electricity and Circuits",
          topic: "Simple Electric Circuits",
          description: "An electric circuit is a path through which current flows. Connect a battery, switch, and bulb.",
          type: "Interactive Circuit Lab",
          lessonId: "physics-circuit",
          route: "/stem-lab/physics",
          quizRoute: "/quiz/physics_circuit",
          is3D: true,
          lesson: {
            id: "physics-circuit",
            title: "Understanding a Simple Electric Circuit",
            introduction:
              "An electric circuit is a path through which electric current can flow. A simple circuit contains a battery, connecting wires, a switch, and a bulb.",
            points: [
              "A battery or dry cell provides electrical energy.",
              "Copper wires connect the components together.",
              "A switch can open (break) or close (complete) the electrical path.",
              "Current flows from the positive terminal to the negative terminal in a complete loop.",
              "A bulb glows only when the circuit is closed and unbroken.",
            ],
            question: "When can electric current flow through a simple circuit?",
            options: [
              "When the circuit is open",
              "When the path is complete (closed)",
              "When a wire is disconnected",
              "When the switch breaks the loop",
            ],
            correctAnswer: 1,
            explanation:
              "Current can only flow when there is an uninterrupted, complete conducting loop.",
          },
        },
        {
          id: "phys-6-2",
          chapter: "Light, Shadows and Reflections",
          topic: "Rectilinear Propagation of Light",
          description: "Discover how light travels in straight lines and why opaque objects cast dark shadows.",
          type: "Interactive Lesson",
          lessonId: "phys-light-shadows",
          lesson: {
            id: "phys-light-shadows",
            title: "How Shadows and Reflections Form",
            introduction:
              "Light enables us to see objects around us. A luminous body emits its own light, while non-luminous objects reflect light into our eyes.",
            points: [
              "Light travels in straight lines (rectilinear propagation).",
              "Opaque objects completely block light, casting dark shadows on a screen.",
              "Translucent objects allow partial light, while transparent objects let light pass freely.",
              "A smooth mirror surface produces specular reflection.",
            ],
            question: "Which type of material completely blocks light to cast a dark shadow?",
            options: ["Transparent", "Translucent", "Opaque", "Luminous"],
            correctAnswer: 2,
            explanation:
              "Opaque materials do not allow light to pass through them, creating sharp shadows behind them.",
          },
        },
      ],
      "Class 7": [
        {
          id: "phys-7-1",
          chapter: "Motion and Time",
          topic: "Speed Calculation & Simple Pendulum",
          description: "Measure time period using an oscillating pendulum and plot distance-time graphs.",
          type: "Interactive Lesson",
          lessonId: "phys-motion-time",
          lesson: {
            id: "phys-motion-time",
            title: "Speed, Distance and Pendulum Oscillations",
            introduction:
              "Speed is defined as the distance covered by an object per unit of time. The SI unit of speed is metres per second (m/s).",
            points: [
              "Speed = Distance / Time.",
              "A simple pendulum consists of a small metallic bob suspended by a thread.",
              "One complete back-and-forth swing is called one oscillation.",
              "The time taken to complete one oscillation is called the time period.",
            ],
            question: "If a vehicle travels 120 kilometres in 2 hours, what is its speed?",
            options: ["50 km/h", "60 km/h", "70 km/h", "240 km/h"],
            correctAnswer: 1,
            explanation:
              "Speed = Distance / Time = 120 km / 2 h = 60 km/h.",
          },
        },
      ],
      "Class 8": [
        {
          id: "phys-8-1",
          chapter: "Force and Pressure",
          topic: "Contact vs Non-Contact Forces",
          description: "Examine gravitational, electrostatic, and magnetic forces versus muscular and friction forces.",
          type: "Interactive Lesson",
          lessonId: "phys-force-pressure",
          lesson: {
            id: "phys-force-pressure",
            title: "Understanding Forces and Surface Pressure",
            introduction:
              "A push or a pull on an object is called a force. Force can change the state of motion, speed, or shape of an object.",
            points: [
              "Muscular force and friction require physical contact.",
              "Gravity, magnetism, and electrostatic forces act from a distance (non-contact).",
              "Pressure is force acting per unit area (Pressure = Force / Area).",
              "Smaller surface areas exert higher pressure for the same applied force (e.g. sharp pins).",
            ],
            question: "Why does a sharp knife cut vegetables more easily than a blunt knife?",
            options: [
              "It exerts less force",
              "It has a smaller contact area, producing higher pressure",
              "It has a larger contact area",
              "It generates more friction",
            ],
            correctAnswer: 1,
            explanation:
              "A sharp edge has a tiny surface area, so the force applied creates much higher pressure to slice through.",
          },
        },
      ],
      "Class 9": [
        {
          id: "phys-9-1",
          chapter: "Gravitation",
          topic: "Universal Law of Gravitation & Free Fall",
          description: "Discover why all objects fall with acceleration g = 9.8 m/s² regardless of their mass.",
          type: "Interactive Lesson",
          lessonId: "phys-gravitation",
          lesson: {
            id: "phys-gravitation",
            title: "Newton's Universal Law of Gravitation",
            introduction:
              "Every object in the universe attracts every other object with a force directly proportional to the product of their masses and inversely proportional to the square of distance.",
            points: [
              "Gravitational force F = G * (m1 * m2) / d².",
              "On Earth's surface, acceleration due to gravity is approximately g = 9.8 m/s².",
              "In a vacuum, a feather and an iron ball fall at the exact same rate.",
              "Mass remains constant everywhere, while weight depends on local gravity.",
            ],
            question: "What is the standard acceleration due to gravity on the surface of Earth?",
            options: ["9.8 m/s²", "98 m/s²", "1.6 m/s²", "0 m/s²"],
            correctAnswer: 0,
            explanation:
              "Acceleration due to gravity on Earth is approximately 9.8 m/s².",
          },
        },
      ],
      "Class 10": [
        {
          id: "phys-10-1",
          chapter: "Light — Reflection and Refraction",
          topic: "Snell's Law & Refractive Index",
          description: "Observe bending of light as it passes between air, water, and glass prisms.",
          type: "Interactive Lesson",
          lessonId: "phys-refraction",
          lesson: {
            id: "phys-refraction",
            title: "Refraction of Light and Snell's Law",
            introduction:
              "When a ray of light travels obliquely from one transparent medium to another, its speed changes, causing it to bend.",
            points: [
              "When passing from a rarer to a denser medium, light bends towards the normal.",
              "When passing from a denser to a rarer medium, light bends away from the normal.",
              "Snell's Law: sin(i) / sin(r) = constant (refractive index).",
              "Convex lenses converge light rays; concave lenses diverge light rays.",
            ],
            question: "How does a ray of light bend when entering water from air?",
            options: [
              "Away from the normal",
              "Towards the normal",
              "It does not bend",
              "It reflects completely",
            ],
            correctAnswer: 1,
            explanation:
              "Water is optically denser than air, so light slows down and bends towards the normal line.",
          },
        },
      ],
    },
  },
  biology: {
    id: "biology",
    name: "Biology",
    tagline: "Discover cellular biology, plant life, photosynthesis, and human anatomy.",
    icon: "Microscope",
    color: "#28B67A",
    accentBg: "rgba(40, 182, 122, 0.12)",
    image: "/crafto/demo-elearning-courses-01.jpg",
    classes: {
      "Class 6": [
        {
          id: "bio-6-1",
          chapter: "Getting to Know Plants",
          topic: "Parts of Plants & Leaf Venation",
          description: "Discover roots, stems, leaves, flowers, and the difference between reticulate and parallel venation.",
          type: "Interactive Lesson",
          lessonId: "bio-plant-parts",
          lesson: {
            id: "bio-plant-parts",
            title: "Plant Structures and Leaf Venation",
            introduction:
              "Plants have specialized organs: roots absorb water and minerals, stems transport fluids, and leaves synthesize food.",
            points: [
              "Reticulate venation features a net-like vein design (e.g. peepal, mango).",
              "Parallel venation features straight veins parallel to each other (e.g. grass, wheat).",
              "Transpiration is the release of excess water vapour through microscopic stomata.",
              "Flowers contain male parts (stamens) and female parts (pistil/carpel).",
            ],
            question: "What is the process by which leaves release water vapour called?",
            options: ["Photosynthesis", "Transpiration", "Respiration", "Germination"],
            correctAnswer: 1,
            explanation:
              "Transpiration is the evaporation of water from plant leaves into the atmosphere.",
          },
        },
      ],
      "Class 7": [
        {
          id: "bio-7-1",
          chapter: "Nutrition in Plants",
          topic: "Photosynthesis & Chlorophyll",
          description: "Green plants convert carbon dioxide, water, and sunlight into glucose and oxygen.",
          type: "Interactive Lesson",
          lessonId: "bio-photosynthesis",
          lesson: {
            id: "bio-photosynthesis",
            title: "How Green Plants Make Food",
            introduction:
              "Autotrophic nutrition is the process where green organisms synthesize their own organic food using inorganic raw materials.",
            points: [
              "Chloroplasts in plant leaves contain the green pigment chlorophyll.",
              "Raw materials: Carbon dioxide from air (via stomata) and water from soil (via roots).",
              "Photosynthesis equation: 6CO2 + 6H2O + Sunlight → C6H12O6 + 6O2.",
              "Oxygen released during photosynthesis is essential for animal respiration.",
            ],
            question: "Which gas is released by green plants during daytime photosynthesis?",
            options: ["Carbon dioxide", "Oxygen", "Nitrogen", "Methane"],
            correctAnswer: 1,
            explanation:
              "Green plants absorb carbon dioxide and release oxygen as a byproduct of photosynthesis.",
          },
        },
      ],
      "Class 8": [
        {
          id: "bio-8-1",
          chapter: "Cell — Structure and Functions",
          topic: "Plant Cell Structure & Organelles",
          description: "A plant cell is the basic structural unit of plant life with specialized organelles.",
          type: "Microscope Lab",
          lessonId: "biology-cell",
          route: "/stem-lab/biology",
          quizRoute: "/quiz/biology_cell",
          is3D: true,
          lesson: {
            id: "biology-cell",
            title: "Introduction to Plant Cells",
            introduction:
              "A plant cell is the basic structural unit of a plant. It contains different parts called organelles that perform essential life functions.",
            points: [
              "The cell wall supports and protects the plant cell.",
              "The cell membrane controls what enters and leaves the cell.",
              "The nucleus contains hereditary genetic information (DNA).",
              "Chloroplasts contain chlorophyll and synthesize food using sunlight.",
              "The central vacuole stores water, sap, and cellular nutrients.",
            ],
            question: "Which cell part helps green plants make food using sunlight?",
            options: ["Nucleus", "Chloroplast", "Cell wall", "Vacuole"],
            correctAnswer: 1,
            explanation:
              "Chloroplasts contain green chlorophyll pigments that trap solar energy for photosynthesis.",
          },
        },
      ],
      "Class 9": [
        {
          id: "bio-9-1",
          chapter: "The Fundamental Unit of Life",
          topic: "Plasma Membrane & Osmosis",
          description: "Learn how diffusion and osmosis move water molecules through selectively permeable membranes.",
          type: "Cellular Lab",
          lessonId: "bio-osmosis-cell",
          lesson: {
            id: "bio-osmosis-cell",
            title: "Osmosis across Biological Membranes",
            introduction:
              "Osmosis is the net movement of water molecules across a selectively permeable membrane from higher to lower water potential.",
            points: [
              "Hypotonic solution: Cell gains water and swells up.",
              "Hypertonic solution: Cell loses water and shrinks (plasmolysis).",
              "Isotonic solution: No net movement; cell volume stays constant.",
              "Mitochondria are known as the powerhouses of the cell (producing ATP).",
            ],
            question: "What is called the powerhouse of the cell?",
            options: ["Ribosome", "Mitochondria", "Golgi apparatus", "Lysosome"],
            correctAnswer: 1,
            explanation:
              "Mitochondria produce ATP through cellular respiration, powering biological processes.",
          },
        },
      ],
      "Class 10": [
        {
          id: "bio-10-1",
          chapter: "Life Processes",
          topic: "Human Circulatory & Excretory System",
          description: "Examine double circulation through the human four-chambered heart and nephron filtration.",
          type: "Interactive Lesson",
          lessonId: "bio-circulation",
          lesson: {
            id: "bio-circulation",
            title: "Human Circulation & Blood Flow",
            introduction:
              "The human circulatory system transports nutrients, oxygen, and metabolic wastes throughout the body using blood and the muscular heart.",
            points: [
              "The human heart has 4 chambers: two atria and two ventricles.",
              "Arteries carry oxygenated blood away from the heart (except the pulmonary artery).",
              "Veins return deoxygenated blood to the heart (except the pulmonary vein).",
              "Double circulation prevents the mixing of oxygenated and deoxygenated blood.",
            ],
            question: "Which blood vessels carry oxygenated blood away from the heart to body organs?",
            options: ["Veins", "Arteries", "Capillaries", "Lymphatics"],
            correctAnswer: 1,
            explanation:
              "Arteries are thick-walled vessels that pump oxygen-rich blood under high pressure away from the heart.",
          },
        },
      ],
    },
  },
  math: {
    id: "math",
    name: "Mathematics",
    tagline: "Discover geometry, spatial 3D shapes, numbers, and algebraic patterns.",
    icon: "Shapes",
    color: "#2D7FF9",
    accentBg: "rgba(45, 127, 249, 0.12)",
    image: "/crafto/demo-elearning-courses-03.jpg",
    classes: {
      "Class 6": [
        {
          id: "math-6-1",
          chapter: "Basic Geometrical Ideas & 3D Shapes",
          topic: "Understanding 2D and 3D Shapes",
          description: "Explore the difference between length/width (2D) and length/width/height (3D polyhedrons).",
          type: "3D Polyhedron Lab",
          lessonId: "math-shapes",
          route: "/stem-lab/math",
          quizRoute: "/quiz/math_shapes",
          is3D: true,
          lesson: {
            id: "math-shapes",
            title: "Understanding 2D and 3D Shapes",
            introduction:
              "A 2D shape has two dimensions: length and width. A 3D shape has three dimensions: length, width, and height.",
            points: [
              "A square, circle, and triangle are 2D flat shapes.",
              "A cube, cuboid, cylinder, and sphere are 3D solid shapes.",
              "A standard cube has 6 flat faces, 12 straight edges, and 8 corner vertices.",
              "A sphere has 1 curved continuous surface and zero edges.",
            ],
            question: "Which of the following is a three-dimensional (3D) solid shape?",
            options: ["Square", "Triangle", "Cube", "Rectangle"],
            correctAnswer: 2,
            explanation:
              "A cube is a 3D shape because it occupies space with length, width, and height.",
          },
        },
        {
          id: "math-6-2",
          chapter: "Fractions & Decimals",
          topic: "Parts of a Whole on a Number Line",
          description: "Visualise fractions as equal slices of a whole unit and convert between fractions and decimals.",
          type: "Interactive Lesson",
          lessonId: "math-fractions",
          lesson: {
            id: "math-fractions",
            title: "Visualising Fractions and Decimals",
            introduction:
              "A fraction represents a part of a whole or collection. The top number is the numerator; the bottom number is the denominator.",
            points: [
              "In proper fractions, the numerator is less than the denominator (e.g. 3/4).",
              "Equivalent fractions represent the same quantity (e.g. 1/2 = 2/4 = 5/10).",
              "Fractions with denominator 10, 100, or 1000 convert directly to decimals (e.g. 5/10 = 0.5).",
              "A mixed fraction consists of a whole number part and a proper fraction part.",
            ],
            question: "What is 3/4 expressed as a decimal value?",
            options: ["0.34", "0.50", "0.75", "1.25"],
            correctAnswer: 2,
            explanation:
              "3 divided by 4 equals 0.75.",
          },
        },
      ],
      "Class 7": [
        {
          id: "math-7-1",
          chapter: "Lines and Angles",
          topic: "Complementary & Supplementary Angles",
          description: "Explore adjacent, vertically opposite, and interior angles formed by parallel lines.",
          type: "Interactive Lesson",
          lessonId: "math-angles",
          lesson: {
            id: "math-angles",
            title: "Pairs of Angles and Parallel Lines",
            introduction:
              "An angle is formed when lines or line segments meet at a vertex. Understanding angle relationships is fundamental to architecture and geometry.",
            points: [
              "Two angles are complementary if their sum equals 90°.",
              "Two angles are supplementary if their sum equals 180°.",
              "When two straight lines intersect, vertically opposite angles are always equal.",
              "The sum of all three angles inside any flat triangle is always 180°.",
            ],
            question: "If an angle measures 65°, what is its complementary angle?",
            options: ["115°", "25°", "35°", "90°"],
            correctAnswer: 1,
            explanation:
              "Complementary angles sum to 90°. Therefore: 90° - 65° = 25°.",
          },
        },
      ],
      "Class 8": [
        {
          id: "math-8-1",
          chapter: "Visualising Solid Shapes",
          topic: "Euler's Formula for Polyhedrons",
          description: "Count faces, vertices, and edges of polyhedrons to prove Euler's Formula: F + V - E = 2.",
          type: "Interactive Geometry",
          lessonId: "math-euler",
          lesson: {
            id: "math-euler",
            title: "Euler's Polyhedral Formula",
            introduction:
              "A polyhedron is a solid shape bounded entirely by polygons. Leonhard Euler discovered a magical relationship for all simple convex polyhedrons.",
            points: [
              "F represents the number of Faces (flat surfaces).",
              "V represents the number of Vertices (corner points).",
              "E represents the number of Edges (straight boundary lines).",
              "Euler's Formula states: Faces + Vertices - Edges = 2 (F + V - E = 2).",
              "For a cube: F = 6, V = 8, E = 12 → 6 + 8 - 12 = 2.",
            ],
            question: "A polyhedron has 6 faces and 8 vertices. How many edges must it have according to Euler's Formula?",
            options: ["10", "12", "14", "16"],
            correctAnswer: 1,
            explanation:
              "Using F + V - E = 2: 6 + 8 - E = 2 → 14 - E = 2 → E = 12 edges.",
          },
        },
      ],
      "Class 9": [
        {
          id: "math-9-1",
          chapter: "Surface Areas and Volumes",
          topic: "Cubes, Cuboids & Cylinders",
          description: "Derive formulas for lateral surface area, total surface area, and internal liquid capacity.",
          type: "Interactive Lesson",
          lessonId: "math-mensuration",
          lesson: {
            id: "math-mensuration",
            title: "Surface Area & Volume Calculations",
            introduction:
              "Surface area is the total area occupied by the exterior surfaces of a 3D solid. Volume is the measure of 3D space occupied inside.",
            points: [
              "Total Surface Area of a cube with side a = 6 * a².",
              "Volume of a cuboid = length * width * height.",
              "Curved surface area of a cylinder with radius r and height h = 2 * π * r * h.",
              "Volume of a cylinder = π * r² * h.",
            ],
            question: "What is the volume of a cube with an edge length of 3 cm?",
            options: ["9 cm³", "18 cm³", "27 cm³", "54 cm³"],
            correctAnswer: 2,
            explanation:
              "Volume of a cube = side³ = 3 * 3 * 3 = 27 cm³.",
          },
        },
      ],
      "Class 10": [
        {
          id: "math-10-1",
          chapter: "Trigonometry",
          topic: "Trigonometric Ratios in Right Triangles",
          description: "Define sine, cosine, and tangent as ratios of opposite, adjacent, and hypotenuse sides.",
          type: "Interactive Lesson",
          lessonId: "math-trigonometry",
          lesson: {
            id: "math-trigonometry",
            title: "Introduction to Trigonometric Ratios",
            introduction:
              "Trigonometry is the study of relationships between the side lengths and angles of triangles, particularly right-angled triangles.",
            points: [
              "sin(θ) = Opposite side / Hypotenuse.",
              "cos(θ) = Adjacent side / Hypotenuse.",
              "tan(θ) = Opposite side / Adjacent side = sin(θ) / cos(θ).",
              "Fundamental Pythagorean trigonometric identity: sin²(θ) + cos²(θ) = 1.",
            ],
            question: "In any right triangle, what is the value of sin²(θ) + cos²(θ)?",
            options: ["0", "1", "2", "Infinity"],
            correctAnswer: 1,
            explanation:
              "The fundamental trigonometric identity states that sin²(θ) + cos²(θ) = 1 for any angle θ.",
          },
        },
      ],
    },
  },
};
