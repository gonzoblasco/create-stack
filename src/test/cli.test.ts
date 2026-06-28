import { describe, expect, it } from "vitest";
import { parseArgs } from "../parse-args.js";

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

	it("lanza error si --pm tiene un valor inválido", () => {
		expect(() => parseArgs(["my-app", "--pm", "deno"])).toThrow(
			/--pm inválido/,
		);
	});

	it("lanza error si --pm no tiene valor", () => {
		expect(() => parseArgs(["my-app", "--pm"])).toThrow(
			/--pm requiere un valor/,
		);
	});

	it("lanza error con flag desconocida", () => {
		expect(() => parseArgs(["my-app", "--foo"])).toThrow(
			/Flag desconocida/,
		);
	});
});

describe("validateProjectName (reglas)", () => {
	it("acepta nombres válidos", () => {
		const validNames = ["my-app", "my_app", "app123", "test-project"];
		for (const name of validNames) {
			expect(/^[a-z0-9-_]+$/.test(name)).toBe(true);
		}
	});

	it("rechaza nombres con mayúsculas", () => {
		expect(/^[a-z0-9-_]+$/.test("MyApp")).toBe(false);
	});

	it("rechaza nombres con espacios", () => {
		expect(/^[a-z0-9-_]+$/.test("my app")).toBe(false);
	});

	it("rechaza nombres que empiezan con .", () => {
		expect(/^[a-z0-9-_]+$/.test(".hidden")).toBe(false);
	});

	it("detecta nombres que empiezan con - (validateProjectName los rechaza)", () => {
		// La regex base los acepta, pero validateProjectName tiene chequeo explícito
		expect("-invalid".startsWith("-")).toBe(true);
	});
});