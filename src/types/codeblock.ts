import type { RefObject } from "react";
import { z } from "zod";

export const StyleValueSchema = z.record(z.string(), z.string());

const ToastPositionSchema = z.enum([
	"top-left",
	"top-center",
	"top-right",
	"bottom-left",
	"bottom-center",
	"bottom-right",
]);

export const ToastStyleSchema = z.object({
	style: StyleValueSchema.optional(),
	iconTheme: z
		.object({
			primary: z.string().optional(),
			secondary: z.string().optional(),
		})
		.optional(),
	className: z.string().optional(),
	duration: z.number().optional(),
	id: z.string().optional(),
	position: ToastPositionSchema.optional(),
});

export const ToastStylesSchema = z.object({
	success: ToastStyleSchema.optional(),
	error: ToastStyleSchema.optional(),
});

const StylesSchema = z.object({
	buttonContainer: z.string(),
	languageLabel: z.string(),
	copyButton: z.string(),
	mobileButton: z.string(),
	default: StyleValueSchema,
	hover: StyleValueSchema,
	success: StyleValueSchema,
	language: StyleValueSchema,
});

export type StyleValue = z.infer<typeof StyleValueSchema>;
export type ToastStyle = z.infer<typeof ToastStyleSchema>;
export type ToastStyles = z.infer<typeof ToastStylesSchema>;
export type Styles = z.infer<typeof StylesSchema>;
// Props carry callbacks, which Zod 4 no longer models inside object
// schemas, so these are plain types.
export type CopyButtonProps = {
	codeText: string;
	isMobile: boolean;
	onCopy: () => void;
};
export type UseCopyButtonProps = {
	buttonRef: RefObject<HTMLButtonElement | null>;
	codeText: string;
	onCopy: () => void;
	toastStyles: ToastStyles;
};
