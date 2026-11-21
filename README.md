# 🎓 CU GradePulse | Next-Gen CUIMS Academic Intelligence Platform

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Offline First](https://img.shields.io/badge/Storage-100%25%20Offline%20First-00C853?style=for-the-badge&logo=pwa&logoColor=white)](#privacy--architecture)
[![License](https://img.shields.io/badge/License-MIT-F50057?style=for-the-badge)](LICENSE)

> **The ultimate real-time SGPA/CGPA simulator, relative grading visualizer, and end-term target calculator engineered specifically for Chandigarh University (CU) students.**

---

## 💡 Why CU GradePulse? (The Student Problem We Solved)

Chandigarh University students face three major challenges with academic tracking on the CUIMS portal:
1. **Raw Marks Confusion**: Internal marks are uploaded out of irregular maximums (e.g. experiments out of 30, MSTs out of 20, surprises out of 12, quizzes out of 4). Calculating true weighted percentages manually is tedious and error-prone.
2. **Relative Grading Blindspots**: CU uses relative grading where cutoffs shift based on batch difficulty, yet students have no way to know whether an 82 or an 88 gets an `A+`.
3. **End-Term Target Uncertainty**: Students go into final exams without knowing the exact external score needed out of 60 (or 40) to hit their desired target grade (`O`, `A+`, `A`, `B+`).

**CU GradePulse eliminates the guesswork entirely.**

---

## 🔥 Flagship Features That Drive Student Adoption

### ⚡ 1. CUIMS Regex Smart Paste & Mobile Parser
*Zero manual typing. Paste raw text directly from the CUIMS portal in seconds.*
- **Mobile Multi-Line Auto-Detection**: Automatically parses broken column copies from mobile phones (e.g. `Practical MST\n8.5/10`, `Practical Worksheet/Projects 1\n29/30`, `MST-1 Hybrid\n16/20`).
- **Direct Slash Notation Parsing**: Recognizes any `Obtained / Max` score format (`8.5/10`, `29/30`, `16/20`, `8/30`).
- **Desktop Table Scanner**: Automatically extracts tab-separated tables from desktop CUIMS browser views.
- **Auto-Subject Mapping**: Intelligently matches component labels (MSTs, Quizzes, Surprise Tests, Worksheets, Assignments) to the corresponding course without manual sorting.

### 🎛️ 2. Global & Subject-Wise Cutoff Customizer
*Calibrate relative grading to match your section's actual paper difficulty.*
- **3 Dynamic Presets**:
  - **Standard CU Default**: $O \ge 95$, $A+ \ge 88$, $A \ge 80$, $B+ \ge 70$, $B \ge 60$, $C \ge 50$, $P \ge 40$.
  - **Lenient / Tough Paper Shift**: Shift cutoffs downward when question papers are notoriously hard ($A+ \ge 82$, $A \ge 74$).
  - **Strict / Easy Paper Shift**: Shift cutoffs upward when batch averages are exceptionally high ($A+ \ge 92$, $A \ge 85$).
- **Subject-Specific Overrides**: Apply custom cutoffs to notoriously hard individual courses (e.g., Probability & Statistics or Computer Networks) without altering other subjects.
- **Gaussian Bell Curve Visualizer**: Live distribution curve illustrating grade brackets, percentiles, and cohort percent allocations.

### 📐 3. Full Assessment Scheme Customization
*Tailor any subject to its exact CU evaluation scheme.*
- **Theory (40% Internal / 60% External)**: MST-1 (10%), MST-2 (10%), Assignment/PBL (10%), Surprise Test (4%), Quiz (4%), Attendance (2%) + External Exam (60%).
- **Practical (60% Internal / 40% External)**: 10 Lab Experiments / Worksheets (45%) + Mid-Term Test (15%) + External Lab Viva/Exam (40%).
- **Hybrid (70% Internal / 30% External)**: Practical Evaluations (20%), 10 Worksheets (20%), Practical MST (4%), MST-1 Hybrid (5%), MST-2 Hybrid (5%), Assignment (6%), Surprise Test (4%), Quiz (4%), Attendance (2%) + External Exam (30%).
- **Continuous Evaluation (100% Internal)**: Milestone 1 / Mid-Review (25%), Milestone 2 / Progress Demo (25%), Final Project & Viva (30%), Documentation (15%), Attendance & Conduct (5%) with 0 external exam.
- **Direct Grade (10-Point Scale)**: Pill selector for NPTEL / MOOC certifications (`O` to `F`).

### 🎓 4. Professional Elective & Cohort Track Chooser
*Switch elective tracks with one click while preserving all previously entered marks.*
- **Set F: Core Computer Science Electives**: Web Development, Data Mining, Mobile UX, Digital Image Processing, Business Analytics, Vulnerability Assessment.
- **Set B: Apple Authorized Track**: Swift Programming (`24CSH-352` Hybrid 70/30) & iOS App Design (`24CSP-353` Hybrid 70/30).
- **Set C: IoT Track**: IoT Network Architecture (`24CST-360` Hybrid 70/30) & Microcontroller Interfacing (`24CSP-361` Practical 60/40).
- **Set D: ML & AI Track**: Optimization for AI (`24CST-354` Theory) & Machine Learning for Computer Vision (`24CSP-355` Practical).
- **Set E: Industry Specialization (100% Internal)**: KPIT Embedded Systems, Virtusa Full Stack Cloud, Salesforce Platform, SAP S/4HANA, ServiceNow Automation, Tech Mahindra Cloud & Edge, IBM MLOps.
- **Cloud & DevOps Track**: Cloud Architecture (`24CST-356`) & DevOps Containerization (`24CSP-357`).
- **Cyber Security Track**: Network Security & Cryptography (`24CST-358`) & Cyber Defense Lab (`24CSP-359`).
- **Dual NPTEL MOOC Track**: Big Data Fundamentals (`PE-2`) & Cyber Threat Intelligence (`PE-3`).

### 🔄 5. Include / Exclude Any Subject in SGPA (MNG Toggle)
*Seamlessly manage non-graded and audit courses.*
- **Default Exclusion for Soft Skills & Aptitude**: Automatically sets `24TDP-311` and `24TDT-312` to Non-Graded (`MNG`) mode by default, excluding their 4 credits from the SGPA denominator ($19.0$ credits total).
- **Passing Threshold Verifier**: Monitors the $\ge 40/100$ qualifying criterion; displays a backlog alert if internal marks fall below threshold.
- **One-Click Toggle**: Re-include any subject into graded calculations ($23.0$ credits total) whenever needed.

### ➕ 6. Add & Fully Configure Any Custom Subject
*Never be locked into hardcoded semesters.*
- Add custom courses with custom names, course codes, credit weights (1.0 to 5.0), and scheme types.
- Customize maximum marks, obtained scores, and component weightages dynamically.

### 🎯 7. "What-If" External Target Simulator
*Know exactly how many marks you need in the end-term exam.*
- Dynamic target slider with color-coded tickmarks displaying the exact marks required out of 60 (or 40) to unlock `O`, `A+`, `A`, `B+`, `B`, `C`, and `P`.
- Real-time grade indicator updates immediately as you slide.

### 🧠 8. AI Target SGPA Reverse-Optimizer
*Work smarter, not harder.*
- Enter your goal SGPA (e.g. `8.75` or `9.20`).
- The reverse optimizer prioritizes high-credit subjects (such as 4-credit `24SMT-341`), accounts for your current internal scores, and computes the lowest-effort external exam target for every course.
- One click applies the optimal external roadmap across all cards.

### 📈 9. Single-Subject Deep-Dive & Mobile Project Report
*Comprehensive per-course analytics on any screen size.*
- Complete breakdown of internal components, scaled marks, and percentage mastery.
- Minimum external score requirements matrix per grade tier.
- Mobile-responsive single-subject report with compact cards and visual progress bars.

### 🔮 10. Cumulative CGPA Forecaster
*Project your overall academic trajectory.*
- Input previous CGPA and completed credits.
- Instantly previews your projected new overall CGPA and net change delta (e.g. `+0.16`).

### 📸 11. Scorecard Snapshot & Verification Report
*Share your academic strategy or save for your records.*
- Generate high-resolution exportable report cards with student profile, course credit matrix, and official verification stamp.
- Export as printable format or screenshot-ready card for WhatsApp and LinkedIn.

### ⏱️ 12. Real-Time Attendance Tracker
*Protect your end-term exam eligibility.*
- Interactive attendance calculator alerting students if attendance dips below the mandatory 75% CU eligibility threshold.
- Maps attendance percentage directly to the continuous evaluation attendance marks.

### ⚡ 13. Power-User Command Palette (`Ctrl + K` / `Cmd + K`)
- Keyboard-first command bar to search subjects, toggle MNG modes, switch elective tracks, launch regex paste, or run the AI optimizer in milliseconds.

### 🔒 14. 100% Privacy-Preserving & Offline-First
- **Zero Login / Signup**: No student accounts, no passwords, no email collection.
- **Never Asks for CUIMS Credentials**: Pure clientside simulation.
- **Local Persistence**: All marks, custom cutoffs, and track preferences stay securely in your browser's `localStorage`.

### 📬 15. Instant Developer Feedback System
- In-app feedback modal integrated with instant mobile push notifications (`ntfy.sh`), allowing students to submit bug reports and feature requests directly to the maintainer.

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

## 💻 Tech Stack & Architecture

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom glassmorphic dark palette (`#09090B` Obsidian background, `#06B6D4` Cyan, `#6366F1` Indigo)
- **Icons**: Lucide React
- **Animations & Effects**: Canvas Confetti, CSS Keyframe Animations
- **Build Tool**: Vite 5
- **Notification Delivery**: Ntfy Push Notifications

---

## 🚀 Quickstart for Local Development

```bash
# 1. Clone the repository
git clone https://github.com/anujku-09/cu-gradepulse.git

# 2. Enter project directory
cd cu-gradepulse

# 3. Install dependencies
npm install

# 4. Start local development server
npm run dev

# 5. Build for production
npm run build
```

---

## 🤝 Contributing

Contributions, track updates, and feedback are always welcome!
Feel free to open an issue or submit a pull request on GitHub.

---

Developed with ❤️ for the Chandigarh University Student Community.
