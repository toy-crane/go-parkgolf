import React from "react";

import Header from "./_components/header";

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) => {
  const gameId = params.id;

  return (
    <>
      <Header gameId={gameId} />
    </>
  );
};

export default Page;
