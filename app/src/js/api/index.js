import * as c from '@/shared/constants';

class HttpError extends Error {
  constructor(response) {
    super(`${response.status} for ${response.url}`);
    this.name = 'HttpError';
    this.response = response;
  }
}

async function loadJSON(url) {
  let response = await fetch(`${c.API}/${url}/`);

  if (response.status === 200) {
    return response.json();
  } else {
    throw new HttpError(response);
  }
}

// Services
export async function fetchData(url) {
  let data;
  while(true) {
    try {
      data = await loadJSON(url);
      break;
    } catch (error) {
      if (error instanceof HttpError && error.response.status == 404) {
        console.log(error);
      } else {
        throw error;
      }
    }
  }

  return data;
}

