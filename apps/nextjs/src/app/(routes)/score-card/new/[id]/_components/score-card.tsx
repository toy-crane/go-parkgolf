const ScoreCard = async ({ gameId }: { gameId: string }) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return <div>Hello {gameId}</div>;
};

export default ScoreCard;
