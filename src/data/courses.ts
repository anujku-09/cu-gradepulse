import { Course } from '../types';

export function getCoursesTemplate(isSample: boolean = false): Course[] {
  return [
    // 1. Competitive Coding-II
    {
      id: 'course-cc2',
      code: '24CSP-305',
      name: 'Competitive Coding-II',
      credits: 2.0,
      type: 'Practical',
      group: 'A',
      externalName: 'External Viva / Voce',
      externalRawMax: 40,
      externalWeightage: 40,
      externalTargetScore: isSample ? 34 : 0,
      components: [
        ...Array.from({ length: 10 }, (_, i) => ({
          id: `cc2-exp-${i + 1}`,
          name: `Experiment ${i + 1}`,
          rawMax: 30,
          weightage: 4.5,
          rawObtained: isSample ? 27 : 0,
          category: 'Experiment' as const,
        })),
        {
          id: 'cc2-mst',
          name: 'Mid-Term Test',
          rawMax: 15,
          weightage: 15,
          rawObtained: isSample ? 13 : 0,
          category: 'MST' as const,
        }
      ]
    },

    // 2. Full Stack Development - II
    {
      id: 'course-fsd2',
      code: '24CSP-304',
      name: 'Full Stack Development - II',
      credits: 1.0,
      type: 'Practical',
      group: 'A',
      externalName: 'External Viva / Voce',
      externalRawMax: 40,
      externalWeightage: 40,
      externalTargetScore: isSample ? 35 : 0,
      components: [
        ...Array.from({ length: 10 }, (_, i) => ({
          id: `fsd2-exp-${i + 1}`,
          name: `Experiment ${i + 1}`,
          rawMax: 30,
          weightage: 4.5,
          rawObtained: isSample ? 28 : 0,
          category: 'Experiment' as const,
        })),
        {
          id: 'fsd2-mst',
          name: 'Mid-Term Test',
          rawMax: 15,
          weightage: 15,
          rawObtained: isSample ? 14 : 0,
          category: 'MST' as const,
        }
      ]
    },

    // 3. Project Based Learning in Java
    {
      id: 'course-java-pbl',
      code: '24CSH-301',
      name: 'Project Based Learning in Java',
      credits: 3.0,
      type: 'Hybrid',
      group: 'A',
      externalName: 'End Term Hybrid Theory',
      externalRawMax: 60,
      externalWeightage: 30,
      externalTargetScore: isSample ? 50 : 0,
      components: [
        {
          id: 'java-prac-eval',
          name: 'Practical Evaluations',
          rawMax: 40,
          weightage: 20,
          rawObtained: isSample ? 36 : 0,
          category: 'PracticalEvaluation' as const,
        },
        ...Array.from({ length: 10 }, (_, i) => ({
          id: `java-sheet-${i + 1}`,
          name: `Practical Worksheet/Projects ${i + 1}`,
          rawMax: 30,
          weightage: 2,
          rawObtained: isSample ? 28 : 0,
          category: 'Experiment' as const,
        })),
        {
          id: 'java-prac-mst',
          name: 'Practical MST',
          rawMax: 10,
          weightage: 4,
          rawObtained: isSample ? 9 : 0,
          category: 'MST' as const,
        },
        {
          id: 'java-mst-1',
          name: 'MST-1 Hybrid',
          rawMax: 20,
          weightage: 5,
          rawObtained: isSample ? 18 : 0,
          category: 'MST' as const,
        },
        {
          id: 'java-mst-2',
          name: 'MST-2 Hybrid',
          rawMax: 20,
          weightage: 5,
          rawObtained: isSample ? 17 : 0,
          category: 'MST' as const,
        },
        {
          id: 'java-assign',
          name: 'Assignment / PBL',
          rawMax: 10,
          weightage: 6,
          rawObtained: isSample ? 9.5 : 0,
          category: 'Assignment' as const,
        },
        {
          id: 'java-surprise',
          name: 'Surprise Test',
          rawMax: 12,
          weightage: 4,
          rawObtained: isSample ? 11 : 0,
          category: 'Surprise Test' as const,
        },
        {
          id: 'java-quiz',
          name: 'Quiz',
          rawMax: 4,
          weightage: 4,
          rawObtained: isSample ? 4 : 0,
          category: 'Quiz' as const,
        },
        {
          id: 'java-att',
          name: 'Attendance Marks',
          rawMax: 2,
          weightage: 2,
          rawObtained: isSample ? 2 : 0,
          category: 'Attendance' as const,
        }
      ]
    },

    // 4. Probability and Statistics
    {
      id: 'course-pns',
      code: '24SMT-341',
      name: 'Probability and Statistics',
      credits: 4.0,
      type: 'Theory',
      group: 'A',
      externalName: 'External Theory',
      externalRawMax: 60,
      externalWeightage: 60,
      externalTargetScore: isSample ? 48 : 0,
      components: [
        {
          id: 'pns-mst1',
          name: 'MST-1',
          rawMax: 20,
          weightage: 10,
          rawObtained: isSample ? 17 : 0,
          category: 'MST' as const,
        },
        {
          id: 'pns-mst2',
          name: 'MST-2',
          rawMax: 20,
          weightage: 10,
          rawObtained: isSample ? 16.5 : 0,
          category: 'MST' as const,
        },
        {
          id: 'pns-assign',
          name: 'Assignment / PBL',
          rawMax: 10,
          weightage: 10,
          rawObtained: isSample ? 9.5 : 0,
          category: 'Assignment' as const,
        },
        {
          id: 'pns-surprise',
          name: 'Surprise Test',
          rawMax: 12,
          weightage: 4,
          rawObtained: isSample ? 11 : 0,
          category: 'Surprise Test' as const,
        },
        {
          id: 'pns-quiz',
          name: 'Quiz',
          rawMax: 4,
          weightage: 4,
          rawObtained: isSample ? 4 : 0,
          category: 'Quiz' as const,
        },
        {
          id: 'pns-att',
          name: 'Attendance Marks',
          rawMax: 2,
          weightage: 2,
          rawObtained: isSample ? 2 : 0,
          category: 'Attendance' as const,
        }
      ]
    },

    // 5. Web Development Fundamentals
    {
      id: 'course-wdf',
      code: '24CST-351',
      name: 'Web Development Fundamentals',
      credits: 3.0,
      type: 'Theory',
      group: 'A',
      externalName: 'External Theory',
      externalRawMax: 60,
      externalWeightage: 60,
      externalTargetScore: isSample ? 50 : 0,
      components: [
        {
          id: 'wdf-mst1',
          name: 'MST-1',
          rawMax: 20,
          weightage: 10,
          rawObtained: isSample ? 18 : 0,
          category: 'MST' as const,
        },
        {
          id: 'wdf-mst2',
          name: 'MST-2',
          rawMax: 20,
          weightage: 10,
          rawObtained: isSample ? 17.5 : 0,
          category: 'MST' as const,
        },
        {
          id: 'wdf-assign',
          name: 'Assignment / PBL',
          rawMax: 10,
          weightage: 10,
          rawObtained: isSample ? 9 : 0,
          category: 'Assignment' as const,
        },
        {
          id: 'wdf-surprise',
          name: 'Surprise Test',
          rawMax: 12,
          weightage: 4,
          rawObtained: isSample ? 10.5 : 0,
          category: 'Surprise Test' as const,
        },
        {
          id: 'wdf-quiz',
          name: 'Quiz',
          rawMax: 4,
          weightage: 4,
          rawObtained: isSample ? 4 : 0,
          category: 'Quiz' as const,
        },
        {
          id: 'wdf-att',
          name: 'Attendance Marks',
          rawMax: 2,
          weightage: 2,
          rawObtained: isSample ? 2 : 0,
          category: 'Attendance' as const,
        }
      ]
    },

    // 6. Computer Networks
    {
      id: 'course-cn',
      code: '24CST-302',
      name: 'Computer Networks',
      credits: 3.0,
      type: 'Theory',
      group: 'A',
      externalName: 'External Theory',
      externalRawMax: 60,
      externalWeightage: 60,
      externalTargetScore: isSample ? 47 : 0,
      components: [
        {
          id: 'cn-mst1',
          name: 'MST-1',
          rawMax: 20,
          weightage: 10,
          rawObtained: isSample ? 16.5 : 0,
          category: 'MST' as const,
        },
        {
          id: 'cn-mst2',
          name: 'MST-2',
          rawMax: 20,
          weightage: 10,
          rawObtained: isSample ? 17 : 0,
          category: 'MST' as const,
        },
        {
          id: 'cn-assign',
          name: 'Assignment / PBL',
          rawMax: 10,
          weightage: 10,
          rawObtained: isSample ? 9 : 0,
          category: 'Assignment' as const,
        },
        {
          id: 'cn-surprise',
          name: 'Surprise Test',
          rawMax: 12,
          weightage: 4,
          rawObtained: isSample ? 11 : 0,
          category: 'Surprise Test' as const,
        },
        {
          id: 'cn-quiz',
          name: 'Quiz',
          rawMax: 4,
          weightage: 4,
          rawObtained: isSample ? 3.5 : 0,
          category: 'Quiz' as const,
        },
        {
          id: 'cn-att',
          name: 'Attendance Marks',
          rawMax: 2,
          weightage: 2,
          rawObtained: isSample ? 2 : 0,
          category: 'Attendance' as const,
        }
      ]
    },

    // 7. Professional Elective (PE-5)
    {
      id: 'course-pe5',
      code: 'PE-5',
      name: 'Professional Elective (Cloud / AI / Cyber)',
      credits: 3.0,
      type: 'DirectGrade',
      group: 'B',
      externalName: 'Target Assessment',
      externalRawMax: 100,
      externalWeightage: 100,
      externalTargetScore: isSample ? 85 : 0,
      directGrade: isSample ? 'A' : 'B',
      components: []
    },

    // 8. Soft Skills-III
    {
      id: 'course-ss3',
      code: '24TDP-311',
      name: 'Soft Skills-III',
      credits: 2.0,
      type: 'Practical',
      group: 'C',
      isNonGraded: true, // Non-Graded (MNG) by default
      externalName: 'External Viva / Voce',
      externalRawMax: 40,
      externalWeightage: 40,
      externalTargetScore: isSample ? 32 : 0,
      components: [
        {
          id: 'ss3-write-x',
          name: 'Write X (Soft Skills)',
          rawMax: 10,
          weightage: 10,
          rawObtained: isSample ? 9 : 0,
          category: 'Assignment' as const,
        },
        {
          id: 'ss3-pres',
          name: 'Presentation (Soft Skills)',
          rawMax: 10,
          weightage: 10,
          rawObtained: isSample ? 8.5 : 0,
          category: 'Assignment' as const,
        },
        {
          id: 'ss3-att',
          name: 'Attendance & Engagement (LMS)',
          rawMax: 4,
          weightage: 4,
          rawObtained: isSample ? 4 : 0,
          category: 'Attendance' as const,
        },
        {
          id: 'ss3-quiz-1',
          name: 'Quiz-1',
          rawMax: 6,
          weightage: 2,
          rawObtained: isSample ? 5 : 0,
          category: 'Quiz' as const,
        },
        {
          id: 'ss3-quiz-2',
          name: 'Quiz-2',
          rawMax: 6,
          weightage: 2,
          rawObtained: isSample ? 5.5 : 0,
          category: 'Quiz' as const,
        },
        {
          id: 'ss3-quiz-3',
          name: 'Quiz-3',
          rawMax: 6,
          weightage: 2,
          rawObtained: isSample ? 5 : 0,
          category: 'Quiz' as const,
        },
        {
          id: 'ss3-live-1',
          name: 'Live Assignment-1',
          rawMax: 30,
          weightage: 10,
          rawObtained: isSample ? 27 : 0,
          category: 'Assignment' as const,
        },
        {
          id: 'ss3-live-2',
          name: 'Live Assignment-2',
          rawMax: 30,
          weightage: 10,
          rawObtained: isSample ? 26 : 0,
          category: 'Assignment' as const,
        },
        {
          id: 'ss3-live-3',
          name: 'Live Assignment-3',
          rawMax: 30,
          weightage: 10,
          rawObtained: isSample ? 28 : 0,
          category: 'Assignment' as const,
        }
      ]
    },

    // 9. Aptitude-III
    {
      id: 'course-apt3',
      code: '24TDT-312',
      name: 'Aptitude-III',
      credits: 2.0,
      type: 'Theory',
      group: 'C',
      isNonGraded: true, // Non-Graded (MNG) by default
      externalName: 'External Theory',
      externalRawMax: 60,
      externalWeightage: 60,
      externalTargetScore: isSample ? 45 : 0,
      components: [
        {
          id: 'apt3-mst1',
          name: 'MST-1',
          rawMax: 20,
          weightage: 10,
          rawObtained: isSample ? 17 : 0,
          category: 'MST' as const,
        },
        {
          id: 'apt3-mst2',
          name: 'MST-2',
          rawMax: 20,
          weightage: 10,
          rawObtained: isSample ? 16 : 0,
          category: 'MST' as const,
        },
        {
          id: 'apt3-assign',
          name: 'Assignment / PBL',
          rawMax: 12,
          weightage: 6,
          rawObtained: isSample ? 11 : 0,
          category: 'Assignment' as const,
        },
        {
          id: 'apt3-quiz',
          name: 'Quiz',
          rawMax: 6,
          weightage: 6,
          rawObtained: isSample ? 5.5 : 0,
          category: 'Quiz' as const,
        },
        {
          id: 'apt3-surprise',
          name: 'Surprise Test',
          rawMax: 12,
          weightage: 4,
          rawObtained: isSample ? 10 : 0,
          category: 'Surprise Test' as const,
        },
        {
          id: 'apt3-att',
          name: 'Attendance Marks',
          rawMax: 4,
          weightage: 4,
          rawObtained: isSample ? 4 : 0,
          category: 'Attendance' as const,
        }
      ]
    }
  ];
}

export const INITIAL_BLANK_COURSES = getCoursesTemplate(false);
export const SAMPLE_CSE_COURSES = getCoursesTemplate(true);
export const INITIAL_COURSES = INITIAL_BLANK_COURSES;
