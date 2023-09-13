import { useParams } from "@solidjs/router";
import { MdBookWrapper } from "../components/MdBookWrapper";
export const CallsPage = () => {
  let params = useParams<{ pallet: string }>();
  return (
    <MdBookWrapper>
      <h1>Pallet {params.pallet}</h1>
    </MdBookWrapper>
  );
};
