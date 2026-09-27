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

const features = [
	{ icon: LuZap, text: "Lightning Fast" },
	{ icon: LuPalette, text: "Beautiful Design" },
	{ icon: LuWrench, text: "Powerful Features" },
];

function ComingSoon({ featureName }: ComingSoonProps) {
	return (
		<main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-6 text-[#c0caf5]">
			<div className="absolute inset-0">
				<div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-linear-to-r from-[#7aa2f7]/10 to-[#bb9af7]/10 blur-3xl" />
				<div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-linear-to-r from-[#bb9af7]/10 to-[#9ece6a]/10 blur-3xl" />
			</div>

			<div className="relative z-10 w-full max-w-5xl">
				<div
					className="relative w-full overflow-hidden rounded-3xl border border-[#565f89]/30 bg-[#24283b]/60 p-8 text-center shadow-2xl backdrop-blur-xl md:p-16"
					role="alert"
					aria-live="polite"
				>
					<div className="absolute inset-0 rounded-3xl bg-linear-to-r from-[#7aa2f7]/5 via-transparent to-[#bb9af7]/5" />

					<div className="relative space-y-8">
						<div className="flex justify-center">
							<div className="relative">
								<div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#7aa2f7] to-[#bb9af7] opacity-50 blur-lg" />
								<div className="relative rounded-2xl bg-linear-to-r from-[#7aa2f7] to-[#bb9af7] p-6 text-6xl">
									<LuRocket className="h-12 w-12 text-white" />
								</div>
							</div>
						</div>

						<div className="space-y-4">
							<h1 className="text-4xl font-bold md:text-6xl">
								<span
									id="feature-name"
									className="bg-linear-to-r from-[#7aa2f7] via-[#bb9af7] to-[#9ece6a] bg-clip-text text-transparent"
								>
									{featureName}
								</span>
							</h1>

							<h2 className="text-2xl font-semibold text-[#a9b1d6] md:text-3xl">
								Coming Soon!
							</h2>

							<div className="mx-auto h-1 w-24 rounded-full bg-linear-to-r from-[#7aa2f7] via-[#bb9af7] to-[#9ece6a]" />
						</div>

						<p className="mx-auto max-w-3xl text-lg leading-relaxed text-[#a9b1d6] md:text-xl">
							This feature is currently under development. We're working hard to
							bring you something amazing. Stay tuned for updates!
						</p>

						<div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
							{features.map((feature) => (
								<div
									key={feature.text}
									className="rounded-xl border border-[#565f89]/20 bg-[#1a1b26]/40 p-4 backdrop-blur-md transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:border-[#7aa2f7]/40"
								>
									<div className="mb-2">
										<feature.icon className="mx-auto h-7 w-7 text-[#7aa2f7]" />
									</div>
									<div className="text-sm font-medium text-[#a9b1d6]">
										{feature.text}
									</div>
								</div>
							))}
						</div>

						<div className="mt-12">
							<a
								className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-xl bg-linear-to-r from-[#7aa2f7] to-[#bb9af7] px-8 py-4 font-semibold text-white shadow-lg shadow-[#7aa2f7]/25 transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl hover:shadow-[#7aa2f7]/30 active:scale-[0.98]"
								href="/"
								aria-label="Return to homepage"
							>
								<div className="absolute inset-0 bg-linear-to-r from-[#bb9af7] to-[#7aa2f7] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
								<span className="relative">Back to Home</span>
								<span className="relative text-xl">
									<LuArrowLeft className="h-5 w-5" />
								</span>
							</a>
						</div>

						<div className="mx-auto mt-10 max-w-md space-y-4">
							<div className="text-sm font-medium text-[#565f89]">
								Development Progress
							</div>
							<div className="h-3 w-full overflow-hidden rounded-full bg-[#1a1b26]/60">
								<div
									style={{ width: "65%" }}
									className="relative h-full rounded-full bg-linear-to-r from-[#7aa2f7] to-[#bb9af7]"
								>
									<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent" />
								</div>
							</div>
							<div className="text-xs text-[#565f89]">65% Complete</div>
						</div>
					</div>
				</div>

				<div className="mt-8 text-center text-sm text-[#565f89]">
					<p>Want to be notified when this feature launches?</p>
					<a
						href="/contact-me"
						className="mt-2 inline-flex items-center gap-2 text-[#7aa2f7] transition duration-300 hover:scale-105 hover:text-[#bb9af7]"
					>
						<span>Contact me for updates</span>
						<LuMail className="h-4 w-4" />
					</a>
				</div>
			</div>
		</main>
	);
}

export default ComingSoon;
