
import { SubjectData, PastPaper } from './types';

export const COURSE_DATA: Record<string, SubjectData> = {
  P1: {
    title: "Pure Mathematics 1",
    color: "text-blue-600",
    bg: "bg-blue-100",
    chapters: [
      { 
        id: 'p1_1', title: "1. Algebraic Expressions", videoId: "p1_v1",
        topics: ["Index Laws", "Expanding Brackets", "Factorising", "Surds"], 
        videoGuide: {
          structure: ["Indices Rules", "Fractional Indices", "Quadratics & Cubics", "Factorising", "Surds & Conjugates"],
          coreContent: "This video establishes algebra foundations. Focus on (a+b)² ≠ a² + b² and rationalising denominators.",
          tips: ["Remember index laws strictly.", "Conjugate of a+√b is a-√b."]
        },
        details: {
          keyPoints: ["Multiply powers: add indices.", "Rationalise using conjugates.", "Difference of two squares is vital."],
          formulas: ["a^m × a^n = a^(m+n)", "a^(m/n) = ⁿ√(a^m)"],
          concepts: [{ term: "Surd", def: "Irrational number with a root." }]
        }
      },
      { 
        id: 'p1_2', title: "2. Quadratics", videoId: "p1_v2",
        topics: ["Solving Quadratics", "Completing the Square", "The Discriminant", "Modeling"], 
        videoGuide: {
          structure: ["Factorisation", "CTS form", "Quadratic Formula", "Discriminant", "Sketching"],
          coreContent: "Analyze ax²+bx+c. CTS reveals the vertex directly.",
          tips: ["Δ > 0: distinct real roots.", "Δ = 0: one repeated root."]
        },
        details: {
          keyPoints: ["Vertex is (-p, q) in a(x+p)²+q form.", "Discriminant is b²-4ac."],
          formulas: ["x = [-b ± √(b²-4ac)] / 2a", "Δ = b² - 4ac"],
          concepts: [{ term: "Discriminant", def: "Used to determine root nature." }]
        }
      },
      { id: 'p1_3', title: "3. Equations & Inequalities", videoId: "p1_v3", topics: ["Simultaneous Eq", "Quadratic Inequalities", "Graphs of Inequalities"] },
      { id: 'p1_4', title: "4. Graphs & Transformations", videoId: "p1_v4", topics: ["Cubic Graphs", "Reciprocal Graphs", "Transformations (Translation/Stretch)"] },
      { id: 'p1_5', title: "5. Straight Line Graphs", videoId: "p1_v5", topics: ["y=mx+c", "Parallel/Perpendicular", "Distance/Midpoint"] },
      { id: 'p1_6', title: "6. Trigonometric Ratios", videoId: "p1_v6", topics: ["Sine/Cosine Rule", "Triangle Area", "Trig Graphs"] },
      { 
        id: 'p1_7', title: "7. Differentiation", videoId: "p1_v7",
        topics: ["First Principles", "Tangents & Normals", "x^n Rule"], 
        videoGuide: {
          structure: ["Concept of Gradient", "Power Rule", "Tangents", "Normals"],
          coreContent: "Introduction to Calculus. dy/dx represents the gradient function.",
          tips: ["Differentiate term by term.", "Normal gradient is -1/m."]
        },
        details: {
          keyPoints: ["Derivative is the gradient function.", "Stationary points occur at dy/dx = 0."],
          formulas: ["dy/dx = anx^(n-1)", "f'(x) = limit definition"],
          concepts: [{ term: "Derivative", def: "Instantaneous rate of change." }]
        }
      },
      { id: 'p1_8', title: "8. Integration", videoId: "p1_v8", topics: ["Indefinite Integrals", "Finding C", "Definite Integrals", "Area Under Curves"] }
    ]
  },
  P2: {
    title: "Pure Mathematics 2",
    color: "text-indigo-600",
    bg: "bg-indigo-100",
    chapters: [
      { id: 'p2_1', title: "1. Algebraic Methods", videoId: "p2_v1", topics: ["Polynomial Division", "Factor Theorem", "Proof"] },
      { id: 'p2_2', title: "2. Coordinate Geometry", videoId: "p2_v2", topics: ["Circles", "Tangents/Normals to Circles"] },
      { 
        id: 'p2_3', title: "3. Exponentials & Logarithms", videoId: "p2_v3", topics: ["Laws of Logs", "Solving Equations", "Graphs"],
        videoGuide: {
          structure: ["Log Definition", "Laws of Logs", "Natural Logs (ln)", "Solving a^x=b"],
          coreContent: "Logarithms are the inverse of exponentials. Master the log laws to solve power equations.",
          tips: ["log(a)+log(b) = log(ab).", "Take logs of both sides for unknowns in powers."]
        },
        details: {
          keyPoints: ["log_a(x) = y means a^y = x.", "e is the natural base (approx 2.718)."],
          formulas: ["log(xy) = log x + log y", "log(x^k) = k log x"],
          concepts: [{ term: "Logarithm", def: "The power to which a base must be raised." }]
        }
      },
      { id: 'p2_4', title: "4. Binomial Expansion", videoId: "p2_v4", topics: ["(1+x)^n", "Factorial Notation", "nCr Formula"] },
      { id: 'p2_5', title: "5. Sequences & Series", videoId: "p2_v5", topics: ["Arithmetic Progressions", "Geometric Progressions", "Sum to Infinity"] },
      { id: 'p2_6', title: "6. Trigonometric Identities", videoId: "p2_v6", topics: ["Radians", "Arc Length", "Sector Area", "Identities"] },
      { id: 'p2_7', title: "7. Differentiation", videoId: "p2_v7", topics: ["Increasing/Decreasing", "Stationary Points", "Optimization"] },
      { id: 'p2_8', title: "8. Integration", videoId: "p2_v8", topics: ["Trapezium Rule", "Area Between Curves"] }
    ]
  },
  S1: {
    title: "Statistics 1",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    chapters: [
      { id: 's1_1', title: "1. Mathematical Models", videoId: "s1_v1", topics: ["Modeling Process", "Variable Types"] },
      { id: 's1_2', title: "2. Measures of Location & Spread", videoId: "s1_v2", topics: ["Mean/Median", "Variance/SD", "Interpolation", "Coding"] },
      { id: 's1_3', title: "3. Representations of Data", videoId: "s1_v3", topics: ["Box Plots", "Histograms", "Skewness"] },
      { id: 's1_4', title: "4. Probability", videoId: "s1_v4", topics: ["Venn Diagrams", "Tree Diagrams", "Conditional Prob", "Independence"] },
      { id: 's1_5', title: "5. Correlation & Regression", videoId: "s1_v5", topics: ["PMCC", "Regression Line", "Coding Effect"] },
      { id: 's1_6', title: "6. Discrete Random Variables", videoId: "s1_v6", topics: ["E(X)", "Var(X)", "Uniform Distribution"] },
      { 
        id: 's1_7', title: "7. The Normal Distribution", videoId: "s1_v7", topics: ["Z-scores", "Standard Normal", "Inverse Normal"],
        videoGuide: {
          structure: ["Bell Curve Properties", "Standardizing (Z)", "Using Tables", "Inverse Calculations"],
          coreContent: "The most important continuous distribution. Everything is standardized to Z ~ N(0,1).",
          tips: ["Always sketch the curve.", "Area under the curve is always 1."]
        },
        details: {
          keyPoints: ["Symmetrical about the mean.", "Z-score measures standard deviations from mean."],
          formulas: ["Z = (X - μ) / σ"],
          concepts: [{ term: "Standardization", def: "Converting any Normal to the Standard Normal." }]
        }
      }
    ]
  }
};

