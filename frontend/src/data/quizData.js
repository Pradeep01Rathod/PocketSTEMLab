// ==========================================================================
// EDUSPARK STEM QUIZ DATA REPOSITORY
// Classes 6 to 10 · Mathematics, Physics, Chemistry, Biology
// ==========================================================================

export const quizBank = {
  // =========================================================================
  // CHEMISTRY QUIZZES
  // =========================================================================
  chemistry_filtration: {
    id: "chemistry_filtration",
    subject: "Chemistry",
    classLevel: "Class 6",
    chapter: "Separation of Substances",
    title: "Filtration & Insoluble Mixtures Quiz",
    description: "Test your understanding of mechanical separation using filter funnels, residue, and filtrate.",
    lessonId: "chemistry-filtration",
    questions: [
      {
        question: "What is filtration primarily used for in the laboratory?",
        options: [
          "Separating an insoluble solid from a liquid suspension",
          "Separating two miscible liquids with different boiling points",
          "Converting liquid water into steam",
          "Neutralising an acidic solution with a base",
        ],
        answer: 0,
        explanation:
          "Filtration is a mechanical separation technique that separates insoluble solid particles from a liquid medium by passing the suspension through a porous barrier.",
      },
      {
        question: "Which laboratory apparatus supports the filter paper during filtration?",
        options: [
          "Graduated measuring cylinder",
          "Conical filter funnel",
          "Digital balance",
          "Thermometer",
        ],
        answer: 1,
        explanation:
          "The conical filter funnel holds the folded circular filter paper and directs the liquid flow into the receiving container.",
      },
      {
        question: "What happens to the sand particles when sand-and-water mixture is poured into the filter?",
        options: [
          "Sand dissolves completely into the water",
          "Sand evaporates into atmospheric gas",
          "Sand is trapped on the filter paper as residue",
          "Sand passes freely through the paper pores",
        ],
        answer: 2,
        explanation:
          "Because insoluble sand grains are larger than the microscopic pores of the filter paper, they are trapped on top as residue.",
      },
      {
        question: "What is the proper scientific term for the clear liquid collected after passing through the filter?",
        options: ["Residue", "Filtrate", "Solute", "Precipitate"],
        answer: 1,
        explanation:
          "The clear liquid that successfully passes through the pores of the filter paper is called the filtrate.",
      },
      {
        question: "Can ordinary paper filtration separate dissolved common salt from water?",
        options: [
          "Yes, all dissolved substances are caught by filter paper",
          "No, dissolved salt particles are small enough to pass through with water",
          "Only if the water is boiled first",
          "Only if we use a metal wire mesh",
        ],
        answer: 1,
        explanation:
          "When salt dissolves in water, it breaks down into individual sodium and chloride ions that are far smaller than the paper pores. Evaporation or distillation is required instead.",
      },
    ],
  },

  chemistry_atoms: {
    id: "chemistry_atoms",
    subject: "Chemistry",
    classLevel: "Class 6",
    chapter: "Sorting Materials into Groups",
    title: "Atoms and Molecules Fundamentals",
    description: "Assess your knowledge of subatomic particles, elements, and chemical compounds.",
    lessonId: "chemistry-atoms",
    questions: [
      {
        question: "What is the basic fundamental unit of all chemical matter?",
        options: ["Cell", "Atom", "Crystal", "Compound"],
        answer: 1,
        explanation: "An atom is the smallest constituent unit of ordinary matter that retains the properties of a chemical element.",
      },
      {
        question: "Which subatomic particles are located inside the central atomic nucleus?",
        options: [
          "Protons and Electrons",
          "Protons and Neutrons",
          "Electrons and Neutrons",
          "Photons and Electrons",
        ],
        answer: 1,
        explanation: "The central atomic nucleus contains positively charged protons and neutral neutrons.",
      },
      {
        question: "What electric charge is carried by electrons orbiting the nucleus?",
        options: ["Positive (+1)", "Negative (-1)", "Neutral (0)", "Variable charge"],
        answer: 1,
        explanation: "Electrons carry a negative electric charge (-1) and orbit in shells around the positive nucleus.",
      },
      {
        question: "How many hydrogen atoms are bonded in a single water molecule (H₂O)?",
        options: ["One", "Two", "Three", "Four"],
        answer: 1,
        explanation: "The formula H₂O indicates exactly two hydrogen atoms bonded chemically to one oxygen atom.",
      },
      {
        question: "What defines the atomic number of an element in the periodic table?",
        options: [
          "Total number of protons in its nucleus",
          "Total number of neutrons in its nucleus",
          "Total mass of the electron cloud",
          "Physical volume occupied by the atom",
        ],
        answer: 0,
        explanation: "The atomic number is uniquely determined by the number of protons in an atom's nucleus.",
      },
    ],
  },

  chemistry_acids: {
    id: "chemistry_acids",
    subject: "Chemistry",
    classLevel: "Class 7",
    chapter: "Acids, Bases and Salts",
    title: "Acids, Bases and Indicators Quiz",
    description: "Identify acidic and basic substances using natural and synthetic chemical indicators.",
    lessonId: "chem-acids-bases",
    questions: [
      {
        question: "What colour change occurs when blue litmus paper is dipped into an acidic solution like lemon juice?",
        options: ["Turns red", "Turns blue", "Turns yellow", "Turns green"],
        answer: 0,
        explanation: "Acids turn blue litmus paper red due to the presence of free hydrogen ions (H⁺).",
      },
      {
        question: "Which of the following substances is basic in nature?",
        options: ["Lemon juice", "Baking soda solution", "Vinegar", "Curd / Yoghurt"],
        answer: 1,
        explanation: "Baking soda (sodium bicarbonate) is a base. Lemon juice, vinegar, and curd all contain organic acids.",
      },
      {
        question: "What colour does natural turmeric indicator turn when exposed to a basic substance like soap?",
        options: ["Bright yellow", "Reddish-brown", "Deep purple", "Colourless"],
        answer: 1,
        explanation: "Turmeric contains curcumin which turns distinct reddish-brown in alkaline/basic solutions.",
      },
      {
        question: "What are the two products formed during an acid-base neutralisation reaction?",
        options: [
          "Salt and Water",
          "Hydrogen gas and Oxygen gas",
          "Acid and Carbon dioxide",
          "Sugar and Alcohol",
        ],
        answer: 0,
        explanation: "During neutralisation: Acid + Base → Salt + Water (e.g. HCl + NaOH → NaCl + H₂O).",
      },
      {
        question: "What is the pH value of a completely neutral solution (like pure distilled water at 25°C)?",
        options: ["pH = 0", "pH = 7", "pH = 14", "pH = 1"],
        answer: 1,
        explanation: "On the logarithmic pH scale, 7 represents exact neutrality. Values below 7 are acidic; values above 7 are basic.",
      },
    ],
  },

  // =========================================================================
  // PHYSICS QUIZZES
  // =========================================================================
  physics_circuit: {
    id: "physics_circuit",
    subject: "Physics",
    classLevel: "Class 6",
    chapter: "Electricity and Circuits",
    title: "Electric Circuits and Continuity Quiz",
    description: "Test your mastery of complete conducting loops, voltage sources, switches, and loads.",
    lessonId: "physics-circuit",
    questions: [
      {
        question: "Under which condition will electric current flow through a simple circuit to light a bulb?",
        options: [
          "When the switch is open and loop is broken",
          "When there is an unbroken, complete conducting path",
          "When an insulator like plastic connects the battery terminals",
          "When one connecting wire is cut in half",
        ],
        answer: 1,
        explanation: "Current flows only through a continuous closed conducting loop connecting the power source terminals.",
      },
      {
        question: "What role does a chemical battery cell play in an electric circuit?",
        options: [
          "It acts as a mechanical switch to stop electrons",
          "It provides the electrical potential difference (voltage) to push electrons",
          "It cools down the wires",
          "It absorbs light energy from the room",
        ],
        answer: 1,
        explanation: "A battery converts chemical energy into electrical potential energy, creating the voltage that drives electron flow.",
      },
      {
        question: "Why are electrical connecting wires typically made of copper?",
        options: [
          "Copper is a transparent insulator",
          "Copper is an excellent conductor with abundant free valence electrons",
          "Copper prevents electric current from traveling",
          "Copper is lighter than air",
        ],
        answer: 1,
        explanation: "Copper has low electrical resistance and delocalised valence electrons that drift freely when voltage is applied.",
      },
      {
        question: "Which of the following materials is an electrical insulator?",
        options: ["Iron nail", "Copper wire", "Rubber eraser", "Graphite pencil core"],
        answer: 2,
        explanation: "Rubber holds its electrons tightly bound, preventing current flow. Iron, copper, and graphite are conductors.",
      },
      {
        question: "What happens if a battery's positive and negative terminals are connected directly with zero load (short circuit)?",
        options: [
          "The battery charges up infinitely",
          "Excessive current flows rapidly, causing dangerous overheating",
          "The circuit voltage drops to zero with zero current",
          "The wires turn into magnets permanently",
        ],
        answer: 1,
        explanation: "A short circuit has almost zero resistance, causing high current to surge and generating hazardous thermal heat.",
      },
    ],
  },

  physics_conductors: {
    id: "physics_conductors",
    subject: "Physics",
    classLevel: "Class 7",
    chapter: "Electricity and Circuits",
    title: "Conductors vs Insulators Mastery",
    description: "Explore the atomic and electron behavior behind electrical conductivity in matter.",
    lessonId: "physics-conductors",
    questions: [
      {
        question: "Why can graphite conduct electricity while diamond (both pure carbon) cannot?",
        options: [
          "Graphite is heavier than diamond",
          "Graphite has layered hexagonal rings with delocalised pi electrons",
          "Diamond is melted carbon",
          "Graphite contains metallic copper impurities",
        ],
        answer: 1,
        explanation: "In graphite, each carbon bonds to 3 others, leaving 1 free electron per atom that moves freely along hexagonal sheets.",
      },
      {
        question: "Why do electricians wear thick rubber gloves while repairing live circuits?",
        options: [
          "Rubber conducts current into the ground",
          "Rubber is an electrical insulator that prevents current from passing through the body",
          "Rubber keeps hands warm in cold weather",
          "Rubber makes tools lighter to lift",
        ],
        answer: 1,
        explanation: "Rubber has extremely high electrical resistance, acting as a protective insulating barrier against lethal electric shock.",
      },
      {
        question: "Which liquid conducts electricity effectively?",
        options: ["Pure distilled water", "Saltwater solution", "Cooking oil", "Liquid paraffin"],
        answer: 1,
        explanation: "Dissolved salt dissociates into mobile sodium (Na⁺) and chloride (Cl⁻) ions that carry charge through the solution.",
      },
      {
        question: "What property determines how strongly a material resists electrical current?",
        options: ["Density", "Electrical Resistance", "Thermal Expansion", "Opacity"],
        answer: 1,
        explanation: "Electrical resistance (measured in Ohms, Ω) quantifies a material's opposition to the passage of electric current.",
      },
      {
        question: "What is an electrical fuse designed to do during an unexpected power surge?",
        options: [
          "Melt safely and break the circuit before wires catch fire",
          "Double the voltage supplied to the house",
          "Store electricity like a rechargeable battery",
          "Change alternating current into direct current",
        ],
        answer: 0,
        explanation: "A fuse wire has a low melting point: when excessive current flows, Joule heating melts it and stops current flow.",
      },
    ],
  },

  // =========================================================================
  // BIOLOGY QUIZZES
  // =========================================================================
  biology_cell: {
    id: "biology_cell",
    subject: "Biology",
    classLevel: "Class 8",
    chapter: "Cell — Structure and Functions",
    title: "Plant Cell Structure and Organelles",
    description: "Identify cellular organelles, membrane functions, and plant vs animal cell features.",
    lessonId: "biology-cell",
    questions: [
      {
        question: "Which organelle is found in plant cells to provide rigid structural support, but is absent in animal cells?",
        options: ["Mitochondria", "Cell Wall", "Ribosome", "Endoplasmic Reticulum"],
        answer: 1,
        explanation: "The rigid cellulose Cell Wall surrounds plant cells, maintaining shape and protecting against turgor pressure.",
      },
      {
        question: "What is the primary biological function of chloroplasts in green plant leaves?",
        options: [
          "Pumping blood through the stem",
          "Trapping solar energy to synthesize glucose via photosynthesis",
          "Breaking down cellular wastes like lysosomes",
          "Storing genetic DNA in chromosomes",
        ],
        answer: 1,
        explanation: "Chloroplasts contain green chlorophyll pigments that capture sunlight, carbon dioxide, and water to produce food.",
      },
      {
        question: "What occupies up to 90% of the interior volume of a mature plant cell?",
        options: ["The Nucleus", "The Large Central Vacuole", "The Centrosome", "The Golgi body"],
        answer: 1,
        explanation: "The prominent central vacuole stores water and cell sap, exerting turgor pressure that keeps leaves from wilting.",
      },
      {
        question: "Which cellular organelle is universally known as the 'control centre' of the cell?",
        options: ["The Nucleus", "The Cell Wall", "The Chloroplast", "The Cytoplasm"],
        answer: 0,
        explanation: "The nucleus contains hereditary genetic material (DNA) and directs all cellular growth, metabolism, and reproduction.",
      },
      {
        question: "What is the semi-permeable boundary that controls what enters and exits all living cells?",
        options: ["Cell Membrane (Plasma Membrane)", "Nuclear Membrane", "Tonoplast", "Cell Wall"],
        answer: 0,
        explanation: "The plasma membrane is selectively permeable, allowing nutrients and water in while keeping harmful substances out.",
      },
    ],
  },

  biology_plants: {
    id: "biology_plants",
    subject: "Biology",
    classLevel: "Class 6",
    chapter: "Getting to Know Plants",
    title: "Plant Organs and Leaf Venation",
    description: "Examine roots, transpiration, xylem transport, and reticulate vs parallel venation.",
    lessonId: "bio-plant-parts",
    questions: [
      {
        question: "What pattern of leaf veins forms a branched, net-like design (as seen in peepal and mango leaves)?",
        options: ["Parallel venation", "Reticulate venation", "Spiral venation", "Radial venation"],
        answer: 1,
        explanation: "Reticulate venation features a central midrib branching into an intricate network of smaller veins.",
      },
      {
        question: "What process allows plants to release excess water vapor into the air through leaf stomata?",
        options: ["Respiration", "Transpiration", "Germination", "Pollination"],
        answer: 1,
        explanation: "Transpiration is the evaporative loss of water vapor through microscopic stomatal pores on leaf undersides.",
      },
      {
        question: "Which specialized vascular tissue conducts water and dissolved soil minerals upward from roots to leaves?",
        options: ["Phloem", "Xylem", "Epidermis", "Pith"],
        answer: 1,
        explanation: "Xylem vessels form a continuous microscopic plumbing system transporting water and minerals upward from roots.",
      },
      {
        question: "What type of root system features a single dominant thick vertical root with small lateral branch roots?",
        options: ["Fibrous root system", "Taproot system", "Adventitious roots", "Prop roots"],
        answer: 1,
        explanation: "A taproot system (e.g. carrot, mustard) has one main thick root growing deep vertically, unlike diffuse fibrous grass roots.",
      },
      {
        question: "What green pigment inside leaf cells absorbs light energy for photosynthesis?",
        options: ["Carotene", "Anthocyanin", "Chlorophyll", "Hemoglobin"],
        answer: 2,
        explanation: "Chlorophyll absorbs red and blue light wavelengths while reflecting green light, giving plant leaves their green color.",
      },
    ],
  },

  // =========================================================================
  // MATHEMATICS QUIZZES
  // =========================================================================
  math_shapes: {
    id: "math_shapes",
    subject: "Mathematics",
    classLevel: "Class 6",
    chapter: "Basic Geometrical Ideas & 3D Shapes",
    title: "3D Polyhedrons and Euler's Formula",
    description: "Verify faces, edges, vertices, and topological invariants of three-dimensional solids.",
    lessonId: "math-shapes",
    questions: [
      {
        question: "How many flat faces, straight edges, and corner vertices does a standard cube have?",
        options: [
          "Faces: 6, Edges: 12, Vertices: 8",
          "Faces: 8, Edges: 12, Vertices: 6",
          "Faces: 6, Edges: 8, Vertices: 12",
          "Faces: 4, Edges: 6, Vertices: 4",
        ],
        answer: 0,
        explanation: "A regular cube has 6 square faces, 12 straight edges where faces meet, and 8 sharp corner vertices.",
      },
      {
        question: "What is Leonhard Euler's famous polyhedral formula relating Faces (F), Vertices (V), and Edges (E)?",
        options: [
          "F + V - E = 2",
          "F + E - V = 2",
          "F * V - E = 0",
          "F + V + E = 10",
        ],
        answer: 0,
        explanation: "Euler's Formula states that for every simple convex polyhedron: F + V - E = 2.",
      },
      {
        question: "For a regular octahedron with 8 triangular faces and 6 vertices, how many edges must it have?",
        options: ["10 edges", "12 edges", "14 edges", "16 edges"],
        answer: 1,
        explanation: "Using Euler's formula: F + V - E = 2 → 8 + 6 - E = 2 → 14 - E = 2 → E = 12 edges.",
      },
      {
        question: "Why is a sphere or cylinder NOT classified as a polyhedron?",
        options: [
          "Because they are too heavy",
          "Because their surfaces are curved and not made of flat polygonal faces",
          "Because they exist only in 2 dimensions",
          "Because their volume cannot be measured",
        ],
        answer: 1,
        explanation: "By definition, a polyhedron must be bounded exclusively by flat 2D polygonal faces and straight edges.",
      },
      {
        question: "How many triangular faces meet to form a regular tetrahedron (triangular pyramid)?",
        options: ["3 faces", "4 faces", "5 faces", "6 faces"],
        answer: 1,
        explanation: "A tetrahedron is bounded by exactly 4 equilateral triangular faces (F = 4, V = 4, E = 6: 4 + 4 - 6 = 2).",
      },
    ],
  },

  math_fractions: {
    id: "math_fractions",
    subject: "Mathematics",
    classLevel: "Class 6",
    chapter: "Fractions & Decimals",
    title: "Fractions and Decimal Representations",
    description: "Understand parts of a whole, equivalent ratios, and conversions on a number line.",
    lessonId: "math-fractions",
    questions: [
      {
        question: "In the fraction 3/4, what does the denominator (4) represent?",
        options: [
          "The number of parts taken or shaded",
          "The total number of equal parts the whole unit is divided into",
          "The difference between numerator and denominator",
          "The number of whole numbers added together",
        ],
        answer: 1,
        explanation: "The denominator indicates the total number of equal divisions in the whole unit.",
      },
      {
        question: "Which of the following is equivalent to the fraction 2/5?",
        options: ["4/10", "5/2", "3/6", "2/10"],
        answer: 0,
        explanation: "Multiplying numerator and denominator by 2 gives: (2 * 2) / (5 * 2) = 4/10 = 0.4.",
      },
      {
        question: "What is 3/4 converted into its exact decimal representation?",
        options: ["0.34", "0.43", "0.75", "0.65"],
        answer: 2,
        explanation: "Dividing 3 by 4 gives exactly 0.75 (or 75/100).",
      },
      {
        question: "What type of fraction has a numerator that is strictly greater than its denominator (e.g. 7/3)?",
        options: ["Proper fraction", "Improper fraction", "Mixed fraction", "Unit fraction"],
        answer: 1,
        explanation: "An improper fraction has a numerator greater than or equal to its denominator, representing a value $\\ge 1$.",
      },
      {
        question: "What is the sum of 1/3 and 1/6 expressed in simplest fractional form?",
        options: ["2/9", "1/2", "2/6", "1/9"],
        answer: 1,
        explanation: "Finding common denominator 6: (2/6) + (1/6) = 3/6 = 1/2 in simplest terms.",
      },
    ],
  },
};
