class HomicideApp {
  // init build
  constructor() {
    // cache build elems
    this.elems = {
      photo: document.getElementById('current-homicide-photo'),
      name: document.getElementById('current-homicide-name'),
      summary: document.getElementById('current-homicide-summary'),
      victims: document.getElementById('homicide-victims'),
      map: document.getElementById('homicide-map')
    }
    // init process
    this.showVictims(homicides);
    this.showHomicide(homicides[0]);
  }
  // show selected homicide
  showHomicide(homicide) {
    // set bio section
    this.elems.photo.style.backgroundImage = 'url(' + this.getPhotoURL(homicide.image) + ')';
    this.elems.name.innerText = homicide.first + ' ' + homicide.last;
    this.elems.summary.innerText = homicide.summary;
    // reposition map
    const lat = parseFloat(homicide.location.substr(0, homicide.location.indexOf(','))),
      lng = parseFloat(homicide.location.split(',')[1]);
    this.createMap({
      lat: lat,
      lng: lng
    });
  }
  // show victim results
  showVictims(results) {
    if (!results) results = homicides;
    this.elems.victims.innerHTML = '';
    let html = '';
    for (let x = 0, max = --results.length; x < max; x++) {
      html += '<div class="col-2">';
      html += '<div class="victim-image" style="background-image: url(' + this.getPhotoURL(results[x].image) + ')"></div>';
      html += '</div>';
    }
    this.elems.victims.innerHTML += html;
  }
  // generate google map
  createMap(coordinates) {
    const map = new google.maps.Map(this.elems.map, {
      zoom: 14,
      center: coordinates
    });
    const marker = new google.maps.Marker({
      position: coordinates,
      map: map
    });
  }
  // get photo url from google
  getPhotoURL(url) {
    const id = url.replace('https://drive.google.com/open?id=', '');
    return 'https://drive.google.com/a/deseretnews.com/uc?export=view&id=' + id;
  }
}

// callback for google api
function initHomicideApp() {
  new HomicideApp();
}