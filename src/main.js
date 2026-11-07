import { getImagesByQuery } from './js/pixabay-api.js';

import {
  renderImages,
  clearGallery,
  showError,
  showMessage,
} from './js/render-functions.js';

import './css/styles.css';

const searchForm = document.querySelector('.form');
const searchInput = document.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');
const loader = document.querySelector('.loader');

let currentPage = 1;
let currentQuery = '';
let totalHits = 0;

const PER_PAGE = 15;

searchForm.addEventListener('submit', onSearch);

async function onSearch(event) {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    showError('Please enter a search query!');
    return;
  }

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  loadMoreBtn.classList.add('hidden');

  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    totalHits = data.totalHits;

    if (data.hits.length === 0) {
      showMessage(
        'Sorry, there are no images matching your search query. Please try again!'
      );
      return;
    }

    renderImages(data.hits);

    if (totalHits > PER_PAGE) {
      loadMoreBtn.classList.remove('hidden');
    }
  } catch (error) {
    showError('Something went wrong. Please try again later.');
    console.error(error);
  }
}
loadMoreBtn.addEventListener('click', onLoadMore);

let isLoading = false;
async function onLoadMore() {
  if (isLoading) return;

  isLoading = true;
  loadMoreBtn.disabled = true;

  try {
    const nextPage = currentPage + 1;

    const data = await getImagesByQuery(currentQuery, nextPage);

    currentPage = nextPage;

    renderImages(data.hits);

    const card = document.querySelector('.gallery-item');

    if (card) {
      const cardHeight = card.getBoundingClientRect().height;

      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }

    if (currentPage * PER_PAGE >= totalHits) {
      loadMoreBtn.classList.add('hidden');

      showMessage("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    showError('Something went wrong. Please try again later.');
    console.error(error);
  } finally {
    isLoading = false;
    loadMoreBtn.disabled = false;
  }
}
