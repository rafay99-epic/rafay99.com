import type { ComponentType, CSSProperties } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { LuSend } from "react-icons/lu";
import { generateShareUrls, type ShareUrls } from "types/shareUtils";

interface ShareButtonsProps {
	url: string;
	pagetitle: string;
	compact?: boolean;
}

const sharePlatforms = [
	{
		id: "whatsapp",
		label: "WhatsApp",
		icon: FaWhatsapp,
		color: "#25D366",
	},
	{
		id: "twitter",
		label: "Twitter",
		icon: FaTwitter,
		color: "#1DA1F2",
	},
	{
		id: "facebook",
		label: "Facebook",
		icon: FaFacebook,
		color: "#1877F2",
	},
	{
		id: "linkedin",
		label: "LinkedIn",
		icon: FaLinkedin,
		color: "#0A66C2",
	},
] as const satisfies ReadonlyArray<{
	id: keyof ShareUrls;
	label: string;
	icon: ComponentType<{ className?: string; style?: CSSProperties }>;
	color: string;
}>;

const ShareButtons = function ShareButtons({
	url,
	pagetitle,
	compact = false,
}: ShareButtonsProps) {
	const shareUrls = generateShareUrls(url);

	if (compact) {
		return (
			<div className="flex flex-wrap items-center justify-center gap-2">
				{sharePlatforms.map((platform) => {
					const IconComponent = platform.icon;
					return (
						<a
							key={platform.id}
							href={shareUrls[platform.id]}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={`Share on ${platform.label}`}
							className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#565f89]/40 bg-[#24283b]/60 text-[#a9b1d6] transition-[border-color,color,transform] duration-200 hover:scale-105 hover:border-[#7aa2f7]/50 hover:text-[#c0caf5]"
						>
							<IconComponent
								className="h-4 w-4"
								style={{ color: platform.color }}
							/>
						</a>
					);
				})}
			</div>
		);
	}

	return (
		<div className="mt-12">
			<div className="rounded-2xl border border-[#565f89]/30 bg-[#24283b]/40 p-8 backdrop-blur-xl">
				<div className="mb-8 text-center">
					<div className="mb-4 flex items-center justify-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-[#7aa2f7] to-[#bb9af7]">
							<LuSend className="h-5 w-5 text-white" />
						</div>
						<h3 className="text-xl font-bold">
							<span className="bg-linear-to-r from-[#7aa2f7] via-[#bb9af7] to-[#9ece6a] bg-clip-text text-transparent">
								Share this {pagetitle}
							</span>
						</h3>
					</div>
					<p className="text-base text-[#a9b1d6]">
						Help others discover this content by sharing it on your favorite
						platform
					</p>
				</div>

				<div className="flex justify-center">
					<div className="grid grid-cols-4 gap-6">
						{sharePlatforms.map((platform) => {
							const IconComponent = platform.icon;
							return (
								<a
									key={platform.id}
									href={shareUrls[platform.id]}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={`Share on ${platform.label}`}
									className="group relative flex h-20 w-20 flex-col items-center justify-center rounded-xl transition-[border-color,box-shadow,transform] duration-300 hover:scale-105 hover:border-[#7aa2f7]/60 hover:shadow-lg hover:shadow-[#7aa2f7]/20"
								>
									<div
										className="flex h-12 w-12 items-center justify-center rounded-lg transition-transform duration-300 group-hover:scale-110"
										style={{
											background: `linear-gradient(135deg, ${platform.color}20, ${platform.color}10)`,
											border: `1px solid ${platform.color}40`,
										}}
									>
										<IconComponent
											className="h-6 w-6 transition-transform duration-300 group-hover:scale-110"
											style={{ color: platform.color }}
										/>
									</div>

									<span className="mt-2 text-center text-xs font-medium text-[#a9b1d6] transition-colors duration-300 group-hover:text-[#c0caf5]">
										{platform.label}
									</span>

									<div className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
										<div
											className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 transform rounded-full blur-lg"
											style={{
												background: `${platform.color}20`,
											}}
										/>
									</div>
								</a>
							);
						})}
					</div>
				</div>

				<div className="mt-8 border-t border-[#565f89]/20 pt-6 text-center">
					<div className="flex items-center justify-center gap-4 text-sm text-[#565f89]">
						<div className="flex items-center gap-2">
							<div className="h-2 w-2 rounded-full bg-[#9ece6a]"></div>
							<span>Ready to Share</span>
						</div>
						<span>•</span>
						<span>{sharePlatforms.length} Platforms Available</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ShareButtons;
