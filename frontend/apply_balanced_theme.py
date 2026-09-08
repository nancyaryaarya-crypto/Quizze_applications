import re

with open('src/styles/global.css', 'r', encoding='utf-8') as f:
    css = f.read()

balanced_theme_css = '''
/* ==============================================================
   EDTECH PREMIUM SAAS OVERRIDES (BALANCED THEME)
   ============================================================== */
:root {
  /* Brand Primary */
  --primary: #02619e;
  --primary-hover: #022970;
  --primary-light: rgba(2, 97, 158, 0.1);
  
  /* Status */
  --success: #01a3c7;
  --success-dark: #02619e;
  --success-light: rgba(1, 163, 199, 0.15);
  --warning: #F59E0B;
  --warning-light: rgba(245, 158, 11, 0.15);
  --danger: #EF4444;
  --danger-light: rgba(239, 68, 68, 0.15);

  /* Surfaces & Text - Balanced Mode */
  --bg: #f0f4f9;          /* Soft, non-blinding blue-gray */
  --surface: #ffffff;     /* Crisp white cards for readability */
  --border: #dce4ed;      /* Soft border */
  --text: #01012a;        /* Palette Color 1: Very Dark Navy */
  --text-muted: #5a6e85;
  --text-light: #94a3b8;

  /* Modern Radius & Shadows */
  --radius: 16px;
  --radius-sm: 8px;
  --shadow: 0 4px 20px rgba(1, 1, 42, 0.04);
  --shadow-md: 0 8px 30px rgba(1, 1, 42, 0.08);
  --transition: 0.2s ease;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--bg);
  color: var(--text);
}

/* Typography Overrides */
h1, h2, h3, h4, h5, h6 { color: var(--text); }
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
  border-color: var(--primary-light);
}

.topic-card-small {
  border-radius: var(--radius);
  box-shadow: var(--shadow);
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
  background: linear-gradient(135deg, #022970, #02619e);
  color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(2, 41, 112, 0.3);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text);
  border: 1px solid var(--border);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--bg);
  color: var(--primary-hover);
  border-color: var(--primary);
}

/* ── Top Navbar ─────────────────────────────────── */
.navbar {
  background: var(--surface);
  box-shadow: 0 1px 4px rgba(1, 1, 42, 0.05);
  border-bottom: 1px solid var(--border);
}
.navbar-brand a {
  color: var(--primary-hover);
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
  border-color: var(--primary-light);
}
.navbar-username {
  color: var(--text);
  font-weight: 600;
}

/* ── Sidebar (Dark Mode for Balance) ────────────── */
.sidebar {
  background: #01012a !important; /* Palette Color 1 */
  border-right: 1px solid #022970 !important; /* Palette Color 2 */
}
.sidebar-logo {
  color: #00fff9 !important; /* Palette Color 5 */
  border-bottom: 1px solid #022970 !important;
}
.sidebar-link {
  color: #8ca8d1 !important;
}
.sidebar-link-active {
  background: rgba(0, 255, 249, 0.1) !important;
  color: #00fff9 !important; /* Palette Color 5 */
  border-left: 3px solid #00fff9 !important;
}
.sidebar-link:hover:not(.sidebar-link-active) {
  background: rgba(2, 97, 158, 0.3) !important;
  color: #ffffff !important;
}
.sidebar-logout {
  border-color: #022970 !important;
  color: #8ca8d1 !important;
}
.sidebar-logout:hover {
  background: rgba(239, 68, 68, 0.1) !important;
  color: #EF4444 !important;
}

/* ── Welcome Banner (Dark Premium Feel) ─────────── */
.welcome-section {
  background: linear-gradient(135deg, #022970, #02619e) !important; /* Palette Colors 2 & 3 */
  border: none;
  box-shadow: var(--shadow-md);
}
.welcome-text h1 {
  color: #ffffff !important;
}
.welcome-text p {
  color: #e0faff !important;
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

/* ── Forms & Tables (Reset from Dark Mode) ──────── */
.form-group input, .form-group textarea, .form-group select, .search-bar input {
  background: var(--surface);
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
.bg-color-1 { background: rgba(1, 1, 42, 0.08); color: #01012a; }
.bg-color-2 { background: rgba(2, 41, 112, 0.08); color: #022970; }
.bg-color-3 { background: rgba(2, 97, 158, 0.1); color: #02619e; }
.bg-color-4 { background: rgba(1, 163, 199, 0.15); color: #01a3c7; }
.bg-color-5 { background: rgba(0, 255, 249, 0.2); color: #00b3b0; }

.text-color-1 { color: #01012a; }
.text-color-2 { color: #022970; }
.text-color-3 { color: #02619e; }
.text-color-4 { color: #01a3c7; }
.text-color-5 { color: #00b3b0; }

/* ── Quiz Indicators ─────────────────────────────── */
.nav-bubble {
  border-width: 2px;
  cursor: default !important;
  background: var(--surface);
  color: var(--text-muted);
  border-color: var(--border);
}
.nav-bubble.current {
  background: var(--primary);
  color: #ffffff;
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

css += balanced_theme_css

with open('src/styles/global.css', 'w', encoding='utf-8') as f:
    f.write(css)
