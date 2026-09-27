import { useState, useEffect } from 'react'
import SectionHeading from '../components/SectionHeading'
import SetupWizard from '../components/finance-tracker/SetupWizard'
import TrackerDashboard from '../components/finance-tracker/TrackerDashboard'
import { Sparkles, SlidersHorizontal, ShieldCheck } from 'lucide-react'

const STORAGE_KEY = 'finova_finance_tracker_data'

function FinanceTrackerPage() {
  const [trackerData, setTrackerData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch (e) {
      console.warn('Could not read tracker data from localStorage', e)
      return null
    }
  })

  // If already enabled, show dashboard by default; if not enabled, show setup wizard
  const [isEditing, setIsEditing] = useState(false)

  // Sync to localStorage
  const handleSaveData = (data) => {
    setTrackerData(data)
    setIsEditing(false)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (e) {
      console.warn('Could not save tracker data to localStorage', e)
    }
  }

  const handleResetData = () => {
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.warn('Could not clear tracker data', e)
    }
    setTrackerData(null)
    setIsEditing(false)
  }

  const isEnabled = Boolean(trackerData?.enabled)

  return (
    <div className="space-y-8">
      {/* Top Banner / Hero section matching other pages */}
      <section className="rounded-[2rem] border border-slate-900/10 bg-white/75 p-6 shadow-sm backdrop-blur sm:p-8 lg:p-10">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <SectionHeading
            eyebrow="Personal Finance Tracker"
            title={
              isEnabled && !isEditing
                ? 'Your Personalized Financial Intelligence Dashboard'
                : 'Personal Finance Setup & Intelligence Calibration'
            }
            description={
              isEnabled && !isEditing
                ? 'Review your cash flow distribution, savings trajectory, active milestone goals, and simulated AI recommendations in one place.'
                : 'Complete the guided 6-step financial onboarding to initialize your custom budget tracking and unlock simulated AI recommendations.'
            }
          />

          <div className="flex shrink-0 items-center gap-2 rounded-full border border-slate-200 bg-[#fcfaf5] px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Frontend Simulation Demo</span>
          </div>
        </div>
      </section>

      {/* Main Container: Switch between Setup Wizard & Active Dashboard */}
      {isEnabled && !isEditing ? (
        <TrackerDashboard
          data={trackerData}
          onEdit={() => setIsEditing(true)}
          onReset={handleResetData}
        />
      ) : (
        <SetupWizard
          initialData={trackerData}
          onComplete={handleSaveData}
          onCancel={isEnabled ? () => setIsEditing(false) : null}
        />
      )}
    </div>
  )
}

export default FinanceTrackerPage
