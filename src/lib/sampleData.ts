import { Question } from "./schema/question.schema";
import { Answer } from "./schema/answer.schema";
import { Mapping } from "./schema/mapping.schema";
import { Grading } from "./schema/grading.schema";
import { PageImage } from "./store/sessionStore";

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: "q1",
    numberLabel: "1",
    text: "Which blood vessel carries blood away from the heart?",
    maxScore: 2,
  },
  {
    id: "q2",
    numberLabel: "2",
    text: "Which of the following organelles is primarily involved in photosynthesis?",
    maxScore: 2,
  },
  {
    id: "q3",
    numberLabel: "3",
    text: "Explain the role of chloroplasts in photosynthesis, naming the main pigments involved and briefly outlining the two major stages of the process.",
    maxScore: 2,
  },
  {
    id: "q4",
    numberLabel: "4",
    text: "Describe the flow of blood through the human heart starting from the right atrium and ending at the aorta; include the names of valves crossed.",
    maxScore: 2,
  },
  {
    id: "q5",
    numberLabel: "5",
    text: "Draw a labelled diagram of an alveolus showing capillaries and air space (label alveolar sac, capillary, and direction of gas exchange).",
    maxScore: 2,
  },
  {
    id: "q6",
    numberLabel: "6",
    text: "Draw a neat labelled diagram of the human digestive system (stomach, small intestine, large intestine, liver, pancreas) and label the site where most absorption occurs.",
    maxScore: 5,
  },
  {
    id: "q7",
    numberLabel: "7",
    text: "Draw and label a nephron (Bowman's capsule, glomerulus, proximal tubule, loop of Henle, distal tubule, collecting duct).",
    maxScore: 5,
  },
  {
    id: "q8",
    numberLabel: "8",
    text: "Explain the structural differences between palisade mesophyll and spongy mesophyll and state how each structure aids its function in the leaf.",
    maxScore: 5,
  },
  {
    id: "q9",
    numberLabel: "9",
    text: "Describe the process of transpiration in plants in two to three sentences and name two environmental factors that increase its rate.",
    maxScore: 5,
  },
  {
    id: "q10",
    numberLabel: "10",
    text: "Explain how the structure of xylem vessels facilitates water transport in plants (mention one structural feature and its role).",
    maxScore: 5,
  },
  {
    id: "q11a",
    numberLabel: "11a",
    text: "A diagram shows two potted plants — Plant A in bright light with broad green leaves, Plant B kept in dim light with pale, elongated leaves.",
    maxScore: 2,
  },
  {
    id: "q11b",
    numberLabel: "11b",
    text: "Suggest one practical measure to help Plant B recover.",
    maxScore: 3,
  },
  {
    id: "q12",
    numberLabel: "12",
    text: "Explain the mechanism of stomatal opening and closing in response to turgor pressure changes.",
    maxScore: 2,
  },
  {
    id: "q13",
    numberLabel: "13",
    text: "Define reflex arc and trace the pathway of a nerve impulse during a knee-jerk reaction.",
    maxScore: 3,
  },
];

