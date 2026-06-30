import { spawn } from "node:child_process";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { copyTemplate } from "../copy-template.js";

function runCommand(cmd: string, cwd: string): Promise<void> {
	return new Promise((resolve, reject) => {
		const child = spawn(cmd, {
			cwd,
			shell: true,
			stdio: "inherit",
		});

		child.on("close", (code) => {
			if (code === 0) resolve();
			else reject(new Error(`Command failed with code ${code}`));
		});
	});
}

describe("Integration: full project generation", () => {
	let tempDir: string;
	let targetDir: string;

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), "create-stack-int-"));
		targetDir = join(tempDir, "my-test-app");
	});

	afterEach(async () => {
		await rm(tempDir, { recursive: true, force: true });
	});

	it("generates a project that passes lint, typecheck, test and build", async () => {
		const templateDir = join(process.cwd(), "template");

		await copyTemplate(templateDir, targetDir, {
			projectName: "my-test-app",
			pm: "npm",
		});

		// Instalar dependencias
		await runCommand("npm install", targetDir);

		// Primero formateamos con Biome (el template puede tener archivos sin formatear)
		await runCommand("npm run lint:fix", targetDir);

		// Luego corremos los checks
		await runCommand("npm run lint", targetDir);
		await runCommand("npm run typecheck", targetDir);
		await runCommand("npm run test:run", targetDir);
		await runCommand("npm run build", targetDir);

		// Si llegamos acá sin errores, el test pasa
		expect(true).toBe(true);
	}, 120_000); // timeout de 2 minutos
});
