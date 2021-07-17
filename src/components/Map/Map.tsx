import React, { useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  Polyline,
  useMapEvents,
  MapConsumer,
} from 'react-leaflet'
import L from 'leaflet'
import 'components/Map/Map.css'
import { MyMarkerIcon, FriendsMarkerIcon } from 'assets/icons/Map/MyMarker'
import { LatLngBoundsExpression } from 'leaflet'
import { DefaultApi } from '../../mapsApi/api'
import {
  CenterInputDTO,
  RouteInputDTO,
  TravelModeDTO,
} from '../../mapsApi/model'
import ConfirmButton from 'components/ConfirmButton/ConfirmButton'
import MyInfo from './Kitten'

declare global {
  interface Window {
    _env_:any;
  }
}

function decode(str: any, precision?: number) {
  var index = 0,
    lat = 0,
    lng = 0,
    coordinates: [number, number][] = [],
    shift = 0,
    result = 0,
    byte = null,
    latitude_change,
    longitude_change,
    factor = Math.pow(10, precision || 6)

  while (index < str.length) {
    byte = null
    shift = 0
    result = 0

    do {
      byte = str.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    latitude_change = result & 1 ? ~(result >> 1) : result >> 1

    shift = result = 0

    do {
      byte = str.charCodeAt(index++) - 63
      result |= (byte & 0x1f) << shift
      shift += 5
    } while (byte >= 0x20)

    longitude_change = result & 1 ? ~(result >> 1) : result >> 1

    lat += latitude_change
    lng += longitude_change

    coordinates.push([lat / factor, lng / factor])
  }

  return coordinates
}

let coords = [] as any
let bounds: LatLngBoundsExpression = [
  [40.49751, -74.263481],
  [40.93053, -73.546144],
]

let markers = [[40.722699, -73.73593]]
let usersInfo = { users: [] } as CenterInputDTO
let centerRoutes = [[]]
let centerTime = [] as any
let centerLat = 0,
  centerLon = 0

const apiService = new DefaultApi(window._env_.REACT_APP_MAPS_SERVICE_URL)

async function routeD(handleVisibility: any) {
  console.log(markers)
  let usersObject = [] as any
  for (let i = 1; i < markers.length; i += 2) {
    let userInfo = {
      location: {
        lat: markers[i][0],
        lon: markers[i][1],
      },
      mode: 'DRIVING',
    }
    usersObject.push(userInfo)
  }
  usersInfo = { users: usersObject }
  console.log(usersInfo)
  let CenterPoint = await apiService.getCenter({ centerInputDTO: usersInfo })
  centerLat = CenterPoint.location?.lat!
  centerLon = CenterPoint.location?.lon!

  console.log(CenterPoint)

  for (let i = 1; i < markers.length; i += 2) {
    let APoint = { lat: markers[i][0], lon: markers[i][1] }
    let BPoint = {
      lat: CenterPoint.location?.lat,
      lon: CenterPoint.location?.lon,
    }
    let route = {
      mode: TravelModeDTO.DRIVING,
      origin: APoint,
      destination: BPoint,
      includeTolls: false,
      includeHighways: false,
      includeFerries: false,
    } as RouteInputDTO
    let routeResult = await apiService.getRoute({ routeInputDTO: route })
    centerTime.push(routeResult.summary?.time)
    coords = decode(routeResult.shape)
    centerRoutes.push(coords)
  }
  handleVisibility()
  console.log(centerRoutes)
}

interface RouteProps {
  visible: boolean
  centerRoutes: Array<Array<Array<number>>>
  centerLat: number
  centerLon: number
}

function Routes(Props: RouteProps) {
  console.log(centerRoutes)
  return Props.visible ? (
    <div>
      <Marker icon={FriendsMarkerIcon} position={[centerLat, centerLon]} />
      <>
        {centerRoutes.map((item, index) => {
          return index !== 0 ? (
            <Polyline
              positions={centerRoutes[index]}
              pathOptions={routeOptions}
              key={index}
            />
          ) : null
        })}
      </>
    </div>
  ) : null
}

const routeOptions = { color: '#01B0E8', weight: 8 }

interface MyProps {}

interface MyState {
  visible: boolean
}

class Map extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props)
    this.state = {
      visible: false,
    }
    this.handleVisibility = this.handleVisibility.bind(this)
  }

  handleVisibility() {
    this.setState((prevState) => ({
      visible: !prevState.visible,
    }))
  }

  render() {
    return (
      <div className="leaflet-container">
        <MapContainer bounds={bounds} scrollWheelZoom={true}>
          <LayersControl position="topright">
            <LayersControl.BaseLayer checked name="Light Theme">
              <TileLayer
                attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}"
                accessToken="0TrF3SsEIIn6VzxFTCQy7dMAUkTDEEp6Lwj5wswHvubv9E0iEg5NEQ9Njgu29AM2"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Dark Theme">
              <TileLayer
                attribution='<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token={accessToken}"
                accessToken="0TrF3SsEIIn6VzxFTCQy7dMAUkTDEEp6Lwj5wswHvubv9E0iEg5NEQ9Njgu29AM2"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          <Routes
            centerRoutes={centerRoutes}
            centerLat={centerLat}
            centerLon={centerLon}
            visible={this.state.visible}
          />

          <MyInfo
            centerTime={centerTime}
            onClick={routeD}
            visibility={this.handleVisibility}
          />

          <MapConsumer>
            {(map: L.Map | L.LayerGroup<any>) => {
              map.on('click', function (e: { latlng: { lat: any; lng: any } }) {
                const { lat, lng } = e.latlng
                markers.push([lat, lng])
                L.marker([lat, lng], { icon: MyMarkerIcon }).addTo(map)
              })
              return null
            }}
          </MapConsumer>
        </MapContainer>
      </div>
    )
  }
}

export default Map
