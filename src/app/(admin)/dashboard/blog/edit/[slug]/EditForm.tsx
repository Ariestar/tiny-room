"use client";

import * as React from "react";
import ReactMde from "react-mde";
import ReactMarkdown from "react-markdown";
import "react-mde/lib/styles/css/react-mde-all.css";

// A very simple component to render the markdown preview
const renderMarkdown = (markdown: string) => {
	return Promise.resolve(<ReactMarkdown>{markdown}</ReactMarkdown>);
};

interface EditFormProps {
	initialContent: string;
	slug: string;
}

export default function EditForm({ initialContent, slug }: EditFormProps) {
	const [value, setValue] = React.useState(initialContent);
	const [selectedTab, setSelectedTab] = React.useState<"write" | "preview">("write");

	const handleSave = async (data: string) => {
		// TODO: Implement save functionality in a later task
		console.log("Saving content for slug:", slug, "data:", data);
	};

	return (
		<>
			<div className='prose lg:prose-xl dark:prose-invert max-w-none'>
				<ReactMde
					value={value}
					onChange={setValue}
					selectedTab={selectedTab}
					onTabChange={setSelectedTab}
					generateMarkdownPreview={markdown => renderMarkdown(markdown)}
					childProps={{
						writeButton: {
							tabIndex: -1,
						},
					}}
				/>
			</div>
			<div className='mt-6 flex justify-end'>
				<button
					onClick={() => handleSave(value)}
					className='bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition-colors'
				>
					Save Changes (Coming Soon)
				</button>
			</div>
		</>
	);
}
