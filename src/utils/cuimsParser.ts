import { Course } from '../types';

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

export function parseCuimsText(rawText: string, courses: Course[]): ParseResult {
  const lines = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const items: ParsedItem[] = [];
  const unmatchedLines: string[] = [];

  let currentCourse: Course | null = courses.length === 1 ? courses[0] : null;

  for (const line of lines) {
    // 1. Skip table header rows from CUIMS
    if (/exam\s*description|max\s*marks|marks\s*obtd|marks\s*obtained|sr\s*no/i.test(line)) {
      continue;
    }

    // 2. Check if line contains a course code or course name header
    // Strict course code match: e.g. 24CST-302, 24CSH-301, 24CSP-305, 24CSP-304, 24SMT-341, 24CST-351, 24TDP-311, 24TDT-312, PE-5
    const codeMatch = line.match(/(24[a-z]{3}[-_]?\d{3}|pe[-_]?5)/i);
    if (codeMatch) {
      const cleanCode = codeMatch[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const found = courses.find(c => c.code.toLowerCase().replace(/[^a-z0-9]/g, '') === cleanCode);
      if (found) {
        currentCourse = found;
        // If this line ONLY has the course header, move to next line
        if (!line.match(/\b(mst|quiz|experiment|assignment|surprise|attendance|mid-term|test)\b/i)) {
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
          if (lineClean.includes(cNameClean) || (c.code === '24CST-302' && lineClean.includes('computer networks')) ||
              (c.code === '24SMT-341' && lineClean.includes('probability')) ||
              (c.code === '24CSH-301' && lineClean.includes('project based learning in java')) ||
              (c.code === '24CSP-305' && lineClean.includes('competitive coding')) ||
              (c.code === '24CSP-304' && lineClean.includes('full stack')) ||
              (c.code === '24CST-351' && lineClean.includes('web development')) ||
              (c.code === '24TDP-311' && lineClean.includes('soft skills')) ||
              (c.code === '24TDT-312' && lineClean.includes('aptitude'))) {
            currentCourse = c;
            break;
          }
        }
      }
    }

    // 3. Find matching component in target courses
    // If a course is locked, check that course first. Otherwise check all courses.
    const searchCourses = currentCourse ? [currentCourse] : courses;
    let matchedComponent: { course: Course; component: Course['components'][0]; matchedLabel: string } | null = null;

    for (const c of searchCourses) {
      for (const comp of c.components) {
        const cName = comp.name.toLowerCase();
        let m: RegExpMatchArray | null = null;

        // MST-1 / Mid-Semester Test-1
        if (cName.includes('mst-1')) {
          m = line.match(/mid[-_\s]*semester\s*test[-_\s]*1\b|mst[-_\s]*1\b/i);
        }
        // MST-2 / Mid-Semester Test-2
        else if (cName.includes('mst-2')) {
          m = line.match(/mid[-_\s]*semester\s*test[-_\s]*2\b|mst[-_\s]*2\b/i);
        }
        // Mid-Term Test (CC-2, FSD-2)
        else if (cName.includes('mid-term')) {
          m = line.match(/mid[-_\s]*term(?:\s*test)?/i);
        }
        // Practical MST
        else if (cName.includes('practical mst')) {
          m = line.match(/practical\s*mst/i);
        }
        // Practical Evaluations
        else if (cName.includes('practical eval')) {
          m = line.match(/practical\s*evaluations?/i);
        }
        // Assignment / PBL
        else if (cName.includes('assignment') && !cName.includes('live')) {
          m = line.match(/assignment[\/\s]*pbl|assignment|pbl\b/i);
        }
        // Surprise Test
        else if (cName.includes('surprise')) {
          m = line.match(/surprise(?:\s*test)?/i);
        }
        // Attendance
        else if (cName.includes('attendance')) {
          m = line.match(/attendance(?:(?:\s*&|\s*marks)?(?:\s*engagement)?(?:\s*\(lms\))?)?/i);
        }
        // Write X
        else if (cName.includes('write x')) {
          m = line.match(/write\s*x(?:\s*\(soft\s*skills\))?/i);
        }
        // Presentation
        else if (cName.includes('presentation')) {
          m = line.match(/presentation(?:\s*\(soft\s*skills\))?/i);
        }
        // Live Assignment 1, 2, 3
        else if (cName.includes('live assignment')) {
          const numMatch = cName.match(/\d+/);
          const num = numMatch ? numMatch[0] : '1';
          m = line.match(new RegExp(`live\\s*assignment[-_\\s#]*${num}\\b`, 'i'));
        }
        // Experiment 1 to 10
        else if (cName.includes('experiment')) {
          const numMatch = cName.match(/\d+/);
          const num = numMatch ? numMatch[0] : '1';
          m = line.match(new RegExp(`(?:experiment|exp)[-_\\s#]*${num}\\b`, 'i'));
        }
        // Practical Worksheet/Projects 1 to 10
        else if (cName.includes('worksheet')) {
          const numMatch = cName.match(/\d+/);
          const num = numMatch ? numMatch[0] : '1';
          m = line.match(new RegExp(`(?:practical\\s*worksheet(?:\\/projects?)?|worksheet)[-_\\s#]*${num}\\b`, 'i'));
        }
        // Numbered Quiz (Soft Skills Quiz 1, 2, 3)
        else if (cName.includes('quiz-') || cName.includes('quiz 1') || cName.includes('quiz 2') || cName.includes('quiz 3')) {
          const numMatch = cName.match(/\d+/);
          const num = numMatch ? numMatch[0] : '1';
          m = line.match(new RegExp(`quiz[-_\\s#]*${num}\\b`, 'i'));
        }
        // Generic Quiz (Probability, Java, Networks, Web Dev, Aptitude)
        else if (cName === 'quiz') {
          m = line.match(/\bquiz\b/i);
        }

        if (m) {
          matchedComponent = { course: c, component: comp, matchedLabel: m[0] };
          break;
        }
      }
      if (matchedComponent) break;
    }

    if (!matchedComponent) {
      if (!codeMatch) {
        unmatchedLines.push(line);
      }
      continue;
    }

    const { course: matchedCourse, component, matchedLabel } = matchedComponent;

    // 4. Extract numbers AFTER the assessment label
    const textAfterLabel = line.substring(line.indexOf(matchedLabel) + matchedLabel.length);
    const numbers = textAfterLabel.match(/\d+(?:\.\d+)?/g);

    if (!numbers || numbers.length === 0) {
      unmatchedLines.push(line);
      continue;
    }

    let obtained: number | null = null;
    let maxFound: number | null = null;

    if (numbers.length >= 2) {
      const n1 = parseFloat(numbers[0]);
      const n2 = parseFloat(numbers[1]);

      // Smart CUIMS column detection:
      // In CUIMS, columns are: "Exam Description | Max. Marks | Marks Obtd."
      // So if n1 equals component.rawMax, n1 is Max and n2 is Obtained!
      if (n1 === component.rawMax && n2 <= component.rawMax) {
        maxFound = n1;
        obtained = n2;
      } else if (n2 === component.rawMax && n1 <= component.rawMax) {
        // Reverse format: "Experiment 1 29 30" (Obtained then Max)
        maxFound = n2;
        obtained = n1;
      } else {
        // Fallback: in academic marks, obtained is <= max marks
        if (n1 > component.rawMax && n2 <= component.rawMax) {
          obtained = n2;
          maxFound = n1;
        } else {
          // If n1 < n2, n1 is obtained and n2 is max
          obtained = Math.min(n1, n2);
          maxFound = Math.max(n1, n2);
        }
      }
    } else if (numbers.length === 1) {
      obtained = parseFloat(numbers[0]);
      maxFound = component.rawMax;
    }

    if (obtained === null || isNaN(obtained)) {
      unmatchedLines.push(line);
      continue;
    }

    const validObtained = Math.min(component.rawMax, Math.max(0, obtained));

    const parsedItem: ParsedItem = {
      courseId: matchedCourse.id,
      courseCode: matchedCourse.code,
      courseName: matchedCourse.name,
      componentId: component.id,
      componentName: component.name,
      rawMax: component.rawMax,
      extractedObtained: validObtained,
      previousObtained: component.rawObtained,
      confidence: maxFound === component.rawMax ? 1.0 : 0.95
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
