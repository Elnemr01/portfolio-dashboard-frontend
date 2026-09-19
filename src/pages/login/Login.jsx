    import client from '@/api/axios';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useFormik } from 'formik'
import toast from 'react-hot-toast';
    import { useNavigate } from 'react-router-dom'

    const Login = () => {
    const navigate = useNavigate();
    const {mutate: login,isPending}=useMutation({
        mutationKey:['login'],
        mutationFn: async (data)=> client.post("/api/access",data),
        onSuccess: ()=>{
            toast.success('Login successful');
            localStorage.setItem('access', 'loggedin');
            navigate('/', { replace: true });
        },
        onError: (error)=>{
            toast.error('Login failed');
        }
    })

    const formik = useFormik({
        initialValues: {
        password: '',
        },
        validate: (values) => {
        const errors = {}
        if (!values.password) {
            errors.password = 'Password is required'
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at least 6 characters'
        }
        return errors
        },
        onSubmit: (values, { setSubmitting, setErrors }) => {
        if (values.password === 'admin123') {
            localStorage.setItem('access', 'true')
            navigate('/', { replace: true })
        } else {
            setErrors({ password: 'Invalid password' })
        }
        setSubmitting(false)
        },
    })

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
            <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                Sign in to dashboard
            </h2>
            </div>
            <form className="mt-8 space-y-6" onSubmit={formik.handleSubmit}>
            <div className="rounded-md shadow-sm -space-y-px">
                <div>
                <label htmlFor="password" className="sr-only">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                    formik.touched.password && formik.errors.password
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:border-red-500 focus:ring-red-500'
                        : 'border-gray-300 placeholder-gray-500 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500'
                    } rounded-t-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:z-10 sm:text-sm`}
                    placeholder="Password"
                />
                {formik.touched.password && formik.errors.password && (
                    <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p>
                )}
                </div>
            </div>

            <div>
                <button
                type="submit"
                disabled={formik.isSubmitting}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {formik.isSubmitting ? 'Signing in...' : 'Sign in'}
                </button>
            </div>
            </form>
        </div>
        </div>
    )
    }

    export default Login