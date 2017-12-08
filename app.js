(() => {
  // show selected homicide
  function displayHomicide(homicide) {
    const photo = document.getElementById('current-homicide-photo'),
      name = document.getElementById('current-homicide-name'),
      summary = document.getElementById('current-homicide-summary');
    photo.style.backgroundImage = 'url(' + getPhotoURL(homicide.image) + ')';
    name.innerText = homicide.first + ' ' + homicide.last;
    summary.innerText = homicide.summary;
  }
  // show results 
  function displayVictims() {
    const container = document.getElementById('homicide-victims');
    container.innerHTML = '';
    for (let x = 0; x < 6; x++) {
      let html = '<div class="col-2">';
      html += '<div class="victim-image" style="background-image: url(' + getPhotoURL(homicides[x].image) + ')"></div>';
      html += '</div>'
      container.innerHTML += html;
    }
  }
  // get photo from google drive
  function getPhotoURL(url) {
    const id = url.replace('https://drive.google.com/open?id=', '');
    return 'https://drive.google.com/a/deseretnews.com/uc?export=view&id=' + id;
  }
  // show first homicide
  displayVictims();
  displayHomicide(homicides[0]);
})();