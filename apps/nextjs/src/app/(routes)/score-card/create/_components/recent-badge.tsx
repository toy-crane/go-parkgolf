import { Badge } from "@/components/ui/badge";

interface Props {
  onClick: () => void;
  children: React.ReactNode;
}

const RecentBadge = ({ onClick, children }: Props) => {
  return (
    <Badge
      variant="secondary"
      className="mr-2 cursor-pointer py-1"
      onClick={onClick}
    >
      {children}
    </Badge>
  );
};

export default RecentBadge;
