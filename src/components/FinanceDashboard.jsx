import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BadgeDollarSign,
  BrainCircuit,
  Building2,
  CreditCard,
  Landmark,
  PiggyBank,
  Plus,
  Target,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { format } from 'date-fns'
import { seedBudgets, seedTransactions } from '../data/mockData'
import {
  calculateDashboardStats,
  categorizeExpense,
  createMonthlyReport,
  currency,
  getBudgetStatus,
  getRecentTransactions,
  getSpendingTrendLabel,
  getTopInsights,
  groupTransactionsByCategory,
} from '../utils/finance.jsx'

const bankPartners = [
  { name: 'Plaid Secure Sync', status: 'Sandbox ready', tone: 'emerald' },
  { name: 'Razorpay Banking', status: 'API mapped', tone: 'amber' },
  { name: 'Open Banking Layer', status: 'Optional backend module', tone: 'sky' },
]

const statCards = [
  { key: 'balance', label: 'Net balance', icon: Wallet, accent: 'from-emerald-400/40 via-emerald-200/10 to-transparent' },
  { key: 'income', label: 'Monthly income', icon: TrendingUp, accent: 'from-sky-400/40 via-sky-200/10 to-transparent' },
  { key: 'expenses', label: 'Monthly expenses', icon: ArrowDownRight, accent: 'from-rose-400/40 via-rose-200/10 to-transparent' },
  { key: 'savingsRate', label: 'Savings rate', icon: PiggyBank, accent: 'from-amber-400/40 via-amber-200/10 to-transparent' },
]

