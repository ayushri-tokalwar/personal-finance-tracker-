import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ChevronRight,
  DollarSign,
  GraduationCap,
  HeartPulse,
  Home,
  Laptop,
  Percent,
  PiggyBank,
  Plane,
  Plus,
  Receipt,
  RotateCcw,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { currency } from '../../utils/finance.jsx'

export const DEFAULT_EXPENSE_CATEGORIES = [
  { key: 'Rent / Home', defaultAmount: 15000, icon: Home },
  { key: 'Food & Groceries', defaultAmount: 6000, icon: Receipt },
  { key: 'Fuel / Transport', defaultAmount: 3000, icon: Plane },
  { key: 'Utilities', defaultAmount: 2000, icon: Receipt },
  { key: 'Mobile / Internet', defaultAmount: 1000, icon: Laptop },
  { key: 'Education', defaultAmount: 0, icon: GraduationCap },
  { key: 'Healthcare', defaultAmount: 1500, icon: HeartPulse },
  { key: 'Entertainment', defaultAmount: 2000, icon: Sparkles },
  { key: 'Shopping', defaultAmount: 2500, icon: Receipt },
  { key: 'Subscriptions', defaultAmount: 800, icon: Receipt },
  { key: 'Other', defaultAmount: 1200, icon: Wallet },
]

export const GOAL_TEMPLATES = [
  { name: 'Emergency Fund', icon: '🛡️', defaultTarget: 100000, defaultMonths: 12 },
  { name: 'Travel / Trip', icon: '✈️', defaultTarget: 60000, defaultMonths: 8 },
  { name: 'Vehicle / Bike / Car', icon: '🚗', defaultTarget: 180000, defaultMonths: 24 },
  { name: 'Gadget / Electronics', icon: '💻', defaultTarget: 75000, defaultMonths: 6 },
  { name: 'Home / Renovation', icon: '🏡', defaultTarget: 500000, defaultMonths: 36 },
  { name: 'Jewelry / Gold', icon: '💎', defaultTarget: 120000, defaultMonths: 18 },
  { name: 'Education / Upskilling', icon: '🎓', defaultTarget: 50000, defaultMonths: 6 },
  { name: 'Wedding', icon: '💍', defaultTarget: 300000, defaultMonths: 24 },
  { name: 'Investment / Stocks', icon: '📈', defaultTarget: 150000, defaultMonths: 18 },
  { name: 'Business Venture', icon: '💼', defaultTarget: 250000, defaultMonths: 24 },
  { name: 'Other Custom Goal', icon: '🎯', defaultTarget: 50000, defaultMonths: 12 },
]

