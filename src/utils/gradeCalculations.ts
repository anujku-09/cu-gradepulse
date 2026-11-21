import { Course, CourseResult, GradeCutoffs, GradeLevel, CurveMode, SemesterCalculation, CgpaForecast } from '../types';

export const GRADE_POINTS: Record<GradeLevel, number> = {
  'A+': 10,
  'A': 9,
  'B+': 8,
  'B': 7,
  'C+': 6,
  'C': 5,
  'D': 4,
  'F': 0,
};

export const GRADE_COLORS: Record<GradeLevel | 'PENDING', { text: string; bg: string; border: string; glow: string; ring: string }> = {
  'A+': {
    text: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-500/40',
    glow: 'shadow-[0_0_25px_rgba(16,185,129,0.35)]',
    ring: '#10B981',
  },
  'A': {
    text: 'text-cyan-400',
    bg: 'bg-cyan-950/40',
    border: 'border-cyan-500/40',
    glow: 'shadow-[0_0_25px_rgba(6,182,212,0.35)]',
    ring: '#06B6D4',
  },
  'B+': {
    text: 'text-indigo-400',
    bg: 'bg-indigo-950/40',
    border: 'border-indigo-500/40',
    glow: 'shadow-[0_0_25px_rgba(99,102,241,0.35)]',
    ring: '#6366F1',
  },
  'B': {
    text: 'text-violet-400',
    bg: 'bg-violet-950/40',
    border: 'border-violet-500/40',
    glow: 'shadow-[0_0_25px_rgba(139,92,246,0.35)]',
    ring: '#8B5CF6',
  },
  'C+': {
    text: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-500/40',
    glow: 'shadow-[0_0_25px_rgba(245,158,11,0.3)]',
    ring: '#F59E0B',
  },
  'C': {
    text: 'text-amber-500',
    bg: 'bg-amber-950/30',
    border: 'border-amber-600/40',
    glow: 'shadow-[0_0_20px_rgba(217,119,6,0.25)]',
    ring: '#D97706',
  },
  'D': {
    text: 'text-orange-400',
    bg: 'bg-orange-950/30',
    border: 'border-orange-500/40',
    glow: 'shadow-[0_0_20px_rgba(249,115,22,0.25)]',
    ring: '#F97316',
  },
  'F': {
    text: 'text-rose-500',
    bg: 'bg-rose-950/40',
    border: 'border-rose-500/50',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.4)]',
    ring: '#EF4444',
  },
  'PENDING': {
    text: 'text-slate-400',
    bg: 'bg-obsidian-850',
    border: 'border-white/10',
    glow: 'shadow-none',
    ring: 'rgba(255,255,255,0.15)',
  }
};

export const CURVE_PRESETS: Record<Exclude<CurveMode, 'custom'>, GradeCutoffs> = {
  standard: {
    'A+': 95, // Realistic CU CSE cohort cutoff for A+ (95 - 96+)
    'A': 88,  // Realistic CU CSE cohort cutoff for A (88 - 90+)
    'B+': 78,
    'B': 68,
    'C+': 58,
    'C': 50,
    'D': 40,
    'F': 0,
  },
  strict: {
    'A+': 96, // Hyper-competitive / High internal section inflation (A+ ~ 96-97)
    'A': 90,  // A ~ 90-91+
    'B+': 80,
    'B': 70,
    'C+': 60,
    'C': 50,
    'D': 40,
    'F': 0,
  },
  lenient: {
    'A+': 91, // Tough end-term exam / Low overall CSE cohort average
    'A': 84,  // A ~ 84-86+
    'B+': 74,
    'B': 64,
    'C+': 54,
    'C': 45,
    'D': 40,
    'F': 0,
  }
};

/**
 * Determine letter grade based on total score and cutoffs
 */
export function determineGrade(score: number, cutoffs: GradeCutoffs): GradeLevel {
  const rounded = Math.round(score * 100) / 100;
  if (rounded >= cutoffs['A+']) return 'A+';
  if (rounded >= cutoffs['A']) return 'A';
  if (rounded >= cutoffs['B+']) return 'B+';
  if (rounded >= cutoffs['B']) return 'B';
  if (rounded >= cutoffs['C+']) return 'C+';
  if (rounded >= cutoffs['C']) return 'C';
  if (rounded >= cutoffs['D']) return 'D';
  return 'F';
}

/**
 * Calculate course result
 */