export const SAMPLE_ANSWERS: Answer[] = [
  {
    id: "ans_q1",
    questionLabel: "Q1",
    text: "Photosynthesis is the process used by green plants and some other organisms to convert light energy into chemical energy.\n6CO2 + 6H2O --(Light/Chlorophyll)--> C6H12O6 + 6O2\nDiagram: Plant with Sunlight, Carbon dioxide, Oxygen, Water.",
    segments: [
      {
        pageIndex: 0,
        bbox: { x: 0.04, y: 0.05, w: 0.92, h: 0.34 },
      },
    ],
  },
  {
    id: "ans_q2",
    questionLabel: "Q2",
    text: "The process mainly occurs in the chloroplast of the plant cell. It has two main stages:\n1. Light reaction - Captures light energy.\n2. Dark reaction - Uses energy to make glucose.",
    segments: [
      {
        pageIndex: 0,
        bbox: { x: 0.04, y: 0.41, w: 0.92, h: 0.16 },
      },
    ],
  },
  {
    id: "ans_q3",
    questionLabel: "Q3",
    text: "Chloroplasts contain chlorophyll pigments that absorb blue and red light wavelengths. Photosynthesis consists of light-dependent reactions in thylakoid membranes producing ATP and NADPH, and light-independent Calvin cycle in the stroma synthesizing glucose.",
    segments: [
      {
        pageIndex: 1,
        bbox: { x: 0.05, y: 0.08, w: 0.90, h: 0.22 },
      },
    ],
  },
  {
    id: "ans_q5",
    questionLabel: "Q5",
    text: "Alveolar sac surrounded by pulmonary capillaries. Oxygen diffuses into blood, Carbon dioxide diffuses into alveolus.",
    segments: [
      {
        pageIndex: 1,
        bbox: { x: 0.05, y: 0.35, w: 0.90, h: 0.25 },
      },
    ],
  },
  {
    id: "ans_q6",
    questionLabel: "Q6",
    text: "Digestive system diagram showing esophagus, stomach, liver, pancreas, small intestine, and large intestine. Most nutrient absorption occurs in the villi of the small intestine.",
    segments: [
      {
        pageIndex: 2,
        bbox: { x: 0.05, y: 0.06, w: 0.90, h: 0.40 },
      },
    ],
  },
  {
    id: "ans_q7",
    questionLabel: "Q7",
    text: "Nephron structure with glomerulus inside Bowman's capsule, proximal convoluted tubule, loop of Henle, distal tubule, and collecting duct.",
    segments: [
      {
        pageIndex: 2,
        bbox: { x: 0.05, y: 0.50, w: 0.90, h: 0.42 },
      },
    ],
  },
  {
    id: "ans_q8",
    questionLabel: "Q8",
    text: "Palisade mesophyll cells are column-shaped and tightly packed near top surface with dense chloroplasts for maximum light absorption. Spongy mesophyll cells are loosely arranged with air spaces to facilitate rapid gas exchange.",
    segments: [
      {
        pageIndex: 3,
        bbox: { x: 0.05, y: 0.05, w: 0.90, h: 0.25 },
      },
    ],
  },
  {
    id: "ans_q9",
    questionLabel: "Q9",
    text: "Transpiration is the evaporation of water vapor from plant stomata into the atmosphere. Factors increasing transpiration rate: high temperature and high wind speed.",
    segments: [
      {
        pageIndex: 3,
        bbox: { x: 0.05, y: 0.32, w: 0.90, h: 0.18 },
      },
    ],
  },
  {
    id: "ans_q10",
    questionLabel: "Q10",
    text: "Xylem vessels are hollow, continuous tubes reinforced with thick lignin walls. Lignin prevents vessel collapse under negative tension pressure.",
    segments: [
      {
        pageIndex: 3,
        bbox: { x: 0.05, y: 0.52, w: 0.90, h: 0.18 },
      },
    ],
  },
  {
    id: "ans_q11a",
    questionLabel: "Q11a",
    text: "Plant A performed normal photosynthesis under sunlight. Plant B underwent etiolation due to lack of light, causing stem elongation to seek light.",
    segments: [
      {
        pageIndex: 3,
        bbox: { x: 0.05, y: 0.72, w: 0.90, h: 0.12 },
      },
    ],
  },
  {
    id: "ans_q11b",
    questionLabel: "Q11b",
    text: "Move Plant B gradually into indirect sunlight and water moderately.",
    segments: [
      {
        pageIndex: 3,
        bbox: { x: 0.05, y: 0.85, w: 0.90, h: 0.10 },
      },
    ],
  },
];

export const SAMPLE_MAPPINGS: Mapping[] = [
  { questionId: "q1", answerId: "ans_q1", confidence: 0.98, reasoning: "Matched question 1 to handwritten Q1 segment" },
  { questionId: "q2", answerId: "ans_q2", confidence: 0.99, reasoning: "Matched question 2 to handwritten Q2 segment" },
  { questionId: "q3", answerId: "ans_q3", confidence: 0.96, reasoning: "Matched question 3 to handwritten Q3 segment" },
  { questionId: "q4", answerId: null, confidence: 0.0, reasoning: "No answer found for question 4 in answer sheet" },
  { questionId: "q5", answerId: "ans_q5", confidence: 0.95, reasoning: "Matched question 5 to handwritten Q5 segment" },
  { questionId: "q6", answerId: "ans_q6", confidence: 0.94, reasoning: "Matched question 6 to handwritten Q6 segment" },
  { questionId: "q7", answerId: "ans_q7", confidence: 0.97, reasoning: "Matched question 7 to handwritten Q7 segment" },
  { questionId: "q8", answerId: "ans_q8", confidence: 0.92, reasoning: "Matched question 8 to handwritten Q8 segment" },
  { questionId: "q9", answerId: "ans_q9", confidence: 0.96, reasoning: "Matched question 9 to handwritten Q9 segment" },
  { questionId: "q10", answerId: "ans_q10", confidence: 0.93, reasoning: "Matched question 10 to handwritten Q10 segment" },
  { questionId: "q11a", answerId: "ans_q11a", confidence: 0.95, reasoning: "Matched question 11a to handwritten Q11a segment" },
  { questionId: "q11b", answerId: "ans_q11b", confidence: 0.88, reasoning: "Matched question 11b to handwritten Q11b segment" },
  { questionId: "q12", answerId: null, confidence: 0.0, reasoning: "No answer found" },
  { questionId: "q13", answerId: null, confidence: 0.0, reasoning: "No answer found" },
];

