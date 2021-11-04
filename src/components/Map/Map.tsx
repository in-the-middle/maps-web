import React, { useState, useEffect } from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
  Polyline,
  MapConsumer,
  ZoomControl,
  useMap,
  Tooltip,
} from 'react-leaflet'
import { LatLngExpression, marker } from 'leaflet'
import 'components/Map/Map.css'
import { MyMarkerIcon, FriendsMarkerIcon } from 'assets/icons/Map/MyMarker'
import { LatLngBoundsExpression } from 'leaflet'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import Loader from 'react-loader-spinner'
import MediaQuery from 'react-responsive'

import { DefaultApi } from '../../mapsApi/api'
import {
  CenterInputDTO,
  RouteInputDTO,
  TravelModeDTO,
} from '../../mapsApi/model'

import SearchInput from 'components/SearchInput/searchInput'
import VehicleButton from 'components/VehicleButton/vehicleButton'
import AvoidSwitch from 'components/avoidSwitch/avoidSwitch'
import FriendsPopup from 'components/friendsPopup/friendsPopup'
import FriendSettings from 'components/FriendSettings/FriendSettings'

import LocationOn from 'assets/icons/Interface/locationOn.svg'
import LocationOff from 'assets/icons/Interface/locationOff.svg'

import authService from 'components/apiDeclaration/apiDeclaration'

import MyInfo from 'components/Map/Interface'

import { friends } from 'mocks/friends'

import styled from 'styled-components'
import { LocationDTO } from 'authServiceApi'

declare global {
  interface Window {
    _env_: any
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

let usersInfo = { users: [] } as CenterInputDTO
let centerRoutes = [[]]
let userLocation = [] as any
let userLocationFlag = false

let centerLat = 0,
  centerLon = 0

const apiService = new DefaultApi('https://maps-be-v1-45iud4jnfq-uc.a.run.app')

const routeOptions = { color: '#01B0E8', weight: 8 }

interface MapProps {
  user: any
}

interface RouteProps {
  centerRoutes: Array<Array<Array<number>>>
  centerLat: number
  centerLon: number
}

var locationShare = [] as any
function LocationShare(props: any) {
  const map = useMap()
  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      locationShare = e.latlng
      console.log(locationShare)
    })
  }, [])
  return <div></div>
}

function LocationMarker(props: any) {
  const { username } = props
  const [position, setPosition] = useState([0, 0] as LatLngExpression)
  const [bbox, setBbox] = useState([])

  const map = useMap()

  useEffect(() => {
    map.locate().on('locationfound', function (e) {
      map.flyTo(e.latlng, map.getZoom())
      setBbox(e.bounds.toBBoxString().split(',') as any)
      userLocation = [e.latlng.lat, e.latlng.lng]
      userLocationFlag = true
      setPosition(e.latlng)
    })
  }, [])

  return position === null ? null : (
    <Marker position={position} icon={MyMarkerIcon}>
      <UserTooltop direction={'bottom'} offset={[0, 25]} permanent>
        {username}
      </UserTooltop>
    </Marker>
  )
}

