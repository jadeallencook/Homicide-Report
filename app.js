new class HomicideApp {
  // init build
  constructor() {
    // cache build elems
    this.elems = {
      photo: document.getElementById('current-homicide-photo'),
      name: document.getElementById('current-homicide-name'),
      summary: document.getElementById('current-homicide-summary'),
      victims: document.getElementById('homicide-victims')
    }
    // init process
    this.showVictims();
    this.showHomicide(homicides[0]);
  }
  // show selected homicide
  showHomicide(homicide) {
    this.elems.photo.style.backgroundImage = 'url(' + this.getPhotoURL(homicide.image) + ')';
    this.elems.name.innerText = homicide.first + ' ' + homicide.last;
    this.elems.summary.innerText = homicide.summary;
  }
  // show victim results
  showVictims(search) {
    this.elems.victims.innerHTML = '';
    for (let x = 0; x < 6; x++) {
      let html = '<div class="col-2">';
      html += '<div class="victim-image" style="background-image: url(' + this.getPhotoURL(homicides[x].image) + ')"></div>';
      html += '</div>'
      this.elems.victims.innerHTML += html;
    }
  }
  // get photo url from google
  getPhotoURL(url) {
    const id = url.replace('https://drive.google.com/open?id=', '');
    return 'https://drive.google.com/a/deseretnews.com/uc?export=view&id=' + id;
  }
}