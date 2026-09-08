import re

with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'<div className="welcome-section" style={{[^}]+}}>', '<div className="welcome-section">', content)

with open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
