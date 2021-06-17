/* eslint @typescript-eslint/no-unused-vars: off */
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

import {
    CenterInputDTO,
    CenterOutputDTO,
    LocationDTO,
    RouteInputDTO,
    RouteOutputDTO,
    SummaryDTO,
    TravelModeDTO,
    UserInfoDTO,
} from "./model";

import { BaseAPI } from "./base";

export interface ApplicationApis {
    defaultApi: DefaultApiInterface;
}

/**
 * DefaultApi - object-oriented interface
 */
export interface DefaultApiInterface {
    /**
     *
     * @summary getCenter
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    getCenter(params?: {
        centerInputDTO: CenterInputDTO;
    }): Promise<CenterOutputDTO>;
    /**
     *
     * @summary getRoute
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    getRoute(params?: {
        routeInputDTO: RouteInputDTO;
    }): Promise<RouteOutputDTO>;
}

/**
 * DefaultApi - object-oriented interface
 */
export class DefaultApi extends BaseAPI implements DefaultApiInterface {
    /**
     *
     * @summary getCenter
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getCenter(params: {
        centerInputDTO: CenterInputDTO;
    }): Promise<CenterOutputDTO> {
        return await this.POST(
            "/center",
            {},
            { body: params.centerInputDTO, contentType: "application/json" }
        );
    }
    /**
     *
     * @summary getRoute
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getRoute(params: {
        routeInputDTO: RouteInputDTO;
    }): Promise<RouteOutputDTO> {
        return await this.POST(
            "/route",
            {},
            { body: params.routeInputDTO, contentType: "application/json" }
        );
    }
}

export const servers: ApplicationApis[] = [
    {
        defaultApi: new DefaultApi("/"),
    },
];

