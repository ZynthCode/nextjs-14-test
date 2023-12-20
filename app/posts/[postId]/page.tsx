import React from "react";

type Props = {
  params: {
    postId: string;
  };
};

export const generateMetadata = async ({ params }: Props) => {
  // const post = await getPost(params.postId);
  return { title: params.postId };
};

const page = ({ params: { postId } }: Props) => {
  return <div>POST ID: {postId}</div>;
};

export default page;
