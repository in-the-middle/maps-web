/**
 * ua.trip.maps.api.v1.MapsApi
 * Maps Service
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: ermakovsa03@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

export interface CenterInputDTO {
  users?: Array<UserInfoDTO>
}

export interface CenterOutputDTO {
  location?: LocationDTO
}

/**
 * Single set of lat and lng fields
 */
export interface LocationDTO {
  /**
   * Latitude
   */
  lat?: number
  /**
   * Longitude
   */
  lon?: number
}

/**
 * Object that represents input of route request
 */
export interface RouteInputDTO {
  origin?: LocationDTO
  destination?: LocationDTO
  mode?: TravelModeDTO
  includeTolls?: boolean
  includeHighways?: boolean
  includeFerries?: boolean
}

export interface RouteOutputDTO {
  units?: string
  language?: string
  origin?: LocationDTO
  destination?: LocationDTO
  summary?: SummaryDTO
  shape?: string
}

export interface SummaryDTO {
  minLat?: number
  minLon?: number
  maxLat?: number
  maxLon?: number
  time?: number
  length?: number
}
/**
 * @export
 * @enum {string}
 */
export enum TravelModeDTO {
  DRIVING = 'DRIVING',
  WALKING = 'WALKING',
  BICYCLING = 'BICYCLING',
  TRANSIT = 'TRANSIT',
}

export interface UserInfoDTO {
  location?: LocationDTO
  mode?: TravelModeDTO
}