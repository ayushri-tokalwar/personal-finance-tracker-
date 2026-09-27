import { useState, useMemo } from 'react'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BrainCircuit,
  Calendar,
  CheckCircle2,
  Clock,
  DollarSign,
  Edit3,
  Lightbulb,
  PiggyBank,
  PieChart as PieChartIcon,
  Plus,
  RotateCcw,
  Sparkles,
  Target,
  TrendingUp,
  Wallet,
  X,
} from 'lucide-react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import { currency } from '../../utils/finance.jsx'
import { generateFinancialInsights } from './aiInsights'

// Coordinated color palette for categories
const CHART_COLORS = [
  '#0f766e',
  '#f97316',
  '#2563eb',
  '#eab308',
  '#db2777',
  '#7c3aed',
  '#16a34a',
  '#dc2626',
  '#14b8a6',
  '#0284c7',
  '#475569',
  '#64748b',
]

function TrackerDashboard({ data, onEdit, onReset }) {
  const [showResetConfirm, setShowResetConfirm] = useState(false)
  const [showSuccessBanner, setShowSuccessBanner] = useState(true)

  // Extract core numbers from saved data
  const monthlyIncome = data.income?.calculatedMonthly || data.income?.amount || 0
  const monthlyExpenses = data.totalMonthlyExpenses || 0
  const plannedSavings = data.savings?.targetAmount || 0
  const availableSurplus = Math.max(0, monthlyIncome - monthlyExpenses)
  const remainingBuffer = Math.max(0, availableSurplus - plannedSavings)

  // Savings progress ratio
  const savingsProgressPct =
    availableSurplus > 0
      ? Math.min(100, Math.round((plannedSavings / availableSurplus) * 100))
      : 0

  // Category breakdown for chart
  const expenseChartData = useMemo(() => {
    if (!data.expenses) return []
    return Object.entries(data.expenses)
      .map(([name, amount]) => ({
        name,
        value: Number(amount) || 0,
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value)
  }, [data.expenses])

  // AI Insights
  const insights = useMemo(() => generateFinancialInsights(data), [data])

  return (
    <div className="space-y-8">
      {/* Step 7: Celebratory Setup Success Banner */}
      {showSuccessBanner && (
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-900/20 bg-[#132a24] p-6 text-white shadow-[0_30px_80px_rgba(19,42,36,0.22)] sm:p-8">
          <button
            type="button"
            onClick={() => setShowSuccessBanner(false)}
            className="absolute top-5 right-5 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            aria-label="Dismiss banner"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-emerald-300">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Personal Finance Tracker Enabled
              </div>
              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Your financial intelligence tracking is active.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#c9dbd1]">
                Your personalized baseline has been calibrated. Below is your live demo dashboard with
                computed cash flow metrics, category breakdowns, goal trackers, and simulated AI insights.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
              <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
                <p className="text-[11px] uppercase tracking-wider text-[#b8cec3]">Income</p>
                <p className="font-display text-base font-bold text-white">{currency(monthlyIncome)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
                <p className="text-[11px] uppercase tracking-wider text-[#b8cec3]">Expenses</p>
                <p className="font-display text-base font-bold text-rose-300">{currency(monthlyExpenses)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
                <p className="text-[11px] uppercase tracking-wider text-[#b8cec3]">Planned Savings</p>
                <p className="font-display text-base font-bold text-emerald-300">{currency(plannedSavings)}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-center backdrop-blur">
                <p className="text-[11px] uppercase tracking-wider text-[#b8cec3]">Goals</p>
                <p className="font-display text-base font-bold text-amber-300">{data.goals?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Control bar: Action Buttons + Demo disclaimer */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-900/10 bg-white/70 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:px-6">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>College Project Demo • Local browser persistence enabled</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 shadow-sm"
          >
            <Edit3 className="h-3.5 w-3.5 text-slate-600" />
            Edit Financial Setup
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Demo Data
          </button>
        </div>
      </div>

      {/* Step 8: 4 Core Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Income Card */}
        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monthly Income
            </span>
            <div className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-slate-900">
            {currency(monthlyIncome)}
          </p>
          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
            <span>Primary source:</span>
            <span className="font-semibold text-slate-700">{data.income?.source || 'Salary'}</span>
          </div>
        </div>

        {/* Expenses Card */}
        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monthly Expenses
            </span>
            <div className="rounded-xl bg-rose-100 p-2 text-rose-800">
              <ArrowDownRight className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-rose-700">
            {currency(monthlyExpenses)}
          </p>
          <div className="mt-2 text-xs text-slate-500">
            {monthlyIncome > 0 ? (
              <span>
                <strong>{Math.round((monthlyExpenses / monthlyIncome) * 100)}%</strong> of monthly earnings
              </span>
            ) : (
              'Calculated outgoings'
            )}
          </div>
        </div>

        {/* Planned Savings Card */}
        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Planned Savings
            </span>
            <div className="rounded-xl bg-sky-100 p-2 text-sky-800">
              <PiggyBank className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-sky-800">
            {currency(plannedSavings)}
          </p>
          <div className="mt-2 text-xs text-slate-500">
            Target savings rate:{' '}
            <strong className="text-slate-800">
              {monthlyIncome > 0 ? Math.round((plannedSavings / monthlyIncome) * 100) : 0}%
            </strong>
          </div>
        </div>

        {/* Remaining Buffer Card */}
        <div className="relative overflow-hidden rounded-[1.75rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Net Buffer / Surplus
            </span>
            <div className="rounded-xl bg-amber-100 p-2 text-amber-800">
              <Wallet className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-slate-900">
            {currency(remainingBuffer)}
          </p>
          <div className="mt-2 text-xs text-slate-500">
            Unassigned monthly buffer for unexpected needs
          </div>
        </div>
      </div>

      {/* Row: Expense Breakdown + Savings Progress */}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Expense Breakdown Card */}
        <div className="rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Outflow Distribution</p>
              <h3 className="mt-1 font-display text-xl font-bold text-slate-900">
                Expense Breakdown
              </h3>
            </div>
            <div className="rounded-xl bg-slate-100 p-2 text-slate-600">
              <PieChartIcon className="h-5 w-5" />
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            {/* Recharts Pie Donut */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expenseChartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val) => currency(val)}
                    contentStyle={{
                      backgroundColor: '#132a24',
                      borderRadius: '1rem',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Category Progress Bars */}
            <div className="space-y-3">
              {expenseChartData.slice(0, 6).map((item, idx) => {
                const pct = monthlyExpenses > 0 ? Math.round((item.value / monthlyExpenses) * 100) : 0
                const color = CHART_COLORS[idx % CHART_COLORS.length]

                return (
                  <div key={item.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-slate-600">
                        {currency(item.value)} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Savings Progress Card */}
        <div className="flex flex-col justify-between rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Savings Target</p>
              <div className="rounded-xl bg-emerald-100 p-2 text-emerald-800">
                <Target className="h-5 w-5" />
              </div>
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-slate-900">
              Monthly Savings Goal
            </h3>

            {/* Target vs Available comparison */}
            <div className="mt-6 rounded-2xl bg-emerald-50/60 p-4 border border-emerald-100">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Target Savings:</span>
                <span className="font-bold text-emerald-900">{currency(plannedSavings)}</span>
              </div>
              <div className="mt-1 flex justify-between text-xs text-slate-600">
                <span>Available Surplus:</span>
                <span className="font-bold text-slate-900">{currency(availableSurplus)}</span>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs font-semibold text-slate-700">
                  <span>Surplus Allocation:</span>
                  <span>{savingsProgressPct}%</span>
                </div>
                <div className="mt-1.5 h-3 w-full overflow-hidden rounded-full bg-emerald-200/50">
                  <div
                    className="h-full rounded-full bg-emerald-600 transition-all duration-700"
                    style={{ width: `${Math.min(100, savingsProgressPct)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* 50-30-20 Rule Guide */}
            <div className="mt-5 space-y-2 text-xs text-slate-600">
              <p className="font-semibold text-slate-800">50-30-20 Rule College Benchmark:</p>
              <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="text-[10px] text-slate-500">Needs (50%)</p>
                  <p className="font-bold text-slate-800">{currency(monthlyIncome * 0.5)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="text-[10px] text-slate-500">Wants (30%)</p>
                  <p className="font-bold text-slate-800">{currency(monthlyIncome * 0.3)}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-2">
                  <p className="text-[10px] text-slate-500">Save (20%)</p>
                  <p className="font-bold text-emerald-700">{currency(monthlyIncome * 0.2)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4 text-xs text-slate-500">
            Tracking cadence: <strong className="capitalize text-slate-700">{data.tracking?.frequency || 'Monthly'} reviews</strong>
          </div>
        </div>
      </div>

      {/* Financial Goals Dashboard */}
      <div className="rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Milestones</p>
            <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">
              Financial Goals Tracking
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Visualizing timeline and simulated accumulation towards your target milestones.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            <Clock className="h-3.5 w-3.5" />
            {data.goals?.length || 0} active goal{data.goals?.length === 1 ? '' : 's'}
          </span>
        </div>

        {data.goals && data.goals.length > 0 ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.goals.map((goal, index) => {
              // Deterministic demo progress calculation
              // Each goal gets a realistic mock progress based on planned savings and index
              const demoMultiplier = Math.max(0.2, (0.5 - index * 0.15))
              const simulatedSaved = Math.min(
                goal.targetAmount,
                Math.round(goal.targetAmount * demoMultiplier)
              )
              const pct = Math.round((simulatedSaved / goal.targetAmount) * 100)

              return (
                <div
                  key={goal.id || index}
                  className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{goal.icon || '🎯'}</span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                        {goal.category}
                      </span>
                    </div>

                    <h4 className="mt-3 font-display text-lg font-bold text-slate-900">
                      {goal.name}
                    </h4>

                    <div className="mt-3 space-y-1 text-xs">
                      <div className="flex justify-between text-slate-500">
                        <span>Target Deadline:</span>
                        <span className="font-semibold text-slate-700">{goal.targetDate}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>Target Amount:</span>
                        <span className="text-emerald-700">{currency(goal.targetAmount)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-3">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">
                        Demo saved: <strong>{currency(simulatedSaved)}</strong>
                      </span>
                      <span className="font-bold text-slate-900">{pct}%</span>
                    </div>
                    <div className="mt-1.5 h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-slate-900 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-[10px] text-slate-400 text-right">
                      *Demo progress calculation
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="mt-6 text-sm text-slate-500 italic">
            No goals active. Click "Edit Financial Setup" above to add goals.
          </p>
        )}
      </div>

      {/* AI Financial Insights Section */}
      <div className="rounded-[2rem] border border-slate-900/10 bg-[#132a24] p-6 text-white shadow-[0_30px_80px_rgba(19,42,36,0.22)] sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-amber-300">
              <BrainCircuit className="h-4 w-4" />
              AI-Powered Demo Insights
            </div>
            <h3 className="mt-3 font-display text-2xl font-bold text-white sm:text-3xl">
              AI Financial Insights
            </h3>
            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[#c8d9d1]">
              Simulated intelligent recommendations derived deterministically from your income, expenses,
              and goal milestones. Demonstrates intelligent finance guidance without requiring an external AI API key.
            </p>
          </div>

          <div className="rounded-xl border border-white/15 bg-white/5 p-3 text-xs text-[#b8cec3]">
            🤖 Simulated Rule-Based AI Engine
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur transition hover:bg-white/15"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] uppercase tracking-wider text-amber-300 font-semibold">
                    {item.category}
                  </span>
                  <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#e3efe9]">
                    {item.tag}
                  </span>
                </div>
                <h4 className="mt-3 font-display text-base font-bold text-white">{item.title}</h4>
                <p className="mt-2 text-xs leading-6 text-[#d7e5de]">{item.text}</p>
              </div>

              <div className="mt-4 border-t border-white/10 pt-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                  <Sparkles className="h-3 w-3" />
                  {item.actionLabel}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal for Resetting Demo Data */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <h4 className="mt-4 font-display text-xl font-bold text-slate-900">
              Reset Demo Financial Data?
            </h4>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              This will clear your customized income, expenses, and goals from your browser's local
              storage and return you to the initial setup form. This is safe and can be reconfigured
              any time during your presentation.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetConfirm(false)
                  onReset()
                }}
                className="rounded-full bg-rose-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-rose-700 shadow-sm"
              >
                Yes, Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TrackerDashboard