export const SAMPLE_GRADINGS: Grading[] = [
  {
    questionId: "q1",
    score: 2,
    maxScore: 2,
    isCorrect: true,
    feedback: "Accurate definition of photosynthesis and complete chemical equation provided.",
  },
  {
    questionId: "q2",
    score: 2,
    maxScore: 2,
    isCorrect: true,
    feedback: "Excellent work! You correctly identified the chloroplast as the organelle responsible for photosynthesis. Keep it up!",
  },
  {
    questionId: "q3",
    score: 2,
    maxScore: 2,
    isCorrect: true,
    feedback: "Comprehensive explanation covering chlorophyll pigments and thylakoid vs stroma reactions.",
  },
  {
    questionId: "q4",
    score: 0,
    maxScore: 2,
    isCorrect: false,
    feedback: "Unanswered. No response was written on the student answer sheet.",
  },
  {
    questionId: "q5",
    score: 2,
    maxScore: 2,
    isCorrect: true,
    feedback: "Diagram and gas diffusion directions correctly identified.",
  },
  {
    questionId: "q6",
    score: 4,
    maxScore: 5,
    isCorrect: true,
    feedback: "Clear diagram of digestive system and correct location of absorption in small intestine. Minor detail missing on liver duct connection.",
  },
  {
    questionId: "q7",
    score: 5,
    maxScore: 5,
    isCorrect: true,
    feedback: "All six nephron structures accurately drawn and correctly labeled.",
  },
  {
    questionId: "q8",
    score: 3,
    maxScore: 5,
    isCorrect: false,
    feedback: "Palisade vs spongy mesophyll structure identified well, but state of stomata gas exchange could be explained further.",
  },
  {
    questionId: "q9",
    score: 5,
    maxScore: 5,
    isCorrect: true,
    feedback: "Clear definition of transpiration and correct environmental factors (temperature and wind speed).",
  },
  {
    questionId: "q10",
    score: 4,
    maxScore: 5,
    isCorrect: true,
    feedback: "Lignin reinforcement correctly identified as key structural feature preventing collapse.",
  },
  {
    questionId: "q11a",
    score: 2,
    maxScore: 2,
    isCorrect: true,
    feedback: "Correctly identified etiolation and light response differences between Plant A and B.",
  },
  {
    questionId: "q11b",
    score: 1,
    maxScore: 3,
    isCorrect: false,
    feedback: "Moving Plant B to light is correct, but full recovery requires light intensity transition steps.",
  },
  {
    questionId: "q12",
    score: 0,
    maxScore: 2,
    isCorrect: false,
    feedback: "Unanswered.",
  },
  {
    questionId: "q13",
    score: 0,
    maxScore: 3,
    isCorrect: false,
    feedback: "Unanswered.",
  },
];

