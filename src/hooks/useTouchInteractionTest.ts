'use client'

import { useEffect, useState, useCallback } from 'react'

interface TouchTestResult {
  element: string
  touchStart: number
  touchEnd: number
  duration: number
  success: boolean
  issues: string[]
}

interface TouchTestConfig {
  minTouchTarget: number // 最小触控目标尺寸 (44px)
  maxResponseTime: number // 最大响应时间 (100ms)
  enableLogging: boolean
}

const defaultConfig: TouchTestConfig = {
  minTouchTarget: 44,
  maxResponseTime: 100,
  enableLogging: false
}

export function useTouchInteractionTest(config: Partial<TouchTestConfig> = {}) {
  const [testResults, setTestResults] = useState<TouchTestResult[]>([])
  const [isTestingMode, setIsTestingMode] = useState(false)
  const [touchElements, setTouchElements] = useState<Element[]>([])
  
  const finalConfig = { ...defaultConfig, ...config }

  // 检查元素是否符合触控标准
  const checkTouchTarget = useCallback((element: Element): string[] => {
    const issues: string[] = []
    const rect = element.getBoundingClientRect()
    
    // 检查最小触控目标尺寸
    if (rect.width < finalConfig.minTouchTarget || rect.height < finalConfig.minTouchTarget) {
      issues.push(`触控目标过小: ${Math.round(rect.width)}×${Math.round(rect.height)}px (建议: ${finalConfig.minTouchTarget}×${finalConfig.minTouchTarget}px)`)
    }
    
    // 检查是否有足够的间距
    const siblings = Array.from(element.parentElement?.children || [])
    const elementIndex = siblings.indexOf(element)
    
    if (elementIndex > 0) {
      const prevSibling = siblings[elementIndex - 1]
      const prevRect = prevSibling.getBoundingClientRect()
      const gap = rect.top - (prevRect.top + prevRect.height)
      
      if (gap < 8) {
        issues.push(`与相邻元素间距过小: ${Math.round(gap)}px (建议: ≥8px)`)
      }
    }
    
    return issues
  }, [finalConfig.minTouchTarget])

  // 扫描页面中的可交互元素
  const scanTouchElements = useCallback(() => {
    const selectors = [
      'button',
      'a[href]',
      '[role="button"]',
      '[onclick]',
      'input[type="button"]',
      'input[type="submit"]',
      '[tabindex="0"]',
      '.cursor-pointer'
    ]
    
    const elements = document.querySelectorAll(selectors.join(', '))
    const visibleElements = Array.from(elements).filter(el => {
      const rect = el.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0
    })
    
    setTouchElements(visibleElements)
    
    if (finalConfig.enableLogging) {
      console.log(`发现 ${visibleElements.length} 个可交互元素`)
    }
  }, [finalConfig.enableLogging])

  // 测试单个元素的触控响应
  const testElementTouch = useCallback((element: Element): TouchTestResult => {
    const elementName = element.tagName.toLowerCase() + 
      (element.className ? `.${element.className.split(' ')[0]}` : '') +
      (element.id ? `#${element.id}` : '')
    
    const issues = checkTouchTarget(element)
    const touchStart = performance.now()
    
    // 模拟触控事件
    const touchEvent = new TouchEvent('touchstart', {
      bubbles: true,
      cancelable: true,
      touches: [{
        identifier: 0,
        target: element,
        clientX: element.getBoundingClientRect().left + element.getBoundingClientRect().width / 2,
        clientY: element.getBoundingClientRect().top + element.getBoundingClientRect().height / 2,
        pageX: 0,
        pageY: 0,
        screenX: 0,
        screenY: 0,
        radiusX: 0,
        radiusY: 0,
        rotationAngle: 0,
        force: 1
      }] as any
    })
    
    element.dispatchEvent(touchEvent)
    const touchEnd = performance.now()
    const duration = touchEnd - touchStart
    
    if (duration > finalConfig.maxResponseTime) {
      issues.push(`响应时间过长: ${Math.round(duration)}ms (建议: ≤${finalConfig.maxResponseTime}ms)`)
    }
    
    return {
      element: elementName,
      touchStart,
      touchEnd,
      duration,
      success: issues.length === 0,
      issues
    }
  }, [checkTouchTarget, finalConfig.maxResponseTime])

  // 运行完整的触控测试
  const runTouchTest = useCallback(async () => {
    if (!isTestingMode) return
    
    const results: TouchTestResult[] = []
    
    for (const element of touchElements) {
      const result = testElementTouch(element)
      results.push(result)
      
      // 添加小延迟避免阻塞UI
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    
    setTestResults(results)
    
    if (finalConfig.enableLogging) {
      const passedTests = results.filter(r => r.success).length
      console.log(`触控测试完成: ${passedTests}/${results.length} 通过`)
    }
  }, [isTestingMode, touchElements, testElementTouch, finalConfig.enableLogging])

  // 开始测试模式
  const startTesting = useCallback(() => {
    setIsTestingMode(true)
    scanTouchElements()
  }, [scanTouchElements])

  // 停止测试模式
  const stopTesting = useCallback(() => {
    setIsTestingMode(false)
    setTestResults([])
    setTouchElements([])
  }, [])

  // 获取测试统计
  const getTestStats = useCallback(() => {
    const total = testResults.length
    const passed = testResults.filter(r => r.success).length
    const failed = total - passed
    const avgResponseTime = testResults.length > 0 
      ? testResults.reduce((sum, r) => sum + r.duration, 0) / testResults.length 
      : 0
    
    return {
      total,
      passed,
      failed,
      passRate: total > 0 ? (passed / total) * 100 : 0,
      avgResponseTime: Math.round(avgResponseTime * 100) / 100
    }
  }, [testResults])

  // 自动运行测试当进入测试模式时
  useEffect(() => {
    if (isTestingMode && touchElements.length > 0) {
      runTouchTest()
    }
  }, [isTestingMode, touchElements, runTouchTest])

  // 监听窗口大小变化，重新扫描元素
  useEffect(() => {
    if (!isTestingMode) return
    
    const handleResize = () => {
      scanTouchElements()
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isTestingMode, scanTouchElements])

  return {
    // 状态
    isTestingMode,
    testResults,
    touchElements: touchElements.length,
    
    // 操作
    startTesting,
    stopTesting,
    runTouchTest,
    scanTouchElements,
    
    // 数据
    getTestStats,
    
    // 配置
    config: finalConfig
  }
}