import { useSelector } from "react-redux";
import { RootState } from "../../services/store";
import { FileText, Video, Mic, BookOpen } from "lucide-react";

export function StatCards() {
  // Access the Redux state using useSelector
  const mediaState = useSelector((state: RootState) => state.media);

  // Extract the total counts from the Redux state
  const totalBlogs = mediaState.blogs.meta.total;
  const totalVideos = mediaState.videos.meta.total;
  const totalPodcasts = mediaState.podcasts.results; // Assuming podcasts have 'results' for total
  const totalPublications = mediaState.publications.meta.total;

  const stats = [
    {
      icon: FileText,
      label: "Total Blog",
      value: totalBlogs ?? 0, // Fallback to 0 if not available
      color: "bg-rose-200",
    },
    {
      icon: Video,
      label: "Total Videos",
      value: totalVideos ?? 0, // Fallback to 0 if not available
      color: "bg-rose-200",
    },
    {
      icon: Mic,
      label: "Total Podcasts",
      value: totalPodcasts ?? 0, // Fallback to 0 if not available
      color: "bg-rose-200",
    },
    {
      icon: BookOpen,
      label: "Total Publication",
      value: totalPublications ?? 0, // Fallback to 0 if not available
      color: "bg-rose-200",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className={`rounded-xl ${stat.color} p-6 transition-transform hover:scale-105`}
        >
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-poppins font-semibold text-neutral-900">
              {stat.label}
            </h3>
            <stat.icon className="h-6 w-6 text-neutral-900" />
          </div>
          <p className="text-3xl font-poppins font-bold text-neutral-900">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}
