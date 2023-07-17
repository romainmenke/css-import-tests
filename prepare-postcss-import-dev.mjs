import fs from "fs/promises";
import fsSync from "fs";

await fs.rm("./postcss-import", { recursive: true, force: true });

if (fsSync.existsSync("../postcss-import/index.js")) {
	await fs.cp("../postcss-import", "./postcss-import", {
		recursive: true,
		filter: (src, dest) => {
			return !/(?:node_modules|git|coverage)/i.test(src);
		}
	 });
	await fs.rm("./postcss-import/node_modules", { recursive: true, force: true });
} else {
	await fs.mkdir("./postcss-import");
	await fs.writeFile("./postcss-import/index.js", `module.exports = false;`);
}
