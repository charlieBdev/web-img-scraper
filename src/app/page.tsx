"use client";

import Link from "next/link";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
// import { Bars } from "react-loading-icons";
import { Audio } from "react-loading-icons";
// import { BallTriangle } from "react-loading-icons";
export const dynamic = "force-dynamic";

type ImageInfo = {
	src: string;
	alt: string;
	height: string;
	width: string;
};

const predefinedUrls = [
	"https://www.bbc.co.uk/news",
	"https://www.bbc.co.uk/sport",
	"https://en.wikipedia.org/wiki/Sheffield",
	"https://charliebdev.vercel.app/projects",
	"https://rickastley.co.uk/",
	"https://unsplash.com/",
	"https://www.bbcgoodfood.com/howto/guide/top-10-most-popular-autumn-recipes",
	"https://bjjfanatics.com/",
	"https://blogs.nasa.gov/webb/category/james-webb-space-telescope/",
	"https://www.akaipro.com/products/mpc-series",
	"https://www.rane.com/products/mixers",
];

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
		<main className="flex min-h-screen flex-col items-center p-6 gap-3 justify-center">
			<h1 className="text-lg font-bold">Web Image Scraper</h1>
			<h2>Search a website for images, select and download... not yet.</h2>
			<form
				className="flex flex-col gap-3 w-full items-center lg:w-2/4"
				onSubmit={handleSubmit}
			>
				<input
					onChange={(e) => setUrl(e.target.value)}
					value={url}
					placeholder="Enter a URL"
					className={`${
						isValidUrl && url ? "bg-green-100" : ""
					} rounded-lg p-1 text-neutral-950 italic w-full`}
				/>
				<div className="flex flex-col gap-2 items-center">
					<div className="flex gap-2">
						<button
							disabled={isLoading}
							type="submit"
							className={`${
								isLoading ? "animate-pulse" : ""
							} text-neutral-50 border rounded-lg bg-orange-400 hover:bg-orange-500 p-1 w-24`}
						>
							{isLoading ? "Going..." : "Go"}
						</button>
						<button
							disabled={isLoading}
							type="submit"
							onClick={handleRandomClick}
							className={`${
								isLoading ? "animate-pulse" : ""
							} text-neutral-50 border rounded-lg bg-orange-400 hover:bg-orange-500 p-1 w-24`}
						>
							{isLoading ? "..." : "Random"}
						</button>
						<button
							disabled={isLoading}
							type="button"
							onClick={handleClear}
							className={`${
								isLoading ? "animate-pulse" : ""
							} text-neutral-50 border rounded-lg bg-blue-400 hover:bg-blue-500 p-1 w-24`}
						>
							Clear
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
				{urlHistory.length > 0 && !isLoading && (
					<section className="flex flex-col items-center bg-neutral-50 bg-opacity-20 rounded shadow-lg hover:shadow-xl w-full p-2 gap-2">
						<p className="font-semibold text-neutral-950">
							Your Last 3 Searches
						</p>
						<div className="flex flex-wrap gap-3">
							{urlHistory.map((searchedUrl, index) => (
								<div className="flex gap-2 items-center" key={index}>
									<button
										className="text-neutral-500 hover:text-neutral-950"
										type="submit"
										onClick={() => handleHistoryLinkClick(searchedUrl)}
									>
										{searchedUrl}
									</button>
									<button
										className="hover:text-orange-500"
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

			{error && <p className="text-red-500">{error}</p>}

			<section className="text-center flex flex-col gap-2 items-center">
				{imgInfo.length > 0 && !isLoading && !error && (
					<p>
						<span className="font-bold text-neutral-950">{imgInfo.length}</span>{" "}
						images scraped
					</p>
				)}
				{isLoading ? (
					// <Bars />
					<div className="flex justify-center">
						<Audio />
					</div>
				) : (
					<div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{imgInfo.map((img, index) => (
							<div
								key={index}
								className="bg-neutral-50 bg-opacity-20 rounded shadow-lg hover:shadow-xl w-full"
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
								<p className="text-left p-1">
									{img.alt || "No alt tag was found"}
								</p>
							</div>
						))}
					</div>
				)}
				<button
					onClick={scrollToTop}
					className={`${
						imgInfo.length === 0 ? "hidden" : ""
					} text-neutral-50 border rounded-lg bg-orange-400 hover:bg-orange-500 p-1 transition duration-300 w-24`}
				>
					Top
				</button>
				<p className="text-neutral-500 text-right text-sm">
					©️ 2023{" "}
					<Link href="https://charliebdev.vercel.app/" target="_blank">
						Charlie B
					</Link>
				</p>
			</section>
		</main>
	);
}
