import { LuArrowLeft, LuBookOpen, LuHouse } from "react-icons/lu";

function NotFoundPage() {
	return (
		<div className="flex items-center justify-center p-6">
			<div className="w-full max-w-2xl text-center">
				<div className="rounded-3xl border border-[#565f89]/30 bg-[#24283b]/40 p-8 backdrop-blur-xl md:p-12">
					<div className="mb-8">
						<div className="relative">
							<div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#7aa2f7]/20 to-[#bb9af7]/20 blur-2xl"></div>

							<div className="relative rounded-2xl border border-[#565f89]/40 bg-[#1a1b26]/80 p-8 font-mono">
								<div className="flex items-center justify-center gap-4 text-4xl font-bold md:text-5xl lg:text-6xl">
									<span className="text-[#7aa2f7]">{"<"}</span>
									<span className="text-[#bb9af7]">404</span>
									<span className="text-[#9ece6a]">{"/>"}</span>
								</div>

								<div className="mt-4 text-sm text-[#a9b1d6] md:text-base">
									<span className="text-[#ff7a93]">Error:</span>
									<span className="text-[#c0caf5]"> Page not found</span>
								</div>
							</div>
						</div>
					</div>

					<h1 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl">
						<span className="bg-linear-to-r from-[#7aa2f7] via-[#bb9af7] to-[#9ece6a] bg-clip-text text-transparent">
							Oops! You're Lost in Code
						</span>
					</h1>

					<p className="mb-8 text-base leading-relaxed text-[#a9b1d6] md:text-lg lg:text-xl">
						It seems like you've wandered into uncharted code territory. The
						page you're looking for doesn't exist in this repository.
					</p>

					<div className="flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="/"
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#7aa2f7] to-[#bb9af7] px-8 py-4 font-semibold text-white shadow-lg shadow-[#7aa2f7]/25 transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:shadow-xl hover:shadow-[#7aa2f7]/30 active:scale-95"
						>
							<LuHouse className="h-5 w-5" />
							<span>Return to Home</span>
							<LuArrowLeft className="h-4 w-4" />
						</a>

						<a
							href="/blog"
							className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#565f89]/40 bg-[#1a1b26]/60 px-8 py-4 font-semibold text-[#a9b1d6] transition duration-300 hover:-translate-y-0.5 hover:scale-105 hover:border-[#7aa2f7]/40 hover:bg-[#24283b]/60 hover:text-[#c0caf5] active:scale-95"
						>
							<LuBookOpen className="h-5 w-5" />
							<span>Browse Blog</span>
						</a>
					</div>

					<div className="mt-8 border-t border-[#565f89]/20 pt-6">
						<div className="flex items-center justify-center gap-4 text-sm text-[#565f89]">
							<div className="flex items-center gap-2">
								<div className="h-2 w-2 rounded-full bg-[#ff7a93]" />
								<span>404 Error</span>
							</div>
							<span>•</span>
							<span>Page Not Found</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NotFoundPage;