export function calculateCourseResult(course: Course, globalCutoffs: GradeCutoffs): CourseResult {
  const cutoffs = course.customCutoffs || globalCutoffs;

  // Handle Direct Grade Course (PE-5)
  if (course.type === 'DirectGrade') {
    const grade = course.directGrade;
    const isUnselected = !grade;
    const activeGrade = grade || 'B';
    const gradePoint = isUnselected ? 0 : GRADE_POINTS[activeGrade];
    const totalWeightedScore = isUnselected ? 0 : (cutoffs[activeGrade] ?? 80);
    const isExcluded = !!course.isExcluded;

    return {
      courseId: course.id,
      code: course.code,
      name: course.name,
      credits: course.credits,
      weightedInternalScore: 0,
      maxInternalWeightage: 0,
      weightedExternalScore: totalWeightedScore,
      maxExternalWeightage: 100,
      totalWeightedScore,
      predictedGrade: activeGrade,
      gradePoint,
      isBacklog: false,
      isExcluded,
      effectiveCredits: isExcluded ? 0 : course.credits,
      gradeCutoffs: cutoffs,
      targetRequirements: []
    };
  }

  // Calculate Weighted Internal Score
  let totalWeightedInternal = 0;
  let maxInternalWeightage = 0;
  let hasAnyInternalEntered = false;

  for (const comp of course.components) {
    maxInternalWeightage += comp.weightage;
    if (comp.rawMax > 0) {
      if (comp.rawObtained > 0) {
        hasAnyInternalEntered = true;
      }
      const rawClamped = Math.max(0, Math.min(comp.rawObtained, comp.rawMax));
      const compWeighted = (rawClamped / comp.rawMax) * comp.weightage;
      totalWeightedInternal += compWeighted;
    }
  }

  // If user typed a direct internal score override on the card, use that directly!
  if (course.directInternalOverride !== undefined && !isNaN(course.directInternalOverride)) {
    totalWeightedInternal = Math.max(0, Math.min(course.directInternalOverride, maxInternalWeightage));
    if (course.directInternalOverride > 0) {
      hasAnyInternalEntered = true;
    }
  }

  // Calculate Weighted External Score
  const hasExternalTargetEntered = course.externalTargetScore > 0;
  const extRawClamped = Math.max(0, Math.min(course.externalTargetScore, course.externalRawMax));
  const weightedExternal = course.externalRawMax > 0
    ? (extRawClamped / course.externalRawMax) * course.externalWeightage
    : 0;

  const totalWeightedScore = Math.min(100, Math.round((totalWeightedInternal + weightedExternal) * 100) / 100);

  // CRITICAL FIX: An unentered course (0 marks because user hasn't filled it)
  // is PENDING, NOT an F-Grade backlog!
  const hasUserEnteredAnyMarks = hasAnyInternalEntered || hasExternalTargetEntered;

  let predictedGrade: GradeLevel = determineGrade(totalWeightedScore, cutoffs);
  let gradePoint = GRADE_POINTS[predictedGrade];

  // A backlog is ONLY real if user has entered marks AND still fails (< 40)
  const isExcluded = !!course.isExcluded;
  const isBacklog = !isExcluded && hasUserEnteredAnyMarks && predictedGrade === 'F';

  const effectiveCredits = isExcluded ? 0 : course.credits;

  // Calculate what-if external targets for each grade tier
  const tiers: GradeLevel[] = ['D', 'C', 'C+', 'B', 'B+', 'A', 'A+'];
  const targetRequirements = tiers.map((tier) => {
    const requiredTotal = cutoffs[tier];
    const neededFromExternal = requiredTotal - totalWeightedInternal;

    if (neededFromExternal <= 0) {
      return {
        grade: tier,
        requiredExternalRaw: 0,
        possible: true,
        alreadyAchieved: true,
      };
    }

    if (course.externalWeightage <= 0 || course.externalRawMax <= 0) {
      return {
        grade: tier,
        requiredExternalRaw: 0,
        possible: false,
        alreadyAchieved: false,
      };
    }

    const rawNeeded = (neededFromExternal * course.externalRawMax) / course.externalWeightage;
    const roundedRaw = Math.ceil(rawNeeded * 10) / 10;

    return {
      grade: tier,
      requiredExternalRaw: roundedRaw,
      possible: roundedRaw <= course.externalRawMax,
      alreadyAchieved: false,
    };
  });

  return {
    courseId: course.id,
    code: course.code,
    name: course.name,
    credits: course.credits,
    weightedInternalScore: Math.round(totalWeightedInternal * 100) / 100,
    maxInternalWeightage: Math.round(maxInternalWeightage * 100) / 100,
    weightedExternalScore: Math.round(weightedExternal * 100) / 100,
    maxExternalWeightage: course.externalWeightage,
    totalWeightedScore,
    predictedGrade,
    gradePoint,
    isBacklog,
    isExcluded,
    effectiveCredits,
    gradeCutoffs: cutoffs,
    targetRequirements
  };
}

