import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import Home from '../../../src/app/page'

// 扩展 expect 以支持 axe 匹配器
expect.extend(toHaveNoViolations)

// Mock Next.js 相关模块
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
    }),
}))

jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
        button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
        h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
        p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    },
    AnimatePresence: ({ children }: any) => children,
}))

describe('Accessibility Tests', () => {
    it('should not have any accessibility violations on homepage', async () => {
        const { container } = render(<Home />)

        // 等待组件完全渲染
        await new Promise(resolve => setTimeout(resolve, 1000))

        const results = await axe(container)
        expect(results).toHaveNoViolations()
    })

    it('should have proper heading hierarchy', () => {
        const { container } = render(<Home />)

        // 检查是否有 h1 标签
        const h1Elements = container.querySelectorAll('h1')
        expect(h1Elements.length).toBeGreaterThanOrEqual(1)

        // 检查标题层级是否合理
        const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
        const headingLevels = Array.from(headings).map(h => parseInt(h.tagName.charAt(1)))

        // 确保从 h1 开始
        expect(headingLevels[0]).toBe(1)

        // 检查标题层级不跳跃
        for (let i = 1; i < headingLevels.length; i++) {
            const diff = headingLevels[i] - headingLevels[i - 1]
            expect(diff).toBeLessThanOrEqual(1)
        }
    })

    it('should have proper ARIA labels for interactive elements', () => {
        const { container } = render(<Home />)

        // 检查按钮是否有适当的标签
        const buttons = container.querySelectorAll('button')
        buttons.forEach(button => {
            const hasLabel =
                button.textContent?.trim() ||
                button.getAttribute('aria-label') ||
                button.getAttribute('aria-labelledby')

            expect(hasLabel).toBeTruthy()
        })

        // 检查链接是否有适当的标签
        const links = container.querySelectorAll('a')
        links.forEach(link => {
            const hasLabel =
                link.textContent?.trim() ||
                link.getAttribute('aria-label') ||
                link.getAttribute('aria-labelledby')

            expect(hasLabel).toBeTruthy()
        })
    })

    it('should have proper image alt attributes', () => {
        const { container } = render(<Home />)

        const images = container.querySelectorAll('img')
        images.forEach(img => {
            const hasAlt =
                img.getAttribute('alt') !== null ||
                img.getAttribute('aria-label') ||
                img.getAttribute('role') === 'presentation'

            expect(hasAlt).toBeTruthy()
        })
    })

    it('should have proper form labels', () => {
        const { container } = render(<Home />)

        const formElements = container.querySelectorAll('input, textarea, select')
        formElements.forEach(element => {
            const id = element.getAttribute('id')
            const hasLabel =
                (id && container.querySelector(`label[for="${id}"]`)) ||
                element.getAttribute('aria-label') ||
                element.getAttribute('aria-labelledby')

            expect(hasLabel).toBeTruthy()
        })
    })

    it('should have proper focus management', () => {
        const { container } = render(<Home />)

        // 检查可交互元素是否可以获得焦点
        const interactiveElements = container.querySelectorAll(
            'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
        )

        interactiveElements.forEach(element => {
            const tabIndex = element.getAttribute('tabindex')

            // 确保没有使用正数的 tabindex（这会破坏自然的 tab 顺序）
            if (tabIndex && parseInt(tabIndex) > 0) {
                console.warn('Positive tabindex found, which may disrupt natural tab order')
            }
        })
    })
})