export const truncateUrl = (url: string) => {
	if (url.length <= 40) {
		return url.slice(8);
	} else {
		return url.slice(8, 40 - 3) + "...";
	}
};

module.exports = { truncateUrl };
