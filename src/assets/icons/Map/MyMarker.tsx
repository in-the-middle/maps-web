import L from 'leaflet'
import MyMarker from 'assets/icons/Map/myMarker.svg'
import FriendsMarker from 'assets/icons/Map/friendsMarker.svg'
import CenterMarker from 'assets/icons/Map/centerMarker.svg'

const MyMarkerIcon = L.icon({
  iconUrl: MyMarker,
  iconSize: [50, 62],
})

const FriendsMarkerIcon = L.icon({
  iconUrl: FriendsMarker,
  iconSize: [50, 62],
})

const CenterMarkerIcon = L.icon({
  iconUrl: CenterMarker,
  iconSize: [50, 62],
})

export { MyMarkerIcon, FriendsMarkerIcon, CenterMarkerIcon }
