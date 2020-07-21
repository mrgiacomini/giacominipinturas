import useSWR from 'swr'
import Api from '../service/api';

export function useFetch<Data = any, Error = any>(url: string) {
  const { data, error, mutate, isValidating } = useSWR<Data, Error>(url, async url => {
    const response = await Api.get(url);

    return response.data;
  })

  return { data, error, mutate, isValidating }
}