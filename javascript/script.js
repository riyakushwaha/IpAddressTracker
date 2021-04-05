'use strict';
import {API_KEY} from "./_credentials.js";

const inputIP = document.querySelector(".app__input--ip");
const buttonSubmit = document.querySelector(".btn");
const userIP = document.querySelector(".user-ip");
const userLocation = document.querySelector(".user-location");
const userTimezone = document.querySelector(".user-timezone");
const userServiceName = document.querySelector(".user-service-name");
const userServiceValue = document.querySelector(".user-service-value");

class IPAddressTracker{
    #map;
    #myIcon;
    #mapZoomLevel = 13

    constructor(){
        this.getPosition();
        this.getPositionOfInputIP();
        buttonSubmit.addEventListener("click", this.getPositionOfInputIP.bind(this));
    }

    getPosition(){
        console.log("getPosition called");
        navigator.geolocation?.getCurrentPosition(
            this.loadMap.bind(this),
            function () {
              alert('Could not fetch your location');
            }
          );
    }

    loadMap(position){
        console.log("loadmap called");
        const { latitude, longitude } = position.coords;
        const coords = [latitude, longitude];

        this.#map = L.map('map').setView(coords, this.#mapZoomLevel);
        L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
            maxZoom: 20,
            subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
          }).addTo(this.#map);

        this.#myIcon = L.icon({
            iconUrl: '../images/icon-location.svg',
            iconSize: [20, 27],
        });

        this.renderMarkup(coords);
    }

    getPositionOfInputIP(){
        console.log("getPositionOfInputIP called");
        const ip = inputIP.value;
        inputIP.value = "";
        const request = fetch(`https://geo.ipify.org/api/v1?apiKey=${API_KEY}&ipAddress=${ip}`);

        request.then(reponse => reponse.json()).then(
            function(data){
                userIP.innerHTML = data.ip;
                userLocation.innerHTML = `${data.location.city}, ${data.location.country}`;
                userTimezone.innerHTML = data.location.timezone;
        
                if(data.isp){
                    userServiceName.innerHTML = "isp";
                    userServiceValue.innerHTML = data.isp;
                }else{
                    userServiceName.innerHTML = "usp";
                    userServiceValue.innerHTML = data.usp;
                } 
                return [data.location.lat, data.location.lng];   
            }
        ).then((coor) => this.renderMarkup(coor)).catch((err) => console.warn(err,"🎈🎈🎈"));
        
    }

    renderMarkup(coordinates){
        console.log("renderMarkup called", coordinates);
        this.#map.setView(coordinates, this.#mapZoomLevel);
        L.marker(coordinates, {icon: this.#myIcon}).addTo(this.#map).openPopup();
    }
}

const app = new IPAddressTracker();



