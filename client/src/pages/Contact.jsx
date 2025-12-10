import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Contact = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', subject: '', message: '' });
            setLoading(false);
        }, 1000);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div>
            {/* Header */}
            <div className="bg-gray-900 py-12 md:py-16 chess-bg-dark">
                <div className="container text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ color: 'white' }}>
                        {t('footer.contact')}
                    </h1>
                    <p className="text-gray-400">
                        Get in touch with us
                    </p>
                </div>
            </div>

            {/* Content */}
            <section className="py-12 md:py-16">
                <div className="container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-6">
                            <div className="p-6 bg-white border border-gray-200 rounded-xl">
                                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                                    <Mail className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Email</h3>
                                <p className="text-gray-600">contact@pawntoglory.com</p>
                                <p className="text-gray-600">support@pawntoglory.com</p>
                            </div>

                            <div className="p-6 bg-white border border-gray-200 rounded-xl">
                                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                                    <Phone className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Phone</h3>
                                <p className="text-gray-600">+66 2 123 4567</p>
                                <p className="text-gray-600">+66 89 123 4567</p>
                            </div>

                            <div className="p-6 bg-white border border-gray-200 rounded-xl">
                                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Address</h3>
                                <p className="text-gray-600">
                                    123 Chess Street, Bangkok<br />
                                    Thailand 10110
                                </p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                    Send us a message
                                </h2>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('auth.name')}
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="input"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                {t('auth.email')}
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                className="input"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Subject
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="input"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            rows={5}
                                            className="input resize-none"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="btn btn-primary w-full sm:w-auto"
                                    >
                                        {loading ? (
                                            <div className="spinner w-5 h-5 border-2" />
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                {t('common.submit')}
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;
