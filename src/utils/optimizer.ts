import { Course, GradeCutoffs, GradeLevel, StrategyPlan, StrategyPlanCourse } from '../types';
import { GRADE_POINTS, calculateCourseResult } from './gradeCalculations';

const GRADE_ORDER: GradeLevel[] = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D'];

export function generateSgpaStrategy(
  targetSgpa: number,
  courses: Course[],
  globalCutoffs: GradeCutoffs
): StrategyPlan {
  // Filter out any subjects that are disallowed/excluded by the user
  const activeCourses = courses.filter(c => !c.isExcluded);
  const gradedCourses = activeCourses.filter(c => !c.isNonGraded);
  const nonGradedCourses = activeCourses.filter(c => !!c.isNonGraded);

  const totalGradedCredits = gradedCourses.reduce((sum, c) => sum + c.credits, 0);

  if (totalGradedCredits === 0) {
    return {
      targetSgpa,
      achievableSgpa: 0,
      feasible: false,
      courses: [],
      summary: 'No graded credits found. Please ensure at least one course is graded.'
    };
  }

  // Calculate required total grade points
  const requiredTotalPoints = targetSgpa * totalGradedCredits;

  // For each graded course, calculate what external score is needed for each grade level
  type CourseGradeOption = {
    grade: GradeLevel;
    points: number;
    requiredRaw: number;
    maxRaw: number;
    difficultyRatio: number; // 0 to 1+
    possible: boolean;
  };

  const courseGradeOptions = new Map<string, CourseGradeOption[]>();

  for (const course of gradedCourses) {
    const res = calculateCourseResult(course, globalCutoffs);
    const options: CourseGradeOption[] = [];

    if (course.type === 'DirectGrade') {
      // Direct grade course
      for (const g of GRADE_ORDER) {
        options.push({
          grade: g,
          points: GRADE_POINTS[g],
          requiredRaw: 85,
          maxRaw: 100,
          difficultyRatio: (GRADE_POINTS[g] >= 9) ? 0.8 : 0.4,
          possible: true
        });
      }
    } else {
      const cutoffs = course.customCutoffs || globalCutoffs;
      for (const g of GRADE_ORDER) {
        const targetTotal = cutoffs[g];
        const neededFromExt = targetTotal - res.weightedInternalScore;

        if (neededFromExt <= 0) {
          options.push({
            grade: g,
            points: GRADE_POINTS[g],
            requiredRaw: 0,
            maxRaw: course.externalRawMax,
            difficultyRatio: 0,
            possible: true
          });
        } else if (course.externalWeightage > 0 && course.externalRawMax > 0) {
          const rawNeeded = (neededFromExt * course.externalRawMax) / course.externalWeightage;
          const roundedRaw = Math.ceil(rawNeeded * 10) / 10;
          const possible = roundedRaw <= course.externalRawMax;
          const difficultyRatio = roundedRaw / course.externalRawMax;

          options.push({
            grade: g,
            points: GRADE_POINTS[g],
            requiredRaw: Math.min(course.externalRawMax, Math.max(0, roundedRaw)),
            maxRaw: course.externalRawMax,
            difficultyRatio,
            possible
          });
        }
      }
    }

    // Sort options by grade points descending
    options.sort((a, b) => b.points - a.points);
    courseGradeOptions.set(course.id, options);
  }

  // Check maximum possible SGPA achievable given internal scores
  let maxPossiblePoints = 0;
  for (const course of gradedCourses) {
    const opts = courseGradeOptions.get(course.id) || [];
    const bestPossible = opts.find(o => o.possible);
    const pts = bestPossible ? bestPossible.points : 0;
    maxPossiblePoints += pts * course.credits;
  }

  const maxPossibleSgpa = Math.round((maxPossiblePoints / totalGradedCredits) * 100) / 100;
  const isFeasible = maxPossibleSgpa >= targetSgpa;

  // Greedy Allocation with priority on High-Credit & Lowest Difficulty Ratio
  // Initial assignment: Start with lowest passing grade (e.g. B or C) for each course
  const currentAssignment = new Map<string, CourseGradeOption>();

  for (const course of gradedCourses) {
    const opts = courseGradeOptions.get(course.id) || [];
    // Start with B or lowest achievable
    const defaultOpt = opts.find(o => o.possible && o.grade === 'B') ||
      opts.filter(o => o.possible).pop() ||
      opts[opts.length - 1];
    currentAssignment.set(course.id, defaultOpt);
  }

  // Function to calculate current total points
  const getCurrentPoints = () => {
    let sum = 0;
    for (const course of gradedCourses) {
      const opt = currentAssignment.get(course.id);
      if (opt) {
        sum += opt.points * course.credits;
      }
    }
    return sum;
  };

  // Iteratively upgrade courses that provide the best bang for the buck (credits / difficulty)
  let iterations = 0;
  while (getCurrentPoints() < requiredTotalPoints && iterations < 50) {
    iterations++;

    let bestCourseId: string | null = null;
    let bestUpgradeOpt: CourseGradeOption | null = null;
    let bestScore = -Infinity;

    for (const course of gradedCourses) {
      const currentOpt = currentAssignment.get(course.id)!;
      const allOpts = courseGradeOptions.get(course.id) || [];
      const currentIndex = allOpts.indexOf(currentOpt);

      // Check if upgrade possible
      if (currentIndex > 0) {
        const nextOpt = allOpts[currentIndex - 1]; // Higher grade
        if (nextOpt.possible) {
          const pointGain = nextOpt.points - currentOpt.points;
          const weightedGain = pointGain * course.credits;
          const cost = Math.max(0.05, nextOpt.difficultyRatio - currentOpt.difficultyRatio);
          const score = weightedGain / cost;

          if (score > bestScore) {
            bestScore = score;
            bestCourseId = course.id;
            bestUpgradeOpt = nextOpt;
          }
        }
      }
    }

    if (bestCourseId && bestUpgradeOpt) {
      currentAssignment.set(bestCourseId, bestUpgradeOpt);
    } else {
      break; // No further upgrades possible
    }
  }

  const finalPoints = getCurrentPoints();
  const achievableSgpa = Math.round((finalPoints / totalGradedCredits) * 100) / 100;

  // Build the planned course list
  const plannedCourses: StrategyPlanCourse[] = [];

  // 1. Process Core Graded Courses (affecting SGPA)
  for (const course of gradedCourses) {
    const res = calculateCourseResult(course, globalCutoffs);
    const assigned = currentAssignment.get(course.id);
    if (!assigned) continue;

    let difficulty: StrategyPlanCourse['difficulty'] = 'Comfortable';
    if (!assigned.possible) {
      difficulty = 'Impossible';
    } else if (assigned.requiredRaw <= 0) {
      difficulty = 'Achieved';
    } else if (assigned.difficultyRatio < 0.6) {
      difficulty = 'Comfortable';
    } else if (assigned.difficultyRatio <= 0.85) {
      difficulty = 'Challenging';
    } else {
      difficulty = 'Maximum Effort';
    }

    const cutoffs = course.customCutoffs || globalCutoffs;
    const targetCutoff = cutoffs[assigned.grade];
    const externalWtSecured = course.externalRawMax > 0 
      ? (assigned.requiredRaw / course.externalRawMax) * course.externalWeightage 
      : 0;

    const note = course.type === 'DirectGrade'
      ? `Direct assumption: Grade ${assigned.grade} [${assigned.points} pts] • Contributes ${(assigned.points * course.credits).toFixed(1)} points across ${course.credits} Cr`
      : `Internals: ${res.weightedInternalScore.toFixed(1)} wt + Target Ext: ${assigned.requiredRaw}/${course.externalRawMax} (${externalWtSecured.toFixed(1)} wt) = ${(res.weightedInternalScore + externalWtSecured).toFixed(1)}/100 (Threshold ≥ ${targetCutoff})`;

    plannedCourses.push({
      courseId: course.id,
      code: course.code,
      name: course.name,
      credits: course.credits,
      currentInternal: res.weightedInternalScore,
      maxInternal: res.maxInternalWeightage,
      targetExternalRaw: assigned.requiredRaw,
      maxExternalRaw: assigned.maxRaw,
      targetGrade: assigned.grade,
      difficulty,
      isNonGraded: false,
      isQualified: true,
      note
    });
  }

  // Sort graded courses by credit weight descending (highest leverage first)
  plannedCourses.sort((a, b) => b.credits - a.credits);

  // 2. Process Non-Graded (MNG) Courses (0 credits in SGPA)
  for (const course of nonGradedCourses) {
    const res = calculateCourseResult(course, globalCutoffs);
    const neededFor40 = 40 - res.weightedInternalScore;
    let targetRaw = 0;
    if (neededFor40 > 0 && course.externalWeightage > 0) {
      targetRaw = Math.ceil(((neededFor40 * course.externalRawMax) / course.externalWeightage) * 10) / 10;
      targetRaw = Math.min(course.externalRawMax, Math.max(0, targetRaw));
    }

    const isPass = (targetRaw > 0 ? (targetRaw / course.externalRawMax) * course.externalWeightage : 0) + res.weightedInternalScore >= 40.0 || res.weightedInternalScore >= 40.0;

    plannedCourses.push({
      courseId: course.id,
      code: course.code,
      name: course.name,
      credits: course.credits,
      currentInternal: res.weightedInternalScore,
      maxInternal: res.maxInternalWeightage,
      targetExternalRaw: targetRaw,
      maxExternalRaw: course.externalRawMax,
      targetGrade: 'A+', // MNG will render QUALIFIED (PASS) pill
      difficulty: targetRaw === 0 ? 'Achieved' : (targetRaw / course.externalRawMax < 0.5 ? 'Comfortable' : 'Challenging'),
      isNonGraded: true,
      isQualified: isPass,
      note: targetRaw === 0 
        ? `Internals already at ${res.weightedInternalScore.toFixed(1)}/100 wt (≥ 40 threshold passed). 0 credits to SGPA.`
        : `Target ≥ ${targetRaw}/${course.externalRawMax} external to cross 40 marks qualifying threshold. 0 credits to SGPA.`
    });
  }

  let summary = '';
  if (achievableSgpa >= targetSgpa) {
    summary = `Target SGPA ${targetSgpa.toFixed(2)} is realistically achievable across all ${totalGradedCredits} graded credits! Prioritized 4-credit Probability & Statistics (24SMT-341) and high-weight core subjects for optimal SGPA lift.${nonGradedCourses.length > 0 ? ` Note: ${nonGradedCourses.length} Non-Graded (MNG) courses only require ≥ 40/100 to pass and do not affect SGPA.` : ''}`;
  } else {
    summary = `Due to current internal marks, the maximum mathematically achievable SGPA is ${maxPossibleSgpa.toFixed(2)}. This roadmap shows the optimal external marks distribution across all ${totalGradedCredits} graded credits to reach that ceiling.${nonGradedCourses.length > 0 ? ` Non-Graded courses are excluded from the SGPA calculation.` : ''}`;
  }

  return {
    targetSgpa,
    achievableSgpa,
    feasible: isFeasible,
    courses: plannedCourses,
    summary
  };
}
