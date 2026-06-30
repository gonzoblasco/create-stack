#!/usr/bin/env node
import { run } from "./cli.js";

run().catch((err: unknown) => {
	console.error("❌ Error inesperado:", err);
	process.exit(1);
});
