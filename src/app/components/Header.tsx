import { ThemeButton } from "./ThemeButton";

// import Link from "next/link";

export const Header = () => {
	return (
		<header className="flex flex-col justify-center mb-3 gap-3">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-bold tracking-wide">Web Image Scraper</h1>
				<ThemeButton />
			</div>
			<h2 className="italic text-sm font-light">
				Search a website for images, select and download.
			</h2>
		</header>
	);
};
