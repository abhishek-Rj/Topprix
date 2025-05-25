import Navigation from "../components/navigation";
import useAuthenticate from "../hooks/authenticationt";

export default function Wishlist() {
  const { user } = useAuthenticate();
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {user}
        <Navigation />
      </div>
    </>
  );
}
