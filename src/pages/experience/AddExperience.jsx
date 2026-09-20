import { useFormik } from 'formik'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import client from '@/api/axios'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'

const AddExperience = () => {
    const navigate = useNavigate();
    const myLocation = useLocation();

    const id = myLocation.state?.id;
    const data = myLocation.state?.data;
    const edit = myLocation.state?.edit;


    const { mutate: addExperience, isPending } = useMutation({
        mutationKey: ['addExperience'],
        mutationFn: async (values) => await client.post('/api/experiences', values),

        onSuccess: () => {
            toast.success('Experience added successfully')
            navigate('/experiences')
        },
        onError: () => {
            toast.error('Failed to add experience')
        }
    })

    // edit experience
    const { mutate: editExperience, isPending: editPending } = useMutation({
        mutationKey: ['editExperience'],
        mutationFn: async (values) => await client.patch(`/api/experiences/${id}`, values),

        onSuccess: () => {
            toast.success('Experience edited successfully')
            navigate('/experiences')
        },
        onError: () => {
            toast.error('Failed to edit experience')
        }
    })


    const formik = useFormik({
        initialValues: edit ? {
            title: data.title,
            subtitle: data.subtitle || '',
            location: data.location,
            duration: data.duration || '',
            description: data.description?.length ? data.description : ['']
        } : {
            title: '',
            subtitle: '',
            location: '',
            duration: '',
            description: ['']
        },
        onSubmit: (values) => {

            if (edit) {
                editExperience(values);
            } else {
                addExperience(values);
            }
        }
    })

    

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

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{edit ? 'Edit' : 'Add'} Experience</h2>
                            <p className="mt-1 text-gray-600">Add a new experience to your portfolio</p>
                        </div>
                        <Link to="/experiences" className="text-indigo-600 hover:text-indigo-500 text-sm font-medium">
                            ← Back to Experiences
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
                                placeholder="e.g., Frontend Developer"
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
                                placeholder="e.g., Company Name"
                            />
                        </div>

                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
                                Duration
                            </label>
                            <input
                                id="duration"
                                name="duration"
                                type="text"
                                required
                                value={formik.values.duration}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                placeholder="e.g., Jan 2023 - Present"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Location
                            </label>
                            <div className="space-y-2">
                                <div className="flex gap-2">
                                    <input
                                        id='location'
                                        type="text"
                                        required
                                        name='location'
                                        placeholder='location'
                                        value={formik.values.location}
                                        onChange={formik.handleChange}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                                    />
                                </div>
                                
                            </div>
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

                        <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                            <Link
                                to="/experiences"
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
                                    <span>{isPending ? 'Adding...' : 'Add Experience'}</span>
                                    :
                                    <span>{editPending ? 'Editing...' : 'Edit Experience'}</span>
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddExperience