import { useRouteError } from "react-router-dom";

export default function Error() {
  const error = useRouteError() as { statusText: string; message: string };
  console.error(error);

  return (
    <div className="min-h-[500px] w-[90%] mx-auto bg-gray-800 rounded-lg">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
