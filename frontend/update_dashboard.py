import re

with open('src/pages/student/StudentDashboard.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Update welcome section styles
content = content.replace(
    '<div className="welcome-section">',
    '<div className="welcome-section" style={{ background: "linear-gradient(135deg, #EEF2FF, #F5F3FF, #ECFEFF)" }}>'
)

# Replace the topics array
topics_old = """  const recommendedTopics = [
    { icon: "🐍", name: "Python", desc: "Learn backend basics" },
    { icon: "⚛️", name: "React", desc: "Build modern UIs" },
    { icon: "📜", name: "JavaScript", desc: "Master web logic" },
    { icon: "🎨", name: "HTML & CSS", desc: "Structure & style" },
    { icon: "🗄️", name: "SQL", desc: "Database mastery" },
  ];"""
topics_new = """  const recommendedTopics = [
    { icon: "🐍", name: "Python", desc: "Learn backend basics", color: "emerald" },
    { icon: "⚛️", name: "React", desc: "Build modern UIs", color: "blue" },
    { icon: "📜", name: "JavaScript", desc: "Master web logic", color: "amber" },
    { icon: "🎨", name: "HTML & CSS", desc: "Structure & style", color: "violet" },
    { icon: "🗄️", name: "SQL", desc: "Database mastery", color: "indigo" },
  ];"""
content = content.replace(topics_old, topics_new)

# Update rendering of topics
topic_card_old = '<div className="topic-icon">{topic.icon}</div>'
topic_card_new = '<div className={`topic-icon stat-icon-wrap bg-${topic.color} text-${topic.color}`} style={{ width: "48px", height: "48px", fontSize: "1.2rem", marginRight: "1rem" }}>{topic.icon}</div>'
content = content.replace(topic_card_old, topic_card_new)

# Update stat cards
content = content.replace(
    '<div className="stat-icon-wrap bg-blue">📚</div>',
    '<div className="stat-icon-wrap bg-indigo text-indigo">📚</div>'
)
content = content.replace(
    '<div className="stat-icon-wrap bg-green">✅</div>',
    '<div className="stat-icon-wrap bg-emerald text-emerald">✅</div>'
)
content = content.replace(
    '<div className="stat-icon-wrap bg-purple">🏆</div>',
    '<div className="stat-icon-wrap bg-violet text-violet">🏆</div>'
)
content = content.replace(
    '<div className="stat-icon-wrap bg-orange">📈</div>',
    '<div className="stat-icon-wrap bg-cyan text-cyan">📈</div>'
)

with open('src/pages/student/StudentDashboard.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
