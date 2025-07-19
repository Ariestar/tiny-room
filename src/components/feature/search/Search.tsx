"use client";

import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { SearchButton } from "./SearchButton";
import { SearchModal } from "./SearchModal";

export function Search() {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const openSearch = () => setIsSearchOpen(true);
	const closeSearch = () => setIsSearchOpen(false);

	// 全局快捷键
	useHotkeys(
		"cmd+k, ctrl+k",
		e => {
			e.preventDefault();
			openSearch();
		},
		{ enableOnFormTags: true }
	);

	return (
		<>
			<SearchButton onClick={openSearch} />
			<SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
		</>
	);
}

// 导出子组件供独立使用
export { SearchButton } from "./SearchButton";
export { SearchModal } from "./SearchModal";
