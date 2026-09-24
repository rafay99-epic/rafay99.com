declare module "*.json" {
	const value: unknown;
	export default value;
	export const featureFlags: unknown;
}

interface Window {
	fnames?: string[];
	ftypes?: string[];
}
