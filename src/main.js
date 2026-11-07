import { getImagesByQuery } from './js/pixabay-api.js';

import {
  renderImages,
  clearGallery,
  showError,
  showMessage,
  showLoader,
  hideLoader,
  showLoadMore,
  hideLoadMore,
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

  if (isLoading) return;

  const query = searchInput.value.trim();

  if (!query) {
    showError('Please enter a search query!');
    return;
  }

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  hideLoadMore();

  isLoading = true;
  showLoader();

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

    if (totalHits <= PER_PAGE) {
      hideLoadMore();
      showMessage("We're sorry, but you've reached the end of search results.");
    } else {
      showLoadMore();
    }
  } catch (error) {
    showError('Something went wrong. Please try again later.');
    console.error(error);
  } finally {
    hideLoader();
    isLoading = false;
  }
}
loadMoreBtn.addEventListener('click', onLoadMore);

let isLoading = false;
async function onLoadMore() {
  if (isLoading) return;

  isLoading = true;

  hideLoadMore();
  showLoader();

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
      hideLoadMore();

      showMessage("We're sorry, but you've reached the end of search results.");
    } else {
      showLoadMore();
    }
  } catch (error) {
    showError('Something went wrong. Please try again later.');
    console.error(error);
  } finally {
    hideLoader();
    isLoading = false;
  }
}
