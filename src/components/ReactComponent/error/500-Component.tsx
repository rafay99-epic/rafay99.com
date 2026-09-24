import { domAnimation, LazyMotion, m } from "framer-motion";
import { LuArrowLeft, LuHouse, LuRefreshCw } from "react-icons/lu";

function ServerErrorPage() {
	return (
		<LazyMotion features={domAnimation}>
			<div className="flex items-center justify-center p-6">
				<m.div
					initial={false}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-2xl text-center"
				>
					<div className="rounded-3xl border border-[#565f89]/30 bg-[#24283b]/40 p-8 backdrop-blur-xl md:p-12">
						<m.div
							initial={false}
							animate={{ scale: 1, opacity: 1 }}
							transition={{ delay: 0.2, duration: 0.5 }}
							className="mb-8"
						>
							<div className="relative">
								<div className="absolute inset-0 rounded-2xl bg-linear-to-r from-[#ff7a93]/20 to-[#e0af68]/20 blur-2xl"></div>

								<div className="relative rounded-2xl border border-[#565f89]/40 bg-[#1a1b26]/80 p-8 font-mono">
									<div className="flex items-center justify-center gap-4 text-4xl font-bold md:text-5xl lg:text-6xl">
										<m.span
											animate={{
												color: ["#ff7a93", "#e0af68", "#ff7a93"],
												scale: [1, 1.1, 1],
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
												ease: "easeInOut",
											}}
											className="text-[#ff7a93]"
										>
											{"<"}
										</m.span>

										<m.span
											animate={{
												y: [-5, 5, -5],
												color: ["#e0af68", "#ff7a93", "#e0af68"],
											}}
											transition={{
												duration: 2,
												repeat: Infinity,
												ease: "easeInOut",
											}}
											className="text-[#e0af68]"
										>
											500
										</m.span>

										<m.span
											animate={{
												color: ["#e0af68", "#ff7a93", "#e0af68"],
												scale: [1, 1.1, 1],
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
												ease: "easeInOut",
												delay: 1.5,
											}}
											className="text-[#e0af68]"
										>
											{"/>"}
										</m.span>
									</div>

									<m.div
										initial={false}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.4 }}
										className="mt-4 text-sm text-[#a9b1d6] md:text-base"
									>
										<span className="text-[#ff7a93]">Error:</span>
										<span className="text-[#c0caf5]">
											{" "}
											Internal server error
										</span>
									</m.div>
								</div>
							</div>
						</m.div>

						<m.h1
							initial={false}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.3, duration: 0.5 }}
							className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl"
						>
							<span className="bg-linear-to-r from-[#ff7a93] via-[#e0af68] to-[#ff7a93] bg-clip-text text-transparent">
								Something Broke on Our End
							</span>
						</m.h1>

						<m.p
							initial={false}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.5 }}
							className="mb-8 text-base leading-relaxed text-[#a9b1d6] md:text-lg lg:text-xl"
						>
							The server ran into an unexpected error. Don't worry — it's not
							your fault. Try refreshing the page, or head back home while we
							sort things out.
						</m.p>

						<m.div
							initial={false}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.5, duration: 0.5 }}
							className="flex flex-col justify-center gap-4 sm:flex-row"
						>
							<m.button
								onClick={() => window.location.reload()}
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.95 }}
								className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-[#ff7a93] to-[#e0af68] px-8 py-4 font-semibold text-white shadow-lg shadow-[#ff7a93]/25 transition-shadow duration-300 hover:shadow-xl hover:shadow-[#ff7a93]/30"
							>
								<LuRefreshCw className="h-5 w-5" />
								<span>Try Again</span>
							</m.button>

							<m.a
								href="/"
								whileHover={{ scale: 1.05, y: -2 }}
								whileTap={{ scale: 0.95 }}
								className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#565f89]/40 bg-[#1a1b26]/60 px-8 py-4 font-semibold text-[#a9b1d6] transition-shadow duration-300 hover:border-[#ff7a93]/40 hover:bg-[#24283b]/60 hover:text-[#c0caf5]"
							>
								<LuHouse className="h-5 w-5" />
								<span>Return to Home</span>
								<m.span
									animate={{ x: [0, -4, 0] }}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
									}}
								>
									<LuArrowLeft className="h-4 w-4" />
								</m.span>
							</m.a>
						</m.div>

						<m.div
							initial={false}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.6, duration: 0.5 }}
							className="mt-8 border-t border-[#565f89]/20 pt-6"
						>
							<div className="flex items-center justify-center gap-4 text-sm text-[#565f89]">
								<div className="flex items-center gap-2">
									<m.div
										animate={{ scale: [1, 1.2, 1] }}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: "easeInOut",
										}}
										className="h-2 w-2 rounded-full bg-[#e0af68]"
									/>
									<span>500 Error</span>
								</div>
								<span>•</span>
								<span>Internal Server Error</span>
							</div>
						</m.div>
					</div>
				</m.div>
			</div>
		</LazyMotion>
	);
}

export default ServerErrorPage;
