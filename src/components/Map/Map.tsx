import React, { useState, useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  Polyline,
  MapConsumer,
  ZoomControl,
  useMap,
} from 'react-leaflet'
import L, { LatLngExpression } from 'leaflet'
import 'components/Map/Map.css'
import { MyMarkerIcon, FriendsMarkerIcon } from 'assets/icons/Map/MyMarker'
import { LatLngBoundsExpression } from 'leaflet'
import { DefaultApi } from '../../mapsApi/api'
import {
  CenterInputDTO,
  RouteInputDTO,
  TravelModeDTO,
} from '../../mapsApi/model'

import SearchInput from 'components/SearchInput/searchInput'
import VehicleButton from 'components/VehicleButton/vehicleButton'
import AvoidSwitch from 'components/avoidSwitch/avoidSwitch'

import styled from 'styled-components'

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

let markers = [] as any
let usersInfo = { users: [] } as CenterInputDTO
let centerRoutes = [[]]
let centerTime = [] as any
let centerLat = 0,
  centerLon = 0

const apiService = new DefaultApi('http://localhost:8080')

const routeOptions = { color: '#01B0E8', weight: 8 }

interface MyProps {}

interface RouteProps {
  centerRoutes: Array<Array<Array<number>>>
  centerLat: number
  centerLon: number
}

function LocationMarker() {
  const [position, setPosition] = useState([0, 0] as LatLngExpression)
  const [bbox, setBbox] = useState([])

  const map = useMap()

  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      map.flyTo(e.latlng, map.getZoom())
      setBbox(e.bounds.toBBoxString().split(',') as any)
      markers.push([e.latlng.lat, e.latlng.lat])
      setPosition(e.latlng)
      console.log(e.latlng)
      console.log(position)
    })
  }, [map])

  return position === null ? null : (
    <Marker position={position} icon={MyMarkerIcon}></Marker>
  )
}

