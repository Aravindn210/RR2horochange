// include-partials.js
// Usage: add <div data-include="navbar.html"></div> or <div data-include="footer.html"></div>
// This script will fetch the file and replace the element's innerHTML with the fetched content.

document.addEventListener('DOMContentLoaded', function () {
  const includes = document.querySelectorAll('[data-include]');
  let loadedCount = 0;

  if (includes.length === 0) {
    document.dispatchEvent(new CustomEvent('partialsLoaded'));
    return;
  }

  includes.forEach(el => {
    const path = el.getAttribute('data-include');
    if (!path) {
      loadedCount++;
      if (loadedCount === includes.length) document.dispatchEvent(new CustomEvent('partialsLoaded'));
      return;
    }
    fetch(path)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load ' + path);
        return res.text();
      })
      .then(html => {
        el.innerHTML = html;
        const dropdownElList = el.querySelectorAll('.dropdown-toggle');
        if (dropdownElList.length) {
          dropdownElList.forEach(dd => new bootstrap.Dropdown(dd));
        }

        loadedCount++;
        if (loadedCount === includes.length) {
          document.dispatchEvent(new CustomEvent('partialsLoaded'));
        }
      })
      .catch(err => {
        console.error(err);
        loadedCount++;
        if (loadedCount === includes.length) document.dispatchEvent(new CustomEvent('partialsLoaded'));
      });
  });
});
