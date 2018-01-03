
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
      this.refined = this.homicides;
      this.profileID = 0;
      this.googleURL = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=';
      this.googleAPI = '&key=AIzaSyCXllb7HBvBT_nv5jF0dxjaRAo4T6D34xw';
      // calendar build vars
      this.calendarMonths = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
      this.currentMonth = 0;
      // add search types
      this.search = {
        county: [],
        date: [],
        type: []
      }
      this.search.county.push('All');
      this.search.type.push('All');
      for (let homicide of this.homicides) {
        if (this.search.county.indexOf(homicide.county) === -1) this.search.county.push(homicide.county);
        if (this.search.type.indexOf(homicide.type) === -1) this.search.type.push(homicide.type);
      }
      this.search.date.push('All');
      for (let month of this.calendarMonths) {
        this.search.date.push(month);
      }
      this.createSearchDropdowns();
      // init process
      this.showVictims(this.homicides);
      this.showHomicide(this.homicides[0]);
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
        // get id for chrome and safari
        let id = '';
        if (!event.path) id = event.srcElement.id;
        else id = event.path[0].id;
        // show homicide
        if (id.indexOf('homicide-dot-') !== -1) {
          const num = parseInt(id.replace('homicide-dot-', ''));
          this.showHomicide(this.homicides[num]);
        }
      });
      // add search event listeners
      document.getElementById('search-county').addEventListener('click', (event) => {
        const county = event.target.getAttribute('value');
        this.refined = [];
        if (county && county !== 'All') {
          for (let homicide of this.homicides) {
            if (homicide.county === county) {
              this.refined.push(homicide);
            }
          }
          this.showVictims();
          document.querySelector('div#search-county div.search-dropdown-content').style.display = 'none';
        } else if (county === 'All') {
          this.refined = this.homicides;
          document.querySelector('div#search-county div.search-dropdown-content').style.display = 'none';
          this.showVictims();
        } else {
          document.querySelector('div#search-county div.search-dropdown-content').style.display = 'block';
        }
      });
      document.getElementById('search-date').addEventListener('click', (event) => {
        const date = event.target.getAttribute('value');
        if (date && date !== 'All') {
          this.refined = [];
          for (let homicide of this.homicides) {
            if (date === this.calendarMonths[new Date(homicide.date).getMonth()]) {
              this.refined.push(homicide);
            }
          }
          this.showVictims();
          document.querySelector('div#search-date div.search-dropdown-content').style.display = 'none';
        } else if (date === 'All') {
          this.refined = this.homicides;
          document.querySelector('div#search-date div.search-dropdown-content').style.display = 'none';
          this.showVictims();
        } else {
          document.querySelector('div#search-date div.search-dropdown-content').style.display = 'block';
        }
      });
      document.getElementById('search-type').addEventListener('click', (event) => {
        const type = event.target.getAttribute('value');
        if (type && type !== 'All') {
          this.refined = [];
          for (let homicide of this.homicides) {
            if (type === homicide.type) {
              this.refined.push(homicide);
            }
          }
          this.showVictims();
          document.querySelector('div#search-type div.search-dropdown-content').style.display = 'none';
        } else if (type === 'All') {
          this.refined = this.homicides;
          document.querySelector('div#search-type div.search-dropdown-content').style.display = 'none';
          this.showVictims();
        } else {
          document.querySelector('div#search-type div.search-dropdown-content').style.display = 'block';
        }
      });
    }
    // show selected homicide
    showHomicide(homicide) {
      // scroll to top 
      document.getElementById('current-homicide-photo').scrollIntoView();
      window.scrollBy(0, -50);
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
      this.elems.summary.innerHTML = homicide.summary + ' <b>' + homicide.alleged + ': </b><i>' + homicide.motive + '</i> (<a href="https://www.deseretnews.com/search/google?q=+' + homicide.first + '+' + homicide.last + '" target="_blank">Read More</a>)';
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
      this.currentMonth = Math.floor(new Date(homicide.date).getMonth() / 4) * 4;
      this.generateCalendar(this.currentMonth);
    }
    // show victim results
    showVictims() {
      this.elems.victims.innerHTML = '';
      for (let x = 0, max = this.homicides.length; x < max; x++) {
        let style = '';
        if (this.refined.indexOf(this.homicides[x]) === -1) style = 'style="display: none"';
        let html = `
          <div class="col-2" ${style}>
          <div onclick="javascript: 'ga' in window && ga('send', 'event', 'Homicide Victim', 'clicked', 'victim');" class="victim-image" id="victim-${x}" style="background-image: url('${(this.getPhotoURL(this.homicides[x].image))}')"></div>
          </div>
        `;
        this.elems.victims.innerHTML += html;
      }
      this.elems.victims.innerHTML += '<div class="col-12" id="reset-filters">Reset Filters</div>';
      document.getElementById('reset-filters').addEventListener('click', (event) => {
        this.refined = this.homicides;
        this.showVictims();
      });
      // add event listeners
      for (let x = 0, max = this.homicides.length; x < max; x++) {
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
          left = ((day / 31) * 90) + '%';
        // set dot color
        let backgroundColor = 'blue';
        if (homicide.type === 'Car crash') {
          backgroundColor = 'green';
        } else if (homicide.type === 'Shooting') {
          backgroundColor = 'red';
        } else if (homicide.type === 'Stabbing') {
          backgroundColor = 'orange';
        }
        // set border
        let css = 'left:' + left + '; background-color:' + backgroundColor + ';';
        if (this.profileID === x) {
          css += 'border: solid thin #000; z-index: 9999; bottom: 10px;';
        } else {
          css += 'border: solid thin #fff; z-index: 9; bottom: -6px;';
        }
        // insert elem into html
        if (month >= this.currentMonth && month < (this.currentMonth + 4)) {
          const container = dotContainers[month - this.currentMonth],
            id = 'homicide-dot-' + x;
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
      if (!url) {
        return 'https://media.deseretdigital.com/file/88aa4c1731?resize=width_800&type=png&c=14&a=af527bd9';
      } else {
        const id = url.replace('https://drive.google.com/open?id=', '');
        return 'https://drive.google.com/a/deseretnews.com/uc?export=view&id=' + id;
      }
    }
    // format date for bio
    formatDate(date) {
      date = new Date(date);
      date = (date.getMonth() + 1) + '/' + date.getDate() + '/' + date.getFullYear();
      return date;
    }
    // add info to dropdown searches
    createSearchDropdowns() {
      for (let category of Object.keys(this.search)) {
        const list = document.getElementById('search-' + category + '-list');
        list.innerHTML = '';
        for (let value of this.search[category]) {
          list.innerHTML += '<li class="dropdown-refiner" value="' + value + '">' + value + '</li>';
        }
      }
    }
    // refine search
    refineSearch() {
  
    }
  }
  
  // callback for google api
  function initHomicideApp() {
    if ('ga' in window) ga('send', 'event', 'Category', 'action', 'Label');
    new HomicideApp();
  }