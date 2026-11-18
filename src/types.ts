export type CourseType = 'Practical' | 'Theory' | 'Hybrid' | 'DirectGrade';

export type AssessmentComponent = {
  id: string;
  name: string;
  rawMax: number;
  weightage: number;
  rawObtained: number;
  category?: 'Experiment' | 'MST' | 'Assignment' | 'Quiz' | 'Attendance' | 'Surprise Test' | 'Viva' | 'Theory' | 'PracticalEvaluation' | 'Other';
};

export type GradeLevel = 'A+' | 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' | 'F';

export interface GradeCutoffs {
  'A+': number;
  'A': number;
  'B+': number;
  'B': number;
  'C+': number;
  'C': number;
  'D': number;
  'F': number;
}

export type CurveMode = 'standard' | 'lenient' | 'strict' | 'custom';

export type CohortTrackId = 'general' | 'apple' | 'aiml' | 'iot' | 'industry' | 'cloud' | 'cyber' | 'dual-nptel' | 'custom';

export interface CohortTrackInfo {
  id: CohortTrackId;
  name: string;
  badge: string;
  icon: string;
  shortDesc: string;
  description: string;
  electiveHighlight: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  type: CourseType;
  group: 'A' | 'B' | 'C';
  // External assessment details
  externalName: string;
  externalRawMax: number;
  externalWeightage: number;
  externalTargetScore: number;
  // Internal assessment components
  components: AssessmentComponent[];
  // Optional direct internal override (if user wants to type total internal directly)
  directInternalOverride?: number;
  // Group B Direct Grade
  directGrade?: GradeLevel;
  // Group C Dual-mode settings
  isNonGraded?: boolean; // When true, MNG mode (Non-Graded, qualifying >= 40)
  isExcluded?: boolean; // When true, this subject is disallowed/excluded from contributing to SGPA & credits
  customCutoffs?: GradeCutoffs;
  isCustom?: boolean; // When true, custom added subject
}

export interface CourseResult {
  courseId: string;
  code: string;
  name: string;
  credits: number;
  weightedInternalScore: number;
  maxInternalWeightage: number;
  weightedExternalScore: number;
  maxExternalWeightage: number;
  totalWeightedScore: number;
  predictedGrade: GradeLevel;
  gradePoint: number;
  isQualified: boolean; // For MNG
  isBacklog: boolean; // F grade or Not Qualified
  isNonGraded: boolean;
  isExcluded: boolean; // When true, excluded from SGPA calculations
  effectiveCredits: number;
  gradeCutoffs: GradeCutoffs;
  targetRequirements: {
    grade: GradeLevel;
    requiredExternalRaw: number;
    possible: boolean;
    alreadyAchieved: boolean;
  }[];
}

export interface SemesterCalculation {
  courses: Record<string, CourseResult>;
  totalGradedCredits: number;
  totalEarnedGradePoints: number;
  sgpa: number;
  hasBacklog: boolean;
  backlogCourses: string[];
  totalInternalEarned: number;
  totalInternalMax: number;
  overallInternalPercentage: number;
}

export interface CgpaForecast {
  previousCgpa: number;
  previousCredits: number;
  semesterSgpa: number;
  semesterCredits: number;
  predictedCgpa: number;
  cgpaDelta: number;
}

export interface StrategyPlanCourse {
  courseId: string;
  code: string;
  name: string;
  credits: number;
  currentInternal: number;
  maxInternal: number;
  targetExternalRaw: number;
  maxExternalRaw: number;
  targetGrade: GradeLevel;
  difficulty: 'Achieved' | 'Comfortable' | 'Challenging' | 'Maximum Effort' | 'Impossible';
  isNonGraded?: boolean;
  isQualified?: boolean;
  note?: string;
}

export interface StrategyPlan {
  targetSgpa: number;
  achievableSgpa: number;
  feasible: boolean;
  courses: StrategyPlanCourse[];
  summary: string;
}
