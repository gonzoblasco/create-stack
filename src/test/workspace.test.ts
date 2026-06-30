import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isInsideWorkspace } from "../workspace.js";

describe("isInsideWorkspace", () => {
	let tempRoot: string;

	beforeEach(async () => {
		tempRoot = await mkdtemp(join(tmpdir(), "workspace-test-"));
	});

	afterEach(async () => {
		await rm(tempRoot, { recursive: true, force: true });
	});

	it("retorna false si no hay ningún indicador de workspace", async () => {
		const appDir = join(tempRoot, "my-app");
		await mkdir(appDir);
		const result = await isInsideWorkspace(appDir);
		expect(result).toBe(false);
	});

	it("detecta pnpm-workspace.yaml en el directorio padre", async () => {
		await writeFile(join(tempRoot, "pnpm-workspace.yaml"), "");
		const appsDir = join(tempRoot, "apps");
		await mkdir(appsDir);
		const appDir = join(appsDir, "my-app");
		await mkdir(appDir);

		const result = await isInsideWorkspace(appDir);
		expect(result).toBe(true);
	});

	it("detecta turbo.json en el directorio padre", async () => {
		await writeFile(join(tempRoot, "turbo.json"), "{}");
		const appsDir = join(tempRoot, "apps");
		const appDir = join(appsDir, "my-app");
		await mkdir(appDir, { recursive: true });

		const result = await isInsideWorkspace(appDir);
		expect(result).toBe(true);
	});

	it("detecta lerna.json en el mismo directorio", async () => {
		await writeFile(join(tempRoot, "lerna.json"), "{}");
		const result = await isInsideWorkspace(tempRoot);
		expect(result).toBe(true);
	});

	it("detecta package.json con array 'workspaces'", async () => {
		await writeFile(
			join(tempRoot, "package.json"),
			JSON.stringify({ workspaces: ["apps/*"] }),
		);
		const appDir = join(tempRoot, "apps", "my-app");
		await mkdir(appDir, { recursive: true });

		const result = await isInsideWorkspace(appDir);
		expect(result).toBe(true);
	});

	it("ignora package.json sin 'workspaces'", async () => {
		await writeFile(
			join(tempRoot, "package.json"),
			JSON.stringify({ name: "root" }),
		);
		const appDir = join(tempRoot, "apps", "my-app");
		await mkdir(appDir, { recursive: true });

		const result = await isInsideWorkspace(appDir);
		expect(result).toBe(false);
	});

	it("ignora package.json mal formado", async () => {
		await writeFile(join(tempRoot, "package.json"), "{ invalid json ");
		const appDir = join(tempRoot, "apps", "my-app");
		await mkdir(appDir, { recursive: true });

		const result = await isInsideWorkspace(appDir);
		expect(result).toBe(false);
	});
});
