import { Navigate, Route, Routes } from 'react-router-dom'

import { AuthLayout } from './components/layout/AuthLayout'
import { DashboardLayout } from './components/layout/DashboardLayout'
import { MainLayout } from './components/layout/MainLayout'
import { ProtectedRoute } from './components/auth/ProtectedRoute'
import { CreateJobPage } from './pages/CreateJobPage'
import { HomePage } from './pages/HomePage'
import { JobDetailPage } from './pages/JobDetailPage'
import { JobsPage } from './pages/JobsPage'
import { LoginPage } from './pages/LoginPage'
import { MyApplicationsPage } from './pages/MyApplicationsPage'
import { MyJobsPage } from './pages/MyJobsPage'
import { NotFoundPage } from './pages/NotFoundPage'
import { RegisterPage } from './pages/RegisterPage'
import { SavedJobsPage } from './pages/SavedJobsPage'
import { EditJobPage } from './pages/EditJobPage'
import { AdminPendingJobsPage } from './pages/AdminPendingJobsPage'
import { AdminJobDetailPage } from './pages/AdminJobDetailPage'
import { JobApplicantsPage } from './pages/JobApplicantsPage'
import { DashboardIndexRedirect } from './pages/DashboardIndexRedirect'

export function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="jobs" element={<JobsPage />} />
                <Route path="jobs/:id" element={<JobDetailPage />} />
            </Route>

            <Route path="/auth" element={<AuthLayout />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
            </Route>

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<DashboardIndexRedirect />} />

                <Route
                    path="applications"
                    element={
                        <ProtectedRoute roles={['job_seeker']}>
                            <MyApplicationsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="saved-jobs"
                    element={
                        <ProtectedRoute roles={['job_seeker']}>
                            <SavedJobsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="jobs/create"
                    element={
                        <ProtectedRoute roles={['employer']}>
                            <CreateJobPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="jobs/my-jobs"
                    element={
                        <ProtectedRoute roles={['employer']}>
                            <MyJobsPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="jobs/:id/edit"
                    element={
                        <ProtectedRoute roles={['employer']}>
                            <EditJobPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="jobs/:id/applicants"
                    element={
                        <ProtectedRoute roles={['employer']}>
                            <JobApplicantsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="admin/jobs/pending"
                    element={
                        <ProtectedRoute roles={['admin']}>
                            <AdminPendingJobsPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="admin/jobs/:id"
                    element={
                        <ProtectedRoute roles={['admin']}>
                            <AdminJobDetailPage />
                        </ProtectedRoute>
                    }
                />
            </Route>

            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
    )
}
