import React, { useState } from 'react';
import { AuthProvider, useAuth, ProtectedRoute } from '../components/AuthContext';
import { FileUploader } from '../components/FileUploader';
import { RichTextEditor } from '../components/RichTextEditor';
import { useProjects, useGallery } from '../contexts/DataContext';
import type { FileUpload, BlogPost, Project, GalleryImage } from '../types';
import '../styles/pages/admin.scss';

// 模拟上传API - 移动到组件外部
const mockUploadAPI = async (formData: FormData): Promise<FileUpload> => {
  const file = formData.get('file') as File;
  const category = formData.get('category') as string;

  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

  const mockResult: FileUpload = {
    id: Date.now() + Math.floor(Math.random() * 1000),
    originalName: file.name,
    filename: `${Date.now()}_${file.name}`,
    mimeType: file.type,
    size: file.size,
    url: URL.createObjectURL(file),
    category: category as 'image' | 'document' | 'video' | 'audio',
    uploadedAt: new Date().toISOString(),
    uploadedBy: 1,
    metadata: {
      width: file.type.startsWith('image/') ? 1920 : undefined,
      height: file.type.startsWith('image/') ? 1080 : undefined,
    },
  };

  return mockResult;
};

// 登录页面组件
const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (username.trim() && password.trim()) {
      const success = await login({ username, password });
      if (!success) {
        setError('登录失败，请检查用户名和密码');
      }
    } else {
      setError('请输入用户名和密码');
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-container">
          <div className="login-header">
            <h1>Tiny Room</h1>
            <h2>内容管理系统</h2>
            <p>欢迎回来，请登录您的账户</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="username">用户名</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="请输入用户名"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">密码</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="请输入密码"
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  登录中...
                </>
              ) : (
                '登录'
              )}
            </button>
          </form>

          <div className="login-demo-info">
            <h3>🎯 演示账号信息</h3>
            <div className="demo-accounts">
              <div className="demo-account">
                <strong>管理员账号：</strong>
                <br />
                用户名：<code>admin</code>
                <br />
                密码：<code>admin123</code>
              </div>
              <div className="demo-account">
                <strong>编辑账号：</strong>
                <br />
                用户名：<code>editor</code>
                <br />
                密码：<code>editor123</code>
              </div>
              <div className="demo-note">
                <em>💡 提示：这是演示模式，任何非空用户名密码都可以登录</em>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// 管理面板组件
const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user, logout } = useAuth();

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <h1>Tiny Room 管理面板</h1>
        <div className="user-info">
          <span>欢迎，{user?.displayName}</span>
          <button onClick={logout} className="logout-btn">
            退出登录
          </button>
        </div>
      </header>

      <nav className="admin-nav">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >
          仪表板
        </button>
        <button
          className={activeTab === 'projects' ? 'active' : ''}
          onClick={() => setActiveTab('projects')}
        >
          项目管理
        </button>
        <button
          className={activeTab === 'gallery' ? 'active' : ''}
          onClick={() => setActiveTab('gallery')}
        >
          相册管理
        </button>
        <button
          className={activeTab === 'blog' ? 'active' : ''}
          onClick={() => setActiveTab('blog')}
        >
          博客管理
        </button>
      </nav>

      <main className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-overview">
            <h2>系统概览</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>项目总数</h3>
                <p className="stat-number">12</p>
              </div>
              <div className="stat-card">
                <h3>相册图片</h3>
                <p className="stat-number">45</p>
              </div>
              <div className="stat-card">
                <h3>博客文章</h3>
                <p className="stat-number">8</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <div className="projects-management">
            <h2>项目管理</h2>
            <p>项目管理功能正在开发中...</p>
          </div>
        )}

        {activeTab === 'gallery' && (
          <div className="gallery-management">
            <h2>相册管理</h2>
            <p>相册管理功能正在开发中...</p>
          </div>
        )}

        {activeTab === 'blog' && (
          <div className="blog-management">
            <h2>博客管理</h2>
            <p>博客管理功能正在开发中...</p>
          </div>
        )}
      </main>
    </div>
  );
};

// 主组件：使用认证检查
const AdminPageContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner"></div>
        <p>正在加载...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <AdminDashboard />;
};

const AdminPage: React.FC = () => {
  return (
    <AuthProvider>
      <AdminPageContent />
    </AuthProvider>
  );
};

export default AdminPage;
