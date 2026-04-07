import React from 'react'
import { endOfMonth, format, isWithinInterval, parseISO, startOfMonth, subMonths } from 'date-fns'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const categoryMap = {
  swiggy: 'Food',
  zomato: 'Food',
  uber: 'Transport',
  ola: 'Transport',
  fuel: 'Transport',
  salary: 'Income',
  freelance: 'Income',
  rent: 'Housing',
  electricity: 'Utilities',
  bill: 'Utilities',
  pharmacy: 'Healthcare',
  gym: 'Healthcare',
  netflix: 'Subscriptions',
  spotify: 'Subscriptions',
  amazon: 'Shopping',
  myntra: 'Shopping',
  movie: 'Entertainment',
  irctc: 'Travel',
  travel: 'Travel',
  groceries: 'Groceries',
  bigbasket: 'Groceries',
}

const categoryColors = {
  Housing: '#0f766e',
  Food: '#f97316',
  Transport: '#2563eb',
  Utilities: '#eab308',
  Shopping: '#db2777',
  Subscriptions: '#7c3aed',
  Healthcare: '#16a34a',
  Entertainment: '#dc2626',
  Groceries: '#14b8a6',
  Travel: '#0284c7',
  Income: '#15803d',
  Other: '#475569',
}

export function currency(value) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0)
}

export function categorizeExpense(description) {
  const normalized = description.toLowerCase()
  const matchedKey = Object.keys(categoryMap).find((key) => normalized.includes(key))
  return matchedKey ? categoryMap[matchedKey] : 'Other'
}

function sumTransactions(transactions, type) {
  return transactions.filter((item) => item.type === type).reduce((total, item) => total + item.amount, 0)
}

function getMonthlyBucket(transactions, monthDate) {
  const start = startOfMonth(monthDate)
  const end = endOfMonth(monthDate)
  const items = transactions.filter((item) => isWithinInterval(parseISO(item.date), { start, end }))
  const income = sumTransactions(items, 'income')
  const expensesList = items.filter((item) => item.type === 'expense')
  const expenses = expensesList.reduce((total, item) => total + item.amount, 0)
  const savings = income - expenses
  const burnRate = income ? (expenses / income) * 100 : 0
  const isCurrentMonth = format(monthDate, 'yyyy-MM') === format(new Date(), 'yyyy-MM')
  const daysElapsed = new Date().getDate()
  const totalDays = end.getDate()
  const forecastExpense = isCurrentMonth ? (expenses / Math.max(daysElapsed, 1)) * totalDays : expenses

  return { label: format(monthDate, 'MMM yyyy'), income, expenses, savings, burnRate, forecastExpense, expensesList }
}

export function calculateDashboardStats(transactions, currentMonth) {
  const totalIncome = sumTransactions(transactions, 'income')
  const totalExpenses = sumTransactions(transactions, 'expense')
  const savings = currentMonth.income - currentMonth.expenses
  return {
    balance: totalIncome - totalExpenses,
    income: currentMonth.income,
    expenses: currentMonth.expenses,
    savings,
    savingsRate: currentMonth.income ? (savings / currentMonth.income) * 100 : 0,
  }
}

export function groupTransactionsByCategory(expenses) {
  const grouped = expenses.reduce((accumulator, item) => {
    const current = accumulator[item.category] || { name: item.category, value: 0, count: 0 }
    current.value += item.amount
    current.count += 1
    accumulator[item.category] = current
    return accumulator
  }, {})

  return Object.values(grouped).sort((left, right) => right.value - left.value).map((item) => ({ ...item, color: categoryColors[item.name] || categoryColors.Other }))
}

export function getBudgetStatus(categoryData, budgets) {
  const items = budgets.map((budget) => {
    const current = categoryData.find((item) => item.name === budget.category)
    const spent = current?.value || 0
    const percent = budget.limit ? (spent / budget.limit) * 100 : 0
    let status = 'On track'
    if (percent >= 100) status = 'Exceeded'
    else if (percent >= 80) status = 'Critical'
    return { ...budget, spent, percent, status }
  })

  return { items, alertCount: items.filter((item) => item.status !== 'On track').length }
}

