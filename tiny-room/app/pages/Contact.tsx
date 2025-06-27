import { useState } from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from 'react-icons/fa';

export default function Contact() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [formStatus, setFormStatus] = useState<{
    submitted: boolean;
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 在实际应用中，这里会发送表单数据到后端
    // 这里仅模拟提交
    console.log('Form submitted:', formState);

    // 模拟成功提交
    setFormStatus({
      submitted: true,
      success: true,
      message: '消息已发送！我会尽快回复您。',
    });

    // 重置表单
    setFormState({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <main className="container mx-auto p-4 pt-16">
      <section className="contact-header mb-12">
        <h1 className="text-3xl font-bold mb-6">联系我</h1>
        <p className="text-lg">有问题或合作意向？请随时与我联系。</p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="contact-form">
          <h2 className="text-2xl font-semibold mb-6">发送消息</h2>

          {formStatus && (
            <div
              className={`p-4 mb-6 rounded-md ${formStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {formStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                姓名
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formState.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                电子邮件
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formState.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="subject" className="block text-sm font-medium mb-1">
                主题
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formState.subject}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-sm font-medium mb-1">
                消息
              </label>
              <textarea
                id="message"
                name="message"
                value={formState.message}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-colors"
            >
              发送消息
            </button>
          </form>
        </section>

        <section className="contact-info">
          <h2 className="text-2xl font-semibold mb-6">联系方式</h2>

          <div className="space-y-6">
            <div className="flex items-start">
              <div className="text-teal-600 mr-4 mt-1">
                <FaEnvelope size={20} />
              </div>
              <div>
                <h3 className="font-medium">电子邮件</h3>
                <p className="text-gray-600">example@example.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-teal-600 mr-4 mt-1">
                <FaPhone size={20} />
              </div>
              <div>
                <h3 className="font-medium">电话</h3>
                <p className="text-gray-600">+86 123 4567 8910</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="text-teal-600 mr-4 mt-1">
                <FaMapMarkerAlt size={20} />
              </div>
              <div>
                <h3 className="font-medium">地址</h3>
                <p className="text-gray-600">北京市朝阳区某某路123号</p>
              </div>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4">社交媒体</h3>
            <div className="flex space-x-4">
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                <FaLinkedin size={24} />
              </a>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-teal-600 transition-colors"
              >
                <FaTwitter size={24} />
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
