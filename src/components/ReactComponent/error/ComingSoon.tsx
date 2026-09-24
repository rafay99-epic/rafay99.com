import { domAnimation, LazyMotion, m, type Variants } from "framer-motion";
import {
	LuArrowLeft,
	LuMail,
	LuPalette,
	LuRocket,
	LuWrench,
	LuZap,
} from "react-icons/lu";

interface ComingSoonProps {
	featureName: string;
}

const containerVariants = {
	hidden: { opacity: 0, y: 30 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.8,
			ease: "easeOut",
			staggerChildren: 0.2,
		},
	},
} satisfies Variants;

const cardVariants = {
	hidden: { scale: 0.9, opacity: 0, y: 20 },
	visible: {
		scale: 1,
		opacity: 1,
		y: 0,
		transition: { duration: 0.6, ease: "easeOut" },
	},
} satisfies Variants;

const iconVariants = {
	hidden: { scale: 0, rotate: -180 },
	visible: {
		scale: 1,
		rotate: 0,
		transition: {
			duration: 0.8,
			ease: "easeOut",
			type: "spring",
			stiffness: 200,
		},
	},
} satisfies Variants;

function ComingSoon({ featureName }: ComingSoonProps) {
	return (
		<LazyMotion features={domAnimation}>
			<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 text-[#c0caf5]">
				{}
				<div className="absolute inset-0">
					<div className="absolute left-1/4 top-1/4 h-96 w-96 animate-pulse rounded-full bg-linear-to-r from-[#7aa2f7]/10 to-[#bb9af7]/10 blur-3xl" />
					<div className="absolute bottom-1/4 right-1/4 h-80 w-80 animate-pulse rounded-full bg-linear-to-r from-[#bb9af7]/10 to-[#9ece6a]/10 blur-3xl delay-1000" />
				</div>

				<m.div
					variants={containerVariants}
					initial={false}
					animate="visible"
					className="relative z-10 w-full max-w-5xl"
				>
					{}
					<m.div
						variants={cardVariants}
						className="relative w-full overflow-hidden rounded-3xl border border-[#565f89]/30 bg-[#24283b]/60 p-8 text-center shadow-2xl backdrop-blur-xl md:p-16"
						role="alert"
						aria-live="polite"
					>
						{}
						<div className="absolute inset-0 rounded-3xl bg-linear-to-r from-[#7aa2f7]/5 via-transparent to-[#bb9af7]/5" />

						<div className="relative space-y-8">
							{}
							<m.div variants={iconVariants} className="flex justify-center">
								<div className="relative">
									<div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#7aa2f7] to-[#bb9af7] opacity-50 blur-lg" />
									<div className="relative rounded-2xl bg-linear-to-r from-[#7aa2f7] to-[#bb9af7] p-6 text-6xl">
										<LuRocket className="h-12 w-12 text-white" />
									</div>
								</div>
							</m.div>

							{}
							<m.div variants={cardVariants} className="space-y-4">
								<h1 className="text-4xl font-bold md:text-6xl">
									<span className="bg-linear-to-r from-[#7aa2f7] via-[#bb9af7] to-[#9ece6a] bg-clip-text text-transparent">
										{featureName}
									</span>
								</h1>

								<h2 className="text-2xl font-semibold text-[#a9b1d6] md:text-3xl">
									Coming Soon!
								</h2>

								<div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-[#7aa2f7] via-[#bb9af7] to-[#9ece6a]" />
							</m.div>

							{}
							<m.p
								variants={cardVariants}
								className="mx-auto max-w-3xl text-lg leading-relaxed text-[#a9b1d6] md:text-xl"
							>
								This feature is currently under development. We're working hard
								to bring you something amazing. Stay tuned for updates!
							</m.p>

							{}
							<m.div
								variants={cardVariants}
								className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3"
							>
								{[
									{ icon: LuZap, text: "Lightning Fast" },
									{ icon: LuPalette, text: "Beautiful Design" },
									{ icon: LuWrench, text: "Powerful Features" },
								].map((feature) => (
									<m.div
										key={feature.text}
										whileHover={{ scale: 1.05, y: -2 }}
										className="rounded-xl border border-[#565f89]/20 bg-[#1a1b26]/40 p-4 backdrop-blur-md transition-colors duration-300 hover:border-[#7aa2f7]/40"
									>
										<div className="mb-2">
											<feature.icon className="mx-auto h-7 w-7 text-[#7aa2f7]" />
										</div>
										<div className="text-sm font-medium text-[#a9b1d6]">
											{feature.text}
										</div>
									</m.div>
								))}
							</m.div>

							{}
							<m.div variants={cardVariants} className="mt-12">
								<m.a
									whileHover={{ scale: 1.05, y: -2 }}
									whileTap={{ scale: 0.98 }}
									className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-linear-to-r from-[#7aa2f7] to-[#bb9af7] px-8 py-4 font-semibold text-white shadow-lg shadow-[#7aa2f7]/25 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#7aa2f7]/30"
									href="/"
									aria-label="Return to homepage"
									role="button"
								>
									<div className="absolute inset-0 bg-linear-to-r from-[#bb9af7] to-[#7aa2f7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
									<span className="relative">Back to Home</span>
									<m.span
										animate={{ x: [0, -5, 0] }}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: "easeInOut",
										}}
										className="relative text-xl"
									>
										<LuArrowLeft className="h-5 w-5" />
									</m.span>
								</m.a>
							</m.div>

							{}
							<m.div
								variants={cardVariants}
								className="mx-auto mt-10 max-w-md space-y-4"
							>
								<div className="text-sm font-medium text-[#565f89]">
									Development Progress
								</div>
								<div className="h-3 w-full overflow-hidden rounded-full bg-[#1a1b26]/60">
									<m.div
										style={{ width: "65%" }}
										className="relative h-full rounded-full bg-linear-to-r from-[#7aa2f7] to-[#bb9af7]"
									>
										<div className="absolute inset-0 animate-pulse bg-linear-to-r from-transparent via-white/20 to-transparent" />
									</m.div>
								</div>
								<div className="text-xs text-[#565f89]">65% Complete</div>
							</m.div>
						</div>
					</m.div>

					{}
					<m.div
						variants={cardVariants}
						className="mt-8 text-center text-sm text-[#565f89]"
					>
						<p>Want to be notified when this feature launches?</p>
						<m.a
							whileHover={{ scale: 1.05 }}
							href="/contact-me"
							className="mt-2 inline-flex items-center gap-2 text-[#7aa2f7] transition-colors duration-300 hover:text-[#bb9af7]"
						>
							<span>Contact me for updates</span>
							<LuMail className="h-4 w-4" />
						</m.a>
					</m.div>
				</m.div>
			</main>
		</LazyMotion>
	);
}

export default ComingSoon;
