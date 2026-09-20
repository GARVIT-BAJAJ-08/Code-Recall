import { Routes, Route } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import MarketingLayout from '@/components/layout/MarketingLayout'
import Dashboard from '@/pages/Dashboard'
import MyQuestions from '@/pages/MyQuestions'
import AddQuestion from '@/pages/AddQuestion'
import RandomRevision from '@/pages/RandomRevision'
import SmartRevision from '@/pages/SmartRevision'
import CustomRevision from '@/pages/CustomRevision'
import ReviewSessionPage from '@/pages/ReviewSessionPage'
import Progress from '@/pages/Progress'
import HistoryPage from '@/pages/HistoryPage'
import ProfilePage from '@/pages/ProfilePage'
import SettingsPage from '@/pages/SettingsPage'
import LandingPage from '@/pages/LandingPage'
import AboutPage from '@/pages/AboutPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import NotFound from '@/pages/NotFound'
import RequireAuth from '@/components/auth/RequireAuth'

export default function App() {
  return (
    <Routes>
      {/* Public / marketing pages */}
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Authenticated app shell — unchanged routes, plus Custom Revision */}
      <Route element={<RequireAuth />}>
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/questions" element={<MyQuestions />} />
        <Route path="/add" element={<AddQuestion />} />
        <Route path="/random" element={<RandomRevision />} />
        <Route path="/smart" element={<SmartRevision />} />
        <Route path="/custom-revision" element={<CustomRevision />} />
        <Route path="/review/:id" element={<ReviewSessionPage />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      </Route>
    </Routes>
  )
}
