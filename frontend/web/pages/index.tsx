import { api } from "../utils/api";

export default function Page() {
  const { data, isLoading } = api.user.list.useQuery();

  return (
    <div>
      <h1>Hello World!</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <pre>{data && JSON.stringify(data)}</pre>
      )}
    </div>
  );
}
