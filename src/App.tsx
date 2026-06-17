import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './lib/query-client';
import { useAuthStore } from './store/useAuthStore';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import MapPage from './pages/MapPage';
import ReportsPage from './pages/reports/ReportsPage';
import CreateReportPage from './pages/reports/CreateReportPage';
import ReportShowPage from './pages/reports/ReportShowPage';
import BuildingsPage from './pages/BuildingsPage';
import FacilitiesPage from './pages/facilities/FacilitiesPage';
import CategoriesPage from './pages/CategoriesPage';
import UsersPage from './pages/UsersPage';
import AdvancedSearchPage from './pages/AdvancedSearchPage';
import BuildingShowPage from './pages/buildings/BuildingShowPage';
import FacilityShowPage from './pages/facilities/FacilityShowPage';
import MainLayout from './components/layouts/MainLayout';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
    const { user, isAuthenticated } = useAuthStore();
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    if (roles && !roles.includes(user?.role || '')) {
        return <Navigate to="/" replace />;
    }
    return <MainLayout>{children}</MainLayout>;
};

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/map" 
                        element={
                            <ProtectedRoute>
                                <MapPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/reports" 
                        element={
                            <ProtectedRoute>
                                <ReportsPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/reports/create" 
                        element={
                            <ProtectedRoute>
                                <CreateReportPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/reports/:id" 
                        element={
                            <ProtectedRoute>
                                <ReportShowPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/buildings" 
                        element={
                            <ProtectedRoute roles={['staff', 'admin']}>
                                <BuildingsPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/buildings/:id" 
                        element={
                            <ProtectedRoute roles={['staff', 'admin']}>
                                <BuildingShowPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/facilities" 
                        element={
                            <ProtectedRoute roles={['staff', 'admin']}>
                                <FacilitiesPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/facilities/:id" 
                        element={
                            <ProtectedRoute roles={['staff', 'admin']}>
                                <FacilityShowPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/categories" 
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <CategoriesPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/users" 
                        element={
                            <ProtectedRoute roles={['admin']}>
                                <UsersPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route 
                        path="/search" 
                        element={
                            <ProtectedRoute>
                                <AdvancedSearchPage />
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
            <Toaster position="top-right" />
        </QueryClientProvider>
    );
}

export default App;
