/* global google */
import PokeElement from '../PokeElement'
import PokeMapStyle from './map-style'
class PokeMap extends PokeElement {
  constructor () {
    super()
    this._map = null
    const shadowRoot = this.attachShadow({mode: 'open'})
    shadowRoot.innerHTML = `
      <style>
        .map {
          width: 100%;
          height: 100%;
        }
      </style>
      <div id="map" class="map">
        <slot></slot>
      </div>
    `
    this.addEventListener('marker-click', this._handleMarkerClick.bind(this))
  }

  static get is () {
    return 'poke-map'
  }

  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'lat' || name === 'lng') {
      this._changeCenter(+this.lat, +this.lng)
    }
  }

  connectedCallback () {
    this._loadMap()
  }

  disconnectedCallback () {
    this._map = null
  }

  _changeCenter (lat, lng) {
    this._map && this._map.setCenter({ lat, lng })
  }

  _handleMarkerClick (event) {
    event.stopPropagation()
    const { lat, lng } = event.detail
    this._changeCenter(lat, lng)
  }

  _loadMap () {
    const config = {
      center: { lat: +this.lat, lng: +this.lng },
      zoom: +this.zoom,
      styles: PokeMapStyle
    }
    this._map = new google.maps.Map(this.shadowRoot.querySelector('#map'), config)
  }

  get map () {
    return this._map
  }

  get zoom () {
    return this.getAttribute('zoom')
  }

  set zoom (newZoom) {
    this.setAttribute('zoom', newZoom)
  }
}

export default PokeMap
