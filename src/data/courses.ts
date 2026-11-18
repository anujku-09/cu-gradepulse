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

export function createStandardHybridComponents(prefix: string, isSample = false): AssessmentComponent[] {
  return [
    {
      id: `${prefix}-prac-eval`,
      name: 'Practical Evaluations',
      rawMax: 40,
      weightage: 20,
      rawObtained: isSample ? 36 : 0,
      category: 'PracticalEvaluation' as const,
    },
    ...Array.from({ length: 10 }, (_, i) => ({
      id: `${prefix}-sheet-${i + 1}`,
      name: `Practical Worksheet/Projects ${i + 1}`,
      rawMax: 30,
      weightage: 2,
      rawObtained: isSample ? 28 : 0,
      category: 'Experiment' as const,
    })),
    {
      id: `${prefix}-prac-mst`,
      name: 'Practical MST',
      rawMax: 10,
      weightage: 4,
      rawObtained: isSample ? 9 : 0,
      category: 'MST' as const,
    },
    {
      id: `${prefix}-mst-1`,
      name: 'MST-1 Hybrid',
      rawMax: 20,
      weightage: 5,
      rawObtained: isSample ? 18 : 0,
      category: 'MST' as const,
    },
    {
      id: `${prefix}-mst-2`,
      name: 'MST-2 Hybrid',
      rawMax: 20,
      weightage: 5,
      rawObtained: isSample ? 17 : 0,
      category: 'MST' as const,
    },
    {
      id: `${prefix}-assign`,
      name: 'Assignment / PBL',
      rawMax: 10,
      weightage: 6,
      rawObtained: isSample ? 9.5 : 0,
      category: 'Assignment' as const,
    },
    {
      id: `${prefix}-surprise`,
      name: 'Surprise Test',
      rawMax: 12,
      weightage: 4,
      rawObtained: isSample ? 11 : 0,
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

export function createContinuousInternalComponents(prefix: string, isSample = false): AssessmentComponent[] {
  return [
    {
      id: `${prefix}-milestone1`,
      name: 'Milestone 1 / Mid-Review',
      rawMax: 50,
      weightage: 25,
      rawObtained: isSample ? 45 : 0,
      category: 'PracticalEvaluation' as const,
    },
    {
      id: `${prefix}-milestone2`,
      name: 'Milestone 2 / Progress Demo',
      rawMax: 50,
      weightage: 25,
      rawObtained: isSample ? 46 : 0,
      category: 'PracticalEvaluation' as const,
    },
    {
      id: `${prefix}-final-viva`,
      name: 'Final Project Demo & Viva',
      rawMax: 100,
      weightage: 30,
      rawObtained: isSample ? 90 : 0,
      category: 'Viva' as const,
    },
    {
      id: `${prefix}-report`,
      name: 'Documentation & Technical Report',
      rawMax: 50,
      weightage: 15,
      rawObtained: isSample ? 45 : 0,
      category: 'Assignment' as const,
    },
    {
      id: `${prefix}-att-conduct`,
      name: 'Attendance & Professional Conduct',
      rawMax: 10,
      weightage: 5,
      rawObtained: isSample ? 10 : 0,
      category: 'Attendance' as const,
    }
  ];
}

export function detectAssessmentSchemeFromCode(code: string, name: string = ''): CourseType {
  const c = code.trim().toUpperCase();
  const n = name.trim().toLowerCase();

  // 1. Direct Grade NPTEL / Swayam
  if (c.includes('NPTEL') || c.includes('SWAYAM') || c.includes('MOOC') || n.includes('nptel') || n.includes('swayam') || n.includes('direct grade')) {
    return 'DirectGrade';
  }

  // 2. Hybrid PBL (24CSH-...)
  if (c.includes('CSH') || n.includes('(hybrid)') || n.includes('hybrid') || n.includes('pbl')) {
    return 'Hybrid';
  }

  // 3. 100% Continuous Evaluation / Project / Capstone
  if (n.includes('capstone') || n.includes('continuous') || n.includes('project evaluation') || n.includes('internship') || n.includes('seminar')) {
    return 'ContinuousEvaluation';
  }

  // 4. Practical Lab (24CSP-..., 24TDP-..., Lab, Viva)
  if (c.includes('CSP') || c.includes('TDP') || n.includes('lab') || n.includes('practical') || n.includes('viva') || n.includes('testing')) {
    return 'Practical';
  }

  // 5. Theory (24CST-..., 24SMT-..., 24TDT-..., Theory, default)
  return 'Theory';
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

    // 5. Web Development Fundamentals (PE-III Offline Elective)
    {
      id: 'course-wdf',
      code: '24CST-351',
      name: 'PE-III: Web Development Fundamentals (Offline)',
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

    // 7. Professional Elective (PE-II NPTEL)
    {
      id: 'course-pe2',
      code: 'PE-2',
      name: 'PE-II: Big Data / Cyber Threat (NPTEL)',
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
    name: 'Set F: Core Electives',
    badge: 'Rest Sections',
    icon: '🌐',
    shortDesc: 'PE-II NPTEL + PE-III Web Dev / Offline Electives',
    description: 'Set F (Rest remaining sections): PE-II NPTEL (Big Data / Cyber Threat) and PE-III Offline Theory (Web Dev, Mobile UX, Data Mining, Digital Image Processing, Business Analytics, VAPT).',
    electiveHighlight: 'PE-II: NPTEL (Big Data / Cyber) + PE-III: Web Dev (24CST-351)',
  },
  {
    id: 'apple',
    name: 'Set B: Apple Track',
    badge: 'Apple Sections',
    icon: '🍎',
    shortDesc: 'Swift Programming (Offline) + iOS App Design (Offline)',
    description: 'Set B for Apple sections: Programming in Swift (Offline Mandatory) and Application Design & Development for iOS (Offline).',
    electiveHighlight: 'PE-II: Swift (Offline) + PE-III: iOS App Design (Offline)',
  },
  {
    id: 'aiml',
    name: 'Set D: ML & AI Track',
    badge: 'AI Lab Sections',
    icon: '🤖',
    shortDesc: 'Optimization for AI (Offline) + ML Computer Vision (Offline)',
    description: 'Set D for ML & AI sections: Optimization Techniques for AI (Offline Mandatory) and Machine Learning for Computer Vision (Offline).',
    electiveHighlight: 'PE-II: AI Optimization + PE-III: ML Computer Vision',
  },
  {
    id: 'iot',
    name: 'Set C: IoT Track',
    badge: 'IoT Sections',
    icon: '📡',
    shortDesc: 'PE-II NPTEL + PE-III IoT Network Protocols (Offline)',
    description: 'Set C for IoT sections: PE-II NPTEL (Big Data / Cyber Threat) and PE-III IoT Network Architecture & Communication Protocols (Offline).',
    electiveHighlight: 'PE-II: NPTEL + PE-III: IoT Network Protocols (Offline)',
  },
  {
    id: 'industry',
    name: 'Set E: Industry Integration',
    badge: 'Industry Skills',
    icon: '🏢',
    shortDesc: 'PE-II NPTEL + PE-III KPIT / Salesforce / SAP / IBM',
    description: 'Set E for Industry Skill Integration: PE-II NPTEL and PE-III Offline Specialization (KPIT C, Virtusa Testing, Salesforce, SAP, ServiceNow, Tech Mahindra, IBM MLOps).',
    electiveHighlight: 'PE-II: NPTEL + PE-III: Industry Specialization (Offline)',
  },
  {
    id: 'cloud',
    name: 'Cloud & DevOps Track',
    badge: 'Cloud Specialization',
    icon: '☁️',
    shortDesc: 'Cloud Architecture + DevOps Lab',
    description: 'Enterprise Cloud & DevOps cohort covering Cloud Virtualization, Docker, Kubernetes, and CI/CD automation.',
    electiveHighlight: 'Cloud Architecture (24CST-356) + DevOps Lab (24CSP-357)',
  },
  {
    id: 'cyber',
    name: 'Cyber Security Track',
    badge: 'Cyber Specialization',
    icon: '🛡️',
    shortDesc: 'Network Security + Cyber Lab',
    description: 'Information & Cyber Security cohort focusing on Cryptography, Penetration Testing, and Cyber Defense Labs.',
    electiveHighlight: 'Network Security (24CST-358) + Cyber Defense Lab (24CSP-359)',
  },
  {
    id: 'dual-nptel',
    name: 'Dual NPTEL MOOC Track',
    badge: 'Online Electives',
    icon: '🎓',
    shortDesc: 'Both Electives Direct Grade (Certificate)',
    description: 'For sections or students who completed both professional electives through online NPTEL / Swayam examinations.',
    electiveHighlight: 'PE-II: NPTEL (Big Data) + PE-III: NPTEL (Cyber Threat)',
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

export interface ElectivePreset {
  name: string;
  code: string;
  type: CourseType;
  credits: number;
  set: string;
}

export const CU_5TH_SEM_ELECTIVE_PRESETS: ElectivePreset[] = [
  // Set F (Rest remaining sections)
  { name: 'PE-III: Web Development Fundamentals (TPP only)', code: '24CST-351', type: 'Theory', credits: 3.0, set: 'Set F' },
  { name: 'PE-III: Mobile App User Experience Design', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set F' },
  { name: 'PE-III: Introduction to Digital Image Processing', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set F' },
  { name: 'PE-III: Data Mining', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set F' },
  { name: 'PE-III: Business Analytics and Visualization', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set F' },
  { name: 'PE-III: Vulnerability Assessment & Pen-Testing (IIFON)', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set F' },
  
  // Set E (Industry Skill Integration)
  { name: 'PE-III: KPIT: Advanced C Programming', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set E' },
  { name: 'PE-III: Virtusa: Software Testing', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set E' },
  { name: 'PE-III: Salesforce: Salesforce-1', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set E' },
  { name: 'PE-III: SAP: SAP-1', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set E' },
  { name: 'PE-III: ServiceNow: ServiceNow-1', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set E' },
  { name: 'PE-III: Tech Mahindra: Cyber Security-1', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set E' },
  { name: 'PE-III: IBM: MLOps-1', code: 'PE-3', type: 'Theory', credits: 3.0, set: 'Set E' },

  // Set C (IoT)
  { name: 'PE-III: IoT Network Architecture & Protocols', code: '24CST-360', type: 'Theory', credits: 3.0, set: 'Set C' },

  // Set B (Apple)
  { name: 'PE-II: Programming in Swift (Offline)', code: '24CSH-352', type: 'Theory', credits: 3.0, set: 'Set B' },
  { name: 'PE-III: Application Design & Dev for iOS (Offline)', code: '24CSP-353', type: 'Practical', credits: 3.0, set: 'Set B' },

  // Set D (ML & AI)
  { name: 'PE-II: Optimization Techniques for AI (Offline)', code: '24CST-354', type: 'Theory', credits: 3.0, set: 'Set D' },
  { name: 'PE-III: Machine Learning for Computer Vision (Offline)', code: '24CSP-355', type: 'Practical', credits: 3.0, set: 'Set D' },

  // NPTEL Electives (for PE-II and Dual NPTEL)
  { name: 'PE-II: Big Data Fundamentals (NPTEL)', code: 'PE-2', type: 'DirectGrade', credits: 3.0, set: 'NPTEL' },
  { name: 'PE-II: Cyber Threat Intelligence (NPTEL)', code: 'PE-2', type: 'DirectGrade', credits: 3.0, set: 'NPTEL' },
];

export function getElectivesForTrack(trackId: CohortTrackId, isSample = false): Course[] {
  switch (trackId) {
    case 'apple':
      return [
        {
          id: 'course-apple-swift',
          code: '24CSH-352',
          name: 'PE-II: Programming in Swift (Offline)',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory Exam',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 49 : 0,
          components: createStandardTheoryComponents('apple-swift', isSample)
        },
        {
          id: 'course-apple-ios',
          code: '24CSP-353',
          name: 'PE-III: Application Design & Dev for iOS (Offline)',
          credits: 3.0,
          type: 'Practical',
          group: 'A',
          externalName: 'External Practical Viva / Evaluation',
          externalRawMax: 40,
          externalWeightage: 40,
          externalTargetScore: isSample ? 35 : 0,
          components: createStandardPracticalComponents('apple-ios', isSample)
        }
      ];

    case 'aiml':
      return [
        {
          id: 'course-aiml-opt',
          code: '24CST-354',
          name: 'PE-II: Optimization Techniques for AI (Offline)',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 48 : 0,
          components: createStandardTheoryComponents('aiml-opt', isSample)
        },
        {
          id: 'course-aiml-cv',
          code: '24CSP-355',
          name: 'PE-III: Machine Learning for Computer Vision (Offline)',
          credits: 3.0,
          type: 'Practical',
          group: 'A',
          externalName: 'External Viva / Evaluation',
          externalRawMax: 40,
          externalWeightage: 40,
          externalTargetScore: isSample ? 34 : 0,
          components: createStandardPracticalComponents('aiml-cv', isSample)
        }
      ];

    case 'iot':
      return [
        {
          id: 'course-pe2',
          code: 'PE-2',
          name: 'PE-II: Big Data / Cyber Threat (NPTEL)',
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
        {
          id: 'course-iot-net',
          code: '24CST-360',
          name: 'PE-III: IoT Network Architecture & Protocols (Offline)',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 48 : 0,
          components: createStandardTheoryComponents('iot-net', isSample)
        }
      ];

    case 'industry':
      return [
        {
          id: 'course-pe2',
          code: 'PE-2',
          name: 'PE-II: Big Data / Cyber Threat (NPTEL)',
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
        {
          id: 'course-industry-spec',
          code: 'PE-3',
          name: 'PE-III: Industry Specialization (KPIT/Salesforce/SAP/IBM)',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory / Viva',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 49 : 0,
          components: createStandardTheoryComponents('ind-spec', isSample)
        }
      ];

    case 'cloud':
      return [
        {
          id: 'course-cloud-theory',
          code: '24CST-356',
          name: 'PE-II: Cloud Architecture & Virtualization',
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
          name: 'PE-III: Cloud DevOps & Containerization Lab',
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
          name: 'PE-II: Network Security & Cryptography',
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
          name: 'PE-III: Cyber Defense & Ethical Hacking Lab',
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
          name: 'PE-II: Big Data Fundamentals (NPTEL)',
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
          name: 'PE-III: Cyber Threat Intelligence (NPTEL)',
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
          id: 'course-pe2',
          code: 'PE-2',
          name: 'PE-II: Big Data / Cyber Threat (NPTEL)',
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
        {
          id: 'course-wdf',
          code: '24CST-351',
          name: 'PE-III: Web Development Fundamentals (Offline)',
          credits: 3.0,
          type: 'Theory',
          group: 'A',
          externalName: 'External Theory',
          externalRawMax: 60,
          externalWeightage: 60,
          externalTargetScore: isSample ? 50 : 0,
          components: createStandardTheoryComponents('wdf', isSample)
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
    '24CST-358', '24CSP-359',
    '24CST-360', '24CSP-361'
  ];
  return electiveCodes.includes(course.code) || 
         course.id.startsWith('course-apple-') || 
         course.id.startsWith('course-aiml-') ||
         course.id.startsWith('course-cloud-') ||
         course.id.startsWith('course-cyber-') ||
         course.id.startsWith('course-iot-') ||
         course.id.startsWith('course-industry-') ||
         course.id.startsWith('course-wdf') ||
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
  if (codes.includes('24CSH-352') || codes.includes('24CSP-353') || courses.some(c => c.name.toLowerCase().includes('apple') || c.name.toLowerCase().includes('swift'))) {
    return 'apple';
  }
  if (codes.includes('24CST-354') || codes.includes('24CSP-355') || courses.some(c => c.name.toLowerCase().includes('machine learning') || c.name.toLowerCase().includes('optimization techniques for ai'))) {
    return 'aiml';
  }
  if (codes.includes('24CST-360') || courses.some(c => c.name.toLowerCase().includes('iot network') || c.name.toLowerCase().includes('iot'))) {
    return 'iot';
  }
  if (courses.some(c => c.name.toLowerCase().includes('kpit') || c.name.toLowerCase().includes('salesforce') || c.name.toLowerCase().includes('servicenow') || c.name.toLowerCase().includes('virtusa') || c.name.toLowerCase().includes('industry'))) {
    return 'industry';
  }
  if (codes.includes('24CST-356') || codes.includes('24CSP-357') || courses.some(c => c.name.toLowerCase().includes('devops') || c.name.toLowerCase().includes('cloud arch'))) {
    return 'cloud';
  }
  if (codes.includes('24CST-358') || codes.includes('24CSP-359') || courses.some(c => c.name.toLowerCase().includes('cyber security') || c.name.toLowerCase().includes('cryptography'))) {
    return 'cyber';
  }
  if ((codes.includes('PE-2') && codes.includes('PE-3') && courses.filter(c => c.type === 'DirectGrade').length >= 2) || (codes.includes('PE-5A') && codes.includes('PE-5B'))) {
    return 'dual-nptel';
  }
  if (codes.includes('24CST-351') || codes.includes('PE-2') || codes.includes('PE-3') || codes.includes('PE-5')) {
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
      externalName: 'NPTEL Certificate Score',
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

  if (type === 'Hybrid') {
    return {
      id,
      code: code.trim().toUpperCase() || 'CUSTOM-HYBRID',
      name: name.trim() || 'Custom Hybrid PBL Subject',
      credits: Number(credits) || 3.0,
      type: 'Hybrid',
      group: isNonGraded ? 'C' : 'A',
      isCustom: true,
      isNonGraded,
      externalName: 'End Term Hybrid Theory',
      externalRawMax: 60,
      externalWeightage: 30,
      externalTargetScore: 0,
      components: createStandardHybridComponents(id, false)
    };
  }

  if (type === 'ContinuousEvaluation') {
    return {
      id,
      code: code.trim().toUpperCase() || 'CUSTOM-PROJ',
      name: name.trim() || 'Custom Continuous Evaluation Subject',
      credits: Number(credits) || 3.0,
      type: 'ContinuousEvaluation',
      group: isNonGraded ? 'C' : 'A',
      isCustom: true,
      isNonGraded,
      externalName: 'Continuous Evaluation (No External Exam)',
      externalRawMax: 0,
      externalWeightage: 0,
      externalTargetScore: 0,
      components: createContinuousInternalComponents(id, false)
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

export function convertCourseMode(course: Course, targetType: CourseType): Course {
  if (course.type === targetType) return course;

  if (targetType === 'DirectGrade') {
    return {
      ...course,
      type: 'DirectGrade',
      group: 'B',
      directGrade: course.directGrade || 'A',
      externalName: 'NPTEL Certificate Score',
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

  if (targetType === 'Hybrid') {
    return {
      ...course,
      type: 'Hybrid',
      group: course.isNonGraded ? 'C' : 'A',
      directGrade: undefined,
      externalName: 'End Term Hybrid Theory',
      externalRawMax: 60,
      externalWeightage: 30,
      externalTargetScore: 0,
      components: createStandardHybridComponents(course.id, false),
      directInternalOverride: undefined,
    };
  }

  if (targetType === 'ContinuousEvaluation') {
    return {
      ...course,
      type: 'ContinuousEvaluation',
      group: course.isNonGraded ? 'C' : 'A',
      directGrade: undefined,
      externalName: 'Continuous Evaluation (No External Exam)',
      externalRawMax: 0,
      externalWeightage: 0,
      externalTargetScore: 0,
      components: createContinuousInternalComponents(course.id, false),
      directInternalOverride: undefined,
    };
  }

  // Target Theory
  return {
    ...course,
    type: 'Theory',
    group: course.isNonGraded ? 'C' : 'A',
    directGrade: undefined,
    externalName: 'External Theory Exam',
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
