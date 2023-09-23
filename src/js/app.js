import createGellaryCard from "../templates/gellary-card.hbs"
import { UnsplashAPI } from "./unsplash-api";
import { galleryEl, formEl, loadMoreBtn } from "./refs";
import { hideLoader, showLoader, hideMoreBtn, showMoreBtn } from "./function";
import 'simplelightbox/dist/simple-lightbox.min.css';
const unsplashAPI = new UnsplashAPI(12);
let simpleLightBox;

formEl.addEventListener("submit", onSubmit);
loadMoreBtn.addEventListener("click", onMoreData);

function onSubmit (event) {
  event.preventDefault();
  unsplashAPI.page = 1

  const searchQuery = event.currentTarget.elements['user-search-query'].value.trim();

  if (!searchQuery) {
    return alert('Please enter some value');
  }

  showLoader();

  unsplashAPI.query = searchQuery;

  unsplashAPI.getPhotos().then(resp => {
    galleryEl.innerHTML = createGellaryCard(resp.results);
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    alert(`Hi we found ${resp.total} fotos`)
    if (resp.total < unsplashAPI.perPage) return;
    showMoreBtn();

  }).catch(error => {
    console.log(error);
  }).finally( () => {
    hideLoader();
    
  })
 

}

function onMoreData (event) {
  unsplashAPI.page += 1;
  simpleLightBox.destroy();
  unsplashAPI.getPhotos().then(resp => {
    galleryEl.insertAdjacentHTML('beforeend', createGellaryCard(resp.results));
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
    if (unsplashAPI.page === resp.total_pages) {
    hideMoreBtn();
    alert("You reached the end")
  }
  }).catch(error => {
    console.log(error);
  })
}