function SetupWizard({ initialData, onComplete, onCancel }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [errorMsg, setErrorMsg] = useState('')

  // Form State
  const [income, setIncome] = useState(
    initialData?.income || {
      frequency: 'monthly',
      amount: 50000,
      source: 'Salary',
      otherIncome: 5000,
    }
  )

  const [expenses, setExpenses] = useState(
    initialData?.expenses || {
      'Rent / Home': 15000,
      'Food & Groceries': 6000,
      'Fuel / Transport': 3000,
      Utilities: 2000,
      'Mobile / Internet': 1000,
      Education: 0,
      Healthcare: 1500,
      Entertainment: 2000,
      Shopping: 2500,
      Subscriptions: 800,
      Other: 1200,
    }
  )

  const [customExpenses, setCustomExpenses] = useState(initialData?.customExpenses || [])
  const [newCustomName, setNewCustomName] = useState('')
  const [newCustomAmount, setNewCustomAmount] = useState('')

  const [savingsMode, setSavingsMode] = useState(initialData?.savings?.mode || 'amount')
  const [savingsTargetAmount, setSavingsTargetAmount] = useState(initialData?.savings?.targetAmount || 12000)
  const [savingsTargetPercent, setSavingsTargetPercent] = useState(initialData?.savings?.targetPercentage || 25)

  const [goals, setGoals] = useState(
    initialData?.goals && initialData.goals.length > 0
      ? initialData.goals
      : [
          {
            id: 'g-1',
            category: 'Travel / Trip',
            name: 'Goa Holiday Trip',
            icon: '✈️',
            targetAmount: 45000,
            targetDate: '2026-12',
          },
          {
            id: 'g-2',
            category: 'Emergency Fund',
            name: '6 Months Safety Cushion',
            icon: '🛡️',
            targetAmount: 120000,
            targetDate: '2027-06',
          },
        ]
  )

  // New Goal Input
  const [selectedGoalTemplate, setSelectedGoalTemplate] = useState(GOAL_TEMPLATES[0].name)
  const [newGoalName, setNewGoalName] = useState('')
  const [newGoalAmount, setNewGoalAmount] = useState(50000)
  const [newGoalDate, setNewGoalDate] = useState('2027-06')

  const [tracking, setTracking] = useState(
    initialData?.tracking || {
      frequency: 'monthly',
      monitorIncome: true,
      monitorExpenses: true,
      monitorSavings: true,
      monitorGoals: true,
    }
  )

  // Computed values
  const mainIncomeNum = Number(income.amount) || 0
  const otherIncomeNum = Number(income.otherIncome) || 0
  const totalRawIncome = mainIncomeNum + otherIncomeNum

  const calculatedMonthlyIncome =
    income.frequency === 'annual'
      ? Math.round(totalRawIncome / 12)
      : totalRawIncome

  const calculatedAnnualIncome =
    income.frequency === 'monthly'
      ? totalRawIncome * 12
      : totalRawIncome

  // Calculate standard expenses
  const standardExpensesTotal = Object.values(expenses).reduce(
    (sum, val) => sum + (Number(val) || 0),
    0
  )
  const customExpensesTotal = customExpenses.reduce(
    (sum, item) => sum + (Number(item.amount) || 0),
    0
  )
  const totalMonthlyExpenses = standardExpensesTotal + customExpensesTotal

  const availableAmount = Math.max(0, calculatedMonthlyIncome - totalMonthlyExpenses)

  const effectiveSavingsAmount =
    savingsMode === 'percentage'
      ? Math.round((calculatedMonthlyIncome * Number(savingsTargetPercent)) / 100)
      : Number(savingsTargetAmount) || 0

  const isSavingsFeasible = effectiveSavingsAmount <= availableAmount && calculatedMonthlyIncome > totalMonthlyExpenses

  // Step Validation Handlers
  const validateAndNext = () => {
    setErrorMsg('')

    if (currentStep === 1) {
      if (mainIncomeNum <= 0) {
        setErrorMsg('Please enter a valid positive income amount.')
        return
      }
    }

    if (currentStep === 2) {
      if (totalMonthlyExpenses < 0) {
        setErrorMsg('Expenses cannot be negative.')
        return
      }
    }

    if (currentStep === 3) {
      if (effectiveSavingsAmount < 0) {
        setErrorMsg('Savings target cannot be negative.')
        return
      }
    }

    if (currentStep === 4) {
      if (goals.length === 0) {
        setErrorMsg('Please select or add at least one financial goal.')
        return
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, 6))
  }

  const handlePrev = () => {
    setErrorMsg('')
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleAddCustomExpense = (e) => {
    e.preventDefault()
    if (!newCustomName.trim()) {
      setErrorMsg('Please enter a name for the custom expense.')
      return
    }
    const amt = Number(newCustomAmount)
    if (isNaN(amt) || amt < 0) {
      setErrorMsg('Please enter a valid non-negative amount.')
      return
    }

    setCustomExpenses([
      ...customExpenses,
      { id: Date.now().toString(), name: newCustomName.trim(), amount: amt },
    ])
    setNewCustomName('')
    setNewCustomAmount('')
    setErrorMsg('')
  }

  const handleRemoveCustomExpense = (id) => {
    setCustomExpenses(customExpenses.filter((item) => item.id !== id))
  }

  const handleAddGoal = (e) => {
    e.preventDefault()
    const template = GOAL_TEMPLATES.find((t) => t.name === selectedGoalTemplate) || GOAL_TEMPLATES[0]
    const gName = newGoalName.trim() || selectedGoalTemplate
    const amt = Number(newGoalAmount)

    if (amt <= 0) {
      setErrorMsg('Goal target amount must be greater than zero.')
      return
    }

    const newGoalObj = {
      id: Date.now().toString(),
      category: selectedGoalTemplate,
      name: gName,
      icon: template.icon,
      targetAmount: amt,
      targetDate: newGoalDate || '2027-12',
    }

    setGoals([...goals, newGoalObj])
    setNewGoalName('')
    setErrorMsg('')
  }

  const handleRemoveGoal = (id) => {
    setGoals(goals.filter((g) => g.id !== id))
  }

  const handleCompleteSubmission = () => {
    // Merge standard expenses and custom expenses into an organized map
    const consolidatedExpenses = { ...expenses }
    customExpenses.forEach((item) => {
      consolidatedExpenses[item.name] = item.amount
    })

    const payload = {
      income: {
        ...income,
        calculatedMonthly: calculatedMonthlyIncome,
        calculatedAnnual: calculatedAnnualIncome,
      },
      expenses: consolidatedExpenses,
      customExpenses,
      totalMonthlyExpenses,
      savings: {
        mode: savingsMode,
        targetAmount: effectiveSavingsAmount,
        targetPercentage:
          calculatedMonthlyIncome > 0
            ? Math.round((effectiveSavingsAmount / calculatedMonthlyIncome) * 100)
            : 0,
      },
      goals,
      tracking,
      enabled: true,
      lastUpdated: new Date().toISOString(),
    }

    onComplete(payload)
  }

  const stepsList = [
    { num: 1, label: 'Income', icon: Wallet },
    { num: 2, label: 'Expenses', icon: Receipt },
    { num: 3, label: 'Savings', icon: PiggyBank },
    { num: 4, label: 'Goals', icon: Target },
    { num: 5, label: 'Tracking', icon: TrendingUp },
    { num: 6, label: 'Review', icon: CheckCircle2 },
  ]

  return (
    <div className="space-y-6">
      {/* Header & Step Stepper */}
      <div className="rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Sparkles className="h-3.5 w-3.5" />
              Step {currentStep} of 6: {stepsList[currentStep - 1].label}
            </div>
            <h2 className="mt-2 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
              Personal Finance Setup
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Provide your baseline numbers to calibrate your personalized tracker and simulated AI insights.
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Back to Dashboard
            </button>
          )}
        </div>

        {/* Stepper pills */}
        <div className="mt-6 flex items-center justify-between gap-1 overflow-x-auto pb-2">
          {stepsList.map((step, idx) => {
            const Icon = step.icon
            const isDone = currentStep > step.num
            const isCurrent = currentStep === step.num

            return (
              <div key={step.num} className="flex flex-1 items-center">
                <button
                  type="button"
                  onClick={() => isDone && setCurrentStep(step.num)}
                  disabled={!isDone}
                  className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-xs font-semibold transition ${
                    isCurrent
                      ? 'bg-slate-900 text-white shadow-sm'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                      : 'bg-slate-100/70 text-slate-400'
                  }`}
                >
                  <div
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${
                      isCurrent
                        ? 'bg-white/20 text-white'
                        : isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : step.num}
                  </div>
                  <span className="hidden truncate sm:inline">{step.label}</span>
                </button>
                {idx < stepsList.length - 1 && (
                  <ChevronRight className="mx-1 hidden h-4 w-4 shrink-0 text-slate-300 md:block" />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Error banner */}
      {errorMsg && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-800">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* ================= STEP 1: INCOME ================= */}
      {currentStep === 1 && (
        <div className="rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Step 1 — Income</p>
            <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">What is your income?</h3>
            <p className="mt-1 text-sm text-slate-600">
              Enter your regular earnings so the system can evaluate your disposable budget.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {/* Frequency Toggle */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Income Frequency
              </label>
              <div className="mt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIncome({ ...income, frequency: 'monthly' })}
                  className={`flex-1 rounded-2xl border py-3 text-sm font-semibold transition ${
                    income.frequency === 'monthly'
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Monthly Income
                </button>
                <button
                  type="button"
                  onClick={() => setIncome({ ...income, frequency: 'annual' })}
                  className={`flex-1 rounded-2xl border py-3 text-sm font-semibold transition ${
                    income.frequency === 'annual'
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                  }`}
                >
                  Annual (Yearly) Income
                </button>
              </div>
            </div>

            {/* Income Amount */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {income.frequency === 'monthly' ? 'Monthly' : 'Annual'} Base Income (₹)
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-semibold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={income.amount}
                    onChange={(e) => setIncome({ ...income, amount: e.target.value })}
                    placeholder="e.g. 50000"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-base font-semibold text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Other / Side Income (Optional) (₹)
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-semibold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={income.otherIncome}
                    onChange={(e) => setIncome({ ...income, otherIncome: e.target.value })}
                    placeholder="e.g. 5000"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-base font-semibold text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            </div>

            {/* Income Source */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Primary Income Source
              </label>
              <select
                value={income.source}
                onChange={(e) => setIncome({ ...income, source: e.target.value })}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 outline-none focus:border-slate-900 sm:max-w-md"
              >
                <option value="Salary">Salary (Full-time)</option>
                <option value="Business">Business / Entrepreneurship</option>
                <option value="Freelancing">Freelancing / Contracting</option>
                <option value="Internship">College Internship Stipend</option>
                <option value="Allowance">Family / Pocket Allowance</option>
                <option value="Other">Other Sources</option>
              </select>
            </div>

            {/* Calculated Estimates Card */}
            <div className="rounded-[1.75rem] border border-slate-900/10 bg-[#132a24] p-5 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-[#b8cec3]">Derived Projection</p>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-[#c8d9d1]">Estimated Monthly Take-home</p>
                  <p className="font-display text-2xl font-bold text-white">
                    {currency(calculatedMonthlyIncome)}
                    <span className="ml-1 text-xs font-normal text-[#a6bfb4]">/ month</span>
                  </p>
                </div>
                <div>
                  <p className="text-xs text-[#c8d9d1]">Estimated Annual Inflow</p>
                  <p className="font-display text-2xl font-bold text-amber-300">
                    {currency(calculatedAnnualIncome)}
                    <span className="ml-1 text-xs font-normal text-amber-200/80">/ year</span>
                  </p>
                </div>
              </div>
              <p className="mt-3 text-xs text-[#b8cec3]">
                *Calculated as an estimate for demonstration and planning purposes.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 2: EXPENSES ================= */}
      {currentStep === 2 && (
        <div className="rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Step 2 — Outgoings</p>
              <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">
                Where does your money go?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Enter your average monthly expenses. You can enter 0 for categories you do not spend on.
              </p>
            </div>

            {/* Live Expense Counter Badge */}
            <div className="rounded-2xl border border-slate-200 bg-[#fcfaf5] p-3 text-right">
              <p className="text-xs uppercase tracking-wider text-slate-500">Total Monthly Expenses</p>
              <p className="font-display text-xl font-bold text-slate-900">
                {currency(totalMonthlyExpenses)}
              </p>
            </div>
          </div>

          {/* Standard Expense Fields */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEFAULT_EXPENSE_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const currentVal = expenses[cat.key] ?? ''

              return (
                <div
                  key={cat.key}
                  className="rounded-2xl border border-slate-200 bg-white p-3.5 transition hover:border-slate-300"
                >
                  <div className="flex items-center gap-2">
                    <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800">{cat.key}</span>
                  </div>
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-slate-400">
                      ₹
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="100"
                      value={currentVal}
                      onChange={(e) =>
                        setExpenses({
                          ...expenses,
                          [cat.key]: e.target.value === '' ? '' : Math.max(0, Number(e.target.value)),
                        })
                      }
                      placeholder="0"
                      className="w-full rounded-xl border border-slate-200 py-2 pl-7 pr-3 text-sm font-semibold text-slate-900 outline-none focus:border-slate-900"
                    />
                  </div>
                </div>
              )
            })}
          </div>

          {/* Custom Expenses Section */}
          <div className="mt-8 border-t border-slate-200 pt-6">
            <h4 className="font-display text-lg font-bold text-slate-900">Custom Monthly Expenses</h4>
            <p className="text-xs text-slate-500">
              Have specific expenses like Gym, Pet Care, or Course EMI? Add them below.
            </p>

            {customExpenses.length > 0 && (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {customExpenses.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50/50 p-3 text-sm"
                  >
                    <div>
                      <p className="font-semibold text-slate-900">{c.name}</p>
                      <p className="text-xs font-bold text-emerald-800">{currency(c.amount)}/mo</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomExpense(c.id)}
                      className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-100 hover:text-rose-600"
                      title="Remove expense"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Custom Expense Form */}
            <form onSubmit={handleAddCustomExpense} className="mt-4 flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={newCustomName}
                onChange={(e) => setNewCustomName(e.target.value)}
                placeholder="Expense Name (e.g. Gym Membership)"
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-slate-900 sm:min-w-[200px]"
              />
              <div className="relative w-36">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-xs font-semibold text-slate-400">
                  ₹
                </span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={newCustomAmount}
                  onChange={(e) => setNewCustomAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-7 pr-3 text-sm font-semibold text-slate-900 outline-none focus:border-slate-900"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ================= STEP 3: SAVINGS ================= */}
      {currentStep === 3 && (
        <div className="rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Step 3 — Wealth Creation</p>
            <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">
              How much would you like to save?
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Define your monthly savings goal either as a fixed rupee amount or as a percentage of your monthly income.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {/* Mode Selector */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setSavingsMode('amount')}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                  savingsMode === 'amount'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <DollarSign className="h-4 w-4" />
                Fixed Amount (₹)
              </button>
              <button
                type="button"
                onClick={() => setSavingsMode('percentage')}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                  savingsMode === 'percentage'
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-700'
                }`}
              >
                <Percent className="h-4 w-4" />
                Percentage of Income (%)
              </button>
            </div>

            {/* Input field */}
            {savingsMode === 'amount' ? (
              <div className="max-w-md">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Target Monthly Savings (₹)
                </label>
                <div className="relative mt-2">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 font-semibold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={savingsTargetAmount}
                    onChange={(e) => setSavingsTargetAmount(e.target.value)}
                    placeholder="e.g. 15000"
                    className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-base font-semibold text-slate-900 outline-none focus:border-slate-900"
                  />
                </div>
              </div>
            ) : (
              <div className="max-w-md">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Target Savings Percentage: {savingsTargetPercent}%
                </label>
                <div className="mt-2 flex items-center gap-4">
                  <input
                    type="range"
                    min="5"
                    max="60"
                    step="5"
                    value={savingsTargetPercent}
                    onChange={(e) => setSavingsTargetPercent(e.target.value)}
                    className="h-2 w-full cursor-pointer accent-slate-900"
                  />
                  <span className="font-display text-lg font-bold text-slate-900">
                    {savingsTargetPercent}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-slate-500">
                  Equates to approximately {currency(effectiveSavingsAmount)} per month.
                </p>
              </div>
            )}

            {/* Live Financial Balance Comparison Card */}
            <div className="rounded-[1.75rem] border border-slate-900/10 bg-white p-6 shadow-sm">
              <h4 className="font-display text-base font-bold text-slate-900">
                Monthly Cash Flow Comparison
              </h4>

              <div className="mt-4 grid gap-4 sm:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs text-slate-500">Estimated Income</p>
                  <p className="font-display text-lg font-bold text-slate-900">
                    {currency(calculatedMonthlyIncome)}
                  </p>
                </div>

                <div className="rounded-2xl bg-rose-50 p-4">
                  <p className="text-xs text-rose-600">Total Expenses</p>
                  <p className="font-display text-lg font-bold text-rose-700">
                    - {currency(totalMonthlyExpenses)}
                  </p>
                </div>

                <div className="rounded-2xl bg-sky-50 p-4">
                  <p className="text-xs text-sky-600">Available Surplus</p>
                  <p className="font-display text-lg font-bold text-sky-800">
                    {currency(availableAmount)}
                  </p>
                </div>

                <div className="rounded-2xl bg-emerald-50 p-4">
                  <p className="text-xs text-emerald-600">Planned Savings</p>
                  <p className="font-display text-lg font-bold text-emerald-800">
                    {currency(effectiveSavingsAmount)}
                  </p>
                </div>
              </div>

              {/* Status Alert Badge */}
              <div
                className={`mt-4 flex items-center justify-between rounded-2xl p-4 ${
                  isSavingsFeasible
                    ? 'border border-emerald-200 bg-emerald-50 text-emerald-900'
                    : 'border border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white ${
                      isSavingsFeasible ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}
                  >
                    {isSavingsFeasible ? '✓' : '!'}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Status: {isSavingsFeasible ? 'Possible' : 'Needs Adjustment'}
                    </p>
                    <p className="text-xs">
                      {isSavingsFeasible
                        ? 'Based on the information you entered, your target appears achievable within this demo.'
                        : 'Your planned savings target exceeds your monthly surplus. You may need to adjust your target or expenses in this demo.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 4: GOALS ================= */}
      {currentStep === 4 && (
        <div className="rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Step 4 — Aspirations</p>
            <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">What are you saving for?</h3>
            <p className="mt-1 text-sm text-slate-600">
              Set one or more milestones to keep yourself motivated. In this demo, progress is calculated dynamically.
            </p>
          </div>

          {/* Existing Goals Grid */}
          <div className="mt-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Selected Goals ({goals.length})
            </h4>

            {goals.length === 0 ? (
              <p className="mt-2 text-sm italic text-slate-400">
                No goals added yet. Choose a category below to add your first goal.
              </p>
            ) : (
              <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {goals.map((g) => (
                  <div
                    key={g.id}
                    className="relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{g.icon || '🎯'}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveGoal(g.id)}
                          className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                          title="Remove Goal"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-2 font-display text-base font-bold text-slate-900">{g.name}</p>
                      <p className="text-xs text-slate-500">Category: {g.category}</p>
                    </div>

                    <div className="mt-4 border-t border-slate-100 pt-3 text-xs">
                      <div className="flex justify-between font-semibold text-slate-800">
                        <span>Target:</span>
                        <span className="text-emerald-700">{currency(g.targetAmount)}</span>
                      </div>
                      <div className="mt-1 flex justify-between text-slate-500">
                        <span>Target Date:</span>
                        <span>{g.targetDate}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Goal Form */}
          <form
            onSubmit={handleAddGoal}
            className="mt-8 rounded-[1.75rem] border border-slate-200 bg-[#fcfaf5] p-5"
          >
            <h4 className="font-display text-sm font-bold text-slate-900">
              + Add a New Financial Goal
            </h4>

            <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600">Goal Category</label>
                <select
                  value={selectedGoalTemplate}
                  onChange={(e) => {
                    setSelectedGoalTemplate(e.target.value)
                    const tmpl = GOAL_TEMPLATES.find((t) => t.name === e.target.value)
                    if (tmpl) setNewGoalAmount(tmpl.defaultTarget)
                  }}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-900"
                >
                  {GOAL_TEMPLATES.map((tmpl) => (
                    <option key={tmpl.name} value={tmpl.name}>
                      {tmpl.icon} {tmpl.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Custom Title</label>
                <input
                  type="text"
                  value={newGoalName}
                  onChange={(e) => setNewGoalName(e.target.value)}
                  placeholder="e.g. Dream Vacation"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Target Amount (₹)</label>
                <input
                  type="number"
                  min="1000"
                  step="1000"
                  value={newGoalAmount}
                  onChange={(e) => setNewGoalAmount(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600">Target Deadline</label>
                <input
                  type="month"
                  value={newGoalDate}
                  onChange={(e) => setNewGoalDate(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-slate-900"
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-slate-800"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ================= STEP 5: PREFERENCES ================= */}
      {currentStep === 5 && (
        <div className="rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Step 5 — Cadence</p>
            <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">
              How would you like to track your finances?
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Configure how often you wish to review your numbers and which core modules to display.
            </p>
          </div>

          <div className="mt-6 space-y-6">
            {/* Frequency */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Review Frequency
              </label>
              <div className="mt-2 grid gap-3 sm:grid-cols-3">
                {['Monthly', 'Weekly', 'Both'].map((freq) => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setTracking({ ...tracking, frequency: freq.toLowerCase() })}
                    className={`rounded-2xl border p-4 text-center text-sm font-semibold transition ${
                      tracking.frequency === freq.toLowerCase()
                        ? 'border-slate-900 bg-slate-900 text-white'
                        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkboxes */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
                Categories to Monitor in Dashboard
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  { key: 'monitorIncome', label: 'Income Inflow & Trends' },
                  { key: 'monitorExpenses', label: 'Categorized Monthly Expenses' },
                  { key: 'monitorSavings', label: 'Monthly Savings Targets' },
                  { key: 'monitorGoals', label: 'Milestone Financial Goals' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:bg-slate-50"
                  >
                    <input
                      type="checkbox"
                      checked={tracking[item.key]}
                      onChange={(e) => setTracking({ ...tracking, [item.key]: e.target.checked })}
                      className="h-4 w-4 rounded accent-slate-900"
                    />
                    <span className="text-sm font-semibold text-slate-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= STEP 6: REVIEW ================= */}
      {currentStep === 6 && (
        <div className="rounded-[2rem] border border-slate-900/10 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Step 6 — Final Review</p>
            <h3 className="mt-1 font-display text-2xl font-bold text-slate-900">
              Review Your Financial Setup
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Verify your numbers before activating the Personal Finance Tracker dashboard.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Financial Summary Card */}
            <div className="space-y-4">
              <div className="rounded-[1.75rem] border border-slate-200 bg-[#fcfaf5] p-5">
                <h4 className="font-display text-sm font-bold text-slate-900">Summary Figures</h4>
                <div className="mt-3 divide-y divide-slate-200 text-sm">
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600">Estimated Monthly Income:</span>
                    <span className="font-bold text-slate-900">{currency(calculatedMonthlyIncome)}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600">Total Monthly Expenses:</span>
                    <span className="font-bold text-rose-700">{currency(totalMonthlyExpenses)}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600">Available Surplus:</span>
                    <span className="font-bold text-sky-800">{currency(availableAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2.5">
                    <span className="text-slate-600">Target Monthly Savings:</span>
                    <span className="font-bold text-emerald-700">{currency(effectiveSavingsAmount)}</span>
                  </div>
                  <div className="flex justify-between py-2.5 font-bold">
                    <span className="text-slate-800">Remaining Buffer:</span>
                    <span className={availableAmount >= effectiveSavingsAmount ? 'text-slate-900' : 'text-amber-700'}>
                      {currency(Math.max(0, availableAmount - effectiveSavingsAmount))}
                    </span>
                  </div>
                </div>
              </div>

              {/* Goals Summary */}
              <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5">
                <h4 className="font-display text-sm font-bold text-slate-900">
                  Target Goals ({goals.length})
                </h4>
                <div className="mt-3 space-y-2">
                  {goals.map((g) => (
                    <div
                      key={g.id}
                      className="flex items-center justify-between rounded-xl bg-slate-50 p-2.5 text-xs"
                    >
                      <span className="font-semibold text-slate-800">
                        {g.icon} {g.name}
                      </span>
                      <span className="font-bold text-slate-900">{currency(g.targetAmount)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ready to Enable Activation Box */}
            <div className="flex flex-col justify-between rounded-[2rem] border border-slate-900/10 bg-[#132a24] p-6 text-white shadow-[0_30px_80px_rgba(19,42,36,0.22)]">
              <div>
                <div className="inline-flex rounded-2xl bg-white/10 p-3 text-emerald-400">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h4 className="mt-4 font-display text-2xl font-bold text-white">
                  Ready to activate tracking!
                </h4>
                <p className="mt-2 text-xs leading-6 text-[#c8d9d1]">
                  Activating will initialize your personalized dashboard, compute simulated AI insights,
                  and persist your setup in your browser's local storage.
                </p>
                <div className="mt-4 rounded-xl bg-white/10 p-3 text-xs text-[#b8cec3]">
                  💡 <strong>Demo Mode Notice:</strong> This project works entirely in your browser using local calculations. No bank credentials or actual accounts are ever requested.
                </div>
              </div>

              <div className="mt-6 pt-4">
                <button
                  type="button"
                  onClick={handleCompleteSubmission}
                  className="w-full rounded-full bg-white py-3.5 text-center text-sm font-bold text-slate-900 transition hover:bg-[#f7f2e8] shadow-sm"
                >
                  Enable Personal Finance Tracker
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons (Back / Next) */}
      <div className="flex items-center justify-between rounded-[2rem] border border-slate-900/10 bg-white/80 p-4 shadow-sm backdrop-blur sm:p-5">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition ${
            currentStep === 1
              ? 'cursor-not-allowed border-slate-200 text-slate-300'
              : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        {currentStep < 6 ? (
          <button
            type="button"
            onClick={validateAndNext}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleCompleteSubmission}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 shadow-sm"
          >
            <CheckCircle2 className="h-4 w-4" />
            Enable Tracker
          </button>
        )}
      </div>
    </div>
  )
}

export default SetupWizard
