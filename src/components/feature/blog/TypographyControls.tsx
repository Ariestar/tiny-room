"use client";

import { usePathname } from "next/navigation";
import { useTypography } from "@/lib/contexts/TypographyContext";
import { FONT_OPTIONS } from "@/lib/fonts";

export function TypographyControls() {
	const pathname = usePathname();
	const isBlogArticlePage = /^\/blog\/.+/.test(pathname);

	const { fontFamily, setFontFamily, fontSize, setFontSize, lineHeight, setLineHeight } =
		useTypography();

	if (!isBlogArticlePage) {
		return null;
	}

	return (
		<div className='flex items-center gap-4'>
			<div className='flex items-center gap-2'>
				<label htmlFor='font-family' className='text-sm'>
					字体
				</label>
				<select
					id='font-family'
					value={fontFamily}
					onChange={e => setFontFamily(e.target.value)}
					className='bg-background border border-border rounded-md px-2 py-1 text-sm'
				>
					{FONT_OPTIONS.map(font => (
						<option key={font.id} value={font.id}>
							{font.name}
						</option>
					))}
				</select>
			</div>
			<div className='flex items-center gap-2'>
				<label htmlFor='font-size' className='text-sm'>
					字号: {fontSize}px
				</label>
				<input
					id='font-size'
					type='range'
					min='12'
					max='50'
					step='1'
					value={fontSize}
					onChange={e => setFontSize(Number(e.target.value))}
					className='w-24'
				/>
			</div>
			<div className='flex items-center gap-2'>
				<label htmlFor='line-height' className='text-sm'>
					行高: {lineHeight.toFixed(2)}
				</label>
				<input
					id='line-height'
					type='range'
					min='1.2'
					max='2.5'
					step='0.1'
					value={lineHeight}
					onChange={e => setLineHeight(Number(e.target.value))}
					className='w-24'
				/>
			</div>
		</div>
	);
}
