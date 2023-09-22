// import Link from "next/link";

export const Header = () => {
	return (
		<header className="flex flex-col items-center p-6 bg-neutral-50 bg-opacity-20 shadow-lg">
			{/* <Link href="/"> */}
			<h1 className="text-lg font-bold tracking-wide text-neutral-950">
				Web Image Scraper
			</h1>
			{/* </Link> */}
			<h2 className="italic text-md text-center font-light text-neutral-500">
				Search a website for images, select and download... not yet.
			</h2>
		</header>
	);
};
