class HomicideApp {
  // init build
  constructor() {
    // cache build elems
    this.elems = {
      photo: document.getElementById('current-homicide-photo'),
      name: document.getElementById('current-homicide-name'),
      summary: document.getElementById('current-homicide-summary'),
      victims: document.getElementById('homicide-victims'),
      map: document.getElementById('homicide-map'),
      county: document.getElementById('current-homicide-county'),
      town: document.getElementById('current-homicide-town'),
      date: document.getElementById('current-homicide-date'),
      type: document.getElementById('current-homicide-type')
    }
    this.homicides = homicides;
    this.profileID = 0;
    this.googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
    this.googleAPI = '&key=AIzaSyCXllb7HBvBT_nv5jF0dxjaRAo4T6D34xw';
    // calendar build vars
    this.calendarMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    this.currentMonth = 0;
    // add search types
    this.search = {
      county: [],
      city: [],
      date: [],
      type: []
    }
    for (let homicide of this.homicides) {
      if (this.search.type.indexOf(homicide.type) === -1) {
        this.search.type.push(homicide.type);
      }
      // get location using google api
      this.getLocation(homicide.location).then((location) => {
        // add results to search
        if (this.search.county.indexOf(location.county) === -1) this.search.county.push(location.county);
        if (this.search.city.indexOf(location.city) === -1) this.search.city.push(location.city);
        // add city/county to homicide data
        if (this.homicides[this.homicides.indexOf(homicide)]) {
          this.homicides[this.homicides.indexOf(homicide)].city = location.city;
          this.homicides[this.homicides.indexOf(homicide)].county = location.county;
        }
        // show init homicide after api calls are done
        if (this.homicides.indexOf(homicide) === (this.homicides.length - 1)) {
          this.showHomicide(this.homicides[0]);
        }
        // apply search data to dropdowns
        this.createSearchDropdowns();
      });
    }
    this.search.date = this.calendarMonths;
    // init process
    this.showVictims(this.homicides);
    // genereate calendar event listeners
    this.generateCalendar();
    document.getElementById('timeline-right').addEventListener('click', () => {
      if (this.currentMonth === 8) this.currentMonth = 0;
      else this.currentMonth = this.currentMonth + 4;
      this.generateCalendar(this.currentMonth);
    });
    document.getElementById('timeline-left').addEventListener('click', () => {
      if (this.currentMonth === 0) this.currentMonth = 8;
      else this.currentMonth = this.currentMonth - 4;
      this.generateCalendar(this.currentMonth);
    });
    document.addEventListener('click', (event) => {
      if (event.path[0].id.indexOf('homicide-dot-') !== -1) {
        const num = parseInt(event.path[0].id.replace('homicide-dot-', ''));
        this.showHomicide(this.homicides[num]);
      }
    });
    // add search event listeners
    document.getElementById('search-county').addEventListener('click', () => {
      console.log(true);
    });
    document.getElementById('search-city').addEventListener('click', () => {
      console.log(true);
    });
    document.getElementById('search-date').addEventListener('click', () => {
      console.log(true);
    });
    document.getElementById('search-type').addEventListener('click', () => {
      console.log(true);
    });
  }
  // show selected homicide
  showHomicide(homicide) {
    // scroll to top 
    document.body.scrollTop = document.documentElement.scrollTop = 0;
    // highlight calendar dot
    this.profileID = this.homicides.indexOf(homicide);
    if (document.getElementById('homicide-dot-' + this.profileID)) {
      const homicideDotElem = document.getElementById('homicide-dot-' + this.profileID);
      homicideDotElem.style.border = 'solid thin black';
    }
    // highlight vitim profile pic
    for (let elem of document.getElementsByClassName('victim-image')) {
      elem.style.border = 'thick solid #fff';
    }
    document.getElementById('victim-' + this.profileID).style.border = 'thick solid #000';
    // set bio section
    this.elems.photo.style.backgroundImage = 'url(' + this.getPhotoURL(homicide.image) + ')';
    this.elems.name.innerText = homicide.first + ' ' + homicide.last;
    this.elems.summary.innerText = homicide.summary;
    this.elems.county.innerText = homicide.county;
    this.elems.town.innerText = homicide.city;
    this.elems.date.innerText = this.formatDate(homicide.date);
    this.elems.type.innerText = homicide.type;
    // reposition map
    const lat = parseFloat(homicide.location.substr(0, homicide.location.indexOf(','))),
      lng = parseFloat(homicide.location.split(',')[1]);
    this.createMap({
      lat: lat,
      lng: lng
    });
    this.generateCalendar();
  }
  // show victim results
  showVictims(results) {
    if (!results) results = this.homicides;
    this.elems.victims.innerHTML = '';
    for (let x = 0, max = --results.length; x < max; x++) {
      let html = '<div class="col-2">';
      html += '<div class="victim-image" id="victim-' + x + '" style="background-image: url(' + this.getPhotoURL(results[x].image) + ')"></div>';
      html += '</div>';
      this.elems.victims.innerHTML += html;
    }
    // add event listeners
    for (let x = 0, max = results.length; x < max; x++) {
      document.getElementById('victim-' + x).addEventListener('click', () => {
        this.showHomicide(this.homicides[x]);
      });
    }
  }
  // generate calendar with victims
  generateCalendar(startMonth) {
    // create calendar UI
    const monthContainers = document.getElementsByClassName('timeline-date');
    if (!startMonth) startMonth = 0;
    for (let container of monthContainers) {
      container.innerText = this.calendarMonths[startMonth];
      startMonth++;
    }
    // clear containers
    const dotContainers = document.getElementsByClassName('timeline-dot-container');
    for (let container of dotContainers) {
      container.innerHTML = '';
    }
    // insert data into calendar
    for (let x = 0, max = this.homicides.length; x < max; x++) {
      // build vars
      const homicide = this.homicides[x],
        month = new Date(homicide.date).getMonth(),
        day = new Date(homicide.date).getDate(),
        left = ((day / 30) * 100) + '%';
      // set dot color
      let backgroundColor = '#00F';
      if (homicide.type === 'Vehicular') {
        backgroundColor = '#0F0';
      } else if (homicide.type === 'Shooting') {
        backgroundColor = '#F00';
      }
      // set border
      let css = 'left:' + left + '; background-color:' + backgroundColor + ';';
      if (this.profileID === x) {
        css += 'border: solid thin #000; z-index: 9999;';
      } else {
        css += 'border: solid thin #fff; z-index: 9;';
      }
      // insert elem into html
      if (month >= this.currentMonth && month < (this.currentMonth + 4)) {
        const container = dotContainers[month - this.currentMonth],
          id = 'homicide-dot-' + (x + this.currentMonth);
        container.innerHTML = container.innerHTML + '<div class="timeline-dot" id="' + id + '" style="' + css + '"></div>';
      }
    }
  }
  // generate google map
  createMap(coordinates) {
    const map = new google.maps.Map(this.elems.map, {
      zoom: 9,
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
  // format date for bio
  formatDate(date) {
    date = new Date(date);
    date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
    return date;
  }
  // get city/county from lat/long
  getLocation(coordinates) {
    return new Promise((res, reject) => {
      coordinates = coordinates.replace(' ', '');
      const requestURL = this.googleURL + coordinates + this.googleAPI;
      const request = new XMLHttpRequest();
      request.open('GET', requestURL, true);
      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          const geoData = JSON.parse(request.responseText);
          const county = geoData.results[0]['address_components'][3]['long_name'],
            city = geoData.results[0]['address_components'][2]['long_name'];
          res({
            city: city,
            county: county
          });
        };
      }
      request.send();
    });
  }
  // add info to dropdown searches
  createSearchDropdowns() {
    for (let category of Object.keys(this.search)) {
      const list = document.getElementById('search-' + category + '-list');
      list.innerHTML = '';
      for (let value of this.search[category]) {
        list.innerHTML += '<li>' + value + '</li>';
      }
    }
  }
}

// callback for google api
function initHomicideApp() {
  new HomicideApp();
}