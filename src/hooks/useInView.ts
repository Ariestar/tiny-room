"use client";

import { useEffect, useRef, useState } from "react";

interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

/**
 * 检测元素是否进入视窗的Hook
 * 基于Intersection Observer API实现
 */
export function useInView(options: UseInViewOptions = {}) {
  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
  } = options;

  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // 如果已经触发过且设置了只触发一次，则不再监听
    if (hasTriggered && triggerOnce) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => {
              setIsInView(true);
              if (triggerOnce) {
                setHasTriggered(true);
              }
            }, delay);
          } else {
            setIsInView(true);
            if (triggerOnce) {
              setHasTriggered(true);
            }
          }
        } else if (!triggerOnce) {
          setIsInView(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay, hasTriggered]);

  return {
    ref: elementRef,
    isInView: hasTriggered ? true : isInView,
    hasTriggered,
  };
}

/**
 * 用于多个元素的批量视窗检测Hook
 */
export function useInViewBatch(count: number, options: UseInViewOptions = {}) {
  const [inViewStates, setInViewStates] = useState<boolean[]>(
    new Array(count).fill(false)
  );
  const refs = useRef<(HTMLElement | null)[]>(new Array(count).fill(null));

  const {
    threshold = 0.1,
    rootMargin = "0px",
    triggerOnce = true,
    delay = 0,
  } = options;

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    refs.current.forEach((element, index) => {
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (entry.isIntersecting) {
            const updateState = () => {
              setInViewStates((prev) => {
                const newStates = [...prev];
                newStates[index] = true;
                return newStates;
              });
            };

            if (delay > 0) {
              setTimeout(updateState, delay + index * 100); // 添加递增延迟
            } else {
              updateState();
            }
          } else if (!triggerOnce) {
            setInViewStates((prev) => {
              const newStates = [...prev];
              newStates[index] = false;
              return newStates;
            });
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

      observer.observe(element);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  const setRef = (index: number) => (element: HTMLElement | null) => {
    refs.current[index] = element;
  };

  return {
    refs: refs.current.map((_, index) => setRef(index)),
    inViewStates,
  };
}

/**
 * 滚动触发动画的配置
 */
export const scrollAnimationVariants = {
  // 从下方淡入
  fadeInUp: {
    hidden: {
      opacity: 0,
      y: 60,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },

  // 从左侧滑入
  slideInLeft: {
    hidden: {
      opacity: 0,
      x: -60,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },

  // 从右侧滑入
  slideInRight: {
    hidden: {
      opacity: 0,
      x: 60,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },

  // 缩放淡入
  scaleIn: {
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },

  // 渐入（无位移）
  fadeIn: {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },

  // 容器动画（用于子元素的错开动画）
  container: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  },

  // 子元素动画
  item: {
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  },
};

/**
 * 获取动画延迟时间
 */
export function getStaggerDelay(
  index: number,
  baseDelay: number = 0.1
): number {
  return baseDelay * index;
}
