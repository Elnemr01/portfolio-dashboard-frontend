import { useFormik } from 'formik'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import client from '@/api/axios'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState } from 'react'

const AddProject = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [page,setPage]=useState(1);

    const id = location.state?.id;
    const data = location.state?.data;
    const edit = location.state?.edit;

    const { data: skillsList, isLoading: skillsLoading } = useQuery({
        queryKey: ['skills', page],
        queryFn: async () => await client.get(`/api/skills?page=${page}`).then(res => res.data),
    })


    const { mutate: addProject, isPending } = useMutation({
        mutationKey: ['addProject'],
        mutationFn: async (values) => await client.post('/api/projects', values),

        onSuccess: () => {
            toast.success('Project added successfully')
            navigate('/projects')
        },
        onError: () => {
            toast.error('Failed to add project')
        }
    })

    // edit project
    const { mutate: editProject, isPending: editPending } = useMutation({
        mutationKey: ['editProject'],
        mutationFn: async (values) => await client.patch(`/api/projects/${id}`, values),

        onSuccess: () => {
            toast.success('Project edited successfully')
            navigate('/projects')
        },
        onError: () => {
            toast.error('Failed to edit project')
        }
    })

    const formik = useFormik({
        initialValues: edit ? {
            title: data.title,
            subtitle: data.subtitle || '',
            description: data.description?.length ? data.description : [''],
            status: data.status || 'completed',
            skills: data.skills?.map((s) => s._id || s) || [],
            github: data.github || '',
            live: data.live || ''
        } : {
            title: '',
            subtitle: '',
            description: [''],
            status: 'completed',
            skills: [],
            github: '',
            live: ''
        },
        onSubmit: (values) => {
            if (edit) {
                editProject(values);
            } else {
                addProject(values);
            }
        }
    })

    const statusOptions = useMemo(() => [
        { value: 'completed', label: 'Completed' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'planned', label: 'Planned' }
    ], []);

    // description array handlers
    const handleDescriptionChange = (index, value) => {
        const updated = [...formik.values.description];
        updated[index] = value;
        formik.setFieldValue('description', updated);
    }

    const addDescriptionField = () => {
        formik.setFieldValue('description', [...formik.values.description, '']);
    }

    const removeDescriptionField = (index) => {
        const updated = formik.values.description.filter((_, i) => i !== index);
        formik.setFieldValue('description', updated.length ? updated : ['']);
    }

    // skills toggle handler
    const toggleSkill = (skillId) => {
        const current = formik.values.skills;
        if (current.includes(skillId)) {
            formik.setFieldValue('skills', current.filter((s) => s !== skillId));
        } else {
            formik.setFieldValue('skills', [...current, skillId]);
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{edit ? 'Edit' : 'Add'} Project</h2>
                            <p className="mt-1 text-gray-600">Add a new project to your portfolio</p>
                        </div>
                        <Link to="/projects" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                            ← Back to Projects
                        </Link>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                Title
                            </label>
                            <input
                                id="title"
                                name="title"
                                type="text"
                                required
                                value={formik.values.title}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                placeholder="e.g., Portfolio Website"
                            />
                        </div>

                        <div>
                            <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                                Subtitle
                            </label>
                            <input
                                id="subtitle"
                                name="subtitle"
                                type="text"
                                required
                                value={formik.values.subtitle}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                placeholder="e.g., A personal portfolio built with MERN stack"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <div className="space-y-2">
                                {formik.values.description.map((desc, index) => (
                                    <div key={index} className="flex gap-2">
                                        <input
                                            type="text"
                                            value={desc}
                                            required
                                            onChange={(e) => handleDescriptionChange(index, e.target.value)}
                                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                            placeholder={`Point ${index + 1}`}
                                        />
                                        {formik.values.description.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeDescriptionField(index)}
                                                className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={addDescriptionField}
                                className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                + Add another point
                            </button>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
                            >
                                {statusOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Skills
                            </label>
                            {skillsLoading ? (
                                <p className="text-sm text-gray-500">Loading skills...</p>
                            ) : (
                                <>
                                    <div className="flex flex-wrap gap-2">
                                        {skillsList?.data?.skills.map((skill) => {
                                            const selected = formik.values.skills.includes(skill._id);
                                            return (
                                                <button
                                                    type="button"
                                                    key={skill._id}
                                                    onClick={() => toggleSkill(skill._id)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                                                        selected
                                                            ? 'bg-indigo-600 text-white border-indigo-600'
                                                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {skill.skillName}
                                                </button>
                                            )
                                        })}
                                    </div>
                                    <div className="butns flex justify-between mt-2 ">
                                        {<button onClick={()=> setPage(old => old-1)} type="button" 
                                            className={`text-white bg-indigo-600 w-fit p-4 rounded-full py-2  ${page <= 1 ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}>
                                            previous
                                        </button> }
                                        { <button 
                                        className={`text-white bg-indigo-600 w-fit p-4 rounded-full py-2
                                            ${skillsList?.data?.skills.length == 0 ?'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}`}
                                        onClick={()=> setPage(old => old+1)} type="button">
                                            next
                                        </button>}
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="github" className="block text-sm font-medium text-gray-700 mb-1">
                                    GitHub Link
                                </label>
                                <input
                                    id="github"
                                    name="github"
                                    type="text"
                                    value={formik.values.github}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                    placeholder="https://github.com/username/repo"
                                />
                            </div>

                            <div>
                                <label htmlFor="live" className="block text-sm font-medium text-gray-700 mb-1">
                                    Live Link
                                </label>
                                <input
                                    id="live"
                                    name="live"
                                    type="text"
                                    value={formik.values.live}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                    placeholder="https://myproject.com"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                            <Link
                                to="/projects"
                                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                            >
                                {
                                    !edit ?
                                    <span>{isPending ? 'Adding...' : 'Add Project'}</span>
                                    :
                                    <span>{editPending ? 'Editing...' : 'Edit Project'}</span>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddProject