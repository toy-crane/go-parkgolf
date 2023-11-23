import React from "react";

const Page = ({ params }: { params: { id: string } }) => {
  return (
    <main>
      <div>{params.id}</div>
    </main>
  );
};

export default Page;
