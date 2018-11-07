import '../scss/app.scss';
import '../pug/index.pug';

import LiveBookShowcase from './live_book_showcase';
import ProductsShowcase from './products_showcase';

ProductsShowcase();

document.addEventListener('DOMContentLoaded', function() {
  LiveBookShowcase();
});

function init() {

  // ProductsShowcase();
}
