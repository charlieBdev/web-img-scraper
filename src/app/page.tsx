"use client";

import Link from "next/link";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { BsQuestionSquare } from "react-icons/bs";
import { AiOutlineClear } from "react-icons/ai";
import { BiSolidToTop } from "react-icons/bi";
// import { Bars } from "react-loading-icons";
// import { BallTriangle } from "react-loading-icons";
import { Audio } from "react-loading-icons";
import { predefinedUrls } from "./data";
// export const dynamic = "force-dynamic";

type ImageInfo = {
	src: string;
	alt: string;
	height: string;
	width: string;
};

export default function Home() {
	const [url, setUrl] = useState("");
	const [imgInfo, setImgInfo] = useState<ImageInfo[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const [urlHistory, setUrlHistory] = useState<string[]>([]);
	const urlRegex = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+([/?#].*?)?)?$/;
	const isValidUrl = urlRegex.test(url);
	// const [filter, setFilter] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!url) {
			setError("Error: URL missing");
		} else {
			if (!isValidUrl) {
				setError("Error: Please enter a valid URL");
			} else {
				setError("");
				setIsLoading(true);
				setImgInfo([]);
				try {
					const response = await fetch(
						`/api/scraper?url=${encodeURIComponent(url)}`
						// `http://localhost:3000/api/scraper?url=${encodeURIComponent(url)}`
					);
					if (response.ok) {
						const data = await response.json();
						if (data.imgInfo.length > 0) {
							setImgInfo(data.imgInfo);
							if (!urlHistory.includes(url)) {
								if (urlHistory.length >= 3) {
									setUrlHistory([...urlHistory.slice(1), url]);
								} else {
									setUrlHistory([...urlHistory, url]);
								}
							}
						} else {
							setError("Error: No images found from the provided URL");
						}
					} else {
						setError("Error: Could not fetch images. Check the URL");
					}
				} catch (error) {
					setError("Error: Caught an error, but not any images");
				} finally {
					setIsLoading(false);
				}
			}
		}
	};

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	const handleClear = () => {
		setError("");
		setUrl("");
	};

	const handleDelete = (indexToDelete: number) => {
		const updatedHistory = [...urlHistory];
		updatedHistory.splice(indexToDelete, 1);
		setUrlHistory(updatedHistory);
	};

	const handleRandomClick = () => {
		const randomIndex = Math.floor(Math.random() * predefinedUrls.length);
		const randomUrl = predefinedUrls[randomIndex];

		setUrl(randomUrl);
	};

	const handleHistoryLinkClick = (searchedUrl: string) => {
		setUrl(searchedUrl);
	};

	return (
		<main className="flex min-h-screen flex-col px-6 pb-6 gap-3 items-center">
			<form
				className="flex flex-col gap-3 w-full lg:w-2/4"
				onSubmit={handleSubmit}
			>
				<input
					onChange={(e) => setUrl(e.target.value)}
					value={url}
					placeholder="Enter a URL"
					className={`${
						isValidUrl && url ? "bg-green-50" : ""
					} h-10 rounded-lg p-1 italic w-full text-center border text-neutral-950`}
				/>
				<div className="flex flex-col gap-2 items-center">
					<div className="flex gap-2">
						<button
							disabled={isLoading}
							type="submit"
							className={`${
								isLoading ? "animate-pulse" : ""
							} h-10 px-5 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-lg focus:shadow-outline hover:bg-indigo-500 hover:text-indigo-100`}
						>
							{isLoading ? "..." : <BsSearch />}
						</button>
						<button
							disabled={isLoading}
							type="submit"
							onClick={handleRandomClick}
							className={`${
								isLoading ? "animate-pulse" : ""
							} h-10 px-5 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-lg focus:shadow-outline hover:bg-indigo-500 hover:text-indigo-100`}
						>
							{isLoading ? "..." : <BsQuestionSquare />}
						</button>
						<button
							disabled={isLoading}
							type="button"
							onClick={handleClear}
							className={`${
								isLoading ? "animate-pulse" : ""
							} h-10 px-5 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-lg focus:shadow-outline hover:bg-indigo-500 hover:text-indigo-100`}
						>
							{isLoading ? "..." : <AiOutlineClear />}
						</button>
					</div>
					{/* <div className="flex gap-2 items-center">
						<input
							type="checkbox"
							id="filterW"
							name="filterW"
							onChange={(e) => setFilter(e.target.checked)}
						/>
						<label
							htmlFor="filterW"
							className="italic text-sm text-neutral-500"
						>
							Filter width less than 100px
						</label>
					</div> */}
				</div>

				{/* History */}
				{urlHistory.length > 0 && !isLoading && (
					<section className="flex flex-col items-center bg-neutral-50 bg-opacity-10 rounded shadow-lg hover:shadow-xl w-full p-2 gap-2">
						<p className="font-semibold">Your Last 3 Searches</p>
						<div className="flex flex-col gap-3 items-center">
							{urlHistory.map((searchedUrl, index) => (
								<div className="flex gap-2 items-center" key={index}>
									<button
										className="text-sm hover:text-indigo-500 truncate"
										type="submit"
										onClick={() => handleHistoryLinkClick(searchedUrl)}
									>
										<p className="truncate">{searchedUrl}</p>
									</button>
									<button
										className="hover:text-indigo-500"
										type="button"
										onClick={() => handleDelete(index)}
									>
										<AiOutlineDelete />
									</button>
								</div>
							))}
						</div>
					</section>
				)}
			</form>

			{/* Errors */}
			{error && <p className="text-red-500">{error}</p>}

			<section className="text-center flex flex-col gap-2 items-center">
				{/* Results length */}
				{imgInfo.length > 0 && !isLoading && !error && (
					<p className="italic">
						<span className="font-bold text-sm">{imgInfo.length}</span> images
						scraped
					</p>
				)}

				{isLoading ? (
					// <Bars />
					<div className="flex justify-center mt-48 rounded">
						<Audio />
					</div>
				) : (
					// Results
					<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{imgInfo.map((img, index) => (
							<div
								key={index}
								className="bg-neutral-50 bg-opacity-10 rounded shadow-lg hover:shadow-xl w-full"
							>
								<Link href={img.src} target="_blank">
									<img
										height={Number(img.height)}
										width={Number(img.width)}
										key={index}
										src={img.src}
										alt={img.alt || `No alt tag was found`}
										className="rounded-t w-full"
									/>
								</Link>
								<p className="text-left p-1 text-sm">
									{img.alt || "No alt tag was found"}
								</p>
								<p className="text-left p-1 text-xs">
									{img.width} x {img.height} pixels
								</p>
							</div>
						))}
					</div>
				)}
			</section>
			{/* Top button */}
			<button
				onClick={scrollToTop}
				className={`${
					imgInfo.length === 0 ? "hidden" : ""
				} h-10 px-5 text-indigo-700 transition-colors duration-150 border border-indigo-500 rounded-lg focus:shadow-outline hover:bg-indigo-500 hover:text-indigo-100`}
			>
				<BiSolidToTop />
			</button>
		</main>
	);
}
