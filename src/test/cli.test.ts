import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { validateProjectName } from "../cli.js";
import { parseArgs } from "../parse-args.js";

// ═══════════════════════════════════════════════════════════
// Tests de parseArgs
// ═══════════════════════════════════════════════════════════

describe("parseArgs", () => {
	it("parsea el nombre del proyecto como argumento posicional", () => {
		const args = parseArgs(["my-app"]);
		expect(args._).toEqual(["my-app"]);
	});

	it("parsea --no-git correctamente", () => {
		const args = parseArgs(["my-app", "--no-git"]);
		expect(args.git).toBe(false);
	});

	it("parsea --no-install correctamente", () => {
		const args = parseArgs(["my-app", "--no-install"]);
		expect(args.install).toBe(false);
	});

	it("parsea --pm pnpm correctamente", () => {
		const args = parseArgs(["my-app", "--pm", "pnpm"]);
		expect(args.pm).toBe("pnpm");
	});

	it("parsea --pm yarn correctamente", () => {
		const args = parseArgs(["my-app", "--pm", "yarn"]);
		expect(args.pm).toBe("yarn");
	});

	it("parsea --pm bun correctamente", () => {
		const args = parseArgs(["my-app", "--pm", "bun"]);
		expect(args.pm).toBe("bun");
	});

	it("parsea múltiples flags combinadas", () => {
		const args = parseArgs([
			"my-app",
			"--no-git",
			"--no-install",
			"--pm",
			"pnpm",
		]);
		expect(args._).toEqual(["my-app"]);
		expect(args.git).toBe(false);
		expect(args.install).toBe(false);
		expect(args.pm).toBe("pnpm");
	});

	it("lanza error si --pm tiene un valor inválido", () => {
		expect(() => parseArgs(["my-app", "--pm", "deno"])).toThrow(
			/--pm inválido/,
		);
	});

	it("parsea --template api correctamente", () => {
		const args = parseArgs(["my-app", "--template", "api"]);
		expect(args.template).toBe("api");
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
		expect(() => parseArgs(["my-app", "--pm"])).toThrow(
			/--pm requiere un valor/,
		);
	});

	it("lanza error con flag desconocida", () => {
		expect(() => parseArgs(["my-app", "--foo"])).toThrow(/Flag desconocida/);
	});

	it("sin argumentos retorna array vacío de posicionales", () => {
		const args = parseArgs([]);
		expect(args._).toEqual([]);
	});

	it("ignora --help y -h sin error", () => {
		const args = parseArgs(["--help"]);
		expect(args._).toEqual([]);

		const args2 = parseArgs(["-h"]);
		expect(args2._).toEqual([]);
	});
});

// ═══════════════════════════════════════════════════════════
// Tests de validateProjectName (importación directa)
// ═══════════════════════════════════════════════════════════

describe("validateProjectName", () => {
	let tempDir: string;

	beforeEach(async () => {
		tempDir = await mkdtemp(join(tmpdir(), "validate-name-test-"));
	});

	afterEach(async () => {
		await rm(tempDir, { recursive: true, force: true });
	});

	// --- Nombres válidos ---

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

	// --- Nombres inválidos ---

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

	// --- Edge cases de file system ---

	it("rechaza directorio existente NO vacío", async () => {
		const existingDir = join(tempDir, "existing-project");
		await mkdir(existingDir, { recursive: true });
		await writeFile(join(existingDir, "file.txt"), "content");

		// Cambiar cwd temporalmente al tempDir
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
