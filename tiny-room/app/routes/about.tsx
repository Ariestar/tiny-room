export default function About() {
  return (
    <main className="container mx-auto p-4 pt-16">
      <section className="about-header mb-12">
        <h1 className="text-3xl font-bold mb-6">关于我</h1>
        <p className="text-lg mb-4">
          我是一名充满激情的前端开发者，专注于创建美观且功能强大的网站和应用程序。
        </p>
      </section>

      <section className="about-bio mb-12">
        <h2 className="text-2xl font-semibold mb-4">个人简介</h2>
        <p className="mb-4">
          我拥有超过5年的Web开发经验，擅长使用现代前端技术栈构建响应式、高性能的Web应用。
          我热爱学习新技术，并且相信良好的用户体验是成功产品的关键。
        </p>
        <p>除了编程，我还喜欢摄影、旅行和阅读。这些爱好帮助我保持创造力，并从不同角度思考问题。</p>
      </section>

      <section className="skills mb-12">
        <h2 className="text-2xl font-semibold mb-4">技能与专长</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="skill-category">
            <h3 className="text-xl font-medium mb-3">前端开发</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>React & React Router</li>
              <li>TypeScript</li>
              <li>CSS/SCSS</li>
              <li>Tailwind CSS</li>
              <li>Framer Motion</li>
            </ul>
          </div>

          <div className="skill-category">
            <h3 className="text-xl font-medium mb-3">工具与方法</h3>
            <ul className="list-disc list-inside space-y-1">
              <li>Git 版本控制</li>
              <li>Vite</li>
              <li>响应式设计</li>
              <li>性能优化</li>
              <li>Web 无障碍</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="experience mb-12">
        <h2 className="text-2xl font-semibold mb-4">工作经历</h2>

        <div className="timeline space-y-8">
          <div className="timeline-item">
            <div className="flex items-baseline">
              <h3 className="text-xl font-medium">高级前端开发工程师</h3>
              <span className="mx-2">•</span>
              <span className="text-gray-500">某科技公司</span>
              <span className="ml-auto text-gray-500">2021 - 现在</span>
            </div>
            <p className="mt-2">
              负责公司核心产品的前端架构和开发，优化用户体验和性能，指导初级开发者。
            </p>
          </div>

          <div className="timeline-item">
            <div className="flex items-baseline">
              <h3 className="text-xl font-medium">前端开发工程师</h3>
              <span className="mx-2">•</span>
              <span className="text-gray-500">某网络公司</span>
              <span className="ml-auto text-gray-500">2018 - 2021</span>
            </div>
            <p className="mt-2">参与多个Web应用项目的开发，负责UI组件库的维护和文档编写。</p>
          </div>
        </div>
      </section>

      <section className="education mb-12">
        <h2 className="text-2xl font-semibold mb-4">教育背景</h2>

        <div className="timeline space-y-6">
          <div className="timeline-item">
            <div className="flex items-baseline">
              <h3 className="text-xl font-medium">计算机科学学士</h3>
              <span className="mx-2">•</span>
              <span className="text-gray-500">某大学</span>
              <span className="ml-auto text-gray-500">2014 - 2018</span>
            </div>
            <p className="mt-2">主修计算机科学，辅修设计。参与多个学生项目和比赛。</p>
          </div>
        </div>
      </section>

      <section className="contact-cta">
        <h2 className="text-2xl font-semibold mb-4">联系我</h2>
        <p className="mb-6">如果您对我的工作感兴趣，或者有任何问题，欢迎随时联系我。</p>
        <a
          href="/contact"
          className="inline-block bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors"
        >
          联系方式
        </a>
      </section>
    </main>
  );
}
