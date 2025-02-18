export function fetcher<T>(url: string | URL | Request, init?: RequestInit): Promise<T> {
  const getUrl =
    typeof url === 'string' && !url.startsWith('http') ? `${process.env.BASE_URL}${url}` : url;

  return fetch(getUrl, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...init
  }).then((res) => res.json());
}
