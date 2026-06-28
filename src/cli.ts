import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pc from "picocolors";
import { copyTemplate } from "./copy-template.js";
import { parseArgs, type Args } from "./parse-args.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// En dist/ queda en dist/index.js, así que subimos un nivel
const TEMPLATE_DIR = resolve(__dirname, "..", "template");

function printUsage(): void {
	console.log(`
${pc.cyan(pc.bold("create-stack-next"))} — scaffolder opinado para Next.js 15

${pc.bold("Uso:")}
  ${pc.cyan("npx create-stack-next")} ${pc.green("<nombre-del-proyecto>")} [opciones]

${pc.bold("Opciones:")}
  ${pc.yellow("--no-git")}          No inicializa git ni hace commit inicial
  ${pc.yellow("--no-install")}      No corre npm install después de generar
  ${pc.yellow("--pm <nombre>")}     Package manager: ${pc.cyan("npm")}, ${pc.cyan("pnpm")}, ${pc.cyan("yarn")}, ${pc.cyan("bun")} (default: ${pc.cyan("npm")})

${pc.bold("Ejemplos:")}
  ${pc.cyan("npx create-stack-next")} ${pc.green("my-app")}
  ${pc.cyan("npx create-stack-next")} ${pc.green("my-app")} ${pc.yellow("--pm pnpm --no-git")}
`);
}

function validateProjectName(name: string): { ok: true } | { ok: false; reason: string } {
	if (!name) {
		return { ok: false, reason: "Falta el nombre del proyecto" };
	}

	// Mismas reglas que npm init: lowercase, puede tener guión/underscore, no arrancar con .
	if (!/^[a-z0-9-_]+$/.test(name)) {
		return {
			ok: false,
			reason: `Nombre inválido "${name}". Solo lowercase, números, guiones y underscores.`,
		};
	}

	if (name.startsWith(".") || name.startsWith("-")) {
		return {
			ok: false,
			reason: `Nombre inválido "${name}". No puede empezar con . ni -.`,
		};
	}

	if (existsSync(name)) {
		return { ok: false, reason: `El directorio "${name}" ya existe` };
	}

	return { ok: true };
}

function logStep(emoji: string, message: string): void {
	console.log(`  ${emoji}  ${message}`);
}

/**
 * Ejecuta un comando en un directorio. Hereda stdout/stderr del proceso padre
 * para que el output de npm/git sea visible.
 */
function execInDir(cmd: string, args: string[], cwd: string): Promise<void> {
	return new Promise((resolveP, rejectP) => {
		const proc = spawn(cmd, args, { cwd, stdio: "inherit" });
		proc.on("error", rejectP);
		proc.on("exit", (code) => {
			if (code === 0) resolveP();
			else rejectP(new Error(`${cmd} ${args.join(" ")} exited with code ${code}`));
		});
	});
}

async function runGitInit(projectDir: string): Promise<void> {
	await execInDir("git", ["init", "-b", "main"], projectDir);
	await execInDir("git", ["add", "."], projectDir);
	await execInDir(
		"git",
		["commit", "-m", "chore: initial commit from create-stack-next"],
		projectDir,
	);
}

async function runInstall(projectDir: string, pm: string): Promise<void> {
	const installCmd = pm === "npm" ? "npm" : pm;
	await execInDir(installCmd, ["install"], projectDir);
}

export async function run(): Promise<void> {
	// Sin args o --help/-h → mostrar usage
	if (
		process.argv.length <= 2 ||
		process.argv.includes("--help") ||
		process.argv.includes("-h")
	) {
		printUsage();
		process.exit(0);
	}

	const args: Args = parseArgs(process.argv.slice(2));

	const projectName = args._[0];
	if (!projectName) {
		console.error(pc.red("❌"), "Falta el nombre del proyecto.");
		console.error(`   Uso: ${pc.cyan("npx create-stack-next")} ${pc.green("<nombre>")}`);
		process.exit(1);
	}

	// Validar nombre
	const validation = validateProjectName(projectName);
	if (!validation.ok) {
		console.error(pc.red("❌"), validation.reason);
		process.exit(1);
	}

	const projectDir = resolve(process.cwd(), projectName);
	const pm = args.pm ?? "npm";
	const git = args.git !== false;
	const install = args.install !== false;

	console.log();
	console.log(pc.cyan(pc.bold(`Creando proyecto en ./${projectName}...`)));
	console.log();

	try {
		// 1. Crear directorio destino
		await mkdir(projectDir, { recursive: true });
		logStep("📁", "Directorio creado");

		// 2. Copiar template
		await copyTemplate(TEMPLATE_DIR, projectDir, { projectName, pm });
		logStep("📋", "Template copiado");

		// 3. Personalizar package.json con el nombre correcto del proyecto
		const packageJsonPath = join(projectDir, "package.json");
		const { readFile } = await import("node:fs/promises");
		const packageJsonRaw = await readFile(packageJsonPath, "utf-8");
		const packageJson = JSON.parse(packageJsonRaw);
		packageJson.name = projectName;
		await writeFile(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`, "utf-8");
		logStep("📝", "package.json personalizado");

		// 4. Instalar deps
		if (install) {
			logStep("📦", `Instalando dependencias (${pm})...`);
			try {
				await runInstall(projectDir, pm);
				logStep("✅", "Dependencias instaladas");
			} catch (err) {
				logStep("⚠️", `Falló la instalación (${pm}). Corré ${pc.cyan(`${pm} install`)} manualmente.`);
				console.error(pc.dim(`   Error: ${err instanceof Error ? err.message : String(err)}`));
			}
		}

		// 5. Git init
		if (git) {
			logStep("🔧", "Inicializando git...");
			try {
				await runGitInit(projectDir);
				logStep("✅", "Repo git inicializado + commit inicial");
			} catch (err) {
				logStep("⚠️", "Falló git init. Inicializalo manualmente.");
				console.error(pc.dim(`   Error: ${err instanceof Error ? err.message : String(err)}`));
			}
		}

		// 6. Mensaje final
		console.log();
		console.log(pc.green(pc.bold("✅ Proyecto creado.")));
		console.log();
		console.log(pc.bold("Próximos pasos:"));
		console.log(`  ${pc.cyan("cd")} ${pc.green(projectName)}`);
		console.log(`  ${pc.cyan("npm run dev")}          # arrancar dev server`);
		console.log(`  ${pc.cyan("npm run test")}         # correr tests unitarios`);
		console.log(`  ${pc.cyan("npm run test:e2e")}     # correr tests e2e`);
		console.log(`  ${pc.cyan("npm run lint")}         # correr Biome`);
		console.log();
	} catch (err) {
		console.error();
		console.error(pc.red("❌ Error durante la creación del proyecto:"));
		console.error(err instanceof Error ? err.message : String(err));
		process.exit(1);
	}
}