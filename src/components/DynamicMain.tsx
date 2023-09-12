import { useParams } from "@solidjs/router";

export const DynamicMain = () => {
  const params = useParams<{ path: string }>();

  return (
    <>
      <h1>Dynamic page</h1>
      <p>{JSON.stringify(params)}</p>
    </>
  );
};
