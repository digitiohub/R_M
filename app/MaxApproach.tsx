"use client";

import { useEffect, useRef } from "react";

/* The Max Approach View, ported from the CLTV Guy site (ganesh-portfolio's
   Process.jsx). motion and phosphor-icons became CSS reveals (.mav-* in
   globals.css) and inline icons, to avoid adding two dependencies for one section.
   Every figure is made-up sample data, and each panel says so. */

const C = {
  ground: '#060a18',
  panel: '#0a1024',
  card: '#0d1530',
  line: 'rgb(120 150 255 / 0.14)',
  lineStrong: 'rgb(90 130 255 / 0.38)',
  text: '#f3f5ff',
  dim: '#aeb6d3',
  faint: '#7c86a8',
  blue: '#3d6bff',
  sky: '#4aa3ff',
  cyan: '#22d3ee',
  teal: '#14b8a6',
  green: '#34d399',
  purple: '#8b5cf6',
  violet: '#a78bfa',
  pink: '#ec4899',
  orange: '#f59e0b',
  up: '#34d399',
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

function SmallIcon({ d }: { d: string }) {
  return (
    <svg width="9" height="9" fill="currentColor" viewBox="0 0 256 256" aria-hidden>
      <path d={d} />
    </svg>
  )
}

/* -----------------------------------------------------------------------------
   THE PARTS EVERY PANEL IS MADE OF
   --------------------------------------------------------------------------- */

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1.5 text-[10.5px] leading-none"
      style={{ borderColor: C.line, background: C.card, color: C.dim }}
    >
      {children}
      <SmallIcon d="M216.49,104.49l-80,80a12,12,0,0,1-17,0l-80-80a12,12,0,0,1,17-17L128,159l71.51-71.52a12,12,0,0,1,17,17Z" />
    </span>
  )
}

function Card({ title, right, className = '', children }: { title?: string; right?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`flex min-w-0 flex-col rounded-[10px] border p-3 ${className}`}
      style={{ borderColor: C.line, background: C.card }}
    >
      {(title || right) && (
        <div className="mb-2.5 flex items-center justify-between gap-2">
          <p className="min-w-0 text-[11px] font-semibold leading-tight" style={{ color: C.text }}>
            {title}
          </p>
          {right}
        </div>
      )}
      {children}
    </div>
  )
}

function Delta({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex items-center gap-0.5 text-[10.5px] font-semibold tabular-nums"
      style={{ color: C.up }}
    >
      <SmallIcon d="M208.49,120.49a12,12,0,0,1-17,0L140,69V216a12,12,0,0,1-24,0V69L64.49,120.49a12,12,0,0,1-17-17l72-72a12,12,0,0,1,17,0l72,72A12,12,0,0,1,208.49,120.49Z" />
      {children}
    </span>
  )
}

/** A headline figure. `inline` sets the delta beside the value, as the
    campaign row does, rather than under it. */
function Stat({ label, value, delta, inline = false }: { label: string; value: string; delta: string; inline?: boolean }) {
  return (
    <Card className="!p-2.5">
      <p className="text-[10px] leading-none" style={{ color: C.dim }}>
        {label}
      </p>
      <div className={inline ? 'mt-2 flex items-baseline gap-2' : 'mt-2'}>
        <p
          className="text-[clamp(1rem,1.35vw,1.2rem)] font-bold leading-none tracking-[-0.02em] tabular-nums"
          style={{ color: C.text }}
        >
          {value}
        </p>
        <div className={inline ? '' : 'mt-1.5'}>
          <Delta>{delta}</Delta>
        </div>
      </div>
    </Card>
  )
}

function Dot({ color }: { color: string }) {
  return (
    <span
      aria-hidden
      className="inline-block h-[7px] w-[7px] shrink-0 rounded-full"
      style={{ background: color }}
    />
  )
}

function Legend({ items, className = '' }: { items: [string, string][]; className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-3 gap-y-1 ${className}`}>
      {items.map(([label, color]) => (
        <li key={label} className="flex items-center gap-1.5 text-[10px]" style={{ color: C.dim }}>
          <Dot color={color} />
          {label}
        </li>
      ))}
    </ul>
  )
}

function Rank({ n, color = C.purple, small = false }: { n: number; color?: string; small?: boolean }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full font-bold leading-none text-white ${
        small ? 'h-[14px] w-[14px] text-[10px]' : 'h-[17px] w-[17px] text-[10px]'
      }`}
      style={{ background: color }}
    >
      {n}
    </span>
  )
}

