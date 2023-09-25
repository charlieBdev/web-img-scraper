import Link from "next/link";

export const Footer = () => {
	return (
		<footer className="static bottom-0 right-0 w-full">
			<p className="font-light text-xs text-right">
				©️ 2023{" "}
				<Link href="https://charliebdev.vercel.app/" target="_blank">
					Charlie Bishop
				</Link>
			</p>
		</footer>
	);
};
