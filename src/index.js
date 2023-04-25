import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import { fetchImages } from './fetch-images';

const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const btnLoadMore = document.querySelector('.load-more');
let pageCount = 1;
let searchQuery = '';
const lightbox = new SimpleLightbox('.gallery a');

form.addEventListener('submit', onSubmit);
btnLoadMore.addEventListener('click', onLoadBtnClick);
btnLoadMore.style.display = 'none';

async function onSubmit(event) {
  event.preventDefault();
  gallery.innerHTML = '';
  btnLoadMore.style.display = 'none';

  searchQuery = event.currentTarget.searchQuery.value.trim();

  const response = await fetchImages(searchQuery, pageCount);
  if (response.length === 0) {
    return Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${response.totalHits} images.`);
    imageMarkup(response.hits);
    lightbox.refresh();
    if (response.totalHits === response.hits.length) {
      btnLoadMore.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      btnLoadMore.style.display = 'block';
    }
  }
}

function imageMarkup(images) {
  const markup = images
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => {
        return `<div class="photo-card">
<a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" /></a>  
<div class="info">
    <p class="info-item">
      <b>Likes</br>${likes}</b>
    </p>
    <p class="info-item">
      <b>Views</br>${views}</b>
    </p>
    <p class="info-item">
      <b>Comments</br>${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads</br>${downloads}</b>
    </p>
  </div>
</div>`;
      }
    )
    .join('');
  gallery.innerHTML += markup;
}

async function onLoadBtnClick() {
  pageCount += 1;
  const response = await fetchImages(searchQuery, pageCount);
  imageMarkup(response.hits);
  lightbox.refresh();
}
