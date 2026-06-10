const PRODUCTS = [
  {
    id: "chem-acetone-1l",
    name: "Acetone, ACS Reagent Grade",
    category: "Chemicals",
    price: 34.50,
    unit: "1L Bottle",
    rating: 4.8,
    reviews: 24,
    inStock: 15,
    grade: "ACS Reagent",
    formula: "CH₃COCH₃",
    cas: "67-64-1",
    hazards: ["flammable", "irritant"],
    image: "product_images/acetone.jpg",
    safetyPrecautions: "Keep away from heat, sparks, open flames, hot surfaces. No smoking. Avoid breathing vapor. Wear protective gloves/eye protection.",
    description: "High-purity Acetone (>99.5% by GC) suitable for organic synthesis, analysis, and general laboratory extraction.",
    longDescription: "Nexura Reagent Grade Acetone meets or exceeds the specifications of the American Chemical Society (ACS). It is low-residue and has very low water content, making it ideal for standard laboratory cleanings, spectrophotometric analysis, and chemical syntheses. Packaged in a double-sealed, chemical-resistant amber container to maintain purity.",
    specs: {
      "Purity (GC)": "≥ 99.5%",
      "Color (APHA)": "≤ 10",
      "Residue after Evaporation": "≤ 0.001%",
      "Water (H₂O)": "≤ 0.5%",
      "Solubility in Water": "Passes Test"
    }
  },
  {
    id: "chem-naoh-500g",
    name: "Sodium Hydroxide Pellets, ACS",
    category: "Chemicals",
    price: 28.00,
    unit: "500g Bottle",
    rating: 4.9,
    reviews: 31,
    inStock: 22,
    grade: "ACS Grade",
    formula: "NaOH",
    cas: "1310-73-2",
    hazards: ["corrosive"],
    image: "product_images/sodium-hydroxide.jpg",
    safetyPrecautions: "Causes severe skin burns and eye damage. Wear protective gloves, protective clothing, eye protection, face protection. Do not breathe dust.",
    description: "High-purity anhydrous sodium hydroxide pellets. Strong base used for pH adjustment and preparing buffer solutions.",
    longDescription: "Anhydrous Sodium Hydroxide pellets with exceptionally low carbonate and heavy metal contamination. Pellets dissolve rapidly in water, generating significant exothermic heat. Keep container tightly closed as the substance is highly hygroscopic (absorbs moisture from the air).",
    specs: {
      "Assay (NaOH)": "≥ 97.0%",
      "Sodium Carbonate (Na₂CO₃)": "≤ 1.0%",
      "Chloride (Cl)": "≤ 0.005%",
      "Phosphate (PO₄)": "≤ 0.001%",
      "Iron (Fe)": "≤ 0.001%"
    }
  },
  {
    id: "lab-beaker-set",
    name: "Borosilicate Glass Beaker Set",
    category: "Labware",
    price: 49.95,
    unit: "Set of 5",
    rating: 4.6,
    reviews: 57,
    inStock: 35,
    grade: "Class A",
    formula: "N/A (Glass)",
    cas: "65997-17-3",
    hazards: ["none"],
    image: "product_images/beakers.jpg",
    safetyPrecautions: "Inspect for chips or cracks before heating. Wear thermal gloves when handling hot glassware.",
    description: "Premium heavy-wall borosilicate glass beakers. Contains 50mL, 100mL, 250mL, 500mL, and 1000mL sizes.",
    longDescription: "Nexura Class A Beakers are constructed from low-expansion 3.3 borosilicate glass, offering outstanding thermal shock resistance and chemical durability. Feature double-graduated scales, extra-large marking spots, and uniform wall thickness to prevent thermal stress fractures.",
    specs: {
      "Material": "3.3 Borosilicate Glass",
      "Thermal Limit": "Up to 500°C (Short term)",
      "Standard": "ISO 3819 / DIN 12331",
      "Sizes Included": "50, 100, 250, 500, 1000 mL",
      "Tolerance": "Approx. ±5%"
    }
  },
  {
    id: "lab-flask-250",
    name: "Erlenmeyer Flasks, Narrow Neck",
    category: "Labware",
    price: 36.80,
    unit: "Pack of 6",
    rating: 4.8,
    reviews: 42,
    inStock: 19,
    grade: "Class A",
    formula: "N/A (Glass)",
    cas: "65997-17-3",
    hazards: ["none"],
    image: "product_images/flasks.jpg",
    safetyPrecautions: "Avoid thermal shock. Do not heat dry or empty flasks. Check for scratches before autoclaving.",
    description: "250mL narrow neck Erlenmeyer flasks made of heat-resistant 3.3 borosilicate glass. Pack of 6.",
    longDescription: "These Erlenmeyer flasks are designed with thick walls and reinforced rims to minimize mechanical breakage. Their conical shape makes them ideal for mixing liquids, titrations, and cultivating microbial cultures. Autoclavable up to 121°C.",
    specs: {
      "Volume": "250 mL",
      "Neck Type": "Narrow, Beaded Rim",
      "Stopper Size": "No. 6 Rubber Stopper compatible",
      "Thermal Limit": "400°C safe working temp",
      "Graduation Interval": "50 mL"
    }
  },
  {
    id: "eq-mag-stirrer",
    name: "Digital Hotplate Magnetic Stirrer",
    category: "Equipment",
    price: 249.00,
    unit: "Each",
    rating: 4.7,
    reviews: 29,
    inStock: 12,
    grade: "Laboratory Grade",
    formula: "N/A (Electrical)",
    cas: "N/A",
    hazards: ["none"],
    image: "product_images/magnetic-stirrer.jpg",
    safetyPrecautions: "Do not touch hotplate during operation. Ensure unit is grounded. Keep away from flammable vapors.",
    description: "Digital magnetic stirrer with ceramic-coated hotplate, heating up to 280°C and stirring speed up to 1500 RPM.",
    longDescription: "The Nexura MS-H280-Pro is a compact, high-precision heating magnetic stirrer. Features an easy-to-read LED display for speed and temperature, a ceramic-coated plate for chemical resistance, and an external PT1000 temperature sensor for automatic liquid temperature control.",
    specs: {
      "Temp Range": "Ambient to 280°C (±1°C resolution)",
      "Speed Range": "100 - 1500 RPM",
      "Max Stirring Vol": "3 Liters",
      "Plate Dimension": "135mm (5 inches) Diameter",
      "Voltage/Power": "110V, 515W"
    }
  },
  {
    id: "eq-microscope",
    name: "Infinity LED Binocular Microscope",
    category: "Equipment",
    price: 580.00,
    unit: "Each",
    rating: 4.9,
    reviews: 15,
    inStock: 5,
    grade: "Research Grade",
    formula: "N/A",
    cas: "N/A",
    hazards: ["none"],
    image: "product_images/microscope.jpg",
    safetyPrecautions: "Unplug before changing the LED bulb. Store in a dust-free environment with dust cover.",
    description: "Professional biological microscope with infinity-corrected plan optical system, double layer mechanical stage, and cool LED illumination.",
    longDescription: "The Nexura LX-400 microscope provides research-level optical resolution and clarity. Features binocular infinity-corrected viewing heads, 40X-1000X magnification range, plan-achromatic objectives (4X, 10X, 40X, 100X Oil), coaxial coarse/fine focus controls, and a high-stability stage.",
    specs: {
      "Optical System": "Infinity Color Corrected System",
      "Magnification": "40X, 100X, 400X, 1000X",
      "Objectives": "Plan Achromatic 4x, 10x, 40x (S), 100x (S, Oil)",
      "Stage Size": "140mm x 132mm double mechanical stage",
      "Illumination": "3W LED with intensity control"
    }
  },
  {
    id: "safe-goggles",
    name: "Laser Safety Goggles (532nm)",
    category: "Safety Gear",
    price: 75.00,
    unit: "Each",
    rating: 4.5,
    reviews: 13,
    inStock: 14,
    grade: "ANSI Z136.1",
    formula: "N/A",
    cas: "N/A",
    hazards: ["none"],
    image: "product_images/safety-goggles.jpg",
    safetyPrecautions: "Always verify the laser wavelength matches the goggles specs before operation. Do not look directly into the beam.",
    description: "Professional laser goggles providing OD 6+ protection for 190nm-540nm wavelengths. Ideal for Green lasers (532nm).",
    longDescription: "Comfortable, wrap-around polycarbonate safety glasses designed specifically to filter out high-energy violet, blue, and green laser light (wavelengths 190-540nm). High optical density (OD 6+) with excellent visible light transmission (VLT ~50%) to allow clear viewing.",
    specs: {
      "Protection Range": "190nm - 540nm Wavelengths",
      "Optical Density": "OD 6+",
      "VLT (Visible Light Trans.)": "50%",
      "Certification": "ANSI Z136.1 / CE EN207",
      "Frame Type": "Wrap-around with side protection"
    }
  },
  {
    id: "safe-gloves-nitrile",
    name: "Premium Nitrile Gloves, Powder-Free",
    category: "Safety Gear",
    price: 19.99,
    unit: "Box of 100",
    rating: 4.8,
    reviews: 88,
    inStock: 120,
    grade: "Medical Grade",
    formula: "N/A",
    cas: "N/A",
    hazards: ["none"],
    image: "product_images/nitrile-gloves.jpg",
    safetyPrecautions: "Single-use only. Verify glove compatibility before extended exposure to oxidizers or organic solvents.",
    description: "Heavy-duty 5mil thick nitrile gloves, textured fingertips for excellent wet/dry grip, chemical resistant, box of 100.",
    longDescription: "Nexura Nitrile Examination Gloves provide superior barrier protection against common lab chemicals, solvents, and biological hazards. Free of natural rubber latex, reducing allergy risks. Features textured fingertips, beaded cuffs, and tactile sensitivity.",
    specs: {
      "Material": "100% Nitrile (Latex-free)",
      "Thickness": "5.0 mil (0.12mm) average",
      "Color": "Laboratory Cobalt Blue",
      "Compliance": "FDA 510(k), ASTM D6319, EN 374",
      "Size": "Medium (Large/Small options available in cart)"
    }
  },
  {
    id: "con-syringe-filters",
    name: "PTFE Syringe Filters, 0.22µm",
    category: "Consumables",
    price: 45.00,
    unit: "Pack of 100",
    rating: 4.6,
    reviews: 21,
    inStock: 40,
    grade: "HPLC Certified",
    formula: "N/A",
    cas: "N/A",
    hazards: ["none"],
    image: "product_images/syringe-filters.jpg",
    safetyPrecautions: "Verify filter chemical compatibility before use. Do not exceed maximum pressure limit of 45 psi.",
    description: "Hydrophobic PTFE syringe filters, 25mm diameter, 0.22 micron pore size. Excellent for filtration of aggressive organic solvents.",
    longDescription: "Nexura HPLC-certified PTFE syringe filters have high flow rates and extremely low extractable levels. Ideal for sample preparation in chromatography (HPLC/GC) and sterilizing harsh organic chemical solutions. Features a female Luer-Lok inlet and male Luer slip outlet.",
    specs: {
      "Pore Size": "0.22 µm",
      "Filter Diameter": "25 mm",
      "Membrane Material": "Hydrophobic PTFE",
      "Housing Material": "Polypropylene (PP)",
      "Hold-up Volume": "< 100 µL"
    }
  }
];

// Compatibility warning rules. If items of these two groups are present in the cart, trigger warning.
const CHEMICAL_COMPATIBILITY_WARNINGS = [];

if (typeof module !== 'undefined') {
  module.exports = { PRODUCTS, CHEMICAL_COMPATIBILITY_WARNINGS };
}
