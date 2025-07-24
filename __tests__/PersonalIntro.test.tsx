import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PersonalIntro } from '../feature/personal/PersonalIntro'

// Mock framer-motion to avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }: any) => children,
}))

describe('PersonalIntro Component', () => {
    it('renders personal information correctly', () => {
        render(<PersonalIntro />)

        // 检查基本信息是否显示
        expect(screen.getByText('嗨，我是 Tiny Room 👋')).toBeInTheDocument()
        expect(screen.getByText('一个热爱代码和创意的数字工匠')).toBeInTheDocument()

        // 检查基本信息项
        expect(screen.getByText('📍 地球某个角落')).toBeInTheDocument()
        expect(screen.getByText('🎂 永远18岁')).toBeInTheDocument()
        expect(screen.getByText('☕ 咖啡驱动的程序员')).toBeInTheDocument()
    })

    it('expands and collapses detailed information', async () => {
        const user = userEvent.setup()
        render(<PersonalIntro />)

        const expandButton = screen.getByRole('button', { name: /了解更多/ })
        expect(expandButton).toBeInTheDocument()

        // 点击展开
        await user.click(expandButton)

        // 等待展开动画完成并检查按钮文本变化
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /收起详情/ })).toBeInTheDocument()
        })

        // 点击收起
        const collapseButton = screen.getByRole('button', { name: /收起详情/ })
        await user.click(collapseButton)

        // 检查按钮文本恢复
        await waitFor(() => {
            expect(screen.getByRole('button', { name: /了解更多/ })).toBeInTheDocument()
        })
    })

    it('has proper accessibility attributes', () => {
        render(<PersonalIntro />)

        const expandButton = screen.getByRole('button', { name: /了解更多/ })

        // 检查无障碍属性
        expect(expandButton).toHaveAttribute('aria-expanded', 'false')
        expect(expandButton).toHaveAttribute('aria-controls', 'personal-details')
        expect(expandButton).toHaveAttribute('aria-label')
    })

    it('supports keyboard navigation', async () => {
        const user = userEvent.setup()
        render(<PersonalIntro />)

        const expandButton = screen.getByRole('button', { name: /了解更多/ })

        // 使用 Tab 键导航到按钮
        await user.tab()
        expect(expandButton).toHaveFocus()

        // 使用 Enter 键激活
        await user.keyboard('{Enter}')

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /收起详情/ })).toBeInTheDocument()
        })
    })

    it('displays interesting facts section', () => {
        render(<PersonalIntro />)

        expect(screen.getByText('有趣的事实')).toBeInTheDocument()
        expect(screen.getByText('披萨是我的第二编程语言')).toBeInTheDocument()
        expect(screen.getByText('夜猫子，最佳工作时间是深夜')).toBeInTheDocument()
    })
})