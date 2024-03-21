import DeleteAlert from "./delete-alert";
import ShareButton from "./share-button";

const Header = ({
  isMyGame,
  gameId,
}: {
  isMyGame: boolean;
  gameId: string;
}) => {
  return (
    <div className="flex items-center justify-end gap-1 pt-2">
      <ShareButton />
      {isMyGame && <DeleteAlert gameId={gameId} />}
    </div>
  );
};

export default Header;
