import Link from "next/link";

export const Footer = () => {
	return (
		<footer>
			<p className="text-neutral-500 text-xs">
				©️ 2023{" "}
				<Link href="https://charliebdev.vercel.app/" target="_blank">
					Charlie Bishop
				</Link>
			</p>
		</footer>
	);
};
