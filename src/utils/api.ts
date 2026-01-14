import { API_URL } from './constants';
import { CharactersResponse, Episode } from './types';

export async function getCharacters(page?: number): Promise<CharactersResponse> {
  const url = new URL(`${API_URL}/character`);
  
  if (page) {
    url.searchParams.append('page', String(page));
  }

  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function getEpisodesByIds(ids: number[]): Promise<Episode[]> {
  const url = `${API_URL}/episode/${ids.join(',')}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Error en la petición: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();

  if (!data) return [];

  return Array.isArray(data) ? data : [data];
}
