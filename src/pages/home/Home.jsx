import { useMemo } from 'react'
import { Link } from 'react-router-dom'


const Home = () => {
    const routes = useMemo(()=> [
      { path: '/projects', label: 'View Projects', description: 'Browse and manage all projects' },
      { path: '/add-project', label: 'Add Project', description: 'Create a new project entry' },
      { path: '/experiences', label: 'View Experiences', description: 'Browse and manage all experiences' },
      { path: '/add-experience', label: 'Add Experience', description: 'Create a new experience entry' },
      { path: '/skills', label: 'View Skills', description: 'Browse and manage all skills' },
      { path: '/add-skill', label: 'Add Skill', description: 'Create a new skill entry' },
    ], [])

  return (
    <div className="min-h-screen bg-gray-50">

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Welcome to the Dashboard
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Manage your portfolio from here
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-100 hover:border-gray-200"
            >
              <h3 className="text-xl font-semibold text-gray-900">{route.label}</h3>
              <p className="mt-2 text-gray-600">{route.description}</p>
              <span className="mt-4 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Go →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Home