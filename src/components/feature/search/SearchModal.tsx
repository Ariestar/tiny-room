"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useHotkeys } from "react-hotkeys-hook";
import { AnimatedDiv } from "@/components/animation/AnimatedDiv";

interface SearchResult {
	slug: string;
	title: string;
	date: string;
	tags: string[];
	readingTime: string;
	score?: number;
	matches?: Array<{
		key: string;
		value: string;
		indices: number[][];
	}>;
}

interface SearchResponse {
	results: SearchResult[];
	total: number;
	error?: string;
}

interface SearchModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
	const [query, setQuery] = useState("");
	const [results, setResults] = useState<SearchResult[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [selectedIndex, setSelectedIndex] = useState(0);
	const [error, setError] = useState<string | null>(null);

	const inputRef = useRef<HTMLInputElement>(null);
	const resultsRef = useRef<HTMLDivElement>(null);
	const debounceRef = useRef<NodeJS.Timeout>();
	const router = useRouter();

	// 滚动到选中项
	const scrollToResult = (index: number) => {
		if (resultsRef.current) {
			const resultElements = resultsRef.current.querySelectorAll("[data-result-index]");
			const targetElement = resultElements[index] as HTMLElement;
			if (targetElement) {
				targetElement.scrollIntoView({
					behavior: "smooth",
					block: "nearest",
				});
			}
		}
	};

	// 快捷键支持
	useHotkeys(
		"cmd+k, ctrl+k",
		e => {
			e.preventDefault();
			if (!isOpen) {
				// 这里需要父组件处理打开
			} else {
				onClose();
			}
		},
		{ enableOnFormTags: true }
	);

	useHotkeys("escape", onClose, { enabled: isOpen, enableOnFormTags: true });

	// 键盘导航
	useHotkeys(
		"up",
		e => {
			e.preventDefault();
			setSelectedIndex(prev => {
				const newIndex = Math.max(0, prev - 1);
				scrollToResult(newIndex);
				return newIndex;
			});
		},
		{ enabled: isOpen, enableOnFormTags: true }
	);

	useHotkeys(
		"down",
		e => {
			e.preventDefault();
			setSelectedIndex(prev => {
				const newIndex = Math.min(results.length - 1, prev + 1);
				scrollToResult(newIndex);
				return newIndex;
			});
		},
		{ enabled: isOpen, enableOnFormTags: true }
	);

	useHotkeys(
		"enter",
		e => {
			e.preventDefault();
			if (results[selectedIndex]) {
				handleSelectResult(results[selectedIndex]);
			}
		},
		{ enabled: isOpen, enableOnFormTags: true }
	);

	// 搜索函数
	const performSearch = useCallback(async (searchQuery: string) => {
		if (!searchQuery.trim() || searchQuery.length < 2) {
			setResults([]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
			const data: SearchResponse = await response.json();

			if (data.error) {
				setError(data.error);
				setResults([]);
			} else {
				setResults(data.results);
				setSelectedIndex(0);
			}
		} catch (err) {
			setError("搜索时发生错误，请重试");
			setResults([]);
		} finally {
			setIsLoading(false);
		}
	}, []);

	// 防抖搜索
	useEffect(() => {
		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			performSearch(query);
		}, 300);

		return () => {
			if (debounceRef.current) {
				clearTimeout(debounceRef.current);
			}
		};
	}, [query, performSearch]);

	// 焦点管理
	useEffect(() => {
		if (isOpen && inputRef.current) {
			setTimeout(() => {
				inputRef.current?.focus();
			}, 100);
		}
	}, [isOpen]);

	// 选中项滚动
	useEffect(() => {
		if (resultsRef.current) {
			const selectedElement = resultsRef.current.children[selectedIndex] as HTMLElement;
			if (selectedElement) {
				selectedElement.scrollIntoView({
					block: "nearest",
					behavior: "smooth",
				});
			}
		}
	}, [selectedIndex]);

	const handleSelectResult = (result: SearchResult) => {
		router.push(`/blog/${result.slug}`);
		onClose();
		setQuery("");
		setResults([]);
	};

	const highlightMatch = (
		text: string,
		matches?: Array<{ key: string; indices: number[][] }>
	) => {
		if (!matches || matches.length === 0) return text;

		const indices = matches.flatMap(match => match.indices);
		if (indices.length === 0) return text;

		let highlightedText = "";
		let lastIndex = 0;

		// 合并重叠的索引
		const sortedIndices = indices.sort((a, b) => a[0] - b[0]);
		const mergedIndices: number[][] = [];

		for (const [start, end] of sortedIndices) {
			if (mergedIndices.length === 0 || start > mergedIndices[mergedIndices.length - 1][1]) {
				mergedIndices.push([start, end]);
			} else {
				mergedIndices[mergedIndices.length - 1][1] = Math.max(
					mergedIndices[mergedIndices.length - 1][1],
					end
				);
			}
		}

		for (const [start, end] of mergedIndices) {
			highlightedText += text.slice(lastIndex, start);
			highlightedText += `<mark class="bg-yellow-200 dark:bg-yellow-800">${text.slice(
				start,
				end + 1
			)}</mark>`;
			lastIndex = end + 1;
		}
		highlightedText += text.slice(lastIndex);

		return highlightedText;
	};

	if (!isOpen) return null;

	return (
		<div className='fixed inset-0 z-150 flex items-start justify-center pt-20'>
			{/* 背景遮罩 */}
			<div className='absolute inset-0 bg-black/50 backdrop-blur-sm' onClick={onClose} />

			{/* 搜索框容器 */}
			<AnimatedDiv duration={0.1} animation='slideUp' className='relative w-full max-w-2xl mx-4'>
				<div className='bg-background border border-border rounded-lg shadow-lg overflow-hidden'>
					{/* 搜索输入框 */}
					<div className='flex items-center px-4 py-3 border-b border-border'>
						<svg
							className='w-5 h-5 text-muted-foreground mr-3'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
							/>
						</svg>
						<input
							ref={inputRef}
							type='text'
							value={query}
							onChange={e => setQuery(e.target.value)}
							placeholder='搜索文章...'
							className='flex-1 bg-transparent border-none outline-none text-foreground placeholder-muted-foreground'
						/>
						{isLoading && (
							<div className='animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full ml-3' />
						)}
					</div>

					{/* 搜索结果 */}
					<div ref={resultsRef} className='max-h-96 overflow-y-auto'>
						{error && <div className='px-4 py-8 text-center text-red-500'>{error}</div>}

						{!error && query.length >= 2 && !isLoading && results.length === 0 && (
							<div className='px-4 py-8 text-center text-muted-foreground'>
								没有找到相关文章
							</div>
						)}

						{!error && query.length < 2 && (
							<div className='px-4 py-8 text-center text-muted-foreground'>
								请输入至少 2 个字符开始搜索
							</div>
						)}

						{results.map((result, index) => (
							<div
								key={result.slug}
								data-result-index={index}
								className={`px-4 py-3 cursor-pointer transition-all duration-150 border-l-2 ${index === selectedIndex
									? "bg-primary/10 border-primary text-primary-foreground"
									: "border-transparent hover:bg-accent/50 hover:border-accent"
									}`}
								onClick={() => handleSelectResult(result)}
							>
								<div className='space-y-1'>
									<h3
										className='font-medium text-foreground'
										dangerouslySetInnerHTML={{
											__html: highlightMatch(
												result.title,
												result.matches?.filter(m => m.key === "title")
											),
										}}
									/>
									<div className='flex items-center space-x-2 text-sm text-muted-foreground'>
										<span>{result.date}</span>
										<span>•</span>
										<span>{result.readingTime}</span>
										{result.tags.length > 0 && (
											<>
												<span>•</span>
												<div className='flex space-x-1'>
													{result.tags.slice(0, 3).map(tag => (
														<span
															key={tag}
															className='px-1.5 py-0.5 bg-secondary text-secondary-foreground rounded text-xs'
														>
															{tag}
														</span>
													))}
												</div>
											</>
										)}
									</div>
								</div>
							</div>
						))}
					</div>

					{/* 快捷键提示 */}
					{results.length > 0 && (
						<div className='px-4 py-2 border-t border-border bg-muted/50'>
							<div className='flex justify-between text-xs text-muted-foreground'>
								<div className='flex space-x-4'>
									<span>
										<kbd className='px-1.5 py-0.5 bg-background border border-border rounded text-xs'>
											↑↓
										</kbd>{" "}
										导航
									</span>
									<span>
										<kbd className='px-1.5 py-0.5 bg-background border border-border rounded text-xs'>
											Enter
										</kbd>{" "}
										选择
									</span>
								</div>
								<span>
									<kbd className='px-1.5 py-0.5 bg-background border border-border rounded text-xs'>
										Esc
									</kbd>{" "}
									关闭
								</span>
							</div>
						</div>
					)}
				</div>
			</AnimatedDiv>
		</div >
	);
}
