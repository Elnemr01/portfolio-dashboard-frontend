import { useFormik } from 'formik'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import client from '@/api/axios'
import toast from 'react-hot-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

const AddSkills = () => {
    const navigate = useNavigate();
    const location=useLocation();

    const id=location.state?.id;
    const data=location.state?.data;
    const edit=location.state?.edit;

    const {mutate:addSkill ,isPending} = useMutation({
        mutationKey:['addSkill'],
        mutationFn: async (values) => await client.post('/api/skills', values),

        onSuccess: () => {
            toast.success('Skill added successfully')
            navigate('/skills')
        },
        onError: () => {
            toast.error('Failed to add skill')
        }
    })


    // edit skill 
    const {mutate:editkill ,isPending :editPending} = useMutation({
        mutationKey:['editkill'],
        mutationFn: async (values) => await client.patch(`/api/skills/${id}`, values),

        onSuccess: () => {
            toast.success('Skill edited successfully')
            navigate('/skills')
        },
        onError: () => {
            toast.error('Failed to edit skill')
        }
    })

    const formik = useFormik({
        initialValues: edit ? {
            skillName: data.skillName,
            catogery: data.catogery || 'frontend'
        } : {
            skillName: '',
            catogery: 'frontend'
        },
        onSubmit: (values) => {

            if(edit){
                editkill(values);
            }
            else {
                addSkill(values);
            }
        }
    })

    const categories = useMemo(()=> [
        { value: 'frontend', label: 'Frontend' },
        { value: 'backend', label: 'Backend' },
        { value: 'other', label: 'Other' }
    ],[]);

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{edit ? 'Edit' : 'Add'} Skill</h2>
                            <p className="mt-1 text-gray-600">Add a new skill to your portfolio</p>
                        </div>
                        <Link to="/skills" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                            ← Back to Skills
                        </Link>
                    </div>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="skillName" className="block text-sm font-medium text-gray-700 mb-1">
                                Skill Name
                            </label>
                            <input
                                id="skillName"
                                name="skillName"
                                type="text"
                                required
                                value={formik.values.skillName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                placeholder="e.g., React, Node.js, TypeScript"
                            />
                        </div>

                        <div>
                            <label htmlFor="catogery" className="block text-sm font-medium text-gray-700 mb-1">
                                Category
                            </label>
                            <select
                                id="catogery"
                                required
                                name="catogery"
                                value={formik.values.catogery}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors bg-white"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                            <Link
                                to="/skills"
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
                                    <span>{isPending ? 'Adding...' : 'Add Skill'}</span>
                                :
                                <span>
                                    {editPending && edit ? 'Editing...' : 'Edit Skill'}
                                </span>
}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddSkills