import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '@/api/axios'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Pagination from '@/components/pagination/Pagination'

const Projects = () => {
    const [page, setPage] = useState(1)
    const { data: projects, isLoading, isError } = useQuery({
        queryKey: ['projects',page],
        queryFn: async () => await client.get(`/api/projects?page=${page}`).then(res => res.data),
    })
    
    



    // delete project
    const queryClient = useQueryClient()
    const { mutate: deleteProject, isPending, variables } = useMutation({
        mutationKey: ['deleteProject'],
        mutationFn: async (id) => await client.delete(`/api/projects/${id}`),

        onSuccess: () => {
            toast.success('Project deleted successfully')
            queryClient.invalidateQueries(['projects'])
        },
        onError: () => {
            toast.error('Failed to delete project')
        }
    })

    const statusColors = useMemo(() => ({
        completed: 'bg-green-100 text-green-800',
        'in-progress': 'bg-yellow-100 text-yellow-800',
        planned: 'bg-gray-100 text-gray-800',
        default: 'bg-gray-100 text-gray-800',
    }), [])

    if (isLoading) return <div className="p-8 text-center">Loading projects...</div>
    if (isError) return <div className="p-8 text-center text-red-600">Error loading projects</div>

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
                        <p className="mt-1 text-gray-600">Manage your projects</p>
                    </div>
                    <Link
                        to="/add-project"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Add Project
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {projects?.data?.projects.map((project) => (
                            <div key={project._id} className="px-6 py-4 flex items-start justify-between hover:bg-gray-50">
                                <div className="flex items-start gap-4">

                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-medium text-gray-900">{project.title}</h3>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[project.status] || statusColors.default}`}>
                                                {project.status}
                                            </span>
                                        </div>

                                        {project.subtitle && (
                                            <p className="text-sm text-gray-500 mt-0.5">{project.subtitle}</p>
                                        )}

                                        {project.description?.length > 0 && (
                                            <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                                                {project.description.map((desc, i) => (
                                                    <li key={i}>{desc}</li>
                                                ))}
                                            </ul>
                                        )}

                                        {project.skills?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-2">
                                                {project.skills.map((skill) => (
                                                    <span
                                                        key={skill._id}
                                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700"
                                                    >
                                                        {skill.skillName}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex gap-4 mt-2">
                                            {project.github && (
                                                <a
                                                    href={project.github}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                                                >
                                                    GitHub ↗
                                                </a>
                                            )}
                                            {project.live && (
                                                <a
                                                    href={project.live}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-indigo-600 hover:text-indigo-500 font-medium"
                                                >
                                                    Live ↗
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="btns flex gap-2 shrink-0">
                                    <button
                                        onClick={() => deleteProject(project._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                    >
                                        {isPending && variables === project._id ? 'deleting' : 'delete'}
                                    </button>
                                    <Link
                                        state={{ id: project._id, data: project, edit: true }}
                                        to={`/add-project`}
                                        className="p-2 text-blue-600 rounded-lg cursor-pointer transition-colors"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination response={projects} page={page} setFun={setPage} name="projects" />
                </div>
            </div>
        </div>
    )
}

export default Projects