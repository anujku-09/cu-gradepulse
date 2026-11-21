import { Course, AssessmentComponent } from '../types';

export interface ParsedItem {
  courseId: string;
  courseCode: string;
  courseName: string;
  componentId: string;
  componentName: string;
  rawMax: number;
  extractedObtained: number;
  previousObtained: number;
  confidence: number;
}

export interface ParseResult {
  items: ParsedItem[];
  unmatchedLines: string[];
  courseSummary: {
    courseId: string;
    courseCode: string;
    courseName: string;
    matchedCount: number;
  }[];
}

/**
 * Robust matcher that checks if a line corresponds to an assessment component.
 * Extensible for Standard Theory, Practical, Hybrid, Soft Skills, Aptitude, and Industry Tracks.
 */
function matchComponentInLine(line: string, comp: AssessmentComponent): RegExpMatchArray | null {
  const cName = comp.name.toLowerCase();

  // MST-1 / Mid-Semester Test-1 (Theory / Hybrid)
  if (cName.includes('mst-1')) {
    return line.match(/mid[-_\s]*semester\s*test[-_\s]*1(?:\s*hybrid)?\b|mst[-_\s]*1(?:\s*hybrid)?\b/i);
  }
  // MST-2 / Mid-Semester Test-2 (Theory / Hybrid)
  if (cName.includes('mst-2')) {
    return line.match(/mid[-_\s]*semester\s*test[-_\s]*2(?:\s*hybrid)?\b|mst[-_\s]*2(?:\s*hybrid)?\b/i);
  }
  // Practical MST
  if (cName.includes('practical mst')) {
    return line.match(/practical\s*(?:mid[-_\s]*semester\s*test|mst)\b|prac(?:tical)?[-_\s]*mst\b/i);
  }
  // Mid-Term Test (CC-2, FSD-2, Practical)
  if (cName.includes('mid-term')) {
    return line.match(/mid[-_\s]*term(?:\s*test)?/i);
  }
  // Practical Evaluations
  if (cName.includes('practical eval')) {
    return line.match(/practical\s*eval(?:uations?)?/i);
  }
  // Assignment / PBL
  if (cName.includes('assignment') && !cName.includes('live')) {
    return line.match(/assignment[\/\s]*pbl|assignment|pbl\b/i);
  }
  // Surprise Test
  if (cName.includes('surprise')) {
    return line.match(/surprise(?:\s*test)?/i);
  }
  // Attendance Marks / LMS Engagement / Conduct
  if (cName.includes('attendance')) {
    return line.match(/attendance(?:(?:\s*&|\s*marks)?(?:\s*engagement)?(?:\s*\(lms\))?(?:\s*&(?:\s*professional)?\s*conduct)?)?/i);
  }
  // Write X (Soft Skills)
  if (cName.includes('write x')) {
    return line.match(/write\s*x(?:\s*\(soft\s*skills\))?/i);
  }
  // Presentation (Soft Skills)
  if (cName.includes('presentation')) {
    return line.match(/presentation(?:\s*\(soft\s*skills\))?/i);
  }
  // Live Assignment 1, 2, 3
  if (cName.includes('live assignment')) {
    const numMatch = cName.match(/\d+/);
    const num = numMatch ? numMatch[0] : '1';
    return line.match(new RegExp(`live\\s*assignment[-_\\s#]*${num}\\b`, 'i'));
  }
  // Experiment / Worksheet / Projects 1 to 10
  if (cName.includes('experiment') || cName.includes('worksheet')) {
    const numMatch = cName.match(/\d+/);
    const num = numMatch ? numMatch[0] : '1';
    return line.match(new RegExp(`(?:practical\\s*worksheet(?:\\s*\\/\\s*projects?)?|worksheet|experiment|exp)[-_\\s#]*${num}\\b`, 'i'));
  }
  // Numbered Quiz (Soft Skills Quiz 1, 2, 3)
  if (cName.includes('quiz-') || cName.includes('quiz 1') || cName.includes('quiz 2') || cName.includes('quiz 3')) {
    const numMatch = cName.match(/\d+/);
    const num = numMatch ? numMatch[0] : '1';
    return line.match(new RegExp(`quiz[-_\\s#]*${num}\\b`, 'i'));
  }
  // Generic Quiz (Probability, Java, Networks, Web Dev, Aptitude, etc.)
  if (cName === 'quiz') {
    return line.match(/\bquiz\b/i);
  }
  // Industry Continuous Evaluation: Milestone 1 / Mid-Review
  if (cName.includes('milestone 1') || cName.includes('mid-review')) {
    return line.match(/milestone[-_\s]*1|mid[-_\s]*review/i);
  }
  // Industry Continuous Evaluation: Milestone 2 / Progress Demo
  if (cName.includes('milestone 2') || cName.includes('progress demo')) {
    return line.match(/milestone[-_\s]*2|progress[-_\s]*demo/i);
  }
  // Industry Continuous Evaluation: Final Demo & Viva
  if (cName.includes('final project') || cName.includes('viva')) {
    return line.match(/final[-_\s]*project(?:\s*demo)?(?:\s*&\s*viva)?|\bviva\b/i);
  }
  // Industry Continuous Evaluation: Documentation & Technical Report
  if (cName.includes('documentation') || cName.includes('technical report')) {
    return line.match(/documentation|technical\s*report/i);
  }

  return null;
}

