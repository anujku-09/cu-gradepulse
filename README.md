# 🎓 CU GradePulse | CUIMS Academic Intelligence Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Offline First](https://img.shields.io/badge/Privacy-100%25%20Client--Side-00C853?style=for-the-badge&logo=shield&logoColor=white)](#-privacy--zero-login-security)
[![License](https://img.shields.io/badge/License-MIT-F50057?style=for-the-badge)](LICENSE)

> **The real-time SGPA & CGPA simulator, relative grading visualizer, and end-term target calculator engineered specifically for Chandigarh University (CU) students.**

Designed with a sleek **Cyberpunk Obsidian Glassmorphism** interface (`#09090B`), CU GradePulse eliminates the confusion of raw CUIMS marks scaling and empowers students to know their exact target marks before walking into final exams.

---

## 💡 Why CU GradePulse?

Students at Chandigarh University frequently face three major academic pain points:
1. **Raw Marks Scaling Mystery**: Marks in CUIMS are recorded out of varying maximums (experiments out of 30, MSTs out of 20, surprises out of 12, quizzes out of 4). Manually calculating weighted scores is tedious and prone to calculation errors.
2. **Relative Grading Uncertainty**: CU follows relative grading where cutoffs shift with paper difficulty, leaving students guessing whether an 80 gets an `A` or a `B+`.
3. **End-Term Exam Target Blindspots**: Students don't know the exact external marks needed out of 60 (or 40) to reach their desired grade (`O`, `A+`, `A`, `B+`).

**CU GradePulse solves all three in real time.**

---

## 🔥 Key Platform Features

### ⚡ 1. CUIMS Regex Smart Paste (Desktop & Mobile)
*Zero manual typing. Paste raw marks directly from CUIMS in seconds.*
- **Mobile Multi-Line Auto-Detection**: Accurately parses broken column copies from mobile browsers where cells appear on separate lines:
  ```text
  Practical MST
  8.5/10

  Practical Worksheet/Projects 1
  29/30

  Practical Worksheet/Projects 9
  8/30

  MST-1 Hybrid
  16/20
  ```
- **Direct Slash Notation Parsing**: Seamlessly recognizes `Obtained / Max` scores (`8.5/10`, `29/30`, `16/20`, `8/30`).
- **Universal & Single-Subject Modes**: Use the global paste modal for the whole semester or the inline regex box on individual cards.
- **Desktop Table Scanner**: Automatically extracts tab-separated tables copied from desktop CUIMS browser tabs.

---

### 🎛️ 2. Global & Subject-Wise Cutoff Customizer
*Calibrate relative grading to match your section's actual paper difficulty.*
- **3 Dynamic Presets**:
  - **Standard CU Curve**: $O \ge 95$, $A+ \ge 88$, $A \ge 80$, $B+ \ge 70$, $B \ge 60$, $C \ge 50$, $P \ge 40$.
  - **Lenient / Tough Paper**: Shift cutoffs downward when exams are difficult ($A+ \ge 82$, $A \ge 74$).
  - **Strict / Easy Paper**: Shift cutoffs upward when batch averages are high ($A+ \ge 92$, $A \ge 85$).
- **Subject-Wise Cutoff Overrides**: Define custom cutoffs for notoriously tough individual subjects (like Probability & Statistics or Computer Networks) without changing other courses.
- **Gaussian Bell Curve Visualizer**: Live distribution curve displaying grade thresholds and percentile distributions.

---

### 📐 3. Assessment Scheme Customization
*Tailor any subject to its official CU evaluation model.*
- **Theory (40% Internal / 60% External)**: MST-1 (10%), MST-2 (10%), Assignment/PBL (10%), Surprise Test (4%), Quiz (4%), Attendance (2%) + External Exam (60%).
- **Practical (60% Internal / 40% External)**: 10 Lab Experiments / Worksheets (45%) + Mid-Term Test (15%) + External Lab Viva/Exam (40%).
- **Hybrid (70% Internal / 30% External)**: Practical Evaluations (20%), 10 Worksheets (20%), Practical MST (4%), MST-1 Hybrid (5%), MST-2 Hybrid (5%), Assignment (6%), Surprise Test (4%), Quiz (4%), Attendance (2%) + External Exam (30%).
- **Continuous Evaluation (100% Internal)**: Milestone 1 (25%), Milestone 2 (25%), Final Project & Viva (30%), Technical Report (15%), Conduct (5%) with 0 external exam (used for Industry Specialization subjects: KPIT, Virtusa, Salesforce, SAP, ServiceNow, Tech Mahindra, IBM MLOps).
- **Direct Grade (10-Point Scale)**: Direct grade pill selector (`O` to `F`) for NPTEL and MOOC electives.

---

### 🎓 4. Professional Elective & Cohort Track Chooser
*Switch elective tracks with one click while preserving entered marks.*
- **Set F: Core Electives**: Web Development, Data Mining, Mobile UX, Digital Image Processing, Business Analytics, Vulnerability Assessment.
- **Set B: Apple Authorized Track**: Swift Programming (`24CSH-352` Hybrid 70/30) & iOS App Design (`24CSP-353` Hybrid 70/30).
- **Set C: IoT Track**: IoT Network Architecture (`24CST-360` Hybrid 70/30) & Microcontroller Interfacing (`24CSP-361` Practical 60/40).
- **Set D: ML & AI Track**: Optimization for AI (`24CST-354` Theory) & Machine Learning for Computer Vision (`24CSP-355` Practical).
- **Set E: Industry Specialization (100% Internal)**: KPIT Embedded Systems, Virtusa Full Stack Cloud, Salesforce Platform, SAP S/4HANA, ServiceNow Automation, Tech Mahindra Cloud & Edge, IBM MLOps.
- **Cloud & DevOps Track**: Cloud Architecture (`24CST-356`) & DevOps Containerization (`24CSP-357`).
- **Cyber Security Track**: Network Security & Cryptography (`24CST-358`) & Cyber Defense Lab (`24CSP-359`).
- **Dual NPTEL MOOC Track**: Big Data Fundamentals (`PE-2`) & Cyber Threat Intelligence (`PE-3`).

---

### 🔄 5. Include / Exclude Any Subject in SGPA (Dual-Mode MNG)
*Seamlessly manage non-graded and audit courses.*
- **Default Exclusion for Soft Skills & Aptitude**: Automatically sets `24TDP-311` (Soft Skills) and `24TDT-312` (Aptitude) to Non-Graded (`MNG`) mode by default, excluding their 4 credits from the SGPA denominator ($19.0$ credits total).
- **Passing Threshold Verifier**: Monitors the $\ge 40/100$ qualifying criterion; triggers a clear backlog warning if internal marks fall below threshold.
- **One-Click Toggle**: Re-include any subject into graded calculations ($23.0$ credits total) whenever needed.

---

### ➕ 6. Add & Fully Configure Any Custom Subject
*Never be locked into hardcoded semesters or presets.*
- Add custom courses with custom names, course codes, credit weights (1.0 to 5.0), and assessment scheme types.
- Modify credit weights, external maximums, target scores, and remove unwanted subjects anytime.

---

### 🎯 7. "What-If" External Target Score Slider
*Know exactly how many marks you need in the end-term exam.*
- Dynamic target slider with color-coded tickmarks displaying the exact marks required out of 60 (or 40) to unlock `O`, `A+`, `A`, `B+`, `B`, `C`, and `P`.
- Real-time grade indicator updates immediately as you slide.

---

### 📈 8. Single-Subject Project Deep-Dive & Mobile Report
*Inspect any course with granular clarity.*
- Detailed assessment component inspection modal (`CourseDetailModal`).
- Minimum external score requirements matrix per grade tier.
- Mobile-responsive layout optimized for smartphones.

---

### 🔮 9. Cumulative CGPA Forecaster
*Project your overall academic trajectory.*
- Input previous CGPA and completed credits.
- Instantly calculates your projected new overall CGPA and net change delta (e.g. `+0.16`).

---

### 📸 10. Scorecard Snapshot & Verification Report
*Save and share your academic roadmap.*
- Generate high-resolution exportable scorecard with student details, course credit matrix, and official verification stamp.
- Export as printable format or screenshot-ready card for WhatsApp and LinkedIn.

---

### 📱 11. Mobile-First Bottom Navigation Dock
*Ergonomic navigation designed for students on mobile phones.*
- One-tap bottom dock with instant access to **Dashboard**, **Paste**, **Wizard**, **Curve**, and **Forecast**.
- Responsive Bento grid layout that collapses smoothly on mobile viewports.

---

### 🔒 12. Privacy & Zero-Login Security
- **No Login / Sign-up**: No student accounts, no passwords, and zero email collection.
- **Zero CUIMS Credentials Needed**: Pure client-side calculations.
- **Clean Slate on Reload**: Starts fresh on every visit with no persistent user data tracking.

---

### 📬 13. Direct Developer Feedback System
- Integrated feedback modal with star ratings and reviews that notify the developer instantly via mobile push notifications (`ntfy.sh`).

---

## 🧮 Mathematical Formulation

CU GradePulse adheres strictly to the official Chandigarh University Academic Evaluation Manual:

### 1. Component Weightage Scaling
$$\text{Weighted Component Score} = \left(\frac{\text{Raw Marks Obtained}}{\text{Raw Maximum Marks}}\right) \times \text{Weightage}$$

### 2. Composite Total Course Score
$$\text{Total Score} = \sum \text{Weighted Internal Components} + \left(\frac{\text{External Exam Obtained}}{\text{External Exam Max}}\right) \times \text{External Weightage}$$

### 3. Semester Grade Point Average (SGPA)
$$\text{SGPA} = \frac{\sum_{i=1}^{N} (\text{Credits}_i \times \text{Grade Point}_i)}{\sum_{i=1}^{N} \text{Credits}_i} \quad \forall \, i \notin \text{Excluded Courses}$$

### 4. Cumulative Grade Point Average (CGPA)
$$\text{CGPA}_{\text{New}} = \frac{(\text{CGPA}_{\text{Prev}} \times \text{Credits}_{\text{Prev}}) + (\text{SGPA}_{\text{Current}} \times \text{Credits}_{\text{Current}})}{\text{Credits}_{\text{Prev}} + \text{Credits}_{\text{Current}}}$$

---

## 💻 Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphic obsidian palette (`#09090B`)
- **Icons**: Lucide React
- **Animations**: Canvas Confetti & CSS Transitions
- **Build Tool**: Vite 5
- **Notification Delivery**: Ntfy Push Notifications

---

## 🚀 Local Development

```bash
# 1. Clone repository
git clone https://github.com/anujku-09/cu-gradepulse.git

# 2. Navigate to project directory
cd cuims-grade-pulse

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```

---

Developed with ❤️ for the Chandigarh University Student Community.