class Map extends React.Component<MapProps, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      markers: [],
      centerTime: [],
      builded: false,
      settingsMenuOpened: false,
      mode: 'DRIVING',
      modeDTO: TravelModeDTO.DRIVING,
      includeTolls: true,
      includeHighways: true,
      includeFerries: true,
      loading: false,
      location: false,
      bounds: [
        [40.49751, -74.263481],
        [40.93053, -73.546144],
      ] as LatLngBoundsExpression,
      setting: 'preferences',
      friends: [],
      firstSearchValue: '',
      displayedFriends: [],
      addedFriends: [],
      changesApplied: false,
    }
    this.handleBuild = this.handleBuild.bind(this)
    this.handleModeDriving = this.handleModeDriving.bind(this)
    this.handleModeBicycling = this.handleModeBicycling.bind(this)
    this.handleModeWalking = this.handleModeWalking.bind(this)
    this.handleModeTransit = this.handleModeTransit.bind(this)
    this.newMarker = this.newMarker.bind(this)
    this.onValueChange = this.onValueChange.bind(this)
    this.checkDisplayedFriend = this.checkDisplayedFriend.bind(this)
    this.addFriendMarker = this.addFriendMarker.bind(this)
    this.changeFriendsList = this.changeFriendsList.bind(this)
  }

  async componentDidMount() {
    const response = await authService.getFriendList({
      queryParams: {
        id: this.props.user.userId,
      },
    })

    console.log(locationShare)

    const request = {
      id: this.props.user.userId,
      lat: locationShare.lat,
      lon: locationShare.lng,
    } as LocationDTO

    const locResponse = await authService.saveLocation({ locationDTO: request })
    console.log(locResponse)

    this.setState({ friends: response })
    console.log(locationShare)
  }

  addFriendMarker(username: any) {
    console.log(this.state.markers)
    const addedFriends = [...this.state.addedFriends]
    const alreadyAdded = addedFriends.find(
      (friend: any) => friend.username === username,
    )
    if (!!alreadyAdded) {
      const addedIndex = addedFriends.indexOf(alreadyAdded)
      addedFriends.splice(addedIndex, 1)
    } else {
      const uniqueFriend = this.state.friends.find(
        (friend: any) => friend.username === username,
      )
      addedFriends.push(uniqueFriend)
    }
    console.log(addedFriends)
    this.setState({ addedFriends })
  }

  checkDisplayedFriend(username: number) {
    console.log(username)
    const markers = [...this.state.markers]
    const displayedFriends = [...this.state.displayedFriends]
    const alreadyDisplayed = displayedFriends.find(
      (friend: any) => friend.username === username,
    )

    if (!!alreadyDisplayed) {
      const displayedIndex = displayedFriends.indexOf(alreadyDisplayed)
      const displayedMarker = markers.find(
        (marker: any) =>
          marker[0] === alreadyDisplayed.lat &&
          marker[1] === alreadyDisplayed.lon,
      )
      const markerIndex = markers.indexOf(displayedMarker)
      markers.splice(markerIndex, 1)
      displayedFriends.splice(displayedIndex, 1)
    } else {
      console.log(markers)
      const uniqueFriend = this.state.friends.find(
        (friend: any) => friend.username === username,
      )
      markers.push([uniqueFriend.lat, uniqueFriend.lon])
      displayedFriends.push(uniqueFriend)
    }
    this.setState({ displayedFriends })
    this.setState({ markers })
  }

  newMarker() {
    const markers = this.state
    markers.push([40.695841, -73.913678])
    this.setState({ markers })
  }

  addMarker = (e: any) => {
    const { markers } = this.state
    markers.push([e.latlng.lat, e.latlng.lng])
    this.setState({ markers })
  }

  onValueChange = (value: string) => {
    this.setState(() => ({
      firstSearchValue: value,
    }))
  }

  changeFriendsList = (friends: any) => {
    this.setState(() => ({
      friends: friends,
    }))
  }

  handleBuild() {
    this.setState(() => ({
      builded: true,
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

  FriendMarkers(props: any) {
    const { displayedFriends } = props

    return displayedFriends ? (
      <div>
        {displayedFriends.map((friend: any) => (
          <Marker position={[friend.lat, friend.lon]} icon={MyMarkerIcon}>
            <FriendsTooltop direction={'bottom'} offset={[0, 25]} permanent>
              {'@'}
              {friend.username}
            </FriendsTooltop>
          </Marker>
        ))}
      </div>
    ) : null
  }

  async routeD() {
    for (let i = 0; i < this.state.addedFriends.length; i++) {
      console.log(this.state.addedFriends[i])
      if (this.state.addedFriends[i].lat && this.state.addedFriends[i].lon) {
        const { markers } = this.state
        markers.push([
          this.state.addedFriends[i].lat,
          this.state.addedFriends[i].lon,
        ])
        this.setState({ markers })
      }
      console.log(this.state.markers)
    }
    if (
      (this.state.markers.length > 0 && !userLocationFlag) ||
      (this.state.markers.length > 0 && userLocationFlag)
    ) {
      this.setState({ loading: true })
      if (userLocationFlag) {
        const { markers } = this.state
        markers.push(userLocation)
        this.setState({ markers })
      }
      let usersObject = [] as any
      for (let i = 0; i < this.state.markers.length; i++) {
        let userInfo = {
          location: {
            lat: this.state.markers[i][0],
            lon: this.state.markers[i][1],
          },
          mode: this.state.mode,
          includeTolls: this.state.includeTolls,
          includeHighways: this.state.includeHighways,
          includeFerries: this.state.includeFerries,
        }
        usersObject.push(userInfo)
      }
      usersInfo = { users: usersObject }
      let CenterPoint = await apiService.getCenter({
        centerInputDTO: usersInfo,
      })
      centerLat = CenterPoint.location?.lat!
      centerLon = CenterPoint.location?.lon!
      centerRoutes = []
      for (let i = 0; i < this.state.markers.length; i++) {
        let APoint = {
          lat: this.state.markers[i][0],
          lon: this.state.markers[i][1],
        }
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
        let { centerTime } = this.state
        centerTime.push(routeResult.summary?.time)
        this.setState({ centerTime })
        coords = decode(routeResult.shape)
        centerRoutes.push(coords)
      }
      this.setState({ builded: true })
      this.setState({ loading: false })
    }
  }

  clearRoutes() {
    var markers = [...this.state.markers]
    markers = []
    this.state.displayedFriends.map((friend: any) =>
      markers.push([friend.lat, friend.lon]),
    )
    this.setState({ markers, builded: false, centerTime: [] })
  }

  Routes(_Props: RouteProps) {
    return (
      <div>
        <Marker icon={FriendsMarkerIcon} position={[centerLat, centerLon]}>
          <CenterPointTooltop direction={'bottom'} offset={[0, 25]} permanent>
            center point
          </CenterPointTooltop>
        </Marker>
        <>
          {centerRoutes.map((_item, index) => {
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
    const locationMarkerProps = {
      newMarker: this.newMarker,
      user: this.props.user,
    }
    return (
      <div className="leaflet-container">
        <MediaQuery minWidth={850}>
          <Container>
            <InputContainer>
              <SearchInput
                value={this.state.firstSearchValue}
                onValueChange={this.onValueChange}
                title={'Enter the point'}
                icon={'first'}
              />
              <SearchInput
                value=""
                onValueChange={() => {}}
                title={'Enter the point'}
                icon={'second'}
              />
              {this.state.firstSearchValue === '@' ? (
                <FriendsPopup
                  user={this.props.user}
                  friends={this.state.friends}
                  displayedFriends={this.state.displayedFriends}
                  checkDisplayedFriend={this.checkDisplayedFriend}
                  addFriendMarker={this.addFriendMarker}
                  addedFriends={this.state.addedFriends}
                />
              ) : null}
              {this.state.settingsMenuOpened ? (
                <AvoidContainer>
                  <SwitchSettingContainer>
                    <SwitchSetting
                      onClick={() =>
                        this.setState(() => ({
                          setting: 'preferences',
                        }))
                      }
                    >
                      Preferences
                    </SwitchSetting>
                    <SwitchSetting
                      onClick={() =>
                        this.setState(() => ({
                          setting: 'friends',
                        }))
                      }
                    >
                      Friends
                    </SwitchSetting>
                  </SwitchSettingContainer>
                  {this.state.setting === 'preferences' ? (
                    <div>
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
                    </div>
                  ) : (
                    <FriendSettings
                      user={this.props.user}
                      changeFriendsList={this.changeFriendsList}
                    />
                  )}
                </AvoidContainer>
              ) : null}
            </InputContainer>
            <ButtonContainer>
              <VehicleButtonContainer>
                <VehicleButton
                  icon={'car'}
                  onPress={() => this.handleModeDriving()}
                  active={this.state.mode === 'DRIVING' ? true : false}
                />
                <VehicleButton
                  icon={'bike'}
                  onPress={() => this.handleModeBicycling()}
                  active={this.state.mode === 'BICYCLING' ? true : false}
                />
                <VehicleButton
                  icon={'walking'}
                  onPress={() => this.handleModeWalking()}
                  active={this.state.mode === 'WALKING' ? true : false}
                />
                <VehicleButton
                  icon={'public'}
                  onPress={() => this.handleModeTransit()}
                  active={this.state.mode === 'TRANSIT' ? true : false}
                />
              </VehicleButtonContainer>

              <ControlButtonContainer>
                {!this.state.builded ? (
                  <BuildButton
                    onClick={() => {
                      if (!this.state.builded) this.routeD()
                    }}
                  >
                    Build
                  </BuildButton>
                ) : (
                  <ClearButton onClick={() => this.clearRoutes()}>
                    Clear
                  </ClearButton>
                )}
                <SettingsButton
                  onClick={() =>
                    this.setState({
                      settingsMenuOpened: !this.state.settingsMenuOpened,
                    })
                  }
                >
                  Settings
                </SettingsButton>
                <LocationButton
                  onClick={() => {
                    if (this.state.location) userLocationFlag = false
                    this.setState({ location: !this.state.location })
                  }}
                >
                  <img
                    width={25}
                    src={this.state.location ? LocationOn : LocationOff}
                    alt={''}
                  ></img>
                </LocationButton>
              </ControlButtonContainer>
            </ButtonContainer>
          </Container>
        </MediaQuery>

        <MediaQuery maxWidth={849}>
          <MobileContainer>
            <Sidebar />
            <MainContainer>
              <InputContainer>
                <SearchInput
                  value={this.state.firstSearchValue}
                  onValueChange={this.onValueChange}
                  title={'Enter the point'}
                  icon={'first'}
                />
                <SearchInput
                  value=""
                  onValueChange={() => {}}
                  title={'Enter the point'}
                  icon={'second'}
                />
              </InputContainer>
              <ButtonContainer>
                <MobileVehicleButtonContainer>
                  <VehicleButton
                    icon={'car'}
                    onPress={() => this.handleModeDriving()}
                    active={this.state.mode === 'DRIVING' ? true : false}
                  />
                  <VehicleButton
                    icon={'bike'}
                    onPress={() => this.handleModeBicycling()}
                    active={this.state.mode === 'BICYCLING' ? true : false}
                  />
                  <VehicleButton
                    icon={'walking'}
                    onPress={() => this.handleModeWalking()}
                    active={this.state.mode === 'WALKING' ? true : false}
                  />
                  <VehicleButton
                    icon={'public'}
                    onPress={() => this.handleModeTransit()}
                    active={this.state.mode === 'TRANSIT' ? true : false}
                  />
                </MobileVehicleButtonContainer>

                <MobileControlButtonContainer>
                  {!this.state.builded ? (
                    <BuildButton
                      onClick={() => {
                        if (!this.state.builded) this.routeD()
                      }}
                    >
                      Build
                    </BuildButton>
                  ) : (
                    <ClearButton onClick={() => this.clearRoutes()}>
                      Clear
                    </ClearButton>
                  )}
                  <SettingsButton
                    onClick={() =>
                      this.setState({
                        settingsMenuOpened: !this.state.settingsMenuOpened,
                      })
                    }
                  >
                    Settings
                  </SettingsButton>
                  <LocationButton
                    onClick={() => {
                      if (this.state.location) userLocationFlag = false
                      this.setState({ location: !this.state.location })
                    }}
                  >
                    <img
                      width={25}
                      src={this.state.location ? LocationOn : LocationOff}
                      alt={''}
                    ></img>
                  </LocationButton>
                </MobileControlButtonContainer>
              </ButtonContainer>
              {this.state.settingsMenuOpened ? (
                <MobileAvoidContainer>
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
                </MobileAvoidContainer>
              ) : null}
            </MainContainer>
            <Sidebar />
          </MobileContainer>
        </MediaQuery>

        {this.state.loading ? (
          <div>
            <LoadingContainer />
            <LoaderWrapper>
              <Loader
                type="RevolvingDot"
                color="#01B0E8"
                height={100}
                width={100}
              />
            </LoaderWrapper>
          </div>
        ) : null}
        <MapContainer
          bounds={this.state.bounds}
          center={[40.695841, -73.913678]}
          scrollWheelZoom={true}
          zoomControl={false}
          whenCreated={(map) => {
            map.on('click', this.addMarker)
          }}
        >
          <LayersControl position="bottomright">
            <LayersControl.BaseLayer checked name="Light Theme">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://api.mapbox.com/styles/v1/kamenev/cksc5k2m71yw218ntxj7sadj2/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoia2FtZW5ldiIsImEiOiJja3NjNDZhaGEwY3puMnJwazVmZHh1ejJ6In0.3JVkm1gYv6KWCUQhfEViuQ"
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer name="Dark Theme">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.jawg.io/jawg-sunny/{z}/{x}/{y}{r}.png?access-token={accessToken}"
                accessToken="0TrF3SsEIIn6VzxFTCQy7dMAUkTDEEp6Lwj5wswHvubv9E0iEg5NEQ9Njgu29AM2"
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {this.state.markers.map((_position: any, idx: any) => (
            <Marker
              key={`marker-${idx}`}
              icon={MyMarkerIcon}
              position={[
                this.state.markers[idx][0],
                this.state.markers[idx][1],
              ]}
            ></Marker>
          ))}

          {this.state.builded ? (
            <this.Routes
              centerRoutes={centerRoutes}
              centerLat={centerLat}
              centerLon={centerLon}
            />
          ) : null}

          {this.state.location ? (
            <LocationMarker
              username={this.props.user.username}
              {...(locationMarkerProps as any)}
            />
          ) : null}

          <LocationShare />

          <this.FriendMarkers
            displayedFriends={this.state.displayedFriends}
          ></this.FriendMarkers>

          <ZoomControl position="bottomright" />
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

const MobileContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  z-index: 1000;
  position: absolute;
  top: 20px;
`

const Sidebar = styled.div`
  flex: 0.05;
`

const MainContainer = styled.div`
  flex: 0.9;
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

const MobileVehicleButtonContainer = styled.div`
  display: flex;
  height: 50px;
  width: 100%;
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

const MobileControlButtonContainer = styled.div`
  display: flex;
  height: 50px;
  width: 100%;
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

const ClearButton = styled.button`
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
  background: #eb5160;
  border: 0px;
  font-weight: 500;
  font-size: 20px;
  color: white;

  :hover {
    background: #a83a45;
    cursor: pointer;
  }
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
`

const LocationButton = styled.button`
  height: 50px;
  width: 50px;
  display: flex;
  align-self: center;
  flex-direction: row;
  margin-left: 7.5px;
  margin-right: 7.5px;
  justify-content: center;
  align-items: center;

  border-radius: 12px;
  background: rgba(245, 255, 245, 0.9);
  border: 0px;

  :hover {
    background: rgba(200, 245, 200, 0.9);
    cursor: pointer;
  }
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
  width: 375px;
  align-self: center;
  border-radius: 12px;
  background: rgba(245, 255, 245, 0.9);
  margin-bottom: 15px;
`

const MobileAvoidContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 150px;
  width: 100%;
  align-self: center;
  border-radius: 12px;
  background: rgba(245, 255, 245, 0.9);
  margin-bottom: 15px;
`

const LoadingContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: white;
  opacity: 0.5;
  z-index: 1000;
`

const LoaderWrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 1001;
`

const SwitchSetting = styled.button`
  flex: 0.5;
  border: 0;
  background-color: rgba(245, 255, 245, 0.9);
  margin-top: 20px;
  margin-bottom: 20px;
  font-size: 20px;
  cursor: pointer;
  font-weight: 600;
`

const SwitchSettingContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const FriendsTooltop = styled(Tooltip)`
  padding-bottom: 5px;
  font-size: 15px;
  color: #589441;
  font-weight: 600;
  background-color: rgba(245, 255, 245, 1);
  border: 1px solid rgba(245, 255, 245, 1);
  border-radius: 10px;
  opacity: 1;
`

const UserTooltop = styled(Tooltip)`
  padding-bottom: 5px;
  font-size: 15px;
  color: #01b0e8;
  font-weight: 600;
  background-color: rgba(245, 255, 245, 1);
  border: 1px solid rgba(245, 255, 245, 1);
  border-radius: 10px;
  opacity: 1;
`

const CenterPointTooltop = styled(Tooltip)`
  padding-bottom: 5px;
  font-size: 15px;
  color: #fdbb2d;
  font-weight: 600;
  background-color: rgba(245, 255, 245, 1);
  border: 1px solid rgba(245, 255, 245, 1);
  border-radius: 10px;
  opacity: 1;
`