/**
 * Extract score numbers (obtained & max) from single string (either same-line or next-line).
 * Supports slashed format (e.g., "8.5/10", "29/30"), space-separated columns ("10 8.5"),
 * or single values.
 */
function parseScoreFromText(text: string, rawMax: number): { obtained: number; maxFound: number } | null {
  // 1. Direct slash notation: e.g. "8.5/10", "29/30", "16/20", "8/30", "8.5 / 10"
  const slashMatch = text.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (slashMatch) {
    return {
      obtained: parseFloat(slashMatch[1]),
      maxFound: parseFloat(slashMatch[2])
    };
  }

  // 2. Multiple numbers on the line: e.g., "Exam Description  Max  Obtd" -> "20  18.5"
  const numbers = text.match(/\d+(?:\.\d+)?/g);
  if (numbers && numbers.length >= 2) {
    const n1 = parseFloat(numbers[0]);
    const n2 = parseFloat(numbers[1]);
    let obt: number;
    let max: number;

    if (n1 === rawMax && n2 <= rawMax) {
      max = n1;
      obt = n2;
    } else if (n2 === rawMax && n1 <= rawMax) {
      max = n2;
      obt = n1;
    } else if (n1 > rawMax && n2 <= rawMax) {
      obt = n2;
      max = n1;
    } else {
      obt = Math.min(n1, n2);
      max = Math.max(n1, n2);
    }

    return { obtained: obt, maxFound: max };
  }

  // 3. Single number on the line: e.g., "18.5"
  if (numbers && numbers.length === 1) {
    return {
      obtained: parseFloat(numbers[0]),
      maxFound: rawMax
    };
  }

  return null;
}

