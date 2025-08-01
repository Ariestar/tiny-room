"use client";

import React, { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { SearchButton } from "./SearchButton";
import { SearchModal } from "./SearchModal";

interface SearchProps {
	showIcon?: boolean;
	showText?: boolean;
	showShortcut?: boolean;
}

export function Search({ showIcon, showText, showShortcut }: SearchProps) {
	const [isSearchOpen, setIsSearchOpen] = useState(false);

	const openSearch = () => setIsSearchOpen(true);
	const closeSearch = () => setIsSearchOpen(false);

	useHotkeys(
		"cmd+k, ctrl+k",
		(e) => {
			e.preventDefault();
			setIsSearchOpen(prev => !prev);
		},
		{ enableOnFormTags: true }
	);

	return (
		<>
			<SearchButton
				onClick={openSearch}
				showIcon={showIcon}
				showText={showText}
				showShortcut={showShortcut}
			/>
			<SearchModal isOpen={isSearchOpen} onClose={closeSearch} />
		</>
	);
}

// Re-export sub-components for individual use
export { SearchButton } from "./SearchButton";
export { SearchModal } from "./SearchModal";
