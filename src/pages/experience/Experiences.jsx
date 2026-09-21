import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import client from '@/api/axios'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Pagination from '@/components/pagination/Pagination'

const Experiences = () => {
    const [page,setPage]= useState(1);
    const { data: experiences, isLoading, isError } = useQuery({
        queryKey: ['experiences',page],
        queryFn: async () => await client.get(`/api/experiences?page=${page}`).then(res => res.data),
    })

    // delete experience
    const queryClient = useQueryClient()
    const { mutate: deleteExperience, isPending, variables } = useMutation({
        mutationKey: ['deleteExperience'],
        mutationFn: async (id) => await client.delete(`/api/experiences/${id}`),

        onSuccess: () => {
            toast.success('Experience deleted successfully')
            queryClient.invalidateQueries(['experiences'])
        },
        onError: () => {
            toast.error('Failed to delete experience')
        }
    })

    if (isLoading) return <div className="p-8 text-center">Loading experiences...</div>
    if (isError) return <div className="p-8 text-center text-red-600">Error loading experiences</div>

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Experiences</h2>
                        <p className="mt-1 text-gray-600">Manage your experiences</p>
                    </div>
                    <Link
                        to="/add-experience"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Add Experience
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="divide-y divide-gray-200">
                        {experiences?.data?.experiences.map((experience) => (
                            <div key={experience._id} className="px-6 py-4 flex items-start justify-between hover:bg-gray-50">
                                <div className="flex items-start gap-4">
                                    <div className="p-2 bg-indigo-100 rounded-lg">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>

                                    <div>
                                        <h3 className="font-medium text-gray-900">{experience.title}</h3>

                                        {experience.subtitle && (
                                            <p className="text-sm text-gray-500 mt-0.5">{experience.subtitle}</p>
                                        )}

                                        {experience.duration && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700">
                                                {experience.duration}
                                            </span>
                                        )}

                                        {experience.location  && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                📍 {experience.location}
                                            </p>
                                        )}

                                        {experience.description?.length > 0 && (
                                            <ul className="mt-1 text-sm text-gray-600 list-disc list-inside">
                                                {experience.description.map((desc, i) => (
                                                    <li key={i}>{desc}</li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>

                                <div className="btns flex gap-2 shrink-0">
                                    <button
                                        onClick={() => deleteExperience(experience._id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                    >
                                        {isPending && variables === experience._id ? 'deleting' : 'delete'}
                                    </button>
                                    <Link
                                        state={{ id: experience._id, data: experience, edit: true }}
                                        to={`/add-experience`}
                                        className="p-2 text-blue-600 rounded-lg cursor-pointer transition-colors"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    <Pagination page={page} setFun={setPage} response={experiences} name="experiences" />
                </div>
            </div>
        </div>
    )
}

export default Experiences