import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { validateProjectName } from "../cli.js";
import { parseArgs } from "../parse-args.js";

// ═══════════════════════════════════════════════════════════
// Tests de parseArgs (nueva API con stack posicional)
// ═══════════════════════════════════════════════════════════

describe("parseArgs — nueva API con stack posicional", () => {
	it("parsea stack + nombre del proyecto como argumentos posicionales", () => {
		const args = parseArgs(["next", "my-app"]);
		expect(args.stack).toBe("next");
		expect(args.projectName).toBe("my-app");
	});

	it("parsea stack api + nombre", () => {
		const args = parseArgs(["api", "my-api"]);
		expect(args.stack).toBe("api");
		expect(args.projectName).toBe("my-api");
	});

	it("compatibilidad hacia atrás: primer arg no-stack se asume nombre con stack next", () => {
		const args = parseArgs(["my-app"]);
		expect(args.stack).toBe("next");
		expect(args.projectName).toBe("my-app");
	});

	it("parsea --no-git correctamente", () => {
		const args = parseArgs(["next", "my-app", "--no-git"]);
		expect(args.git).toBe(false);
	});

	it("parsea --no-install correctamente", () => {
		const args = parseArgs(["next", "my-app", "--no-install"]);
		expect(args.install).toBe(false);
	});

	it("parsea --pm pnpm correctamente", () => {
		const args = parseArgs(["next", "my-app", "--pm", "pnpm"]);
		expect(args.pm).toBe("pnpm");
	});

	it("parsea --pm yarn correctamente", () => {
		const args = parseArgs(["next", "my-app", "--pm", "yarn"]);
		expect(args.pm).toBe("yarn");
	});

	it("parsea --pm bun correctamente", () => {
		const args = parseArgs(["next", "my-app", "--pm", "bun"]);
		expect(args.pm).toBe("bun");
	});

	it("parsea múltiples flags combinadas", () => {
		const args = parseArgs([
			"next",
			"my-app",
			"--no-git",
			"--no-install",
			"--pm",
			"pnpm",
		]);
		expect(args.stack).toBe("next");
		expect(args.projectName).toBe("my-app");
		expect(args.git).toBe(false);
		expect(args.install).toBe(false);
		expect(args.pm).toBe("pnpm");
	});

	it("lanza error si --pm tiene un valor inválido", () => {
		expect(() => parseArgs(["next", "my-app", "--pm", "deno"])).toThrow(
			/--pm inválido/,
		);
	});

	it("parsea --template api (legacy) correctamente", () => {
		const args = parseArgs(["my-app", "--template", "api"]);
		expect(args.template).toBe("api");
		expect(args.stack).toBe("api");
	});

	it("lanza error si --template tiene un valor inválido", () => {
		expect(() => parseArgs(["my-app", "--template", "invalid"])).toThrow(
			/--template inválido/,
		);
	});

	it("lanza error si --template no tiene valor", () => {
		expect(() => parseArgs(["my-app", "--template"])).toThrow(
			/--template requiere un valor/,
		);
	});

	it("lanza error si --pm no tiene valor", () => {
		expect(() => parseArgs(["next", "my-app", "--pm"])).toThrow(
			/--pm requiere un valor/,
		);
	});

	it("lanza error con flag desconocida", () => {
		expect(() => parseArgs(["next", "my-app", "--foo"])).toThrow(
			/Flag desconocida/,
		);
	});

	it("sin argumentos retorna stack y projectName undefined", () => {
		const args = parseArgs([]);
		expect(args.stack).toBeUndefined();
		expect(args.projectName).toBeUndefined();
	});

	it("ignora --help y -h sin error", () => {
		const args = parseArgs(["--help"]);
		expect(args.stack).toBeUndefined();

		const args2 = parseArgs(["-h"]);
		expect(args2.stack).toBeUndefined();
	});
});

// ═══════════════════════════════════════════════════════════
// Tests de validateProjectName
// ═══════════════════════════════════════════════════════════

describe("validateProjectName", () => {
	let tempDir: string;

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), "validate-name-test-"));
	});

	afterEach(async () => {
		await rm(tempDir, { recursive: true, force: true });
	});

	it("acepta nombres válidos simples", () => {
		const result = validateProjectName("my-app");
		expect(result.ok).toBe(true);
	});

	it("acepta nombres con underscores", () => {
		const result = validateProjectName("my_app");
		expect(result.ok).toBe(true);
	});

	it("acepta nombres con números", () => {
		const result = validateProjectName("app123");
		expect(result.ok).toBe(true);
	});

	it("acepta nombres solo numéricos", () => {
		const result = validateProjectName("123");
		expect(result.ok).toBe(true);
	});

	it("rechaza nombre vacío", () => {
		const result = validateProjectName("");
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.reason).toContain("Falta el nombre");
		}
	});

	it("rechaza nombres con mayúsculas", () => {
		const result = validateProjectName("MyApp");
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.reason).toContain("Nombre inválido");
		}
	});

	it("rechaza nombres con espacios", () => {
		const result = validateProjectName("my app");
		expect(result.ok).toBe(false);
	});

	it("rechaza nombres con caracteres especiales (@)", () => {
		const result = validateProjectName("@scope/name");
		expect(result.ok).toBe(false);
	});

	it("rechaza nombres con caracteres especiales (!)", () => {
		const result = validateProjectName("my-app!");
		expect(result.ok).toBe(false);
	});

	it("rechaza nombres con slash", () => {
		const result = validateProjectName("foo/bar");
		expect(result.ok).toBe(false);
	});

	it("rechaza nombres que empiezan con punto", () => {
		const result = validateProjectName(".hidden");
		expect(result.ok).toBe(false);
	});

	it("rechaza nombres que empiezan con guión", () => {
		const result = validateProjectName("-invalid");
		expect(result.ok).toBe(false);
		if (!result.ok) {
			expect(result.reason).toContain("No puede empezar con");
		}
	});

	it("rechaza directorio existente NO vacío", async () => {
		const existingDir = join(tempDir, "existing-project");
		await mkdir(existingDir, { recursive: true });
		await writeFile(join(existingDir, "file.txt"), "content");

		const originalCwd = process.cwd();
		process.chdir(tempDir);
		try {
			const result = validateProjectName("existing-project");
			expect(result.ok).toBe(false);
			if (!result.ok) {
				expect(result.reason).toContain("no está vacío");
			}
		} finally {
			process.chdir(originalCwd);
		}
	});

	it("acepta directorio existente VACÍO", async () => {
		const emptyDir = join(tempDir, "empty-project");
		await mkdir(emptyDir, { recursive: true });

		const originalCwd = process.cwd();
		process.chdir(tempDir);
		try {
			const result = validateProjectName("empty-project");
			expect(result.ok).toBe(true);
		} finally {
			process.chdir(originalCwd);
		}
	});

	it("acepta directorio existente con solo .DS_Store", async () => {
		const dsDir = join(tempDir, "ds-project");
		await mkdir(dsDir, { recursive: true });
		await writeFile(join(dsDir, ".DS_Store"), "");

		const originalCwd = process.cwd();
		process.chdir(tempDir);
		try {
			const result = validateProjectName("ds-project");
			expect(result.ok).toBe(true);
		} finally {
			process.chdir(originalCwd);
		}
	});
});
