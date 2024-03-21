import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const BottomCTA = ({
  label,
  disabled,
  loading,
}: {
  label: string;
  disabled: boolean;
  loading: boolean;
}) => {
  return (
    <div className="bottom-cta content-grid bg-gradient-to-t from-white from-80% to-transparent pt-5">
      <Button type="submit" size="lg" disabled={loading || disabled}>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" size={24} />
        ) : (
          label
        )}
      </Button>
    </div>
  );
};

export default BottomCTA;
