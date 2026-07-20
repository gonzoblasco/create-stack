import { describe, expect, it } from "vitest";
import { execCapture, getGitConfig, isGitAvailable } from "../cli.js";

describe("isGitAvailable", () => {
	it("retorna true cuando git está instalado", async () => {
		const result = await isGitAvailable();
		expect(result).toBe(true);
	});
});

describe("getGitConfig", () => {
	it("retorna null para una clave de git config inexistente", async () => {
		const result = await getGitConfig(
			"create-stack.nonexistent-key-test",
			process.cwd(),
		);
		expect(result).toBeNull();
	});

	it("retorna un valor string para claves configuradas (si existen)", async () => {
		const userName = await getGitConfig("user.name", process.cwd());
		expect(typeof userName === "string" || userName === null).toBe(true);
	});
});

describe("execCapture", () => {
	it("captura stdout de un comando exitoso", async () => {
		const result = await execCapture("echo", ["hello world"], process.cwd());
		expect(result).toBe("hello world");
	});

	it("rechaza la promesa si el comando falla", async () => {
		await expect(
			execCapture(
				"git",
				["config", "--global", "nonexistent.key.12345"],
				process.cwd(),
			),
		).rejects.toThrow();
	});

	it("rechaza la promesa si el comando no existe", async () => {
		await expect(
			execCapture("nonexistent-command-xyz", [], process.cwd()),
		).rejects.toThrow();
	});
});
