import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Import views (Lazy loading)
const Login = () => import('@/views/Login.vue')
const AdminDashboard = () => import('@/views/admin/Dashboard.vue')
const CollegeDashboard = () => import('@/views/college/Dashboard.vue')
const FacultyDashboard = () => import('@/views/faculty/Dashboard.vue')

const routes = [
    {
        path: '/',
        redirect: (to) => {
            // If we have a user in store (persisted), redirect to their dashboard, otherwise login
            // NOTE: Since we don't have persistence in this mock yet (besides memory), 
            // it will likely go to login on hard refresh.
            return '/login'
        }
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { guest: true }
    },
    {
        path: '/admin/dashboard',
        name: 'AdminDashboard',
        component: AdminDashboard,
        meta: { requiresAuth: true, role: 'SUPER_ADMIN' }
    },
    {
        path: '/college/dashboard',
        name: 'CollegeDashboard',
        component: CollegeDashboard,
        meta: { requiresAuth: true, role: 'COLLEGE_ADMIN' }
    },
    {
        path: '/faculty/dashboard',
        name: 'FacultyDashboard',
        component: FacultyDashboard,
        meta: { requiresAuth: true, role: 'FACULTY' }
    },
    // Catch all -> Redirect to Login
    {
        path: '/:pathMatch(.*)*',
        redirect: '/login'
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    // 1. Check if route requires auth
    if (to.meta.requiresAuth) {
        if (!auth.isAuthenticated) {
            return next('/login')
        }

        // 2. Check Role Permissions
        if (to.meta.role && auth.user?.role !== to.meta.role) {
            // Redirect to correct dashboard based on actual role if they try to access wrong one
            if (auth.user?.role === 'SUPER_ADMIN') return next('/admin/dashboard')
            if (auth.user?.role === 'COLLEGE_ADMIN') return next('/college/dashboard')
            if (auth.user?.role === 'FACULTY') return next('/faculty/dashboard')
            return next('/login') // Fallback
        }
    }

    // 3. Guest only routes (Login) - Prevent access if logged in
    if (to.meta.guest && auth.isAuthenticated) {
        if (auth.user?.role === 'SUPER_ADMIN') return next('/admin/dashboard')
        if (auth.user?.role === 'COLLEGE_ADMIN') return next('/college/dashboard')
        if (auth.user?.role === 'FACULTY') return next('/faculty/dashboard')
    }

    next()
})

export default router
