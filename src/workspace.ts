import { access, readFile } from "node:fs/promises";
import { dirname, join, parse } from "node:path";

/**
 * Recorre el árbol de directorios hacia arriba para detectar si estamos dentro de un workspace/monorepo.
 * Detecta: pnpm-workspace.yaml, lerna.json, turbo.json o package.json con campo "workspaces".
 */
export async function isInsideWorkspace(startDir: string): Promise<boolean> {
	let currentDir = startDir;
	const { root } = parse(currentDir);

	while (currentDir !== root) {
		// Checks directos de archivos
		const hasPnpmWorkspace = await fileExists(
			join(currentDir, "pnpm-workspace.yaml"),
		);
		const hasLerna = await fileExists(join(currentDir, "lerna.json"));
		const hasTurbo = await fileExists(join(currentDir, "turbo.json"));

		if (hasPnpmWorkspace || hasLerna || hasTurbo) {
			return true;
		}

		// Chequeo de package.json
		const pkgPath = join(currentDir, "package.json");
		if (await fileExists(pkgPath)) {
			try {
				const content = await readFile(pkgPath, "utf-8");
				const pkg = JSON.parse(content);
				if (
					pkg.workspaces &&
					Array.isArray(pkg.workspaces) &&
					pkg.workspaces.length > 0
				) {
					return true;
				}
			} catch {
				// Ignoramos errores de parseo
			}
		}

		currentDir = dirname(currentDir);
	}

	return false;
}

async function fileExists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
}
