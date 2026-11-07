import iziToast from 'izitoast';
import SimpleLightbox from 'simplelightbox';

import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallery = document.querySelector('.gallery');

let lightbox = null;

// Створення HTML-розмітки карток
function createGalleryMarkup(images) {
  return images
    .map(
      image => `
        <li class="gallery-item">
          <a class="gallery-link" href="${image.largeImageURL}">
            <img
              class="gallery-image"
              src="${image.webformatURL}"
              alt="${image.tags}"
            />
          </a>
          <div class="image-info">
            <p><b>Likes:</b> ${image.likes}</p>
            <p><b>Views:</b> ${image.views}</p>
            <p><b>Comments:</b> ${image.comments}</p>
            <p><b>Downloads:</b> ${image.downloads}</p>
          </div>
        </li>
      `
    )
    .join('');
}

// Додавання зображень у галерею
export function renderImages(images) {
  const markup = createGalleryMarkup(images);

  gallery.insertAdjacentHTML('beforeend', markup);

  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a', {
      captionsData: 'alt',
      captionDelay: 250,
    });
  } else {
    lightbox.refresh();
  }
}

// Очищення галереї
export function clearGallery() {
  gallery.innerHTML = '';
}

// Повідомлення про помилку
export function showError(message) {
  iziToast.error({
    message,
    position: 'topRight',
  });
}

// Повідомлення про успішний пошук
export function showMessage(message) {
  iziToast.info({
    message,
    position: 'topRight',
  });
}