// SVG mock page rendering generator for demo student answer sheet pages matching Figma
export function generateDemoAnswerSheetPages(): PageImage[] {
  // We generate 4 realistic handwritten notebook page SVG Data URLs matching Figma
  const pages: PageImage[] = [];

  const pageContents = [
    // Page 1 (Q1 & Q2)
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1400" viewBox="0 0 1000 1400">
      <rect width="1000" height="1400" fill="#fdfcf7"/>
      <!-- Red margin line -->
      <line x1="120" y1="0" x2="120" y2="1400" stroke="#f472b6" stroke-width="2"/>
      <!-- Ruled notebook lines -->
      ${Array.from({ length: 30 })
        .map((_, i) => `<line x1="0" y1="${100 + i * 40}" x2="1000" y2="${100 + i * 40}" stroke="#cbd5e1" stroke-width="1"/>`)
        .join("")}
      
      <!-- Handwritten Q1 -->
      <text x="50" y="130" font-family="'Comic Sans MS', 'Caveat', cursive, sans-serif" font-size="28" font-weight="bold" fill="#1e1b4b">Q1.</text>
      <text x="150" y="130" font-family="'Comic Sans MS', 'Caveat', cursive, sans-serif" font-size="26" fill="#1e1b4b">Photosynthesis is the process used by</text>
      <text x="150" y="170" font-family="'Comic Sans MS', 'Caveat', cursive, sans-serif" font-size="26" fill="#1e1b4b">green plants and some other organisms</text>
      <text x="150" y="210" font-family="'Comic Sans MS', 'Caveat', cursive, sans-serif" font-size="26" fill="#1e1b4b">to convert light energy into chemical</text>
      <text x="150" y="250" font-family="'Comic Sans MS', 'Caveat', cursive, sans-serif" font-size="26" fill="#1e1b4b">energy.</text>
      
      <!-- Chemical Equation Box -->
      <rect x="150" y="280" width="760" height="70" fill="none" stroke="#1e1b4b" stroke-width="2"/>
      <text x="170" y="325" font-family="'Comic Sans MS', cursive, sans-serif" font-size="24" fill="#1e1b4b">6CO₂  +  6H₂O   ───────►   C₆H₁₂O₆  +  6O₂</text>
      <text x="440" y="300" font-family="'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1e1b4b">Light</text>
      <text x="420" y="342" font-family="'Comic Sans MS', cursive, sans-serif" font-size="18" fill="#1e1b4b">Chlorophyll</text>

      <!-- Plant Diagram -->
      <circle cx="550" cy="390" r="30" fill="none" stroke="#1e1b4b" stroke-width="2" stroke-dasharray="4,4"/>
      <text x="600" y="395" font-family="cursive" font-size="22" fill="#1e1b4b">Sunlight</text>
      <path d="M 500 500 Q 420 460 480 430 Q 520 470 500 500 Z" fill="none" stroke="#1e1b4b" stroke-width="2"/>
      <path d="M 500 500 Q 580 460 520 430 Q 480 470 500 500 Z" fill="none" stroke="#1e1b4b" stroke-width="2"/>
      <path d="M 500 500 L 500 560" stroke="#1e1b4b" stroke-width="3"/>
      <text x="200" y="470" font-family="cursive" font-size="22" fill="#1e1b4b">Carbon dioxide ──►</text>
      <text x="620" y="470" font-family="cursive" font-size="22" fill="#1e1b4b">◄── Oxygen</text>
      <text x="620" y="560" font-family="cursive" font-size="22" fill="#1e1b4b">◄── Water</text>

      <!-- Handwritten Q2 -->
      <text x="50" y="610" font-family="'Comic Sans MS', cursive, sans-serif" font-size="28" font-weight="bold" fill="#1e1b4b">Q2.</text>
      <text x="150" y="610" font-family="'Comic Sans MS', cursive, sans-serif" font-size="26" fill="#1e1b4b">The process mainly occurs in the</text>
      <text x="150" y="650" font-family="'Comic Sans MS', cursive, sans-serif" font-size="26" fill="#1e1b4b">chloroplast of the plant cell. It has</text>
      <text x="150" y="690" font-family="'Comic Sans MS', cursive, sans-serif" font-size="26" fill="#1e1b4b">two main stages:</text>
      <text x="150" y="730" font-family="'Comic Sans MS', cursive, sans-serif" font-size="26" fill="#1e1b4b">1. Light reaction - Captures light energy.</text>
      <text x="150" y="770" font-family="'Comic Sans MS', cursive, sans-serif" font-size="26" fill="#1e1b4b">2. Dark reaction - Uses energy to</text>
      <text x="180" y="810" font-family="'Comic Sans MS', cursive, sans-serif" font-size="26" fill="#1e1b4b">make glucose.</text>
    </svg>`,

    // Page 2 (Q3 & Q5)
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1400" viewBox="0 0 1000 1400">
      <rect width="1000" height="1400" fill="#fdfcf7"/>
      <line x1="120" y1="0" x2="120" y2="1400" stroke="#f472b6" stroke-width="2"/>
      ${Array.from({ length: 30 })
        .map((_, i) => `<line x1="0" y1="${100 + i * 40}" x2="1000" y2="${100 + i * 40}" stroke="#cbd5e1" stroke-width="1"/>`)
        .join("")}
      <text x="50" y="130" font-family="cursive" font-size="28" font-weight="bold" fill="#1e1b4b">Q3.</text>
      <text x="150" y="130" font-family="cursive" font-size="26" fill="#1e1b4b">Chloroplasts contain chlorophyll pigments...</text>
      <text x="150" y="170" font-family="cursive" font-size="26" fill="#1e1b4b">Light-dependent reactions take place in thylakoid membranes.</text>
      <text x="150" y="210" font-family="cursive" font-size="26" fill="#1e1b4b">Calvin cycle occurs in the stroma to produce glucose.</text>
      
      <text x="50" y="510" font-family="cursive" font-size="28" font-weight="bold" fill="#1e1b4b">Q5.</text>
      <text x="150" y="510" font-family="cursive" font-size="26" fill="#1e1b4b">Alveolus gas exchange diagram &amp; capillary flow.</text>
    </svg>`,

    // Page 3 (Q6 & Q7)
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1400" viewBox="0 0 1000 1400">
      <rect width="1000" height="1400" fill="#fdfcf7"/>
      <line x1="120" y1="0" x2="120" y2="1400" stroke="#f472b6" stroke-width="2"/>
      ${Array.from({ length: 30 })
        .map((_, i) => `<line x1="0" y1="${100 + i * 40}" x2="1000" y2="${100 + i * 40}" stroke="#cbd5e1" stroke-width="1"/>`)
        .join("")}
      <text x="50" y="130" font-family="cursive" font-size="28" font-weight="bold" fill="#1e1b4b">Q6.</text>
      <text x="150" y="130" font-family="cursive" font-size="26" fill="#1e1b4b">Human Digestive System Diagram (Stomach, Intestine, Liver).</text>
      <text x="50" y="720" font-family="cursive" font-size="28" font-weight="bold" fill="#1e1b4b">Q7.</text>
      <text x="150" y="720" font-family="cursive" font-size="26" fill="#1e1b4b">Nephron structure (Bowman's Capsule, Glomerulus, Tubule).</text>
    </svg>`,

    // Page 4 (Q8, Q9, Q10, Q11a, Q11b)
    `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1400" viewBox="0 0 1000 1400">
      <rect width="1000" height="1400" fill="#fdfcf7"/>
      <line x1="120" y1="0" x2="120" y2="1400" stroke="#f472b6" stroke-width="2"/>
      ${Array.from({ length: 30 })
        .map((_, i) => `<line x1="0" y1="${100 + i * 40}" x2="1000" y2="${100 + i * 40}" stroke="#cbd5e1" stroke-width="1"/>`)
        .join("")}
      <text x="50" y="130" font-family="cursive" font-size="28" font-weight="bold" fill="#1e1b4b">Q8.</text>
      <text x="150" y="130" font-family="cursive" font-size="26" fill="#1e1b4b">Palisade vs Spongy mesophyll differences.</text>
      <text x="50" y="470" font-family="cursive" font-size="28" font-weight="bold" fill="#1e1b4b">Q9.</text>
      <text x="150" y="470" font-family="cursive" font-size="26" fill="#1e1b4b">Transpiration process &amp; environmental factors.</text>
      <text x="50" y="750" font-family="cursive" font-size="28" font-weight="bold" fill="#1e1b4b">Q10.</text>
      <text x="150" y="750" font-family="cursive" font-size="26" fill="#1e1b4b">Xylem vessel lignin reinforcement structure.</text>
      <text x="50" y="1030" font-family="cursive" font-size="28" font-weight="bold" fill="#1e1b4b">Q11a.</text>
      <text x="150" y="1030" font-family="cursive" font-size="26" fill="#1e1b4b">Etiolation response in Plant B.</text>
      <text x="50" y="1210" font-family="cursive" font-size="28" font-weight="bold" fill="#1e1b4b">Q11b.</text>
      <text x="150" y="1210" font-family="cursive" font-size="26" fill="#1e1b4b">Practical recovery measure for Plant B.</text>
    </svg>`,
  ];

  pageContents.forEach((svgContent, index) => {
    const encoded = encodeURIComponent(svgContent);
    pages.push({
      pageIndex: index,
      dataUrl: `data:image/svg+xml;utf8,${encoded}`,
      width: 1000,
      height: 1400,
    });
  });

  return pages;
}
