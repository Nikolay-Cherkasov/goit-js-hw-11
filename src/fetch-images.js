import axios from 'axios';

const KEY = '35752722-db21acc954fae2600f1a47d51';
const URL = 'https://pixabay.com/api/';

export async function fetchImages(searchQuery, pageCount) {
  const params = {
    params: {
      key: KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      per_page: 40,
      page: pageCount,
    },
  };
  const response = await axios.get(URL, params);
  return response.data;
}
