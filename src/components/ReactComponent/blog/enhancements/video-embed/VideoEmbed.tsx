import type { FunctionComponent } from "react";
import { useState } from "react";

interface VideoEmbedProps {
	src: string;
	title?: string;
}

const VideoEmbed: FunctionComponent<VideoEmbedProps> = ({
	src,
	title = "Video player",
}) => {
	const [isLoading, setIsLoading] = useState(true);

	const isDirectVideo =
		src.includes("ufs.sh") || src.endsWith(".mp4") || src.endsWith(".webm");

	return (
		<div className="mx-auto mb-8 w-full max-w-[800px]">
			<div
				className="bg-(--accent-dark)/10 relative w-full overflow-hidden rounded-xl"
				style={{
					paddingBottom: "56.25%",
				}}
			>
				{isLoading && (
					<div className="bg-(--accent-dark)/10 absolute inset-0 flex items-center justify-center">
						<div className="h-10 w-10 animate-spin rounded-full border-4 border-(--accent) border-t-transparent" />
					</div>
				)}

				{isDirectVideo ? (
					<video
						className="absolute left-0 top-0 h-full w-full rounded-xl"
						controls
						playsInline
						onLoadedData={() => setIsLoading(false)}
						onError={() => setIsLoading(false)}
						preload="metadata"
						title={title}
					>
						<source src={src} type="video/mp4" />
						<track kind="captions" src="" srcLang="en" label="English" />
						Your browser does not support the video tag.
					</video>
				) : (
					<iframe
						src={src}
						title={title}
						className="absolute left-0 top-0 h-full w-full rounded-xl"
						style={{ border: "none" }}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowFullScreen
						loading="lazy"
						onLoad={() => setIsLoading(false)}
					/>
				)}
			</div>
		</div>
	);
};

export default VideoEmbed;
