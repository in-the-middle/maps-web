import React from 'react'
import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  Polyline,
  Rectangle,
} from 'react-leaflet'
import 'components/Map/Map.css'
import 'mocks/mock.json'
import { StartMarker } from 'uikit/Icons'

function decode(str: string, precision?: number) {
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

const bounds: [number, number][] = [
  [41.313533, 19.813264],
  [41.328792, 19.817446],
]

const limeOptions = { color: 'magenta' }

function Map() {
  const coords: [number, number][] = decode(
    'qhoymAsenxd@dG_A~KgBpJyAvCa@lB[hB[~Do@vEw@~M}BbToDflA{T|VyEjDo@fEu@jc@kInYoFxc@kIfGmAnEu@d@fFtRz{BdC`[fDr_@hDx`@zBxVz@|IzBe@dPuCp@KrCg@pCg@~S{DdGeAxQeDjEu@n_@wGvAWhB]xNkCtNkCxDs@pMaCxt@_N`Es@|\\kG~AY|@Qh@rB`AzAtAz@|AR~ASbBmAfAwB^sC?kAGq@|E{@f\\cG`PuClDo@b\\_GdCe@be@oIlHsAlDo@`@GpFaAb[yFrB_@lB]bLsBhDo@rDq@vT}Ddl@oKzDClH^xBf@z@f@t@oD',
  )

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
        <Polyline pathOptions={limeOptions} positions={coords} />
        <Marker position={coords[0]}></Marker>
        <Marker position={coords[coords.length - 1]} />
        <Marker position={coords[coords.length / 2]} />
      </MapContainer>
    </div>
  )
}

export default Map
