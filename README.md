# CU GradePulse | CUIMS Grade Matrix

> **Next-Generation Academic Intelligence & SGPA/CGPA Simulation Platform for Chandigarh University (CSE) Students**

Designed with a **Spatial Glassmorphic Bento-Grid** architecture in Deep Obsidian Dark Mode (`#09090B`), CU GradePulse eliminates the guesswork from CUIMS raw marks scaling and external end-term target setting.

---

## ⚡ Core Capabilities

### 1. True Weighted Scaling Engine
On the CUIMS portal, raw marks are uploaded out of maximums such as 30, 20, 15, 12, 6, etc.
CU GradePulse implements the precise formula:
$$\text{Weighted Score} = \left(\frac{\text{Raw Obtained}}{\text{Raw Max}}\right) \times \text{Weightage}$$

### 2. Pre-Loaded Semester V Matrix (9 Courses)
- **Group A: Core Marks-Based Courses (6 Courses — 16 Credits)**
  - `24CSP-305` **Competitive Coding-II** (2.0 Cr | Practical: 10 Exps raw 30 $\rightarrow$ 4.5 each + Mid-Term raw 15 $\rightarrow$ 15 + Viva raw 40 $\rightarrow$ 40)
  - `24CSP-304` **Full Stack Development - II** (1.0 Cr | Practical: 10 Exps raw 30 $\rightarrow$ 4.5 each + Mid-Term raw 15 $\rightarrow$ 15 + Viva raw 40 $\rightarrow$ 40)
  - `24CSH-301` **Project Based Learning in Java** (3.0 Cr | Hybrid: Practical Eval raw 40 $\rightarrow$ 20 + 10 Worksheets raw 30 $\rightarrow$ 2 each + Practical MST raw 10 $\rightarrow$ 4 + MST-1 raw 20 $\rightarrow$ 5 + MST-2 raw 20 $\rightarrow$ 5 + Assignment raw 10 $\rightarrow$ 6 + Surprise Test raw 12 $\rightarrow$ 4 + Quiz raw 4 $\rightarrow$ 4 + Attendance raw 2 $\rightarrow$ 2 + End Term Theory raw 60 $\rightarrow$ 30)
  - `24SMT-341` **Probability and Statistics** (4.0 Cr | Theory: MST-1 raw 20 $\rightarrow$ 10 + MST-2 raw 20 $\rightarrow$ 10 + Assignment raw 10 $\rightarrow$ 10 + Surprise Test raw 12 $\rightarrow$ 4 + Quiz raw 4 $\rightarrow$ 4 + Attendance raw 2 $\rightarrow$ 2 + External Theory raw 60 $\rightarrow$ 60)
  - `24CST-351` **Web Development Fundamentals** (3.0 Cr | Theory: Same assessment model as 24SMT-341)
  - `24CST-302` **Computer Networks** (3.0 Cr | Theory: Same assessment model as 24SMT-341)

- **Group B: Direct Grade Assumption (1 Course — 3 Credits)**
  - `PE-5` **Professional Elective (Cloud / AI / Cyber)** (3.0 Cr | Direct grade pill selector from `A+ [10]` to `F [0]`)

- **Group C: Dual-Mode Courses (2 Courses — 2 Credits Each)**
  - `24TDP-311` **Soft Skills-III** (2.0 Cr | Practical: Write X raw 10 $\rightarrow$ 10 + Presentation raw 10 $\rightarrow$ 10 + LMS Attendance raw 4 $\rightarrow$ 4 + 3 Quizzes raw 6 $\rightarrow$ 2 each + 3 Live Assignments raw 30 $\rightarrow$ 10 each + Viva raw 40 $\rightarrow$ 40)
  - `24TDT-312` **Aptitude-III** (2.0 Cr | Theory: MST-1 raw 20 $\rightarrow$ 10 + MST-2 raw 20 $\rightarrow$ 10 + Assignment raw 12 $\rightarrow$ 6 + Quiz raw 6 $\rightarrow$ 6 + Surprise Test raw 12 $\rightarrow$ 4 + Attendance raw 4 $\rightarrow$ 4 + External Theory raw 60 $\rightarrow$ 60)
  - **Batch Track Switch (`MNG` vs `Graded`):**
    - **Non-Graded (`MNG`):** Students enter marks to test qualifying threshold ($\ge 40/100$). Credits ($2 + 2 = 4$) excluded from SGPA denominator ($19.0$ credits total). If $< 40$, prominent backlog warning is triggered!
    - **Graded:** 10-point scale applied, credits ($2 + 2 = 4$) included in SGPA calculation ($23.0$ credits total).

---

## 🚀 Advanced Features

1. **"What-If" External Target Slider with Live Cutoff Tickmarks:**
   - Visual tickmarks along the slider track showing exact external marks needed to unlock `C`, `B`, `B+`, `A`, and `A+`.
2. **CU Relative Grading Simulator:**
   - Switch between **Standard** (A+ $\ge$ 88), **Lenient / Tough Paper** (A+ $\ge$ 82), and **Strict / Easy Paper** (A+ $\ge$ 92), with per-course custom cutoff overrides.
3. **AI Target SGPA Reverse-Optimizer:**
   - Enter your target SGPA (e.g. `8.80`). The optimizer analyzes your internal marks and credit weights (prioritizing 4-credit `24SMT-341`) to generate the lowest-effort external roadmap. One click applies it to all sliders.
4. **Cumulative CGPA Forecaster:**
   - Input your previous CGPA and completed credits to see real-time overall CGPA shift and delta (e.g. `+0.16`).
5. **CUIMS Smart Paste Parser:**
   - Copy any marks table from CUIMS and paste into the parser. Regex extraction automatically detects course codes, assessment names, and maps raw scores.
6. **Command Palette (`Ctrl + K` / `Cmd + K`):**
   - Instant keyboard-driven navigation to search subjects, toggle MNG, auto-fill presets, or run AI optimizer.
7. **Scorecard Snapshot:**
   - High-resolution exportable PNG or printable PDF card with student profile, course table, credit breakdown, and verification stamp.

---

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build & verification
npm run build
```