/**
 * Calculate overall semester SGPA, credits, and backlog statuses
 */
export function calculateSemester(
  courses: Course[],
  globalCutoffs: GradeCutoffs
): SemesterCalculation {
  const courseResults: Record<string, CourseResult> = {};
  let totalGradedCredits = 0;
  let totalWeightedGradePoints = 0;
  let totalInternalEarned = 0;
  let totalInternalMax = 0;
  const backlogCourses: string[] = [];

  // Check if any non-PE course has marks entered
  let hasAnyCoreMarksEntered = false;

  for (const course of courses) {
    const res = calculateCourseResult(course, globalCutoffs);
    courseResults[course.id] = res;

    // IF EXCLUDED BY USER: Skip from SGPA, graded credits, internals, and backlogs!
    if (course.isExcluded) {
      continue;
    }

    // Check if user has entered marks in this course
    const hasMarks = res.weightedInternalScore > 0 || res.weightedExternalScore > 0;
    if (course.type !== 'DirectGrade' && hasMarks) {
      hasAnyCoreMarksEntered = true;
    }

    if (res.isBacklog) {
      backlogCourses.push(`${course.code} - ${course.name}`);
    }

    totalGradedCredits += res.effectiveCredits;
    totalWeightedGradePoints += res.gradePoint * res.effectiveCredits;

    // Only count internal weightage of courses that contribute to SGPA
    if (course.type !== 'DirectGrade' && res.effectiveCredits > 0) {
      totalInternalEarned += res.weightedInternalScore;
      totalInternalMax += res.maxInternalWeightage;
    }
  }

  // If no core marks have been entered anywhere in the semester,
  // do NOT calculate a fake 1.11 SGPA or false backlog alert!
  let sgpa = 0;
  if (hasAnyCoreMarksEntered && totalGradedCredits > 0) {
    sgpa = Math.round((totalWeightedGradePoints / totalGradedCredits) * 100) / 100;
  }

  const overallInternalPercentage = totalInternalMax > 0
    ? Math.round((totalInternalEarned / totalInternalMax) * 1000) / 10
    : 0;

  return {
    courses: courseResults,
    totalGradedCredits,
    totalEarnedGradePoints: hasAnyCoreMarksEntered ? totalWeightedGradePoints : 0,
    sgpa,
    hasBacklog: backlogCourses.length > 0,
    backlogCourses,
    totalInternalEarned: Math.round(totalInternalEarned * 100) / 100,
    totalInternalMax: Math.round(totalInternalMax * 100) / 100,
    overallInternalPercentage
  };
}

/**
 * Cumulative CGPA Forecaster calculation
 */
export function calculateCgpaForecast(
  prevCgpa: number,
  prevCredits: number,
  semesterSgpa: number,
  semesterCredits: number
): CgpaForecast {
  const validPrevCredits = Math.max(0, prevCredits);
  const validPrevCgpa = Math.max(0, Math.min(10, prevCgpa));
  const validSemCredits = Math.max(0, semesterCredits);

  // If semester SGPA is 0 (no marks entered yet), maintain previous CGPA without penalty!
  if (semesterSgpa <= 0) {
    return {
      previousCgpa: validPrevCgpa,
      previousCredits: validPrevCredits,
      semesterSgpa: 0,
      semesterCredits: validSemCredits,
      predictedCgpa: validPrevCgpa,
      cgpaDelta: 0
    };
  }

  const totalCredits = validPrevCredits + validSemCredits;
  if (totalCredits === 0) {
    return {
      previousCgpa: validPrevCgpa,
      previousCredits: validPrevCredits,
      semesterSgpa,
      semesterCredits: validSemCredits,
      predictedCgpa: semesterSgpa,
      cgpaDelta: 0
    };
  }

  const totalPoints = (validPrevCgpa * validPrevCredits) + (semesterSgpa * validSemCredits);
  const predictedCgpa = Math.round((totalPoints / totalCredits) * 100) / 100;
  const cgpaDelta = Math.round((predictedCgpa - validPrevCgpa) * 100) / 100;

  return {
    previousCgpa: validPrevCgpa,
    previousCredits: validPrevCredits,
    semesterSgpa,
    semesterCredits: validSemCredits,
    predictedCgpa,
    cgpaDelta
  };
}
