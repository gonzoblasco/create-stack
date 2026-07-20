export interface StackConfig {
	/** Identificador del stack (ej: "next", "api") */
	id: string;
	/** Nombre legible para mostrar en help */
	label: string;
	/** Descripción breve */
	description: string;
	/** Directorio del template */
	templateDir: string;
	/** Package manager por defecto */
	defaultPM: string;
	/** Versión de Node mínima */
	minNodeVersion: string;
}