function Bar({ share, color, delay = 0, height = 8 }: { share: number; color: string; delay?: number; height?: number }) {
  return (
    <span
      className="relative block min-w-0 flex-1 overflow-hidden rounded-full"
      style={{ height, background: 'rgb(120 150 255 / 0.08)' }}
    >
      <span
        aria-hidden
        className="mav-bar absolute inset-y-0 left-0 block rounded-full"
        style={{ width: `${share}%`, background: color, '--d': `${delay}s` } as React.CSSProperties}
      />
    </span>
  )
}

function Donut({ segments, center, sub }: { segments: [number, string][]; center: string; sub: string }) {
  const r = 38
  const circ = 2 * Math.PI * r
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[112px]">
      <svg viewBox="0 0 100 100" className="block h-full w-full -rotate-90" aria-hidden>
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          stroke="rgb(120 150 255 / 0.08)"
          strokeWidth="12"
        />
        {segments.map(([share, color], i) => {
          const len = (share / 100) * circ
          const offset = segments.slice(0, i).reduce((sum, [s]) => sum + (s / 100) * circ, 0)
          return (
            <circle
              key={color}
              cx="50"
              cy="50"
              r={r}
              fill="none"
              stroke={color}
              strokeWidth="12"
              strokeDasharray={`${Math.max(len - 1.2, 0)} ${circ}`}
              strokeDashoffset={-offset}
            />
          )
        })}
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        <p
          className="text-[clamp(0.95rem,1.2vw,1.1rem)] font-bold leading-none"
          style={{ color: C.text }}
        >
          {center}
        </p>
        <p className="mt-1 text-[10px] leading-none" style={{ color: C.dim }}>
          {sub}
        </p>
      </div>
    </div>
  )
}

/** Points in a 0..100 box, one per month, as an SVG path. */
const path = (ys: number[]) =>
  ys.map((y, i) => `${i ? 'L' : 'M'}${((i / (ys.length - 1)) * 100).toFixed(2)},${y}`).join(' ')

