import { AnnouncementContent } from "@/hooks/usePageContent";

interface Props {
  content?: AnnouncementContent;
}

const AnnouncementBar = ({ content }: Props) => {
  const text = content?.text || "Free Shipping Over $300";

  if (content && !content.enabled) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-primary overflow-hidden whitespace-nowrap z-[60]">
      <div className="animate-marquee flex items-center py-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="mx-8 text-xs font-body tracking-[0.2em] uppercase text-primary-foreground">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
