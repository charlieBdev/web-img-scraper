"use client";

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
// import { CiLight } from "react-icons/ci";
// import { CiDark } from "react-icons/ci";
// import Link from "next/link";

export const Header = () => {
	const { theme, switchLight, switchDark } = useContext(ThemeContext);

	return (
		<header className="flex flex-col justify-center mb-2">
			<div className="flex items-center justify-between">
				<h1 className="text-lg font-bold tracking-wide">Web Image Scraper</h1>
				<button
					aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
					onClick={theme === "light" ? switchDark : switchLight}
					className="text-lg transition-colors duration-150 rounded-lg hover:bg-indigo-500 hover:text-indigo-100"
				>
					{theme === "light" ? "🌙" : "☀️"}
				</button>
			</div>
			<h2 className="italic text-sm font-light">
				Search a website for images, select and download.
			</h2>
		</header>
	);
};