export function getTopInsights({ transactions, monthlyReport, budgetStatus }) {
  const insights = []
  const currentMonth = monthlyReport.currentMonth
  const previousMonth = monthlyReport.previousMonth
  const overspent = budgetStatus.items.filter((item) => item.status === 'Exceeded').sort((left, right) => right.percent - left.percent)[0]

  if (overspent) {
    insights.push({
      tag: 'Budget alert',
      title: `${overspent.category} budget exceeded`,
      severity: 'High',
      detail: `You have already used ${overspent.percent.toFixed(0)}% of your ${overspent.category.toLowerCase()} budget this month.`,
      action: `Trim the next ${currency(overspent.spent - overspent.limit)} in ${overspent.category.toLowerCase()} spending or raise the budget with justification.`,
    })
  }

  if (currentMonth.burnRate > 70) {
    insights.push({
      tag: 'Cash-flow risk',
      title: 'Spending pace is eating into savings',
      severity: 'Medium',
      detail: `This month your expenses are ${currentMonth.burnRate.toFixed(1)}% of income, leaving limited room for emergencies or investments.`,
      action: 'Cap discretionary purchases for the next two weeks and redirect at least 15% of income into savings.',
    })
  }

  if (previousMonth.expenses && currentMonth.expenses > previousMonth.expenses * 1.12) {
    insights.push({
      tag: 'Trend detection',
      title: 'Expenses jumped compared with last month',
      severity: 'Medium',
      detail: `Monthly spending increased by ${(((currentMonth.expenses - previousMonth.expenses) / previousMonth.expenses) * 100).toFixed(1)}% over ${previousMonth.label}.`,
      action: 'Review large one-off transactions and set stricter caps for shopping, dining, and subscriptions.',
    })
  }

  const merchants = transactions.filter((item) => item.type === 'expense').reduce((accumulator, item) => {
    accumulator[item.description] = (accumulator[item.description] || 0) + item.amount
    return accumulator
  }, {})
  const topMerchant = Object.entries(merchants).sort((left, right) => right[1] - left[1])[0]
  if (topMerchant) {
    insights.push({
      tag: 'Merchant intelligence',
      title: 'Largest spend contributor identified',
      severity: 'Low',
      detail: `${topMerchant[0]} has contributed ${currency(topMerchant[1])} in tracked spending over the current dataset.`,
      action: 'Check whether this payment is essential, recurring, or better scheduled at a lower-cost alternative.',
    })
  }

  return insights.slice(0, 4)
}

export function getRecentTransactions(transactions) {
  return [...transactions].sort((left, right) => new Date(right.date) - new Date(left.date)).slice(0, 6)
}

export function getSpendingTrendLabel(monthlyReport) {
  const delta = monthlyReport.currentMonth.expenses - monthlyReport.previousMonth.expenses
  const direction = delta > 0 ? 'higher' : 'lower'
  const percent = monthlyReport.previousMonth.expenses ? Math.abs((delta / monthlyReport.previousMonth.expenses) * 100) : 0

  return { badge: delta > 0 ? 'Watch closely' : 'Improving', copy: `${percent.toFixed(1)}% ${direction} spending`, direction }
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-xl">
      <p className="font-semibold text-slate-900">{label}</p>
      {payload.map((entry) => <p key={entry.name} className="text-sm text-slate-600">{entry.name}: {currency(entry.value)}</p>)}
    </div>
  )
}

function MonthlyAreaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="incomeFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="expenseFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#f97316" stopOpacity={0.35} />
            <stop offset="95%" stopColor="#f97316" stopOpacity={0.03} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
        <Tooltip content={<ChartTooltip />} />
        <Area type="monotone" dataKey="income" stroke="#15803d" strokeWidth={3} fill="url(#incomeFill)" name="Income" />
        <Area type="monotone" dataKey="expenses" stroke="#ea580c" strokeWidth={3} fill="url(#expenseFill)" name="Expenses" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function CategoryPieChart({ categoryData }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie data={categoryData} dataKey="value" nameKey="name" innerRadius={70} outerRadius={108} paddingAngle={4}>
          {categoryData.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
        </Pie>
        <Tooltip content={<ChartTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  )
}

function MonthlyBarChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
        <Tooltip content={<ChartTooltip />} />
        <Bar dataKey="savings" fill="#0f766e" radius={[10, 10, 0, 0]} name="Savings" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function createMonthlyReport(transactions) {
  const months = Array.from({ length: 6 }, (_, index) => subMonths(new Date(), 5 - index))
  const data = months.map((monthDate) => getMonthlyBucket(transactions, monthDate))
  const currentMonth = data[data.length - 1]
  const previousMonth = data[data.length - 2]
  const bestSavingMonth = [...data].sort((left, right) => right.savings - left.savings)[0]
  const healthScore = Math.max(45, Math.min(98, Math.round(100 - currentMonth.burnRate + (currentMonth.savings > 0 ? 10 : -10) - currentMonth.expensesList.length)))

  return {
    data,
    currentMonth,
    previousMonth,
    bestSavingMonth,
    healthScore,
    AreaChart: () => <MonthlyAreaChart data={data} />,
    PieChart: ({ categoryData }) => <CategoryPieChart categoryData={categoryData} />,
    BarChart: () => <MonthlyBarChart data={data} />,
  }
}
