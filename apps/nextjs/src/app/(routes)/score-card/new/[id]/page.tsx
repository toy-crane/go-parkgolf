import React from "react";
import { readUserSession } from "@/libs/auth";

import Header from "./_components/header";

const Page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { tab?: string };
}) => {
  return (
    <>
      <Header gameId={params.id} />
    </>
  );
};

export default Page;