function Lines({ series, height = 84, dots = false, area = false }: { series: [number[], string][]; height?: number; dots?: boolean; area?: boolean }) {
  return (
    <div>
      <div className="mav-plot relative" style={{ height }}>
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="block h-full w-full"
          aria-hidden
        >
          <g stroke="rgb(120 150 255 / 0.09)" strokeWidth="1" vectorEffect="non-scaling-stroke">
            {[20, 45, 70, 95].map((y) => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
          {series.map(([ys, color]) => (
            <g key={color}>
              {area && (
                <>
                  <defs>
                    <linearGradient id={`mav-area-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                      <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`${path(ys)} L100,100 L0,100 Z`}
                    fill={`url(#mav-area-${color.slice(1)})`}
                  />
                </>
              )}
              <path
                d={path(ys)}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
                style={{ filter: `drop-shadow(0 0 4px ${color}88)` }}
              />
            </g>
          ))}
        </svg>
        {/* The dots are HTML, not SVG: the plot is stretched to its box, and a
          circle drawn inside a non-uniform viewBox comes out as an ellipse. */}
        {dots &&
          series.map(([ys, color]) =>
            ys.map((y, i) => (
              <span
                key={`${color}-${i}`}
                aria-hidden
                className="absolute h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${(i / (ys.length - 1)) * 100}%`,
                  top: `${y}%`,
                  background: '#dbe5ff',
                  boxShadow: `0 0 6px ${color}`,
                }}
              />
            )),
          )}
      </div>
    </div>
  )
}

function MonthAxis({ months = MONTHS }: { months?: string[] }) {
  return (
    <div className="mt-1.5 flex justify-between text-[10px]" style={{ color: C.faint }}>
      {months.map((m) => (
        <span key={m}>{m}</span>
      ))}
    </div>
  )
}

function Columns({ bars, height = 88 }: { bars: { label: string; share: number; color: string }[]; height?: number }) {
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {bars.map(({ label, share, color }, i) => (
        <div key={label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end">
          <span
            aria-hidden
            className="mav-col block w-full max-w-[18px] rounded-t-[4px]"
            style={{
              height: `${share}%`,
              background: `linear-gradient(180deg, ${color}, ${color}66)`,
              boxShadow: `0 0 10px ${color}55`,
              '--d': `${0.05 + i * 0.06}s`,
            } as React.CSSProperties}
          />
        </div>
      ))}
    </div>
  )
}

function ColumnAxis({ labels }: { labels: string[] }) {
  return (
    <div className="mt-1.5 flex justify-between gap-2">
      {labels.map((l) => (
        <span key={l} className="relative h-[10px] min-w-0 flex-1">
          <span
            className="absolute left-1/2 top-0 -translate-x-1/2 whitespace-nowrap text-[10px] leading-none"
            style={{ color: C.faint }}
          >
            {l}
          </span>
        </span>
      ))}
    </div>
  )
}

/* -----------------------------------------------------------------------------
   01 - CUSTOMER OVERVIEW
   --------------------------------------------------------------------------- */

const FUNNEL: [string, string, string][] = [
  ['Website Visitors', '100%', C.blue],
  ['Product View', '32%', '#6d5cf6'],
  ['Add to Cart', '12%', C.purple],
  ['Purchase', '4.8%', C.pink],
]

function Funnel() {
  const tiers = FUNNEL.length
  return (
    <div className="flex items-stretch gap-2.5">
      <svg viewBox="0 0 60 100" className="h-[92px] w-[40px] shrink-0" aria-hidden>
        {FUNNEL.map(([label, , color], i) => {
          const top = 4 + i * 23.5
          const bot = top + 21
          const w0 = 58 - i * 12
          const w1 = 58 - (i + 1) * 12 + (i === tiers - 1 ? 6 : 0)
          return (
            <polygon
              key={label}
              points={`${30 - w0 / 2},${top} ${30 + w0 / 2},${top} ${30 + w1 / 2},${bot} ${30 - w1 / 2},${bot}`}
              fill={color}
              style={{ filter: `drop-shadow(0 0 3px ${color}aa)` }}
            />
          )
        })}
      </svg>
      <ul className="flex min-w-0 flex-1 flex-col justify-around">
        {FUNNEL.map(([label, share]) => (
          <li key={label} className="flex items-center justify-between gap-2 text-[10px]">
            <span className="leading-tight" style={{ color: C.dim }}>
              {label}
            </span>
            <span className="font-semibold tabular-nums" style={{ color: C.text }}>
              {share}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function CustomerOverview() {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Total Customers" value="1,24,532" delta="12%" />
        <Stat label="New Customers" value="32,418" delta="18%" />
        <Stat label="Repeat Customers" value="92,114" delta="9%" />
      </div>

      <div className="grid grid-cols-[0.92fr_1.08fr] gap-2">
        <Card>
          <div className="flex h-full flex-col items-center justify-center gap-3 sm:flex-row min-[96rem]:flex-col min-[108rem]:flex-row">
            <div className="w-[96px] shrink-0">
              <Donut
                segments={[
                  [26, C.blue],
                  [58, C.green],
                  [11, C.purple],
                  [5, C.pink],
                ]}
                center="1.2L"
                sub="Customers"
              />
            </div>
            <Legend
              className="!flex-col"
              items={[
                ['New (26%)', C.blue],
                ['Repeat (58%)', C.green],
                ['At Risk (11%)', C.purple],
                ['Churned (5%)', C.pink],
              ]}
            />
          </div>
        </Card>
        <Card title="Customer Conversion Funnel">
          <Funnel />
        </Card>
      </div>

      <Card title="Customer Growth Trend" right={<Chip>Monthly</Chip>} className="flex-1">
        <div className="flex flex-1 flex-col justify-end">
          <Lines
            series={[[[82, 72, 60, 54, 46, 26], C.sky]]}
            dots
            area
            height={70}
          />
          <MonthAxis />
        </div>
      </Card>
    </>
  )
}

/* -----------------------------------------------------------------------------
   02 - RETENTION ANALYTICS
   --------------------------------------------------------------------------- */

const CATEGORIES: [string, number][] = [
  ['Innershorts', 28],
  ['Camisoles', 18],
  ['Boxers', 14],
  ['Activewear', 12],
  ['Sleepwear', 10],
]

const SHOPPERS: [string, number][] = [
  ['One-time', 38],
  ['Repeat', 46],
  ['VIP (3+ orders)', 16],
]

/* The heatmap tiles, row by row, as the board draws them. */
const RFM_TILES = [
  [C.teal, '#2447c9', C.blue, C.blue],
  [C.green, C.teal, '#1f8f8a', '#2447c9'],
  [C.teal, C.green, '#1f8f8a', C.teal],
]

const RFM: [string, string, string][] = [
  ['Champions', '12%', C.blue],
  ['Loyal', '28%', C.sky],
  ['Potential', '26%', C.purple],
  ['At Risk', '20%', C.pink],
  ['Hibernating', '14%', C.orange],
]

function RetentionAnalytics() {
  return (
    <>
      <div
        className="grid grid-cols-3 rounded-[10px] border p-1 text-center text-[10.5px]"
        style={{ borderColor: C.line, background: C.card }}
      >
        {['Product Trend', 'Shopper Trend', 'RFM View'].map((tab, i) => (
          <span
            key={tab}
            className="truncate rounded-md px-1 py-2 leading-none"
            style={
              i === 0
                ? {
                    color: C.text,
                    background: 'rgb(61 107 255 / 0.18)',
                    boxShadow: `inset 0 -2px 0 ${C.sky}`,
                  }
                : { color: C.dim }
            }
          >
            {tab}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card title="Top Product Categories by Revenue">
          <ul className="flex flex-1 flex-col justify-between gap-2">
            {CATEGORIES.map(([label, share], i) => (
              <li key={label} className="flex items-center gap-2 text-[10px]">
                <span className="w-[58px] shrink-0 leading-tight" style={{ color: C.dim }}>
                  {label}
                </span>
                <Bar
                  share={(share / 28) * 100}
                  color={`linear-gradient(90deg, ${C.blue}, ${C.sky})`}
                  delay={0.05 + i * 0.06}
                />
                <span
                  className="w-[24px] shrink-0 text-right font-semibold tabular-nums"
                  style={{ color: C.text }}
                >
                  {share}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Product Trend (Orders)">
          <Lines
            series={[
              [[78, 62, 66, 48, 44, 22], C.violet],
              [[86, 74, 70, 60, 50, 40], C.sky],
              [[92, 84, 80, 72, 66, 58], C.green],
            ]}
            height={72}
          />
          <MonthAxis />
          <Legend
            className="mt-2"
            items={[
              ['Innershorts', C.violet],
              ['Camisoles', C.sky],
              ['Boxers', C.green],
            ]}
          />
        </Card>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2">
        <Card title="Shopper Type Trend">
          <ul className="flex flex-1 flex-col justify-around gap-2.5">
            {SHOPPERS.map(([label, share], i) => (
              <li key={label} className="flex items-center gap-2 text-[10px]">
                <span className="w-[62px] shrink-0 leading-tight" style={{ color: C.dim }}>
                  {label}
                </span>
                <Bar
                  share={(share / 46) * 100}
                  color={`linear-gradient(90deg, ${C.blue}, ${C.sky})`}
                  delay={0.05 + i * 0.06}
                  height={10}
                />
                <span
                  className="w-[24px] shrink-0 text-right font-semibold tabular-nums"
                  style={{ color: C.text }}
                >
                  {share}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="RFM Segmentation">
          <div className="flex flex-1 items-center gap-2.5">
            <div className="grid w-[40%] shrink-0 grid-cols-4 gap-[2px]">
              {RFM_TILES.flat().map((color, i) => (
                <span
                  key={i}
                  aria-hidden
                  className="mav-tile block aspect-square rounded-[3px]"
                  style={{ background: color, boxShadow: `0 0 6px ${color}55`, '--d': `${0.04 * i}s` } as React.CSSProperties}
                />
              ))}
            </div>
            <ul className="flex min-w-0 flex-1 flex-col gap-1.5">
              {RFM.map(([label, share, color]) => (
                <li key={label} className="flex items-center gap-1 text-[10px]">
                  <span
                    aria-hidden
                    className="h-[6px] w-[6px] shrink-0 rounded-[2px]"
                    style={{ background: color }}
                  />
                  <span className="min-w-0 flex-1 leading-tight" style={{ color: C.dim }}>
                    {label}
                  </span>
                  <span
                    className="shrink-0 pl-1 font-semibold tabular-nums"
                    style={{ color: C.text }}
                  >
                    {share}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </>
  )
}

/* -----------------------------------------------------------------------------
   03 - CAMPAIGN DASHBOARD
   --------------------------------------------------------------------------- */

const CHANNELS = [
  { label: 'WhatsApp', share: 100, color: C.sky },
  { label: 'RCS', share: 78, color: C.green },
  { label: 'Email', share: 48, color: C.violet },
  { label: 'SMS', share: 32, color: C.orange },
  { label: 'App Push', share: 36, color: C.pink },
]

const SEGMENTS: [string, string][] = [
  ['Repeat Shoppers', '12.4x'],
  ['Innershorts Buyers', '9.8x'],
  ['At Risk Customers', '7.6x'],
  ['New Registrations', '6.1x'],
  ['Browse Abandoners', '5.4x'],
]

const OPENS: [string, string][] = [
  ['Welcome', '68%'],
  ['Back in Stock', '62%'],
  ['New Launch', '58%'],
]

const CLICKS: [string, string][] = [
  ['Festive Offer', '12.4%'],
  ['Size Up', '10.8%'],
  ['Restock', '9.1%'],
]

const VERBIAGE: [string, number][] = [
  ['Limited Time', 2.8],
  ['Last Chance', 2.3],
  ['Back in Stock', 2.1],
  ['Just for You', 1.9],
]

function RankedList({ rows, gap = 'gap-2', small = false }: { rows: [string, string][]; gap?: string; small?: boolean }) {
  return (
    <ol className={`flex flex-col ${gap}`}>
      {rows.map(([label, value], i) => (
        <li
          key={label}
          className={`flex items-center gap-1.5 ${small ? 'text-[10px]' : 'text-[10px]'}`}
        >
          <Rank n={i + 1} small={small} />
          <span className="min-w-0 flex-1 leading-tight" style={{ color: C.dim }}>
            {label}
          </span>
          <span className="shrink-0 pl-0.5 font-semibold tabular-nums" style={{ color: C.text }}>
            {value}
          </span>
        </li>
      ))}
    </ol>
  )
}

function CampaignDashboard() {
  return (
    <>
      <div className="grid grid-cols-3 gap-2">
        <Stat label="Total Campaigns" value="24" delta="33%" inline />
        <Stat label="Revenue" value="₹12.4L" delta="48%" inline />
        <Stat label="ROAS" value="8.6x" delta="2.1x" inline />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card title="Channel Performance (Revenue)">
          <div className="flex flex-1 flex-col justify-end">
            <Columns bars={CHANNELS} height={84} />
            <ColumnAxis labels={CHANNELS.map((c) => c.label)} />
          </div>
        </Card>
        <Card title="Best Segments by ROAS">
          <RankedList rows={SEGMENTS} gap="gap-2.5" />
        </Card>
      </div>

      <div className="grid flex-1 grid-cols-3 gap-2">
        <Card title="Best Opens" className="!p-2.5">
          <RankedList rows={OPENS} gap="gap-3" small />
        </Card>
        <Card title="Best Clicks" className="!p-2.5">
          <RankedList rows={CLICKS} gap="gap-3" small />
        </Card>
        <Card title="Verbiage Analysis" className="!p-2.5">
          <ul className="flex flex-1 flex-col justify-between gap-2">
            {VERBIAGE.map(([label, lift], i) => (
              <li key={label} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-[40px] shrink-0 leading-tight" style={{ color: C.dim }}>
                  {label}
                </span>
                <Bar
                  share={(lift / 2.8) * 100}
                  color={`linear-gradient(90deg, ${C.blue}, ${C.sky})`}
                  delay={0.05 + i * 0.06}
                  height={6}
                />
                <span className="shrink-0 font-semibold tabular-nums" style={{ color: C.text }}>
                  {lift}x
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  )
}

/* -----------------------------------------------------------------------------
   04 - JOURNEY PERFORMANCE
   --------------------------------------------------------------------------- */

const JOURNEYS: [string, string][] = [
  ['Welcome Journey', '12.2x'],
  ['Abandoned Cart', '8.6x'],
  ['Post Purchase', '7.4x'],
  ['Winback', '6.9x'],
  ['Browse Abandon', '5.1x'],
]

const JOURNEY_REVENUE: [string, number, string][] = [
  ['Welcome (32%)', 32, C.blue],
  ['Abandon Cart (24%)', 24, C.sky],
  ['Post Purchase (20%)', 20, C.violet],
  ['Winback (14%)', 14, C.orange],
  ['Browse Abandon (10%)', 10, C.pink],
]

const CONVERSIONS = [22, 30, 38, 52, 68, 92].map((share, i) => ({
  label: MONTHS[i],
  share,
  color: i < 3 ? C.violet : C.blue,
}))

function JourneyPerformance() {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Card title="Top Performing Journeys">
          <ol className="flex flex-1 flex-col justify-between gap-2.5">
            {JOURNEYS.map(([label, roas], i) => (
              <li key={label} className="flex items-center gap-2 text-[10px]">
                <Rank n={i + 1} color={i === 0 ? C.blue : C.purple} />
                <span className="min-w-0 flex-1 leading-tight" style={{ color: C.dim }}>
                  {label}
                </span>
                <span className="shrink-0 font-semibold tabular-nums" style={{ color: C.up }}>
                  {roas}
                </span>
              </li>
            ))}
          </ol>
        </Card>
        <Card title="Revenue by Journey">
          <div className="flex flex-1 flex-col items-center justify-center gap-3 sm:flex-row min-[96rem]:flex-col min-[108rem]:flex-row">
            <div className="w-[92px] shrink-0">
              <Donut
                segments={JOURNEY_REVENUE.map(([, share, color]): [number, string] => [share, color])}
                center="₹12.4L"
                sub="Revenue"
              />
            </div>
            <Legend
              className="!flex-col"
              items={JOURNEY_REVENUE.map(([label, , color]): [string, string] => [label, color])}
            />
          </div>
        </Card>
      </div>

      <div className="grid flex-1 grid-cols-2 gap-2">
        <Card title="Journey Conversions">
          <div className="flex flex-1 flex-col justify-end">
            <Columns bars={CONVERSIONS} height={92} />
            <ColumnAxis labels={MONTHS} />
          </div>
        </Card>
        <Card title="ROAS Trend by Journey">
          <div className="flex flex-1 flex-col justify-end">
            <Lines
              series={[
                [[80, 66, 58, 50, 40, 24], C.sky],
                [[88, 74, 62, 58, 52, 44], C.violet],
                [[92, 82, 76, 64, 60, 52], C.green],
              ]}
              height={74}
            />
            <MonthAxis />
            <Legend
              className="mt-2"
              items={[
                ['Welcome', C.sky],
                ['Abandon Cart', C.violet],
                ['Winback', C.green],
              ]}
            />
          </div>
        </Card>
      </div>
    </>
  )
}

/* -----------------------------------------------------------------------------
   THE BOARD
   --------------------------------------------------------------------------- */

const PANELS = [
  {
    icon: ['M168,144a40,40,0,1,1-40-40A40,40,0,0,1,168,144ZM64,56A32,32,0,1,0,96,88,32,32,0,0,0,64,56Zm128,0a32,32,0,1,0,32,32A32,32,0,0,0,192,56Z', 'M244.8,150.4a8,8,0,0,1-11.2-1.6A51.6,51.6,0,0,0,192,128a8,8,0,0,1,0-16,24,24,0,1,0-23.24-30,8,8,0,1,1-15.5-4A40,40,0,1,1,219,117.51a67.94,67.94,0,0,1,27.43,21.68A8,8,0,0,1,244.8,150.4ZM190.92,212a8,8,0,1,1-13.85,8,57,57,0,0,0-98.15,0,8,8,0,1,1-13.84-8,72.06,72.06,0,0,1,33.74-29.92,48,48,0,1,1,58.36,0A72.06,72.06,0,0,1,190.92,212ZM128,176a32,32,0,1,0-32-32A32,32,0,0,0,128,176ZM72,120a8,8,0,0,0-8-8A24,24,0,1,1,87.24,82a8,8,0,1,0,15.5-4A40,40,0,1,0,37,117.51,67.94,67.94,0,0,0,9.6,139.19a8,8,0,1,0,12.8,9.61A51.6,51.6,0,0,1,64,128,8,8,0,0,0,72,120Z'],
    title: 'Customer Overview',
    sub: 'One view. Deeper understanding.',
    range: 'Last 6 Months',
    Body: CustomerOverview,
    caption: {
      title: ['Bird Eye View of Customer,', 'Cohorts and Conversion Funnel'],
      sub: null,
      body: 'Know who your customers are, where they are in the journey and what’s driving conversions.',
    },
  },
  {
    icon: ['M208,40V208H152V40Z', 'M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z'],
    title: 'Retention Analytics',
    sub: 'Uncover what drives repeat revenue.',
    range: 'Last 180 Days',
    Body: RetentionAnalytics,
    caption: {
      title: ['Retention Analytics'],
      sub: 'Product Trend, Shopper Trend and RFM View',
      body: 'Discover what your customers love, who’s coming back, and where the next opportunity lies — powered by AI.',
    },
  },
  {
    icon: ['M223.69,42.18l-58.22,192a8,8,0,0,1-14.92,1.25L108,148,20.58,105.45a8,8,0,0,1,1.25-14.92l192-58.22A8,8,0,0,1,223.69,42.18Z', 'M227.32,28.68a16,16,0,0,0-15.66-4.08l-.15,0L19.57,82.84a16,16,0,0,0-2.49,29.8L102,154l41.3,84.87A15.86,15.86,0,0,0,157.74,248q.69,0,1.38-.06a15.88,15.88,0,0,0,14-11.51l58.2-191.94c0-.05,0-.1,0-.15A16,16,0,0,0,227.32,28.68ZM157.83,231.85l-.05.14,0-.07-40.06-82.3,48-48a8,8,0,0,0-11.31-11.31l-48,48L24.08,98.25l-.07,0,.14,0L216,40Z'],
    title: 'Campaign Dashboard',
    sub: 'Turn campaigns into compounding growth.',
    range: 'Last 30 Days',
    Body: CampaignDashboard,
    caption: {
      title: ['Campaign Dashboard'],
      sub: 'ROAS View, Best Segments, Best Opens, Best Clicks and Verbiage Analysis',
      body: 'See what’s working, what’s not, and what to scale — with AI-backed insights.',
    },
  },
  {
    icon: ['M152,128a24,24,0,1,1-24-24A24,24,0,0,1,152,128Z', 'M200,152a31.84,31.84,0,0,0-19.53,6.68l-23.11-18A31.65,31.65,0,0,0,160,128c0-.74,0-1.48-.08-2.21l13.23-4.41A32,32,0,1,0,168,104c0,.74,0,1.48.08,2.21l-13.23,4.41A32,32,0,0,0,128,96a32.59,32.59,0,0,0-5.27.44L115.89,81A32,32,0,1,0,96,88a32.59,32.59,0,0,0,5.27-.44l6.84,15.4a31.92,31.92,0,0,0-8.57,39.64L73.83,165.44a32.06,32.06,0,1,0,10.63,12l25.71-22.84a31.91,31.91,0,0,0,37.36-1.24l23.11,18A31.65,31.65,0,0,0,168,184a32,32,0,1,0,32-32Zm0-64a16,16,0,1,1-16,16A16,16,0,0,1,200,88ZM80,56A16,16,0,1,1,96,72,16,16,0,0,1,80,56ZM56,208a16,16,0,1,1,16-16A16,16,0,0,1,56,208Zm56-80a16,16,0,1,1,16,16A16,16,0,0,1,112,128Zm88,72a16,16,0,1,1,16-16A16,16,0,0,1,200,200Z'],
    title: 'Journey Performance',
    sub: 'Automate. Optimise. Keep them coming back.',
    range: 'Last 90 Days',
    Body: JourneyPerformance,
    caption: {
      title: ['Journey View'],
      sub: 'Best Performing Journey, ROAS from Journey and more',
      body: 'Track performance across every lifecycle journey and keep improving with AI recommendations.',
    },
  },
]

function Panel({ panel, index }: { panel: (typeof PANELS)[number]; index: number }) {
  const { icon, title, sub, range, Body, caption } = panel
  return (
    <li
      /* Two rows of the list's own grid, panel then caption, so every panel in
         a row ends on the same line and the numbered captions start level,
         whatever each caption's length. */
      className="mav-panel row-span-2 grid min-w-0 grid-rows-subgrid"
      style={{ '--panel-d': `${0.04 + (index % 4) * 0.08}s` } as React.CSSProperties}
    >
      <div
        className="flex flex-col gap-2 rounded-[16px] border p-3.5"
        style={{
          borderColor: C.lineStrong,
          background: `linear-gradient(180deg, #0c1430 0%, ${C.panel} 60%)`,
          boxShadow: '0 0 0 1px rgb(61 107 255 / 0.06), 0 18px 50px -20px rgb(40 90 255 / 0.45)',
        }}
      >
        <header className="mb-1 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <svg width="26" height="26" fill={C.sky} viewBox="0 0 256 256" className="mt-0.5 shrink-0" aria-hidden>
              <path d={icon[0]} opacity="0.2" />
              <path d={icon[1]} />
            </svg>
            <div className="min-w-0">
              <h3 className="text-[15px] font-semibold leading-tight" style={{ color: C.text }}>
                {title}
              </h3>
              <p className="mt-1 text-[11px] leading-tight" style={{ color: C.dim }}>
                {sub}
              </p>
            </div>
          </div>
          <Chip>{range}</Chip>
        </header>
        <Body />
        {/* Every figure on these boards is made up for the demo. Said on the
            panel itself, in text, so a reader or an AI tool quoting the page
            cannot take 1,24,532 customers for a client's real numbers. */}
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: C.dim }}>
          Illustrative sample data
        </p>
      </div>

      {/* ---- the numbered caption under the panel ---- */}
      <div className="px-1 pb-8">
        <div className="flex items-center gap-3">
          <span
            className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full border text-[13px] font-medium tabular-nums"
            style={{
              borderColor: C.sky,
              color: C.text,
              boxShadow: `0 0 12px ${C.blue}66`,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
          <span
            aria-hidden
            className="h-px flex-1"
            style={{
              background: `linear-gradient(90deg, ${C.blue}, transparent)`,
            }}
          />
        </div>
        <h4 className="mt-4 text-[17px] font-semibold leading-[1.25]" style={{ color: C.text }}>
          {caption.title.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h4>
        {caption.sub && (
          <p className="mt-0.5 text-[15px] leading-[1.35]" style={{ color: C.text }}>
            {caption.sub}
          </p>
        )}
        <p
          className="mt-3 max-w-[40ch] text-[13.5px] leading-[1.5] text-pretty"
          style={{ color: C.dim }}
        >
          {caption.body}
        </p>
      </div>
    </li>
  )
}

export default function MaxApproach() {
  const root = useRef<HTMLElement>(null)

  useEffect(() => {
    const panels = root.current?.querySelectorAll('.mav-panel')
    if (!panels) return
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        }),
      { threshold: 0.2 },
    )
    panels.forEach((panel) => observer.observe(panel))
    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="approach"
      ref={root}
      className="max-approach relative overflow-hidden border-y"
      style={{
        borderColor: C.line,
        background: `radial-gradient(1200px 500px at 12% 0%, rgb(40 80 255 / 0.18), transparent 60%), radial-gradient(900px 500px at 90% 100%, rgb(60 90 255 / 0.12), transparent 60%), var(--bg)`,
      }}
    >
      <div className="mx-auto max-w-[1760px] px-5 py-12 sm:px-8 md:py-16">
        <div className="grid grid-cols-1 gap-x-16 gap-y-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p
              className="text-[12px] font-semibold uppercase tracking-[0.32em]"
              style={{ color: C.sky }}
            >
              05 / Supercharged by AI.
            </p>
            <h2
              className="mt-3 font-extrabold leading-[0.98] tracking-[-0.035em]"
              style={{
                color: C.text,
                fontSize: 'clamp(2.3rem, 4.6vw, 4.6rem)',
              }}
            >
              The{' '}
              <span className="text-max">Max</span>{' '}
              Approach View.
              <span className="sr-only"> Cohort, RFM and CLTV analytics in one view.</span>
            </h2>
            <p
              className="mt-4 text-[clamp(1rem,1.4vw,1.2rem)] leading-[1.45]"
              style={{ color: C.dim }}
            >
              From data to decisions. From insights to revenue. All in one view.
            </p>
          </div>
          <p
            className="max-w-[46ch] text-[15.5px] leading-[1.6] text-pretty lg:col-span-4"
            style={{ color: C.dim }}
          >
            AI-powered intelligence across your customer, campaigns and journeys — so you can focus
            on what matters most: more loyal customers and higher revenue.
          </p>
        </div>

        {/* One column on a phone, two on a tablet or laptop, four only from
            1536px, where each panel gets about 370px. Any narrower and the
            paired cards inside a panel are narrower than their own labels. */}
        <ol className="mt-12 grid grid-cols-1 gap-x-4 gap-y-5 md:grid-cols-2 min-[96rem]:grid-cols-4">
          {PANELS.map((panel, i) => (
            <Panel key={panel.title} panel={panel} index={i} />
          ))}
        </ol>
      </div>
    </section>
  )
}