export const PAST_PAPERS: PastPaper[] = [
  { id: 'jan24_p1', title: "Jan 2024 - Pure Math 1", difficulty: "Hard", year: 2024, season: "Jan" },
  { id: 'jun23_p1', title: "June 2023 - Pure Math 1", difficulty: "Medium", year: 2023, season: "June" },
  { id: 'oct23_p1', title: "Oct 2023 - Pure Math 1", difficulty: "Hard", year: 2023, season: "Oct" },
  { id: 'jan23_p1', title: "Jan 2023 - Pure Math 1", difficulty: "Easy", year: 2023, season: "Jan" },
  { id: 'jun22_p1', title: "June 2022 - Pure Math 1", difficulty: "Medium", year: 2022, season: "June" },
  { id: 'jan22_p1', title: "Jan 2022 - Pure Math 1", difficulty: "Hard", year: 2022, season: "Jan" },
  { id: 'jan24_p2', title: "Jan 2024 - Pure Math 2", difficulty: "Medium", year: 2024, season: "Jan" },
  { id: 'jun23_p2', title: "June 2023 - Pure Math 2", difficulty: "Hard", year: 2023, season: "June" },
  { id: 'jan24_s1', title: "Jan 2024 - Statistics 1", difficulty: "Medium", year: 2024, season: "Jan" },
  { id: 'jun23_s1', title: "June 2023 - Statistics 1", difficulty: "Hard", year: 2023, season: "June" },
  { id: 'oct22_s1', title: "Oct 2022 - Statistics 1", difficulty: "Medium", year: 2022, season: "Oct" },
];
