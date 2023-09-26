"use client";

import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { CiLight } from "react-icons/ci";
import { CiDark } from "react-icons/ci";

export const ThemeButton = () => {
	const { theme, switchLight, switchDark } = useContext(ThemeContext);

	return (
		<button
			aria-label={`Switch to ${theme === "light" ? "Dark" : "Light"} Mode`}
			onClick={theme === "light" ? switchDark : switchLight}
			className="text-lg transition-colors duration-150 rounded-full p-1 hover:bg-indigo-500 hover:text-indigo-100"
		>
			{theme === "light" ? <CiDark /> : <CiLight />}
		</button>
	);
};
