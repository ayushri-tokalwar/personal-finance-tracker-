/**
 * AI-Style Simulated Insights Engine (Demo Mode)
 * Generates rule-based intelligent recommendations based on user-entered financial information.
 * No external API or LLM call is required for this college demonstration.
 */
import { currency } from '../../utils/finance.jsx'

export function generateFinancialInsights(data) {
  if (!data) return []

  const insights = []
  const monthlyIncome = data.income?.calculatedMonthly || data.income?.amount || 0
  const monthlyExpenses = data.totalMonthlyExpenses || 0
  const targetSavings = data.savings?.targetAmount || 0
  const availableAmount = Math.max(0, monthlyIncome - monthlyExpenses)
  const savingsRate = monthlyIncome > 0 ? Math.round((targetSavings / monthlyIncome) * 100) : 0
  const expenseRatio = monthlyIncome > 0 ? Math.round((monthlyExpenses / monthlyIncome) * 100) : 0

  // 1. Expense Ratio Analysis
  if (expenseRatio > 70) {
    insights.push({
      id: 'high-expenses',
      type: 'warning',
      category: 'Budget Health',
      title: 'High Expense-to-Income Proportion',
      text: `Your monthly expenses (${currency(monthlyExpenses)}) account for ${expenseRatio}% of your income. In this demo, reviewing non-essential spending like dining or subscriptions could help free up cash for your savings goals.`,
      actionLabel: 'Review Discretionary Spend',
      tag: 'Caution',
    })
  } else if (expenseRatio > 0 && expenseRatio <= 50) {
    insights.push({
      id: 'healthy-budget',
      type: 'positive',
      category: 'Budget Health',
      title: 'Favorable Spending Ratio',
      text: `Your current expenses (${expenseRatio}% of income) sit well within the recommended 50% guideline of the 50-30-20 budgeting framework, leaving room for both lifestyle and wealth creation.`,
      actionLabel: 'Maintain Habit',
      tag: 'Optimal',
    })
  }

  // 2. Savings Target Feasibility
  if (targetSavings > availableAmount && monthlyIncome > 0) {
    const deficit = targetSavings - availableAmount
    insights.push({
      id: 'savings-adjustment',
      type: 'warning',
      category: 'Savings Feasibility',
      title: 'Target Savings Exceeds Available Margin',
      text: `Your planned savings of ${currency(targetSavings)} exceeds your available surplus (${currency(availableAmount)}) by ${currency(deficit)}. Consider either trimming high monthly expense items or moderating your savings target.`,
      actionLabel: 'Adjust Target',
      tag: 'Needs Tuning',
    })
  } else if (targetSavings > 0 && availableAmount >= targetSavings) {
    const surplus = availableAmount - targetSavings
    insights.push({
      id: 'savings-achievable',
      type: 'positive',
      category: 'Savings Feasibility',
      title: 'Target Savings Fully Achievable',
      text: `Your monthly savings target of ${currency(targetSavings)} (${savingsRate}% of income) is fully supported by your current surplus. You even retain a safety buffer of ${currency(surplus)} each month.`,
      actionLabel: 'On Track',
      tag: 'Achievable',
    })
  }

  // 3. Goal Analysis & Timeline Projection
  if (data.goals && data.goals.length > 0) {
    const topGoal = data.goals[0]
    if (topGoal && topGoal.targetAmount && targetSavings > 0) {
      const monthsNeeded = Math.ceil(topGoal.targetAmount / targetSavings)
      insights.push({
        id: 'goal-timeline',
        type: 'info',
        category: 'Goal Projections',
        title: `Projection for "${topGoal.name}"`,
        text: `At your planned savings rate of ${currency(targetSavings)}/month, your target of ${currency(topGoal.targetAmount)} for "${topGoal.name}" can be attained in approximately ${monthsNeeded} month${monthsNeeded === 1 ? '' : 's'}.`,
        actionLabel: 'Track Progress',
        tag: 'Timeline Forecast',
      })
    }

    const hasEmergencyFund = data.goals.some((g) =>
      g.category?.toLowerCase().includes('emergency') || g.name?.toLowerCase().includes('emergency')
    )
    if (!hasEmergencyFund && monthlyExpenses > 0) {
      const recommendedFund = monthlyExpenses * 3
      insights.push({
        id: 'emergency-fund-tip',
        type: 'recommendation',
        category: 'Risk Protection',
        title: 'Emergency Safety Cushion Recommendation',
        text: `Financial planners typically recommend maintaining a liquid safety fund of 3 to 6 months of expenses (approximately ${currency(recommendedFund)} for your baseline). Consider adding an Emergency Fund goal.`,
        actionLabel: 'Add Safety Goal',
        tag: 'Recommended',
      })
    }
  }

  // 4. Top Category Concentration Check
  const expenseEntries = Object.entries(data.expenses || {}).filter(([_, val]) => Number(val) > 0)
  if (expenseEntries.length > 0) {
    const sorted = [...expenseEntries].sort((a, b) => Number(b[1]) - Number(a[1]))
    const [topCategory, topAmount] = sorted[0]
    const percentOfTotal = monthlyExpenses > 0 ? Math.round((Number(topAmount) / monthlyExpenses) * 100) : 0

    if (percentOfTotal >= 35) {
      insights.push({
        id: 'category-concentration',
        type: 'info',
        category: 'Spending Concentration',
        title: `Highest Spending Item: ${topCategory}`,
        text: `${topCategory} represents ${percentOfTotal}% of your total outgoing expenses (${currency(topAmount)}). Monitoring this single category closely will produce the highest impact on your monthly savings.`,
        actionLabel: 'Monitor Category',
        tag: 'Key Driver',
      })
    }
  }

  // Fallback insight if few items were triggered
  if (insights.length < 3) {
    insights.push({
      id: 'general-advisory',
      type: 'info',
      category: 'Smart Budgeting',
      title: '50/30/20 Rule Comparison',
      text: `In personal finance, the standard model recommends 50% for Needs, 30% for Wants, and 20% for Savings. Use this benchmark in your college presentation to showcase how structured budgeting works.`,
      actionLabel: 'Demo Best Practice',
      tag: 'Best Practice',
    })
  }

  return insights
}
