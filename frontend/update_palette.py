import re

with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update welcome section gradient to match the new palette tones
content = content.replace(
    'linear-gradient(135deg, #EEF2FF, #F5F3FF, #ECFEFF)',
    'linear-gradient(135deg, #f0f7fa, #e6f5fa, #e0faff)'
)

# Replace the topic colors
content = content.replace('color: "emerald"', 'color: "color-2"')
content = content.replace('color: "blue"', 'color: "color-3"')
content = content.replace('color: "amber"', 'color: "color-4"')
content = content.replace('color: "violet"', 'color: "color-5"')
content = content.replace('color: "indigo"', 'color: "color-2"')

# Update stat cards
content = content.replace('bg-indigo text-indigo', 'bg-color-2 text-color-2')
content = content.replace('bg-emerald text-emerald', 'bg-color-3 text-color-3')
content = content.replace('bg-violet text-violet', 'bg-color-4 text-color-4')
content = content.replace('bg-cyan text-cyan', 'bg-color-5 text-color-5')

with open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
