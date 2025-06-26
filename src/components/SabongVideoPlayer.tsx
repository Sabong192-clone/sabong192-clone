export const SabongVideoPlayer = () => {
  const VIDEO_URL = "PASTE_STREAM_URL_HERE"; // 🔜 Replace with .m3u8/.mp4 when ready

  return (
    <div className="w-full aspect-video rounded overflow-hidden bg-black">
      {VIDEO_URL.includes("http") ? (
        <video src={VIDEO_URL} controls autoPlay className="w-full h-full" />
      ) : (
        <div className="text-white text-center pt-20">🎥 Waiting for SGMC stream URL…</div>
      )}
    </div>
  );
};