function FinanceDashboard() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('finova-transactions')
    return saved ? JSON.parse(saved) : seedTransactions
  })
  const [budgets, setBudgets] = useState(() => {
    const saved = localStorage.getItem('finova-budgets')
    return saved ? JSON.parse(saved) : seedBudgets
  })
  const [form, setForm] = useState({
    type: 'expense',
    description: '',
    amount: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    account: 'HDFC Credit Card',
    category: '',
  })
  const dashboardRef = useRef(null)

  useEffect(() => {
    localStorage.setItem('finova-transactions', JSON.stringify(transactions))
  }, [transactions])

  useEffect(() => {
    localStorage.setItem('finova-budgets', JSON.stringify(budgets))
  }, [budgets])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.dashboard-panel', {
        opacity: 0,
        y: 24,
        duration: 0.8,
        stagger: 0.08,
        ease: 'power2.out',
      })
    }, dashboardRef)

    return () => ctx.revert()
  }, [])

  const monthlyReport = useMemo(() => createMonthlyReport(transactions), [transactions])
  const stats = useMemo(() => calculateDashboardStats(transactions, monthlyReport.currentMonth), [transactions, monthlyReport.currentMonth])
  const categoryData = useMemo(() => groupTransactionsByCategory(monthlyReport.currentMonth.expensesList), [monthlyReport.currentMonth.expensesList])
  const budgetStatus = useMemo(() => getBudgetStatus(categoryData, budgets), [categoryData, budgets])
  const insights = useMemo(() => getTopInsights({ transactions, monthlyReport, budgetStatus }), [transactions, monthlyReport, budgetStatus])
  const recentTransactions = useMemo(() => getRecentTransactions(transactions), [transactions])
  const spendingTrend = getSpendingTrendLabel(monthlyReport)

  const handleFormChange = (field, value) => {
    const nextForm = { ...form, [field]: value }
    if (field === 'description' && !form.category) nextForm.category = categorizeExpense(value)
    setForm(nextForm)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const amount = Number(form.amount)
    if (!form.description || !amount || !form.date) return

    const category = form.category || (form.type === 'expense' ? categorizeExpense(form.description) : 'Income')
    setTransactions((current) => [
      {
        id: crypto.randomUUID(),
        type: form.type,
        description: form.description,
        amount,
        date: form.date,
        account: form.account,
        category,
      },
      ...current,
    ])

    setForm({
      type: 'expense',
      description: '',
      amount: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      account: 'HDFC Credit Card',
      category: '',
    })
  }

  const handleBudgetChange = (category, value) => {
    setBudgets((current) => current.map((item) => (item.category === category ? { ...item, limit: Number(value) || 0 } : item)))
  }

  return (
    <div ref={dashboardRef} className="space-y-6">
      <section className="dashboard-panel overflow-hidden rounded-[2rem] border border-slate-900/10 bg-[#132a24] px-6 py-7 text-[#f8f3ea] shadow-[0_30px_80px_rgba(19,42,36,0.22)] sm:px-8">
        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#bdd1c7]">Live Product Demo</p>
            <h3 className="mt-3 font-display text-3xl text-white sm:text-4xl">
              Track money, decode patterns, and act earlier.
            </h3>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#d0e1d9]">
              This working dashboard showcases the core project functionality: expense
              intelligence, budget monitoring, monthly reporting, and AI-style suggestions.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => {
                const CardIcon = card.icon
                return (
                  <article key={card.key} className={`rounded-3xl border border-white/10 bg-gradient-to-br ${card.accent} p-4 backdrop-blur`}>
                    <div className="mb-6 flex items-center justify-between">
                      <span className="text-sm text-[#d7e5de]">{card.label}</span>
                      <CardIcon className="h-5 w-5 text-amber-200" />
                    </div>
                    <p className="font-display text-3xl text-white">
                      {card.key === 'savingsRate' ? `${stats[card.key].toFixed(1)}%` : currency(stats[card.key])}
                    </p>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#c9dbd1]">Monthly health score</p>
                <p className="font-display text-5xl text-white">{monthlyReport.healthScore}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3">
                <BrainCircuit className="h-7 w-7 text-amber-300" />
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#10231e] p-4">
              <div className="flex items-center justify-between text-sm text-[#c9dbd1]">
                <span>Spending trend</span>
                <span>{spendingTrend.badge}</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-white">{spendingTrend.copy}</p>
              <p className="mt-2 text-sm text-[#c9dbd1]">
                Compared with {monthlyReport.previousMonth.label}, your expense flow is{' '}
                {spendingTrend.direction}.
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <MetricChip icon={Target} label="Budget risk" value={`${budgetStatus.alertCount} categories`} />
              <MetricChip icon={BadgeDollarSign} label="Savings" value={currency(stats.savings)} />
              <MetricChip icon={Landmark} label="APIs planned" value="3 sources" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Panel title="Smart Insights" icon={BrainCircuit}>
            <div className="grid gap-4">
              {insights.map((insight) => (
                <article key={insight.title} className="rounded-[1.5rem] border border-slate-900/10 bg-white/75 p-5 shadow-sm backdrop-blur">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.22em] text-slate-500">{insight.tag}</p>
                      <h3 className="mt-2 text-xl font-semibold text-slate-900">{insight.title}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${insight.severity === 'High' ? 'bg-rose-100 text-rose-700' : insight.severity === 'Medium' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {insight.severity}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{insight.detail}</p>
                  <div className="mt-4 rounded-2xl bg-slate-900 px-4 py-3 text-sm text-slate-100">
                    Suggestion: {insight.action}
                  </div>
                </article>
              ))}
            </div>
          </Panel>

          <Panel title="Monthly Reports" icon={TrendingUp}>
            <div className="grid gap-4 lg:grid-cols-[1.3fr_0.8fr]">
              <div className="rounded-[1.5rem] bg-[#fcfaf5] p-4">
                <h3 className="text-lg font-semibold text-slate-900">Expense vs income over 6 months</h3>
                <p className="mt-1 text-sm text-slate-500">Professional reporting view for project demonstration.</p>
                <div className="mt-4 h-80">
                  <monthlyReport.AreaChart />
                </div>
              </div>
              <div className="space-y-4">
                <ReportMetric label="Best saving month" value={monthlyReport.bestSavingMonth.label} detail={currency(monthlyReport.bestSavingMonth.savings)} />
                <ReportMetric label="Current burn ratio" value={`${monthlyReport.currentMonth.burnRate.toFixed(1)}%`} detail="Expenses as a percentage of income" />
                <ReportMetric label="Forecasted month-end" value={currency(monthlyReport.currentMonth.forecastExpense)} detail="Projected from current pace" />
              </div>
            </div>
          </Panel>

          <Panel title="Expense Categories" icon={CreditCard}>
            <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="rounded-[1.5rem] bg-[#fcfaf5] p-4">
                <h3 className="text-lg font-semibold text-slate-900">Category distribution</h3>
                <div className="mt-4 h-80">
                  <monthlyReport.PieChart categoryData={categoryData} />
                </div>
              </div>
              <div className="space-y-3">
                {categoryData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="font-medium text-slate-900">{item.name}</p>
                        <p className="text-sm text-slate-500">{item.count} transactions</p>
                      </div>
                    </div>
                    <p className="font-semibold text-slate-900">{currency(item.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Budget Alerts" icon={AlertTriangle}>
            <div className="space-y-4">
              {budgetStatus.items.map((item) => (
                <div key={item.category} className="rounded-[1.5rem] border border-slate-900/10 bg-white/75 p-4 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">{item.category}</p>
                      <p className="text-sm text-slate-500">
                        Spent {currency(item.spent)} of {currency(item.limit)}
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === 'Exceeded' ? 'bg-rose-100 text-rose-700' : item.status === 'Critical' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full rounded-full ${item.status === 'Exceeded' ? 'bg-rose-500' : item.status === 'Critical' ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(item.percent, 100)}%` }} />
                  </div>
                  <div className="mt-4">
                    <label className="text-xs uppercase tracking-[0.2em] text-slate-500">Update monthly cap</label>
                    <input type="number" className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#fcfaf5] px-4 py-3 outline-none transition focus:border-slate-900" value={item.limit} onChange={(event) => handleBudgetChange(item.category, event.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Add Transaction" icon={Plus}>
            <form onSubmit={handleSubmit} className="rounded-[1.5rem] border border-slate-900/10 bg-white/75 p-5 backdrop-blur">
              <div className="grid gap-4">
                <div className="grid gap-3 sm:grid-cols-2">
                  <SelectField label="Type" value={form.type} onChange={(value) => handleFormChange('type', value)} options={['expense', 'income']} />
                  <InputField label="Amount" type="number" value={form.amount} onChange={(value) => handleFormChange('amount', value)} placeholder="2500" />
                </div>
                <InputField label="Description" value={form.description} onChange={(value) => handleFormChange('description', value)} placeholder="Swiggy dinner, Uber ride, Salary credit..." />
                <div className="grid gap-3 sm:grid-cols-2">
                  <InputField label="Date" type="date" value={form.date} onChange={(value) => handleFormChange('date', value)} />
                  <InputField label="Account" value={form.account} onChange={(value) => handleFormChange('account', value)} placeholder="Primary bank account" />
                </div>
                <InputField label="Category" value={form.category} onChange={(value) => handleFormChange('category', value)} placeholder="Auto-detected category" />
              </div>
              <div className="mt-4 rounded-2xl bg-[#fcfaf5] px-4 py-3 text-sm text-slate-600">
                Suggested category: <span className="font-semibold text-slate-900">{form.description ? categorizeExpense(form.description) : 'Awaiting description'}</span>
              </div>
              <button type="submit" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white transition hover:bg-slate-800">
                <Plus className="h-4 w-4" />
                Save transaction
              </button>
            </form>
          </Panel>

          <Panel title="Recent Activity" icon={ArrowUpRight}>
            <div className="overflow-hidden rounded-[1.5rem] border border-slate-900/10 bg-white/75 backdrop-blur">
              <div className="divide-y divide-slate-200">
                {recentTransactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between gap-4 px-5 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{tx.description}</p>
                      <p className="text-sm text-slate-500">{tx.category} - {format(new Date(tx.date), 'dd MMM yyyy')} - {tx.account}</p>
                    </div>
                    <p className={`font-semibold ${tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {tx.type === 'income' ? '+' : '-'}{currency(tx.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <Panel title="Bank API Integration" icon={Building2}>
            <div className="grid gap-4">
              {bankPartners.map((partner) => (
                <div key={partner.name} className="rounded-[1.5rem] border border-slate-900/10 bg-white/75 p-5 backdrop-blur">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{partner.name}</h3>
                      <p className="text-sm text-slate-500">Extendable backend module for secure account sync and statement pull.</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${partner.tone === 'emerald' ? 'bg-emerald-100 text-emerald-700' : partner.tone === 'amber' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                      {partner.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </section>
    </div>
  )
}

function Panel({ title, icon, children }) {
  const IconComponent = icon
  return (
    <section className="dashboard-panel space-y-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-white px-3 py-3 shadow-sm">
          <IconComponent className="h-5 w-5 text-slate-900" />
        </div>
        <h2 className="font-display text-2xl text-slate-900">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function MetricChip({ icon, label, value }) {
  const IconComponent = icon
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
      <IconComponent className="h-5 w-5 text-amber-300" />
      <p className="mt-4 text-sm text-[#c9dbd1]">{label}</p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </div>
  )
}

function ReportMetric({ label, value, detail }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-900/10 bg-white/75 p-4 backdrop-blur">
      <p className="text-sm uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-3 font-display text-3xl text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  )
}

function InputField({ label, onChange, ...props }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <input
        {...props}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#fcfaf5] px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-900"
      />
    </label>
  )
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-[#fcfaf5] px-4 py-3 outline-none transition focus:border-slate-900"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}

export default FinanceDashboard
