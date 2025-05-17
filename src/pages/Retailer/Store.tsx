import { useParams } from "react-router-dom";

export default function Store() {
  const { id } = useParams<{ id: string }>();
  return (
    <div>
      <h1>Store Details</h1>
      {id}
    </div>
  );
}
