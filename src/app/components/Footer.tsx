import Link from "next/link";

export const Footer = () => {
	return (
		<footer className="static bottom-0 right-0 w-full">
			<p className="text-neutral-500 text-xs text-right p-3">
				©️ 2023{" "}
				<Link href="https://charliebdev.vercel.app/" target="_blank">
					Charlie Bishop
				</Link>
			</p>
		</footer>
	);
};
