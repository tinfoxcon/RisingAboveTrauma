"use client";

const W = 1560;
const H = 2820;

// ─── Color Palette ────────────────────────────────────────────────────────────
const C = {
  entry: "#475569",
  auth: "#2563EB",
  authDark: "#1D4ED8",
  onboard: "#7C3AED",
  tabs: "#065F46",
  tabCard: "#059669",
  feature: "#0E7490",
  featureAlt: "#0369A1",
  checkin: "#B45309",
  checkinStep: "#D97706",
  emergency: "#DC2626",
  highRisk: "#B91C1C",
  course: "#6D28D9",
  journal: "#BE185D",
  calm: "#0891B2",
  safety: "#15803D",
  line: "#94A3B8",
  bg: "#F8FAFC",
  sectionBg: "rgba(255,255,255,0.6)",
};

// ─── SVG Helpers ──────────────────────────────────────────────────────────────
function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  color = C.entry,
  textColor = "#fff",
  rx = 10,
  opacity = 1,
}) {
  const labelY = sub ? y + h / 2 - 8 : y + h / 2;
  return (
    <g opacity={opacity}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={rx}
        fill={color}
        filter="url(#shadow)"
      />
      <text
        x={x + w / 2}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={13}
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={textColor}
          fontSize={10}
          fontFamily="Inter, sans-serif"
          opacity={0.85}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Diamond({ x, y, w, h, label, color = C.entry, textColor = "#fff" }) {
  const cx = x + w / 2,
    cy = y + h / 2;
  const pts = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
  return (
    <g>
      <polygon points={pts} fill={color} filter="url(#shadow)" />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize={12}
        fontWeight="700"
        fontFamily="Inter, sans-serif"
      >
        {label}
      </text>
    </g>
  );
}

// Straight or L-shaped arrow
function Arrow({ points, label, color = C.line, dashed = false }) {
  if (!points || points.length < 2) return null;
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 1; i < points.length; i++)
    d += ` L${points[i][0]},${points[i][1]}`;
  const mid = points[Math.floor(points.length / 2)];
  return (
    <g>
      <path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth={1.8}
        strokeDasharray={dashed ? "6 4" : undefined}
        markerEnd="url(#arrowhead)"
      />
      {label && (
        <text
          x={mid[0] + 5}
          y={mid[1] - 5}
          fill={color}
          fontSize={10}
          fontFamily="Inter, sans-serif"
          fontStyle="italic"
        >
          {label}
        </text>
      )}
    </g>
  );
}

function SectionLabel({ x, y, label, color }) {
  return (
    <text
      x={x}
      y={y}
      fill={color}
      fontSize={12}
      fontWeight="800"
      fontFamily="Inter, sans-serif"
      letterSpacing="2"
      textTransform="uppercase"
      opacity={0.7}
    >
      {label.toUpperCase()}
    </text>
  );
}

function SectionBg({ x, y, w, h, color, label }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={14}
        fill={color}
        stroke="rgba(0,0,0,0.06)"
        strokeWidth={1}
      />
      {label && (
        <text
          x={x + 14}
          y={y + 20}
          fill="rgba(0,0,0,0.35)"
          fontSize={11}
          fontWeight="700"
          fontFamily="Inter, sans-serif"
          letterSpacing="1.5"
        >
          {label.toUpperCase()}
        </text>
      )}
    </g>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────
const LEGEND = [
  { color: C.entry, label: "Entry / Routing" },
  { color: C.auth, label: "Auth Screens" },
  { color: C.onboard, label: "Onboarding" },
  { color: C.tabCard, label: "Main Tabs" },
  { color: C.feature, label: "Feature Screens" },
  { color: C.checkinStep, label: "Check-In Flow" },
  { color: C.emergency, label: "Emergency / High-Risk" },
  { color: C.course, label: "Course Flow" },
  { color: C.journal, label: "Journal / Tracker" },
  { color: C.calm, label: "Calm & Safety Tools" },
];

// ─── Main Flowchart ───────────────────────────────────────────────────────────
export default function FlowchartPage() {
  return (
    <div
      style={{
        background: C.bg,
        minHeight: "100vh",
        padding: "24px 16px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {/* Page Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1
          style={{ fontSize: 26, fontWeight: 800, color: "#1E293B", margin: 0 }}
        >
          App Flowchart
        </h1>
        <p style={{ color: "#64748B", marginTop: 4, fontSize: 14 }}>
          Full navigation & feature map — scroll down to explore
        </p>
      </div>

      {/* Legend */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px 18px",
          justifyContent: "center",
          marginBottom: 24,
          padding: "12px 20px",
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
          maxWidth: 900,
          margin: "0 auto 28px",
        }}
      >
        {LEGEND.map((l) => (
          <div
            key={l.label}
            style={{ display: "flex", alignItems: "center", gap: 7 }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: l.color,
              }}
            />
            <span style={{ fontSize: 12, color: "#374151", fontWeight: 500 }}>
              {l.label}
            </span>
          </div>
        ))}
      </div>

      {/* SVG Canvas */}
      <div style={{ overflowX: "auto" }}>
        <svg
          width={W}
          height={H}
          viewBox={`0 0 ${W} ${H}`}
          style={{ display: "block", margin: "0 auto", maxWidth: "100%" }}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="8"
              markerHeight="8"
              refX="6"
              refY="3"
              orient="auto"
            >
              <path d="M0,0 L0,6 L8,3 z" fill={C.line} />
            </marker>
            <filter id="shadow" x="-5%" y="-5%" width="115%" height="130%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="2"
                floodOpacity="0.13"
              />
            </filter>
          </defs>

          {/* ═══════════════════════════════════════════════
              SECTION 1 — ENTRY & AUTH
          ═══════════════════════════════════════════════ */}
          <SectionBg
            x={10}
            y={10}
            w={W - 20}
            h={580}
            color="rgba(241,245,249,0.9)"
            label="Entry & Auth Flow"
          />

          {/* App Launch */}
          <Box
            x={670}
            y={40}
            w={200}
            h={52}
            label="App Launch"
            color={C.entry}
          />

          {/* Router Decision */}
          <Diamond
            x={650}
            y={145}
            w={240}
            h={65}
            label="Router Decision"
            color={C.entry}
          />

          {/* Launch → Router */}
          <Arrow
            points={[
              [770, 92],
              [770, 145],
            ]}
          />

          {/* Three branches from router */}
          {/* Branch labels */}
          <text
            x={250}
            y={235}
            textAnchor="middle"
            fill={C.auth}
            fontSize={11}
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            Not logged in
          </text>
          <text
            x={770}
            y={235}
            textAnchor="middle"
            fill={C.onboard}
            fontSize={11}
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            Logged in, not onboarded
          </text>
          <text
            x={1280}
            y={235}
            textAnchor="middle"
            fill={C.tabCard}
            fontSize={11}
            fontWeight="600"
            fontFamily="Inter, sans-serif"
          >
            Logged in + onboarded
          </text>

          {/* Router → Splash (left) */}
          <Arrow
            points={[
              [650, 178],
              [250, 178],
              [250, 250],
            ]}
            color={C.auth}
          />
          {/* Router → Onboarding (center) */}
          <Arrow
            points={[
              [770, 210],
              [770, 250],
            ]}
            color={C.onboard}
          />
          {/* Router → Tabs (right — direct) */}
          <Arrow
            points={[
              [890, 178],
              [1280, 178],
              [1280, 250],
            ]}
            color={C.tabCard}
          />

          {/* AUTH LEFT BRANCH */}
          <Box
            x={130}
            y={250}
            w={240}
            h={52}
            label="Splash Screen"
            sub="911 · Quick Exit · Sign In · Sign Up"
            color={C.auth}
          />
          <Box
            x={60}
            y={370}
            w={150}
            h={50}
            label="Sign In"
            color={C.authDark}
          />
          <Box
            x={260}
            y={370}
            w={150}
            h={50}
            label="Sign Up"
            color={C.authDark}
          />

          {/* Splash → Sign In / Sign Up */}
          <Arrow
            points={[
              [185, 302],
              [185, 330],
              [135, 330],
              [135, 370],
            ]}
            color={C.auth}
            label="sign in"
          />
          <Arrow
            points={[
              [315, 302],
              [315, 330],
              [335, 330],
              [335, 370],
            ]}
            color={C.auth}
            label="sign up"
          />

          {/* Sign In → Router (success) */}
          <Arrow
            points={[
              [135, 420],
              [60, 420],
              [60, 520],
              [580, 520],
            ]}
            color={C.auth}
            dashed
            label="success → re-routes"
          />
          {/* Sign Up → Onboarding */}
          <Arrow
            points={[
              [410, 395],
              [610, 395],
              [610, 250],
            ]}
            color={C.authDark}
            dashed
            label="success → onboarding"
          />

          {/* ONBOARDING CENTER BRANCH */}
          <Box
            x={610}
            y={250}
            w={320}
            h={52}
            label="Onboarding Wizard"
            sub="Intro · Privacy · Choose Path · Children · Quick Exit setup"
            color={C.onboard}
          />
          {/* Onboarding → Tabs */}
          <Arrow
            points={[
              [770, 302],
              [770, 520],
            ]}
            color={C.onboard}
            dashed
            label="complete"
          />

          {/* DIRECT TO TABS (right) */}
          <Box
            x={1160}
            y={250}
            w={240}
            h={52}
            label="Already Authenticated"
            sub="Skip directly to Main Tabs"
            color={C.tabCard}
          />
          <Arrow
            points={[
              [1280, 302],
              [1280, 520],
            ]}
            color={C.tabCard}
          />

          {/* ═══════════════════════════════════════════════
              SECTION 2 — MAIN TABS
          ═══════════════════════════════════════════════ */}
          <SectionBg
            x={10}
            y={590}
            w={W - 20}
            h={140}
            color="rgba(209,250,229,0.5)"
            label="Main Tab Bar"
          />

          {/* Convergence arrow to tabs */}
          <Arrow
            points={[
              [770, 520],
              [770, 590],
            ]}
            color={C.line}
          />

          {/* Tab buttons */}
          {[
            { x: 80, label: "🏠 Home", sub: "Hub screen" },
            { x: 380, label: "📊 Status", sub: "→ Path Switcher" },
            { x: 680, label: "⬆️ Rise", sub: "Subscriptions" },
            { x: 980, label: "📚 Resources", sub: "US & International" },
            { x: 1280, label: "🎓 Learn", sub: "Courses + Legal + Rights" },
          ].map(({ x, label, sub }, i) => (
            <g key={i}>
              <Box
                x={x}
                y={620}
                w={240}
                h={68}
                label={label}
                sub={sub}
                color={C.tabCard}
              />
              {/* Arrow from convergence bar to each tab (except home which already got its arrow) */}
              <Arrow
                points={[
                  [770, 590],
                  [x + 120, 590],
                  [x + 120, 620],
                ]}
                color={C.tabCard}
              />
            </g>
          ))}

          {/* ═══════════════════════════════════════════════
              SECTION 3 — HOME TAB FEATURES
          ═══════════════════════════════════════════════ */}
          <SectionBg
            x={10}
            y={760}
            w={700}
            h={420}
            color="rgba(224,242,254,0.6)"
            label="Home Tab → Feature Screens"
          />

          {/* Arrow from Home tab */}
          <Arrow
            points={[
              [200, 688],
              [200, 780],
            ]}
            color={C.feature}
          />

          {/* Feature grid */}
          {[
            {
              x: 30,
              y: 780,
              label: "⚙️ Settings",
              sub: "Notifications, Security…",
              color: C.featureAlt,
            },
            {
              x: 230,
              y: 780,
              label: "🔀 Path Switcher",
              sub: "still_in_it / just_left / rebuild",
              color: C.featureAlt,
            },
            {
              x: 430,
              y: 780,
              label: "🧘 Calm & Affirmations",
              sub: "Guided breathing + quotes",
              color: C.calm,
            },
            {
              x: 30,
              y: 900,
              label: "🗺️ Pattern Map",
              sub: "Visualize abuse patterns",
              color: C.feature,
            },
            {
              x: 230,
              y: 900,
              label: "📋 Check-In History",
              sub: "Past check-in records",
              color: C.feature,
            },
            {
              x: 430,
              y: 900,
              label: "🔒 Safety Plan",
              sub: "Docs · Safe people · Exits",
              color: C.safety,
            },
            {
              x: 30,
              y: 1020,
              label: "📁 Evidence Export",
              sub: "🔐 Shield/Rise only",
              color: C.featureAlt,
            },
            {
              x: 230,
              y: 1020,
              label: "📝 Scripts Library",
              sub: "🔐 Shield/Rise only",
              color: C.featureAlt,
            },
            {
              x: 430,
              y: 1020,
              label: "📓 My Journal",
              sub: "→ Clarity Journal + Growth",
              color: C.journal,
            },
          ].map(({ x, y, label, sub, color }, i) => (
            <Box
              key={i}
              x={x}
              y={y}
              w={185}
              h={62}
              label={label}
              sub={sub}
              color={color}
            />
          ))}

          {/* ═══════════════════════════════════════════════
              SECTION 3b — LEARN TAB FEATURES
          ═══════════════════════════════════════════════ */}
          <SectionBg
            x={720}
            y={760}
            w={830}
            h={420}
            color="rgba(237,233,254,0.6)"
            label="Learn Tab → Course Flow"
          />

          <Arrow
            points={[
              [1400, 688],
              [1400, 790],
            ]}
            color={C.course}
          />

          {/* Learn content tabs */}
          <Box
            x={730}
            y={790}
            w={280}
            h={55}
            label="Learn Internal Tabs"
            sub="Courses · Legal · Rights · Podcast · Workplace…"
            color={C.course}
          />

          {/* Course flow */}
          <Box
            x={1100}
            y={790}
            w={200}
            h={55}
            label="Course List"
            sub="5 Healing to Freedom courses"
            color={C.course}
          />
          <Arrow
            points={[
              [1010, 818],
              [1100, 818],
            ]}
            color={C.course}
            label="tap course"
          />

          <Box
            x={1100}
            y={910}
            w={200}
            h={55}
            label="Course Detail"
            sub="Overview + lessons"
            color={C.course}
          />
          <Arrow
            points={[
              [1200, 845],
              [1200, 910],
            ]}
            color={C.course}
          />

          <Box
            x={870}
            y={910}
            w={180}
            h={55}
            label="Lesson Player"
            sub="Content + navigation"
            color={C.course}
          />
          <Arrow
            points={[
              [1100, 938],
              [1050, 938],
            ]}
            color={C.course}
            label="open lesson"
          />

          <Box
            x={1100}
            y={1030}
            w={200}
            h={55}
            label="Quiz"
            sub="Pass to earn cert"
            color={C.course}
          />
          <Arrow
            points={[
              [1200, 965],
              [1200, 1030],
            ]}
            color={C.course}
          />

          <Box
            x={1100}
            y={1140}
            w={200}
            h={55}
            label="Certificate 🎓"
            sub="Earned on quiz pass"
            color={C.course}
          />
          <Arrow
            points={[
              [1200, 1085],
              [1200, 1140],
            ]}
            color={C.course}
          />

          {/* ═══════════════════════════════════════════════
              SECTION 4 — CHECK-IN FLOW
          ═══════════════════════════════════════════════ */}
          <SectionBg
            x={10}
            y={1220}
            w={W - 20}
            h={1220}
            color="rgba(254,243,199,0.6)"
            label="60-Second Check-In Flow"
          />

          {/* Arrow from Home → Check-In */}
          <Arrow
            points={[
              [200, 1150],
              [200, 1240],
            ]}
            color={C.checkin}
            dashed
            label="start check-in"
          />

          {/* STEP 1 */}
          <Box
            x={80}
            y={1240}
            w={260}
            h={70}
            label="Step 1 — What Happened?"
            sub="Consent gate · Choose incident type · Path confirmation"
            color={C.checkinStep}
          />

          <Arrow
            points={[
              [210, 1310],
              [210, 1390],
            ]}
            color={C.checkin}
          />

          {/* STEP 2 */}
          <Box
            x={80}
            y={1390}
            w={260}
            h={70}
            label="Step 2 — Select Behaviors"
            sub="Multi-select chips · Assailant info · Danger flag detection"
            color={C.checkinStep}
          />

          {/* Branch from step 2 */}
          <text
            x={400}
            y={1415}
            fill={C.highRisk}
            fontSize={11}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            danger behaviors
          </text>
          <text
            x={400}
            y={1445}
            fill={C.checkin}
            fontSize={11}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            safe behaviors
          </text>

          {/* Danger → High Risk */}
          <Arrow
            points={[
              [340, 1415],
              [500, 1415],
              [500, 1380],
              [580, 1380],
            ]}
            color={C.highRisk}
          />
          <Box
            x={580}
            y={1355}
            w={230}
            h={70}
            label="⚠️ High-Risk Warning"
            sub="Call 911 · DV Hotline · Continue safely"
            color={C.highRisk}
          />

          {/* Safe → Step 3 */}
          <Arrow
            points={[
              [210, 1460],
              [210, 1540],
            ]}
            color={C.checkin}
          />

          {/* High Risk → Step 3 */}
          <Arrow
            points={[
              [695, 1425],
              [695, 1540],
              [470, 1540],
            ]}
            color={C.highRisk}
            dashed
            label="continue check-in"
          />

          {/* STEP 3 */}
          <Box
            x={80}
            y={1540}
            w={260}
            h={70}
            label="Step 3 — Safety Rating"
            sub="Rate 1–5 how safe you feel right now"
            color={C.checkinStep}
          />

          {/* Three branches from step 3 */}
          <text
            x={400}
            y={1560}
            fill={C.emergency}
            fontSize={11}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Rating = 1 (Very Unsafe)
          </text>
          <text
            x={400}
            y={1595}
            fill={C.checkin}
            fontSize={11}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Rating = 2–4
          </text>
          <text
            x={400}
            y={1630}
            fill={C.calm}
            fontSize={11}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            Rating = 5 (Safe) → exits to Calm
          </text>

          {/* Rating 1 → Emergency */}
          <Arrow
            points={[
              [340, 1560],
              [580, 1560],
              [580, 1620],
            ]}
            color={C.emergency}
          />

          {/* Rating 5 → Calm */}
          <Arrow
            points={[
              [340, 1590],
              [900, 1590],
              [900, 1660],
            ]}
            color={C.calm}
          />
          <Box
            x={800}
            y={1660}
            w={200}
            h={60}
            label="🧘 Calm Screen"
            sub="Exits check-in flow"
            color={C.calm}
          />

          {/* Emergency */}
          <Box
            x={480}
            y={1620}
            w={260}
            h={70}
            label="🚨 Emergency Screen"
            sub="Call 911 · DV Hotline · Not Safe message"
            color={C.emergency}
          />

          {/* Rating 2-4 → Step 4 */}
          <Arrow
            points={[
              [210, 1610],
              [210, 1690],
            ]}
            color={C.checkin}
          />
          {/* Emergency → Step 4 */}
          <Arrow
            points={[
              [610, 1690],
              [610, 1750],
              [470, 1750],
            ]}
            color={C.emergency}
            dashed
            label="continue check-in"
          />

          {/* STEP 4 */}
          <Box
            x={80}
            y={1690}
            w={260}
            h={70}
            label="Step 4 — What Do You Need?"
            sub="Calm · Safety Plan · Learn · Help Now · Just Finish"
            color={C.checkinStep}
          />

          {/* Step 4 branches */}
          <text
            x={400}
            y={1710}
            fill={C.emergency}
            fontSize={11}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            "Help Now" → Emergency
          </text>
          <text
            x={400}
            y={1740}
            fill={C.calm}
            fontSize={11}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            "Calm" → Calm screen
          </text>
          <text
            x={400}
            y={1770}
            fill={C.safety}
            fontSize={11}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            "Safety Plan" → Safety Plan screen
          </text>
          <text
            x={400}
            y={1800}
            fill={C.checkin}
            fontSize={11}
            fontWeight="700"
            fontFamily="Inter, sans-serif"
          >
            "Finish" → Step 5
          </text>

          <Arrow
            points={[
              [340, 1707],
              [480, 1707],
              [480, 1688],
            ]}
            color={C.emergency}
          />
          <Arrow
            points={[
              [210, 1760],
              [210, 1840],
            ]}
            color={C.checkin}
          />

          {/* STEP 5 */}
          <Box
            x={80}
            y={1840}
            w={260}
            h={70}
            label="Step 5 — Private Notes"
            sub="Prompt snippets · Free-text notes · Save to DB"
            color={C.checkinStep}
          />

          <Arrow
            points={[
              [210, 1910],
              [210, 1990],
            ]}
            color={C.checkin}
          />

          {/* COMPLETE */}
          <Box
            x={80}
            y={1990}
            w={260}
            h={70}
            label="✅ Check-In Complete"
            sub="Confirmation · Motivational quote · What's Next?"
            color="#15803D"
          />

          {/* Complete → next steps */}
          {[
            { x: 430, y: 2000, label: "🗺️ Pattern Map", color: C.feature },
            { x: 620, y: 2000, label: "📋 Check-In History", color: C.feature },
            { x: 810, y: 2000, label: "🔒 Safety Plan", color: C.safety },
            { x: 1000, y: 2000, label: "🏠 Back to Home", color: C.tabCard },
          ].map(({ x, y, label, color }, i) => (
            <g key={i}>
              <Box x={x} y={y} w={175} h={52} label={label} color={color} />
              <Arrow
                points={[
                  [340, 2025],
                  [x + 88, 2025],
                  [x + 88, 2000],
                ]}
                color={color}
              />
            </g>
          ))}

          {/* ═══════════════════════════════════════════════
              SECTION 5 — JOURNAL & TRACKERS
          ═══════════════════════════════════════════════ */}
          <SectionBg
            x={10}
            y={2460}
            w={W - 20}
            h={330}
            color="rgba(252,231,243,0.6)"
            label="Journal & Tracker Screens"
          />

          <Arrow
            points={[
              [517, 1082],
              [517, 2490],
            ]}
            color={C.journal}
            dashed
          />

          {[
            {
              x: 30,
              y: 2490,
              label: "📒 Clarity Journal History",
              sub: "Victory · Hard Day entries",
              color: C.journal,
            },
            {
              x: 270,
              y: 2490,
              label: "✍️ Clarity Journal Entry",
              sub: "Multi-step guided journal",
              color: C.journal,
            },
            {
              x: 510,
              y: 2490,
              label: "📈 Growth Tracker",
              sub: "Behaviors · Feelings · Rating",
              color: C.journal,
            },
            {
              x: 750,
              y: 2490,
              label: "📊 Growth Tracker History",
              sub: "Past growth entries",
              color: C.journal,
            },
            {
              x: 990,
              y: 2490,
              label: "🕵️ Pattern Tracker",
              sub: "Incidents · Patterns · Export",
              color: C.feature,
            },
            {
              x: 1230,
              y: 2490,
              label: "📤 Pattern Tracker History",
              sub: "Past tracked entries",
              color: C.feature,
            },
          ].map(({ x, y, label, sub, color }, i) => (
            <Box
              key={i}
              x={x}
              y={y}
              w={225}
              h={70}
              label={label}
              sub={sub}
              color={color}
            />
          ))}

          {/* Safety plan history row */}
          {[
            {
              x: 30,
              y: 2620,
              label: "🛡️ Safety Plan View",
              sub: "Current plan display",
              color: C.safety,
            },
            {
              x: 270,
              y: 2620,
              label: "📜 Safety Plan History",
              sub: "Past versions",
              color: C.safety,
            },
            {
              x: 510,
              y: 2620,
              label: "📄 Terms of Use",
              sub: "Legal agreement screen",
              color: C.entry,
            },
            {
              x: 750,
              y: 2620,
              label: "🌱 Rebuild Welcome",
              sub: "Rebuild path intro",
              color: C.onboard,
            },
            {
              x: 990,
              y: 2620,
              label: "📖 Understanding Leaving",
              sub: "Why leaving takes time",
              color: C.onboard,
            },
            {
              x: 1230,
              y: 2620,
              label: "🌟 Your Next Chapter",
              sub: "Post-leaving guidance",
              color: C.onboard,
            },
          ].map(({ x, y, label, sub, color }, i) => (
            <Box
              key={i}
              x={x}
              y={y}
              w={225}
              h={70}
              label={label}
              sub={sub}
              color={color}
            />
          ))}

          {/* Footer note */}
          <text
            x={W / 2}
            y={2800}
            textAnchor="middle"
            fill="#94A3B8"
            fontSize={11}
            fontFamily="Inter, sans-serif"
          >
            🔒 Shield/Rise = subscription-gated features · 🚨 SafetyButtons (911
            + Quick Exit) appear on most screens
          </text>
        </svg>
      </div>

      {/* Key notes */}
      <div
        style={{
          maxWidth: 900,
          margin: "32px auto 0",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 14,
        }}
      >
        {[
          {
            icon: "🔄",
            title: "Router Decision",
            desc: "Every app open routes through index.jsx — it decides Splash, Onboarding, or Tabs based on auth + onboarding state.",
          },
          {
            icon: "🔒",
            title: "Auto Sign-Out",
            desc: "When the app goes to the background, the root layout automatically signs the user out for safety.",
          },
          {
            icon: "🚨",
            title: "SafetyButtons",
            desc: "911 and Quick Exit (opens weather.com) buttons appear at the top of most screens throughout the app.",
          },
          {
            icon: "🛤️",
            title: "Three Paths",
            desc: 'Users choose "still_in_it", "just_left", or "rebuild" — this personalizes content, check-in options, and more throughout the app.',
          },
          {
            icon: "💳",
            title: "Shield / Rise Tiers",
            desc: "Scripts Library and Evidence Export are paywalled. The Rise tab is the subscription/upgrade screen.",
          },
          {
            icon: "✅",
            title: "Check-In Branches",
            desc: "The check-in flow branches based on behavior danger level and safety rating, potentially routing to emergency resources.",
          },
        ].map(({ icon, title, desc }) => (
          <div
            key={title}
            style={{
              background: "#fff",
              borderRadius: 10,
              padding: "14px 16px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.07)",
            }}
          >
            <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
            <div
              style={{
                fontWeight: 700,
                fontSize: 13,
                color: "#1E293B",
                marginBottom: 4,
              }}
            >
              {title}
            </div>
            <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.5 }}>
              {desc}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 36,
          color: "#CBD5E1",
          fontSize: 12,
        }}
      >
        Survivor app · flowchart generated May 2026
      </div>
    </div>
  );
}
