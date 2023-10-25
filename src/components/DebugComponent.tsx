import { useRouteData, useSearchParams } from "@solidjs/router";
import { JSX } from "solid-js";

export const DebugComponent = (): JSX.Element => {
  const [searchParams, setSearchParams] = useSearchParams();

  return (
    <>
      <button
        onClick={() => {
          let searchParams = new URLSearchParams(window.location.search);
          searchParams.set("foo", Math.random().toString());
          // setSearchParams({ hello:  });
        }}
      >
        Press
      </button>
    </>
  );
};