class Map extends React.Component<MyProps, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      visible: false,
      settingsMenuOpened: false,
      mode: 'DRIVING',
      modeDTO: TravelModeDTO.DRIVING,
      includeTolls: false,
      includeHighways: false,
      includeFerries: false,
      correctMarkers: false,
    }
    this.handleVisibility = this.handleVisibility.bind(this)
    this.handleModeDriving = this.handleModeDriving.bind(this)
    this.handleModeBicycling = this.handleModeBicycling.bind(this)
    this.handleModeWalking = this.handleModeWalking.bind(this)
    this.handleModeTransit = this.handleModeTransit.bind(this)
  }

  handleVisibility() {
    this.setState(() => ({
      visible: true,
    }))
  }

  handleModeDriving() {
    this.setState(() => ({
      mode: 'DRIVING',
      modeDTO: TravelModeDTO.DRIVING,
    }))
  }

  handleModeBicycling() {
    this.setState(() => ({
      mode: 'BICYCLING',
      modeDTO: TravelModeDTO.BICYCLING,
    }))
  }

  handleModeWalking() {
    this.setState(() => ({
      mode: 'WALKING',
      modeDTO: TravelModeDTO.WALKING,
    }))
  }

  handleModeTransit() {
    this.setState(() => ({
      mode: 'TRANSIT',
      modeDTO: TravelModeDTO.TRANSIT,
    }))
  }

  handleTolls() {
    this.setState(() => ({
      includeTolls: !this.state.includeTolls,
    }))
  }

  handleHighways() {
    this.setState(() => ({
      includeHighways: !this.state.includeHighways,
    }))
  }

  handleFerries() {
    this.setState(() => ({
      includeFerries: !this.state.includeFerries,
    }))
  }

  async routeD(handleVisibility: any) {
    console.log(markers)
    let usersObject = [] as any
    for (let i = 0; i < markers.length; i++) {
      let userInfo = {
        location: {
          lat: markers[i][0],
          lon: markers[i][1],
        },
        mode: this.state.mode,
      }
      usersObject.push(userInfo)
    }
    usersInfo = { users: usersObject }
    let CenterPoint = await apiService.getCenter({ centerInputDTO: usersInfo })
    centerLat = CenterPoint.location?.lat!
    centerLon = CenterPoint.location?.lon!
    centerRoutes = []
    for (let i = 0; i < markers.length; i++) {
      let APoint = { lat: markers[i][0], lon: markers[i][1] }
      let BPoint = {
        lat: CenterPoint.location?.lat,
        lon: CenterPoint.location?.lon,
      }
      let route = {
        mode: this.state.modeDTO,
        origin: APoint,
        destination: BPoint,
        includeTolls: this.state.includeTolls,
        includeHighways: this.state.includeHighways,
        includeFerries: this.state.includeFerries,
      } as RouteInputDTO
      console.log(route)
      let routeResult = await apiService.getRoute({ routeInputDTO: route })
      centerTime.push(routeResult.summary?.time)
      coords = decode(routeResult.shape)
      centerRoutes.push(coords)
    }
    handleVisibility()
  }

  Routes(Props: RouteProps) {
    return (
      <div>
        <Marker icon={FriendsMarkerIcon} position={[centerLat, centerLon]} />
        <>
          {centerRoutes.map((item, index) => {
            return (
              <Polyline
                positions={centerRoutes[index]}
                pathOptions={routeOptions}
                key={index}
              />
            )
          })}
        </>
      </div>
    )
  }

  render() {
    return (
      <div className="leaflet-container">
        <Container>
          <InputContainer>
            <SearchInput title={'Enter the point'} icon={'first'} />
            <SearchInput title={'Enter the point'} icon={'second'} />
            {this.state.settingsMenuOpened ? (
              <AvoidContainer>
                <AvoidSwitch
                  title={'avoid tolls'}
                  enabled={this.state.includeTolls}
                  onPress={() => this.handleTolls()}
                />
                <AvoidSwitch
                  title={'avoid highways'}
                  enabled={this.state.includeHighways}
                  onPress={() => this.handleHighways()}
                />
                <AvoidSwitch
                  title={'avoid ferries'}
                  enabled={this.state.includeFerries}
                  onPress={() => this.handleFerries()}
                />
              </AvoidContainer>
            ) : null}
          </InputContainer>
          <ButtonContainer>
            <VehicleButtonContainer>
              <VehicleButton
                icon={'car'}
                onPress={() => this.handleModeDriving()}
              />
              <VehicleButton
                icon={'bike'}
                onPress={() => this.handleModeBicycling()}
              />
              <VehicleButton
                icon={'walking'}
                onPress={() => this.handleModeWalking()}
              />
              <VehicleButton
                icon={'public'}
                onPress={() => this.handleModeTransit()}
              />
            </VehicleButtonContainer>
            <ControlButtonContainer>
              <BuildButton onClick={() => this.routeD(this.handleVisibility)}>
                Build
              </BuildButton>
              <SettingsButton
                onClick={() =>
                  this.setState({
                    settingsMenuOpened: !this.state.settingsMenuOpened,
                  })
                }
              >
                Settings
              </SettingsButton>
            </ControlButtonContainer>
          </ButtonContainer>
        </Container>
        <MapContainer
          bounds={bounds}
          scrollWheelZoom={true}
          zoomControl={false}
        >
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

          <LocationMarker></LocationMarker>

          {this.state.visible ? (
            <this.Routes
              centerRoutes={centerRoutes}
              centerLat={centerLat}
              centerLon={centerLon}
            />
          ) : null}

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
          <ZoomControl position="topright" />
        </MapContainer>
      </div>
    )
  }
}

export default Map

const Container = styled.div`
  display: flex;
  flex-direction: row;
  z-index: 1000;
  position: absolute;
  top: 30px;
  left: 30px;
`

const InputContainer = styled.div`
  flex: 1;
  margin-right: 7.5px;
`

const ButtonContainer = styled.div`
  flex: 1;
`

const VehicleButtonContainer = styled.div`
  display: flex;
  height: 50px;
  width: 375px;
  flex-direction: row;
  margin-bottom: 15px;
  justify-content: space-between;
`

const ControlButtonContainer = styled.div`
  display: flex;
  height: 50px;
  width: 375px;
  flex-direction: row;
  margin-bottom: 15px;
  justify-content: space-between;
`

const SettingsButton = styled.button`
  height: 50px;
  display: flex;
  align-self: center;
  flex-direction: row;
  margin-left: 7.5px;
  margin-right: 7.5px;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 12px;
  background: #01b0e8;
  border: 0px;
  font-weight: 500;
  font-size: 20px;
  color: white;

  :hover {
    background: #0097c9;
    cursor: pointer;
  }
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

const BuildButton = styled.button`
  height: 50px;
  display: flex;
  align-self: center;
  flex-direction: row;
  margin-left: 7.5px;
  margin-right: 7.5px;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-radius: 12px;
  background-color: #73b15b;
  border: 0px;
  font-weight: 500;
  font-size: 20px;
  color: white;

  :hover {
    background: #609c48;
    cursor: pointer;
  }
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

const AvoidContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
  width: 375px;
  align-self: center;
  border-radius: 12px;
  background: rgba(245, 255, 245, 0.9);
  margin-bottom: 15px;
`
