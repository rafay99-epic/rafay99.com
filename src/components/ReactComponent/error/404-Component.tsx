import { motion } from "framer-motion";
import { memo } from "react";
import { LuArrowLeft, LuBookOpen, LuHouse } from "react-icons/lu";

const NotFoundPage = memo(function NotFoundPage() {
	return (
		<div className="flex items-center justify-center p-6">
			<motion.div
				initial={false}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="w-full max-w-2xl text-center"
			>
				<div className="rounded-3xl border border-[#565f89]/30 bg-[#24283b]/40 p-8 backdrop-blur-xl md:p-12">
					<motion.div
						initial={false}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="mb-8"
					>
						<div className="relative">
							<div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7aa2f7]/20 to-[#bb9af7]/20 blur-2xl"></div>

							<div className="relative rounded-2xl border border-[#565f89]/40 bg-[#1a1b26]/80 p-8 font-mono">
								<div className="flex items-center justify-center gap-4 text-4xl font-bold md:text-5xl lg:text-6xl">
									<motion.span
										animate={{
											color: ["#7aa2f7", "#bb9af7", "#9ece6a", "#7aa2f7"],
											scale: [1, 1.1, 1],
										}}
										transition={{
											duration: 3,
											repeat: Infinity,
											ease: "easeInOut",
										}}
										className="text-[#7aa2f7]"
									>
										{"<"}
									</motion.span>

									<motion.span
										animate={{
											y: [-5, 5, -5],
											color: ["#bb9af7", "#9ece6a", "#7aa2f7", "#bb9af7"],
										}}
										transition={{
											duration: 2,
											repeat: Infinity,
											ease: "easeInOut",
										}}
										className="text-[#bb9af7]"
									>
										404
									</motion.span>

									<motion.span
										animate={{
											color: ["#9ece6a", "#7aa2f7", "#bb9af7", "#9ece6a"],
											scale: [1, 1.1, 1],
										}}
										transition={{
											duration: 3,
											repeat: Infinity,
											ease: "easeInOut",
											delay: 1.5,
										}}
										className="text-[#9ece6a]"
									>
										{"/>"}
									</motion.span>
								</div>

								<motion.div
									initial={false}
									animate={{ opacity: 1 }}
									transition={{ delay: 0.4 }}
									className="mt-4 text-sm text-[#a9b1d6] md:text-base"
								>
									<span className="text-[#ff7a93]">Error:</span>
									<span className="text-[#c0caf5]"> Page not found</span>
								</motion.div>
							</div>
						</div>
					</motion.div>

					<motion.h1
						initial={false}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
						className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl"
					>
						<span className="bg-gradient-to-r from-[#7aa2f7] via-[#bb9af7] to-[#9ece6a] bg-clip-text text-transparent">
							Oops! You're Lost in Code
						</span>
					</motion.h1>

					<motion.p
						initial={false}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
						className="mb-8 text-base leading-relaxed text-[#a9b1d6] md:text-lg lg:text-xl"
					>
						It seems like you've wandered into uncharted code territory. The
						page you're looking for doesn't exist in this repository.
					</motion.p>

					<motion.div
						initial={false}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="flex flex-col justify-center gap-4 sm:flex-row"
					>
						<motion.a
							href="/"
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#7aa2f7] to-[#bb9af7] px-8 py-4 font-semibold text-white shadow-lg shadow-[#7aa2f7]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#7aa2f7]/30"
						>
							<LuHouse className="h-5 w-5" />
							<span>Return to Home</span>
							<motion.span
								animate={{ x: [0, -4, 0] }}
								transition={{
									duration: 2,
									repeat: Infinity,
									ease: "easeInOut",
								}}
							>
								<LuArrowLeft className="h-4 w-4" />
							</motion.span>
						</motion.a>

						<motion.a
							href="/blog"
							whileHover={{ scale: 1.05, y: -2 }}
							whileTap={{ scale: 0.95 }}
							className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#565f89]/40 bg-[#1a1b26]/60 px-8 py-4 font-semibold text-[#a9b1d6] transition-all duration-300 hover:border-[#7aa2f7]/40 hover:bg-[#24283b]/60 hover:text-[#c0caf5]"
						>
							<LuBookOpen className="h-5 w-5" />
							<span>Browse Blog</span>
						</motion.a>
					</motion.div>

					<motion.div
						initial={false}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.6, duration: 0.5 }}
						className="mt-8 border-t border-[#565f89]/20 pt-6"
					>
						<div className="flex items-center justify-center gap-4 text-sm text-[#565f89]">
							<div className="flex items-center gap-2">
								<motion.div
									animate={{ scale: [1, 1.2, 1] }}
									transition={{
										duration: 2,
										repeat: Infinity,
										ease: "easeInOut",
									}}
									className="h-2 w-2 rounded-full bg-[#ff7a93]"
								/>
								<span>404 Error</span>
							</div>
							<span>•</span>
							<span>Page Not Found</span>
						</div>
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
});

export default NotFoundPage;
