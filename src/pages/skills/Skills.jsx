import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import client from '@/api/axios'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Pagination from '@/components/pagination/Pagination'

const Skills = () => {
    
    const [page, setPage] = useState(1)
    const {data: skills ,isLoading, isError}=useQuery({
        queryKey: ['skills',page],
        queryFn: async () => await client.get(`/api/skills?page=${page}`).then(res => res.data),
    })

    // delete skill
        const queryClient = useQueryClient()
        const {mutate:deleteSkill ,isPending , variables} = useMutation({
            mutationKey:['deleteSkill'],
            mutationFn: async (id) => await client.delete(`/api/skills/${id}`),
    
            onSuccess: () => {
                toast.success('Skill deleted successfully')
                queryClient.invalidateQueries(['skills'])
            },
            onError: () => {
                toast.error('Failed to delete skill')
            }
        })
    

    const categoryColors = useMemo(() => ({
        frontend: 'bg-blue-100 text-blue-800',
        backend: 'bg-green-100 text-green-800',
        devops: 'bg-yellow-100 text-yellow-800',
        default: 'bg-gray-100 text-gray-800',
    }), [])

    if (isLoading) return <div className="p-8 text-center">Loading skills...</div>
    if (isError) return <div className="p-8 text-center text-red-600">Error loading skills</div>

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
                        <p className="mt-1 text-gray-600">Manage your skills</p>
                    </div>
                    <Link
                        to="/add-skill"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Add Skill
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                        <>
            

                            <div className="divide-y divide-gray-200">
                                {skills?.data?.skills.map((skill) => (
                                    <div key={skill._id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="p-2 bg-indigo-100 rounded-lg">
                                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-gray-900">{skill.skillName}</h3>
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[skill.catogery] || categoryColors.default}`}>
                                                    {skill.catogery?.charAt(0).toUpperCase() + skill.catogery?.slice(1) || 'Unknown'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="btns">
                                            <button
                                            onClick={() => deleteSkill(skill._id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                                            >
                                                {isPending && variables === skill._id ? 'deleting': 'delete'}
                                            </button>
                                            <Link
                                            state={{ id: skill._id,data: skill ,edit:true}}
                                                to={`/add-skill`}
                                                className="p-2 text-blue-600 rounded-lg cursor-pointer transition-colors"
                                            >
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Pagination response={skills} page={page} setFun={setPage} name="skills"/>
                        </>
                </div>
            </div>
        </div>
    )
}

export default Skills