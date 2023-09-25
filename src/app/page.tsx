"use client";

import JSZip from "jszip";
import { saveAs } from "file-saver";
import Link from "next/link";
import { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { BsSearch } from "react-icons/bs";
import { BsQuestionSquare } from "react-icons/bs";
import { AiOutlineClear } from "react-icons/ai";
import { BiSolidToTop } from "react-icons/bi";
import { FiSave } from "react-icons/fi";
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

	const handleDownloadAll = async () => {
		if (imgInfo.length === 0) {
			return;
		}

		const confirmDownload = window.confirm(
			"Are you sure you want to download all images?"
		);

		if (!confirmDownload) {
			return;
		}

		const zip = new JSZip();

		// Create a promise for fetching each image
		const fetchPromises = imgInfo.map(async (img, index) => {
			try {
				const response = await fetch(img.src);
				if (!response.ok) {
					throw new Error(`Failed to fetch image: ${img.src}`);
				}
				const blob = await response.blob();
				zip.file(
					`image_${index + 1}.${img.src.split(".").pop() || "jpg"}`,
					blob
				);
			} catch (error) {
				setError("Error: Oops, that did not work. Please try again.");
			}
		});

		// Wait for all fetch promises to complete
		await Promise.all(fetchPromises);

		// Generate the zip file
		zip.generateAsync({ type: "blob" }).then((blob) => {
			const link = document.createElement("a");
			link.href = URL.createObjectURL(blob);
			link.download = "images.zip";
			link.click();
		});
	};

	const handleDownloadOne = (imageUrl: string, fileName: string) => {
		const confirmDownload = window.confirm(
			"Are you sure you want to download this image?"
		);

		if (!confirmDownload) {
			return;
		}

		fetch(imageUrl)
			.then((response) => response.blob())
			.then((blob) => {
				saveAs(blob, fileName);
			})
			.catch((error) => {
				setError("Error: Oops, that did not work. Please try again.");
			});
	};

	return (
		<main className="flex min-h-screen flex-col gap-2 items-center">
			<form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit}>
				<input
					onChange={(e) => setUrl(e.target.value)}
					value={url}
					placeholder="Enter a URL"
					className={`${
						isValidUrl && url ? "bg-green-50" : ""
					} text-sm h-10 rounded-lg p-1 italic w-full text-center border text-neutral-950`}
				/>
				<div className="flex flex-col gap-2 items-center">
					<div className="flex gap-2">
						<button
							aria-label="Submit Form"
							disabled={isLoading}
							type="submit"
							className={`${isLoading ? "animate-pulse" : ""} button_sty`}
						>
							{isLoading ? "..." : <BsSearch />}
						</button>
						<button
							aria-label="Random Search"
							disabled={isLoading}
							type="submit"
							onClick={handleRandomClick}
							className={`${isLoading ? "animate-pulse" : ""} button_sty`}
						>
							{isLoading ? "..." : <BsQuestionSquare />}
						</button>
						<button
							aria-label="Clear Form"
							disabled={isLoading}
							type="button"
							onClick={handleClear}
							className={`${isLoading ? "animate-pulse" : ""} button_sty`}
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
						<p className="font-semibold text-md">Your Last 3 Searches</p>
						<div className="flex flex-col gap-3 items-center">
							{urlHistory.map((searchedUrl, index) => (
								<div className="flex gap-2 items-center" key={index}>
									<button
										aria-label={`Go to ${searchedUrl}`}
										className="text-sm hover:text-indigo-500 truncate"
										type="submit"
										onClick={() => handleHistoryLinkClick(searchedUrl)}
									>
										<p className="truncate">{searchedUrl}</p>
									</button>
									<button
										aria-label={`Delete ${searchedUrl} from search history`}
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
			{error && <p className="text-red-500 text-sm">{error}</p>}

			<section className="text-center flex flex-col gap-2 items-center">
				{/* Results length */}
				{imgInfo.length > 0 && !isLoading && !error && (
					<>
						<p className="italic text-sm">
							<span className="font-bold">{imgInfo.length}</span> images scraped
						</p>
						{imgInfo.length > 0 && (
							<button
								aria-label="Download All Images"
								className="button_sty"
								onClick={handleDownloadAll}
							>
								<FiSave />
							</button>
						)}
					</>
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
										className="rounded-t w-full hover:shadow-lg"
									/>
								</Link>
								<div className="flex justify-between">
									<div>
										<p className="text-left p-1 text-sm">
											{img.alt || "No alt tag was found"}
										</p>
										<p className="text-left p-1 text-xs">
											{img.width} x {img.height} pixels
										</p>
									</div>
									<button
										aria-label={`Download ${img.alt}`}
										className="button_sty m-1"
										onClick={() =>
											handleDownloadOne(img.src, `image_${index + 1}.jpg`)
										}
									>
										<FiSave />
									</button>
								</div>
							</div>
						))}
					</div>
				)}
			</section>
			{/* Top button */}
			<button
				aria-label="Scroll to Top"
				onClick={scrollToTop}
				className={`${imgInfo.length === 0 ? "hidden" : ""} button_sty`}
			>
				<BiSolidToTop />
			</button>
		</main>
	);
}
