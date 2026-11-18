import { Course, CourseType, CohortTrackId, CohortTrackInfo, AssessmentComponent, GradeLevel } from '../types';

export function createStandardTheoryComponents(prefix: string, isSample = false): AssessmentComponent[] {
  return [
    {
      id: `${prefix}-mst1`,
      name: 'MST-1',
      rawMax: 20,
      weightage: 10,
      rawObtained: isSample ? 17 : 0,
      category: 'MST' as const,
    },
    {
      id: `${prefix}-mst2`,
      name: 'MST-2',
      rawMax: 20,
      weightage: 10,
      rawObtained: isSample ? 16.5 : 0,
      category: 'MST' as const,
    },
    {
      id: `${prefix}-assign`,
      name: 'Assignment / PBL',
      rawMax: 10,
      weightage: 10,
      rawObtained: isSample ? 9 : 0,
      category: 'Assignment' as const,
    },
    {
      id: `${prefix}-surprise`,
      name: 'Surprise Test',
      rawMax: 12,
      weightage: 4,
      rawObtained: isSample ? 10.5 : 0,
      category: 'Surprise Test' as const,
    },
    {
      id: `${prefix}-quiz`,
      name: 'Quiz',
      rawMax: 4,
      weightage: 4,
      rawObtained: isSample ? 4 : 0,
      category: 'Quiz' as const,
    },
    {
      id: `${prefix}-att`,
      name: 'Attendance Marks',
      rawMax: 2,
      weightage: 2,
      rawObtained: isSample ? 2 : 0,
      category: 'Attendance' as const,
    }
  ];
}

