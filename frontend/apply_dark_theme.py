import re

with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace the variables in the EDTECH PREMIUM SAAS OVERRIDES block
dark_theme_css = '''
/* ==============================================================
   EDTECH PREMIUM SAAS OVERRIDES (MIDNIGHT/CYAN THEME)
   ============================================================== */
:root {
  /* Brand Primary: Cyan */
  --primary: #01a3c7;
  --primary-hover: #00fff9;
  --primary-light: rgba(1, 163, 199, 0.15);
  
  /* Status */
  --success: #00fff9;
  --success-dark: #01a3c7;
  --success-light: rgba(0, 255, 249, 0.15);
  --warning: #F59E0B;
  --warning-light: rgba(245, 158, 11, 0.15);
  --danger: #EF4444;
  --danger-light: rgba(239, 68, 68, 0.15);

  /* Surfaces & Text - Using exactly the requested 5-color palette */
  --bg: #01012a;          /* Color 1: Deepest Navy/Black */
  --surface: #021a4f;     /* Slightly darker than Color 2 for beautiful cards */
  --border: #022970;      /* Color 2: Dark Navy */
  --text: #ffffff;
  --text-muted: #8ca8d1;  /* Soft light blue-gray for readability */
  --text-light: #4a6b9c;

  /* Modern Radius & Shadows */
  --radius: 16px;
  --radius-sm: 8px;
  --shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
  --shadow-md: 0 12px 40px rgba(0, 0, 0, 0.6);
  --transition: 0.2s ease;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg);
  color: var(--text);
}

/* Typography Overrides */
h1, h2, h3, h4, h5, h6 {
  color: #ffffff;
}
h1 { font-weight: 700; }
h2 { font-weight: 600; }
p { font-weight: 400; }
strong, b { font-weight: 600; }

/* ── Cards ─────────────────────────────────────── */
.section-card, .form-page-card, .quiz-card, .topic-card, .stat-card, .profile-card, .result-card, .question-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  transition: transform var(--transition), box-shadow var(--transition);
}

.stat-card:hover, .quiz-card:hover, .topic-card:hover, .topic-card-small:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: var(--primary);
}

.topic-card-small {
  border-radius: var(--radius);
  box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  background: var(--surface);
}

/* ── Primary Buttons (Subtle Gradient) ──────────── */
.btn-primary {
  background: linear-gradient(135deg, #02619e, #01a3c7);
  color: #ffffff;
  border: none;
  font-weight: 600;
  box-shadow: 0 4px 14px rgba(1, 163, 199, 0.3);
  transition: all 0.2s ease;
}
.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #01a3c7, #00fff9);
  color: #01012a; /* Dark text for bright cyan hover */
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 255, 249, 0.4);
}

.btn-secondary {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--surface);
  color: var(--primary-hover);
  border-color: var(--primary);
}

/* ── Top Navbar ─────────────────────────────────── */
.navbar {
  background: var(--surface);
  box-shadow: 0 2px 10px rgba(0,0,0,0.3);
  border-bottom: 1px solid var(--border);
}
.navbar-brand a {
  color: var(--primary-hover);
  text-shadow: 0 0 10px rgba(0, 255, 249, 0.3);
}
.navbar-links a {
  color: var(--text-muted);
}
.navbar-links a:hover {
  color: var(--primary-hover);
}
.navbar-user {
  background: var(--bg);
  padding: 0.25rem 0.5rem 0.25rem 0.75rem;
  border-radius: 999px;
  border: 1px solid var(--border);
}
.navbar-user:hover {
  border-color: var(--primary);
}
.navbar-username {
  color: var(--text);
  font-weight: 600;
}

/* ── Sidebar ─────────────────────────────────────── */
.sidebar {
  background: var(--surface);
  border-right: 1px solid var(--border);
  box-shadow: 2px 0 10px rgba(0,0,0,0.3);
}
.sidebar-link {
  color: var(--text-muted);
  border-radius: var(--radius-sm);
}
.sidebar-link-active {
  background: var(--primary-light) !important;
  color: var(--primary-hover) !important;
  font-weight: 600;
  border-left: 3px solid var(--primary-hover);
}
.sidebar-link:hover:not(.sidebar-link-active) {
  background: var(--bg) !important;
  color: var(--primary) !important;
}

/* ── Welcome Banner ──────────────────────────────── */
.welcome-section {
  background: linear-gradient(135deg, #022970, #02619e) !important;
  border: 1px solid var(--border);
}
.welcome-text h1 {
  color: #ffffff;
}
.welcome-text p {
  color: #8ca8d1;
}

/* ── Progress Bars ───────────────────────────────── */
.progress-bar-track {
  background: var(--bg);
  border-radius: 999px;
  border: 1px solid var(--border);
}
.progress-bar-fill {
  background: linear-gradient(90deg, #02619e, #00fff9);
  border-radius: 999px;
  box-shadow: 0 0 10px rgba(0, 255, 249, 0.5);
}
.progress-bar-bg {
  background: var(--bg);
  border-radius: 999px;
  height: 8px;
  width: 100%;
  overflow: hidden;
  border: 1px solid var(--border);
}
.progress-bar-bg .progress-bar-fill {
  height: 100%;
}

/* ── Forms & Tables (Dark Mode Adjustments) ──────── */
.form-group input, .form-group textarea, .form-group select, .search-bar input {
  background: var(--bg);
  color: var(--text);
  border: 1px solid var(--border);
}
.form-group input:focus, .form-group textarea:focus, .form-group select:focus, .search-bar input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--primary-light);
}
.data-table {
  background: var(--surface);
  color: var(--text);
}
.data-table th {
  background: var(--bg);
  color: var(--text-muted);
  border-bottom: 1px solid var(--border);
}
.data-table td {
  border-bottom: 1px solid var(--border);
}
.data-table tbody tr:hover {
  background: var(--bg);
}
.modal-box {
  background: var(--surface);
  border: 1px solid var(--border);
}
.modal-header {
  border-bottom: 1px solid var(--border);
}
.empty-inline {
  background: var(--bg);
  border-color: var(--border);
}
.topic-tag {
  background: var(--bg);
  color: var(--primary);
  border: 1px solid var(--border);
}

/* ── Custom Palette Colors for Icons ─────────────── */
.bg-color-1 { background: rgba(1, 1, 42, 0.8); color: #00fff9; }
.bg-color-2 { background: rgba(2, 41, 112, 0.6); color: #01a3c7; }
.bg-color-3 { background: rgba(2, 97, 158, 0.5); color: #00fff9; }
.bg-color-4 { background: rgba(1, 163, 199, 0.25); color: #00fff9; }
.bg-color-5 { background: rgba(0, 255, 249, 0.15); color: #00fff9; }

.text-color-1 { color: #00fff9; }
.text-color-2 { color: #01a3c7; }
.text-color-3 { color: #00fff9; }
.text-color-4 { color: #00fff9; }
.text-color-5 { color: #00fff9; }

/* ── Quiz Indicators ─────────────────────────────── */
.nav-bubble {
  border-width: 2px;
  cursor: default !important;
  background: var(--bg);
  color: var(--text-muted);
  border-color: var(--border);
}
.nav-bubble.current {
  background: var(--primary);
  color: #01012a;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-light);
}
.nav-bubble.answered {
  background: var(--success-light);
  color: var(--success-dark);
  border-color: var(--success-dark);
}
'''

# Remove everything from "/* ==============================================================" to the end
idx = css.find('/* ==============================================================')
if idx != -1:
    css = css[:idx]

css += dark_theme_css

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(css)