export function parseCuimsText(rawText: string, courses: Course[]): ParseResult {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const items: ParsedItem[] = [];
  const unmatchedLines: string[] = [];

  let currentCourse: Course | null = courses.length === 1 ? courses[0] : null;

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];

    // 1. Skip table header rows from CUIMS
    if (/exam\s*description|max\s*marks|marks\s*obtd|marks\s*obtained|sr\s*no/i.test(line)) {
      continue;
    }

    // 2. Check if line contains a course code or course name header
    // Extended code match: e.g. 24CST-302, 24CSH-301, 24CSP-305, 24SMT-341, 24CSH-352, 24CSP-353, 24CST-360, 24CSP-361, PE-3, PE-2, PE-5
    const codeMatch = line.match(/(24[a-z]{3}[-_]?\d{3}|pe[-_]?[a-z0-9]+)/i);
    if (codeMatch) {
      const cleanCode = codeMatch[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const found = courses.find(c => c.code.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanCode);
      if (found) {
        currentCourse = found;
        // If this line ONLY has the course header and no assessment name, move to next line
        if (!line.match(/\b(mst|quiz|experiment|assignment|surprise|attendance|mid-term|test|worksheet|eval|viva|milestone|project)\b/i)) {
          continue;
        }
      }
    } else {
      // Check full course titles only on lines that look like headers (no marks columns)
      const hasMarksOnLine = line.match(/\d+(?:\.\d+)?/g);
      if (!hasMarksOnLine || hasMarksOnLine.length === 0) {
        for (const c of courses) {
          const cNameClean = c.name.toLowerCase();
          const lineClean = line.toLowerCase();
          if (lineClean.includes(cNameClean) || 
              (c.code === '24CST-302' && lineClean.includes('computer networks')) ||
              (c.code === '24SMT-341' && lineClean.includes('probability')) ||
              (c.code === '24CSH-301' && lineClean.includes('project based learning in java')) ||
              (c.code === '24CSP-305' && lineClean.includes('competitive coding')) ||
              (c.code === '24CSP-304' && lineClean.includes('full stack')) ||
              (c.code === '24CST-XXX' && lineClean.includes('web dev / data mining / others')) ||
              (c.code === '24CSH-352' && (lineClean.includes('ios') || lineClean.includes('swift') || lineClean.includes('apple'))) ||
              (c.code === '24CSP-353' && (lineClean.includes('apple') || lineClean.includes('frameworks') || lineClean.includes('swift lab'))) ||
              (c.code === '24CST-354' && lineClean.includes('machine learning')) ||
              (c.code === '24CSP-355' && (lineClean.includes('artificial intelligence') || lineClean.includes('ai lab'))) ||
              (c.code === '24CST-356' && lineClean.includes('cloud')) ||
              (c.code === '24CSP-357' && lineClean.includes('devops')) ||
              (c.code === '24CST-358' && (lineClean.includes('network security') || lineClean.includes('cryptography'))) ||
              (c.code === '24CSP-359' && lineClean.includes('cyber')) ||
              (c.code === '24CST-360' && lineClean.includes('iot')) ||
              (c.code === '24CSP-361' && (lineClean.includes('microcontroller') || lineClean.includes('sensors'))) ||
              (c.code === 'PE-3' && (lineClean.includes('kpit') || lineClean.includes('virtusa') || lineClean.includes('salesforce') || lineClean.includes('sap') || lineClean.includes('servicenow') || lineClean.includes('tech mahindra') || lineClean.includes('ibm') || lineClean.includes('mlops'))) ||
              (c.code === '24TDP-311' && lineClean.includes('soft skills')) ||
              (c.code === '24TDT-312' && lineClean.includes('aptitude'))) {
            currentCourse = c;
            break;
          }
        }
      }
    }

    // 3. Find matching component in target courses
    const searchCourses = currentCourse ? [currentCourse] : courses;
    let matchedComponent: { course: Course; component: AssessmentComponent; matchedLabel: string } | null = null;

    for (const c of searchCourses) {
      for (const comp of c.components) {
        const m = matchComponentInLine(line, comp);
        if (m) {
          matchedComponent = { course: c, component: comp, matchedLabel: m[0] };
          break;
        }
      }
      if (matchedComponent) break;
    }

    // Fallback: If currentCourse was set but the component wasn't in it, search other courses
    if (!matchedComponent && currentCourse && courses.length > 1) {
      for (const c of courses) {
        if (c.id === currentCourse.id) continue;
        for (const comp of c.components) {
          const m = matchComponentInLine(line, comp);
          if (m) {
            matchedComponent = { course: c, component: comp, matchedLabel: m[0] };
            currentCourse = c;
            break;
          }
        }
        if (matchedComponent) break;
      }
    }

    if (!matchedComponent) {
      if (!codeMatch) {
        unmatchedLines.push(line);
      }
      continue;
    }

    const { course: matchedCourse, component, matchedLabel } = matchedComponent;
    if (!currentCourse) {
      currentCourse = matchedCourse;
    }

    // 4. Extract score:
    // First, try from the SAME line (after matchedLabel)
    const textAfterLabel = line.substring(line.indexOf(matchedLabel) + matchedLabel.length).trim();
    let scoreFound: { obtained: number; maxFound: number } | null = null;
    let consumedUntilIndex = lineIndex;

    if (textAfterLabel) {
      scoreFound = parseScoreFromText(textAfterLabel, component.rawMax);
    }

    // If no score on the same line, lookahead to subsequent lines (mobile multi-line format)
    if (!scoreFound) {
      for (let peek = lineIndex + 1; peek < Math.min(lines.length, lineIndex + 5); peek++) {
        const peekLine = lines[peek];

        // Skip table headers if any
        if (/exam\s*description|max\s*marks|marks\s*obtd|marks\s*obtained|sr\s*no/i.test(peekLine)) {
          continue;
        }

        // Stop lookahead if next line is a course header
        if (/(24[a-z]{3}[-_]?\d{3}|pe[-_]?[a-z0-9]+)/i.test(peekLine)) {
          break;
        }

        // Stop lookahead if next line starts another assessment component
        let isAnotherComp = false;
        for (const c of courses) {
          for (const comp of c.components) {
            if (matchComponentInLine(peekLine, comp)) {
              isAnotherComp = true;
              break;
            }
          }
          if (isAnotherComp) break;
        }
        if (isAnotherComp) {
          break;
        }

        // Check if peekLine has slash notation: e.g. "8.5/10", "29/30", "16/20"
        const slash = peekLine.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
        if (slash) {
          scoreFound = {
            obtained: parseFloat(slash[1]),
            maxFound: parseFloat(slash[2])
          };
          consumedUntilIndex = peek;
          break;
        }

        // Check if peekLine has multiple numbers: e.g. "10 8.5" or "8.5 10"
        const nums = peekLine.match(/\d+(?:\.\d+)?/g);
        if (nums && nums.length >= 2) {
          const n1 = parseFloat(nums[0]);
          const n2 = parseFloat(nums[1]);
          let obt: number;
          let max: number;
          if (n1 === component.rawMax && n2 <= component.rawMax) {
            max = n1;
            obt = n2;
          } else if (n2 === component.rawMax && n1 <= component.rawMax) {
            max = n2;
            obt = n1;
          } else {
            obt = Math.min(n1, n2);
            max = Math.max(n1, n2);
          }
          scoreFound = { obtained: obt, maxFound: max };
          consumedUntilIndex = peek;
          break;
        }

        // Check if peekLine has a single number, and peek + 1 also has a number (e.g. Max on line 1, Obtained on line 2)
        if (nums && nums.length === 1) {
          const nextPeek = peek + 1;
          let handledTwoLines = false;
          if (nextPeek < lines.length) {
            const nextLine = lines[nextPeek];
            let nextIsComp = false;
            for (const c of courses) {
              for (const comp of c.components) {
                if (matchComponentInLine(nextLine, comp)) {
                  nextIsComp = true;
                  break;
                }
              }
              if (nextIsComp) break;
            }

            if (!nextIsComp && !/(24[a-z]{3}[-_]?\d{3}|pe[-_]?[a-z0-9]+)/i.test(nextLine)) {
              const nextNums = nextLine.match(/\d+(?:\.\d+)?/g);
              if (nextNums && nextNums.length === 1) {
                const n1 = parseFloat(nums[0]);
                const n2 = parseFloat(nextNums[0]);
                let obt: number;
                let max: number;
                if (n1 === component.rawMax && n2 <= component.rawMax) {
                  max = n1;
                  obt = n2;
                } else if (n2 === component.rawMax && n1 <= component.rawMax) {
                  max = n2;
                  obt = n1;
                } else {
                  obt = Math.min(n1, n2);
                  max = Math.max(n1, n2);
                }
                scoreFound = { obtained: obt, maxFound: max };
                consumedUntilIndex = nextPeek;
                handledTwoLines = true;
                break;
              }
            }
          }

          if (!handledTwoLines) {
            scoreFound = {
              obtained: parseFloat(nums[0]),
              maxFound: component.rawMax
            };
            consumedUntilIndex = peek;
            break;
          }
        }
      }
    }

    if (!scoreFound || scoreFound.obtained === null || isNaN(scoreFound.obtained)) {
      unmatchedLines.push(line);
      continue;
    }

    // Fast-forward lineIndex to the consumed score line so it's not reprocessed
    lineIndex = consumedUntilIndex;

    const validObtained = Math.min(component.rawMax, Math.max(0, scoreFound.obtained));

    const parsedItem: ParsedItem = {
      courseId: matchedCourse.id,
      courseCode: matchedCourse.code,
      courseName: matchedCourse.name,
      componentId: component.id,
      componentName: component.name,
      rawMax: component.rawMax,
      extractedObtained: validObtained,
      previousObtained: component.rawObtained,
      confidence: scoreFound.maxFound === component.rawMax ? 1.0 : 0.95
    };

    const existingIndex = items.findIndex(i => i.courseId === matchedCourse.id && i.componentId === component.id);
    if (existingIndex >= 0) {
      items[existingIndex] = parsedItem;
    } else {
      items.push(parsedItem);
    }
  }

  const courseSummary = courses.map(c => ({
    courseId: c.id,
    courseCode: c.code,
    courseName: c.name,
    matchedCount: items.filter(i => i.courseId === c.id).length
  })).filter(c => c.matchedCount > 0);

  return {
    items,
    unmatchedLines,
    courseSummary
  };
}