export function createStandardPracticalComponents(prefix: string, isSample = false): AssessmentComponent[] {
  return [
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `${prefix}-exp-${i + 1}`,
      name: `Experiment / Worksheet ${i + 1}`,
      rawMax: 30,
      weightage: 4.5,
      rawObtained: isSample ? 27 : 0,
      category: 'Experiment' as const,
    })),
    {
      id: `${prefix}-mst`,
      name: 'Mid-Term Test',
      rawMax: 15,
      weightage: 15,
      rawObtained: isSample ? 13 : 0,
      category: 'MST' as const,
    }
  ];
}

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

    // 5. Web Development Fundamentals (PE-II)
    {
      id: 'course-wdf',
      code: '24CST-351',
      name: 'PE-II: Web Development Fundamentals',
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

    // 7. Professional Elective (PE-III)
    {
      id: 'course-pe3',
      code: 'PE-3',
      name: 'PE-III: NPTEL / Elective (Configurable)',
      credits: 3.0,
      type: 'DirectGrade',
      group: 'B',
      externalName: 'NPTEL Certificate Score',
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

export const COHORT_TRACKS_INFO: CohortTrackInfo[] = [
  {
    id: 'general',
    name: 'General CSE',
    badge: 'Core + 2 Electives',
    icon: '🌐',
    shortDesc: 'PE-II (Web Dev) + PE-III (NPTEL / Elective)',
    description: 'Standard 5th semester curriculum with 7 Core subjects + PE-II (Web Development / NPTEL) and PE-III (NPTEL / Customizable Elective).',
    electiveHighlight: 'PE-II (Web Dev 24CST-351) + PE-III (NPTEL / Elective PE-3)',
  },
  {
    id: 'apple',
    name: 'Apple Specialization Section',
    badge: 'Apple Cohort',
    icon: '🍎',
    shortDesc: 'iOS Swift Theory + Apple Frameworks Lab',
    description: 'Dedicated Apple Lab cohort replacing generic electives with iOS Application Development with Swift and Apple Frameworks Lab.',
    electiveHighlight: 'iOS App Dev with Swift (24CSH-352) + Apple Lab (24CSP-353)',
  },
  {
    id: 'aiml',
    name: 'AI & Machine Learning Section',
    badge: 'Specialization',
    icon: '🤖',
    shortDesc: 'Machine Learning Theory + AI Lab',
    description: 'Artificial Intelligence and Data Science cohort taking ML Foundations theory alongside hands-on AI Programming Lab.',
    electiveHighlight: 'ML Foundations (24CST-354) + AI Applications Lab (24CSP-355)',
  },
  {
    id: 'cloud',
    name: 'Cloud Computing & DevOps',
    badge: 'Specialization',
    icon: '☁️',
    shortDesc: 'Cloud Architecture + DevOps Lab',
    description: 'Enterprise Cloud & DevOps cohort covering Cloud Virtualization, Docker, Kubernetes, and CI/CD automation.',
    electiveHighlight: 'Cloud Architecture (24CST-356) + DevOps Lab (24CSP-357)',
  },
  {
    id: 'cyber',
    name: 'Cyber Security Section',
    badge: 'Specialization',
    icon: '🛡️',
    shortDesc: 'Network Security + Cyber Lab',
    description: 'Information & Cyber Security cohort focusing on Cryptography, Penetration Testing, and Cyber Defense Labs.',
    electiveHighlight: 'Network Security (24CST-358) + Cyber Defense Lab (24CSP-359)',
  },
  {
    id: 'dual-nptel',
    name: 'Dual NPTEL / MOOC Track',
    badge: 'Online Electives',
    icon: '🎓',
    shortDesc: 'Both Electives Direct Grade (PE-2 + PE-3)',
    description: 'For sections or students who completed both professional electives through online NPTEL / Swayam examinations.',
    electiveHighlight: 'PE-II NPTEL (PE-2) + PE-III NPTEL (PE-3)',
  },
  {
    id: 'custom',
    name: 'Custom / Other Section',
    badge: 'Custom',
    icon: '⚙️',
    shortDesc: 'Custom Subjects, Codes & Credits',
    description: 'Configure your own subjects, toggle marks vs direct grade, and adjust credits for any unique section requirements.',
    electiveHighlight: 'User-configured custom elective slots',
  },
];

export function getElectivesForTrack(trackId: CohortTrackId, isSample = false): Course[] {
  switch (trackId) {
    case 'apple':
      return [
        {
          id: 'course-apple-ios',
          code: '24CSH-352',
          name: 'iOS Application Development with Swift',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory / Project Exam',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 49 : 0,
          components: createStandardTheoryComponents('apple-ios', isSample)
        },
        {
          id: 'course-apple-lab',
          code: '24CSP-353',
          name: 'Apple Frameworks & Swift Programming Lab',
          credits: 3.0,
          type: 'Practical',
          group: 'A',
          externalName: 'External Practical Viva / Evaluation',
          externalRawMax: 40,
          externalWeightage: 40,
          externalTargetScore: isSample ? 35 : 0,
          components: createStandardPracticalComponents('apple-lab', isSample)
        }
      ];

    case 'aiml':
      return [
        {
          id: 'course-aiml-theory',
          code: '24CST-354',
          name: 'Machine Learning Foundations',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 48 : 0,
          components: createStandardTheoryComponents('aiml-th', isSample)
        },
        {
          id: 'course-aiml-lab',
          code: '24CSP-355',
          name: 'Artificial Intelligence & Machine Learning Lab',
          credits: 3.0,
          type: 'Practical',
          group: 'A',
          externalName: 'External Viva / Voce',
          externalRawMax: 40,
          externalWeightage: 40,
          externalTargetScore: isSample ? 34 : 0,
          components: createStandardPracticalComponents('aiml-lab', isSample)
        }
      ];

    case 'cloud':
      return [
        {
          id: 'course-cloud-theory',
          code: '24CST-356',
          name: 'Cloud Architecture & Virtualization',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 50 : 0,
          components: createStandardTheoryComponents('cloud-th', isSample)
        },
        {
          id: 'course-cloud-lab',
          code: '24CSP-357',
          name: 'Cloud DevOps & Containerization Lab',
          credits: 3.0,
          type: 'Practical',
          group: 'A',
          externalName: 'External Viva / Voce',
          externalRawMax: 40,
          externalWeightage: 40,
          externalTargetScore: isSample ? 36 : 0,
          components: createStandardPracticalComponents('cloud-lab', isSample)
        }
      ];

    case 'cyber':
      return [
        {
          id: 'course-cyber-theory',
          code: '24CST-358',
          name: 'Network Security & Cryptography',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 47 : 0,
          components: createStandardTheoryComponents('cyber-th', isSample)
        },
        {
          id: 'course-cyber-lab',
          code: '24CSP-359',
          name: 'Cyber Defense & Ethical Hacking Lab',
          credits: 3.0,
          type: 'Practical',
          group: 'A',
          externalName: 'External Viva / Voce',
          externalRawMax: 40,
          externalWeightage: 40,
          externalTargetScore: isSample ? 35 : 0,
          components: createStandardPracticalComponents('cyber-lab', isSample)
        }
      ];

    case 'dual-nptel':
      return [
        {
          id: 'course-pe2',
          code: 'PE-2',
          name: 'PE-II: NPTEL MOOC Elective',
          credits: 3.0,
          type: 'DirectGrade',
          group: 'B',
          externalName: 'NPTEL Certificate Score',
          externalRawMax: 100,
          externalWeightage: 100,
          externalTargetScore: isSample ? 85 : 0,
          directGrade: isSample ? 'A+' : 'A',
          components: []
        },
        {
          id: 'course-pe3',
          code: 'PE-3',
          name: 'PE-III: NPTEL MOOC Elective',
          credits: 3.0,
          type: 'DirectGrade',
          group: 'B',
          externalName: 'NPTEL Certificate Score',
          externalRawMax: 100,
          externalWeightage: 100,
          externalTargetScore: isSample ? 80 : 0,
          directGrade: isSample ? 'A' : 'B+',
          components: []
        }
      ];

    case 'general':
    default:
      return [
        {
          id: 'course-wdf',
          code: '24CST-351',
          name: 'PE-II: Web Development Fundamentals',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 50 : 0,
          components: createStandardTheoryComponents('wdf', isSample)
        },
        {
          id: 'course-pe3',
          code: 'PE-3',
          name: 'PE-III: NPTEL / Elective (Configurable)',
          credits: 3.0,
          type: 'DirectGrade',
          group: 'B',
          externalName: 'NPTEL Certificate Score',
          externalRawMax: 100,
          externalWeightage: 100,
          externalTargetScore: isSample ? 85 : 0,
          directGrade: isSample ? 'A' : 'B',
          components: []
        }
      ];
  }
}

// Check if a course is considered an elective slot that switches between tracks
export function isElectiveCourse(course: Course): boolean {
  const electiveCodes = [
    '24CST-351', 'PE-2', 'PE-3', 'PE-5', 'PE-5A', 'PE-5B',
    '24CSH-352', '24CSP-353',
    '24CST-354', '24CSP-355',
    '24CST-356', '24CSP-357',
    '24CST-358', '24CSP-359'
  ];
  return electiveCodes.includes(course.code) || 
         course.id.startsWith('course-apple-') || 
         course.id.startsWith('course-aiml-') ||
         course.id.startsWith('course-cloud-') ||
         course.id.startsWith('course-cyber-') ||
         course.id.startsWith('course-pe2') ||
         course.id.startsWith('course-pe3') ||
         course.id.startsWith('course-pe5');
}

export function getCoursesForTrack(trackId: CohortTrackId, isSample = false): Course[] {
  const allGeneral = getCoursesTemplate(isSample);
  if (trackId === 'general') return allGeneral;

  const coreOnly = allGeneral.filter(c => !isElectiveCourse(c));
  const trackElectives = getElectivesForTrack(trackId, isSample);
  return [...coreOnly, ...trackElectives];
}

export function detectTrackFromCourses(courses: Course[]): CohortTrackId {
  const codes = courses.map(c => c.code.toUpperCase());
  if (codes.includes('24CSH-352') || codes.includes('24CSP-353') || courses.some(c => c.name.toLowerCase().includes('apple') || c.name.toLowerCase().includes('ios'))) {
    return 'apple';
  }
  if (codes.includes('24CST-354') || codes.includes('24CSP-355') || courses.some(c => c.name.toLowerCase().includes('machine learning'))) {
    return 'aiml';
  }
  if (codes.includes('24CST-356') || codes.includes('24CSP-357') || courses.some(c => c.name.toLowerCase().includes('devops') || c.name.toLowerCase().includes('cloud arch'))) {
    return 'cloud';
  }
  if (codes.includes('24CST-358') || codes.includes('24CSP-359') || courses.some(c => c.name.toLowerCase().includes('cyber security') || c.name.toLowerCase().includes('cryptography'))) {
    return 'cyber';
  }
  if ((codes.includes('PE-2') && codes.includes('PE-3')) || (codes.includes('PE-5A') && codes.includes('PE-5B'))) {
    return 'dual-nptel';
  }
  if (codes.includes('24CST-351') && (codes.includes('PE-3') || codes.includes('PE-5'))) {
    return 'general';
  }
  return 'custom';
}

export function switchTrackPreservingMarks(currentCourses: Course[], newTrackId: CohortTrackId): Course[] {
  if (newTrackId === 'custom') return currentCourses;

  // 1. Keep all non-elective courses (e.g. P&S, Java PBL, CN, CC-2, FSD-2, SS-3, Apt-3 and any custom user added courses)
  const nonElectives = currentCourses.filter(c => !isElectiveCourse(c));
  
  // 2. Get the new electives for the chosen track
  const newElectives = getElectivesForTrack(newTrackId, false);

  // 3. If the user previously had marks in elective slots, try to map into the new electives if types match
  const oldElectives = currentCourses.filter(c => isElectiveCourse(c));
  const mappedElectives = newElectives.map((newEl, idx) => {
    const oldEl = oldElectives[idx];
    if (!oldEl) return newEl;

    // If both are DirectGrade, preserve direct grade
    if (newEl.type === 'DirectGrade' && oldEl.type === 'DirectGrade' && oldEl.directGrade) {
      return { ...newEl, directGrade: oldEl.directGrade };
    }

    // If both are marks-based with external, preserve externalTargetScore
    if (newEl.externalRawMax === oldEl.externalRawMax && oldEl.externalTargetScore > 0) {
      return { 
        ...newEl, 
        externalTargetScore: oldEl.externalTargetScore,
        directInternalOverride: oldEl.directInternalOverride 
      };
    }

    return newEl;
  });

  return [...nonElectives, ...mappedElectives];
}

export function createNewBlankCourse(
  name: string,
  code: string,
  credits: number,
  type: CourseType,
  isNonGraded = false
): Course {
  const id = `custom-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  
  if (type === 'DirectGrade') {
    return {
      id,
      code: code.trim().toUpperCase() || 'CUSTOM-DG',
      name: name.trim() || 'Custom Direct Grade Subject',
      credits: Number(credits) || 3.0,
      type: 'DirectGrade',
      group: 'B',
      isCustom: true,
      externalName: 'Direct Certificate Grade',
      externalRawMax: 100,
      externalWeightage: 100,
      externalTargetScore: 0,
      directGrade: 'A',
      components: [],
      isNonGraded
    };
  }

  if (type === 'Practical') {
    return {
      id,
      code: code.trim().toUpperCase() || 'CUSTOM-PRAC',
      name: name.trim() || 'Custom Practical Subject',
      credits: Number(credits) || 2.0,
      type: 'Practical',
      group: isNonGraded ? 'C' : 'A',
      isCustom: true,
      isNonGraded,
      externalName: 'External Viva / Voce',
      externalRawMax: 40,
      externalWeightage: 40,
      externalTargetScore: 0,
      components: createStandardPracticalComponents(id, false)
    };
  }

  // Default: Theory
  return {
    id,
    code: code.trim().toUpperCase() || 'CUSTOM-TH',
    name: name.trim() || 'Custom Theory Subject',
    credits: Number(credits) || 3.0,
    type: 'Theory',
    group: isNonGraded ? 'C' : 'A',
    isCustom: true,
    isNonGraded,
    externalName: 'External Theory Exam',
    externalRawMax: 60,
    externalWeightage: 60,
    externalTargetScore: 0,
    components: createStandardTheoryComponents(id, false)
  };
}

export function convertCourseMode(course: Course, targetType: 'Theory' | 'Practical' | 'DirectGrade'): Course {
  if (course.type === targetType) return course;

  if (targetType === 'DirectGrade') {
    return {
      ...course,
      type: 'DirectGrade',
      group: 'B',
      directGrade: course.directGrade || 'A',
      externalName: 'Target Direct Grade',
      externalRawMax: 100,
      externalWeightage: 100,
      externalTargetScore: 0,
      components: [],
      directInternalOverride: undefined,
    };
  }

  if (targetType === 'Practical') {
    return {
      ...course,
      type: 'Practical',
      group: course.isNonGraded ? 'C' : 'A',
      directGrade: undefined,
      externalName: 'External Viva / Voce',
      externalRawMax: 40,
      externalWeightage: 40,
      externalTargetScore: 0,
      components: createStandardPracticalComponents(course.id, false),
      directInternalOverride: undefined,
    };
  }

  // Target Theory
  return {
    ...course,
    type: 'Theory',
    group: course.isNonGraded ? 'C' : 'A',
    directGrade: undefined,
    externalName: 'External Theory',
    externalRawMax: 60,
    externalWeightage: 60,
    externalTargetScore: 0,
    components: createStandardTheoryComponents(course.id, false),
    directInternalOverride: undefined,
  };
}

export const INITIAL_BLANK_COURSES = getCoursesTemplate(false);
export const SAMPLE_CSE_COURSES = getCoursesTemplate(true);
export const INITIAL_COURSES = INITIAL_BLANK_COURSES;
