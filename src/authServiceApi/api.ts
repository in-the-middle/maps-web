/* eslint @typescript-eslint/no-unused-vars: off */
/**
 * ua.trip.auth.service.api.v1.AuthServiceApi
 * Auth Service
 *
 * The version of the OpenAPI document: 0.0.1
 * Contact: ermakovsa03@gmail.com
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import {
    AuthenticationDTO,
    EmailStatusDTO,
    FriendDTO,
    GoogleAuthDTO,
    KeyDTO,
    LocationDTO,
    LocationPermissionDTO,
    PasswordResetStatusDTO,
    RefreshTokenDTO,
    StatusDTO,
    TokenDTO,
    TokensDTO,
    UserDTO,
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
     * @summary addFriend
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    addFriend(params?: {
        queryParams?: { id?: string, friendUsername?: string,  };
    }): Promise<void>;
    /**
     *
     * @summary authenticate
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    authenticate(params?: {
        authenticationDTO: AuthenticationDTO;
    }): Promise<TokensDTO>;
    /**
     *
     * @summary authenticateWithGoogle
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    authenticateWithGoogle(params?: {
        googleAuthDTO: GoogleAuthDTO;
    }): Promise<TokensDTO>;
    /**
     *
     * @summary changeLocationPermission
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    changeLocationPermission(params?: {
        queryParams?: { id?: string, friendUsername?: string, locationPermission?: LocationPermissionDTO,  };
    }): Promise<void>;
    /**
     *
     * @summary deleteFriend
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    deleteFriend(params?: {
        queryParams?: { id?: string, friendUsername?: string,  };
    }): Promise<void>;
    /**
     *
     * @summary getFriendList
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    getFriendList(params?: {
        queryParams?: { id?: string,  };
    }): Promise<Array<FriendDTO>>;
    /**
     *
     * @summary getPublicKeys
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    getPublicKeys(): Promise<Array<KeyDTO>>;
    /**
     *
     * @summary refreshToken
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    refreshToken(params?: {
        refreshTokenDTO: RefreshTokenDTO;
    }): Promise<TokenDTO>;
    /**
     *
     * @summary register
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    register(params?: {
        userDTO: UserDTO;
    }): Promise<StatusDTO>;
    /**
     *
     * @summary resetPassword
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    resetPassword(params?: {
        queryParams?: { email?: string, emailCode?: string, newPassword?: string,  };
    }): Promise<PasswordResetStatusDTO>;
    /**
     *
     * @summary saveLocation
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    saveLocation(params?: {
        locationDTO: LocationDTO;
    }): Promise<void>;
    /**
     *
     * @summary sendEmailCode
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    sendEmailCode(params?: {
        queryParams?: { id?: string,  };
    }): Promise<void>;
    /**
     *
     * @summary sendPasswordEmail
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    sendPasswordEmail(params?: {
        queryParams?: { email?: string,  };
    }): Promise<void>;
    /**
     *
     * @summary verifyEmail
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     * @memberof DefaultApi
     */
    verifyEmail(params?: {
        queryParams?: { id?: string, emailCode?: string,  };
    }): Promise<EmailStatusDTO>;
}

/**
 * DefaultApi - object-oriented interface
 */
export class DefaultApi extends BaseAPI implements DefaultApiInterface {
    /**
     *
     * @summary addFriend
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async addFriend(params: {
        queryParams?: { id?: string, friendUsername?: string,  };
    }): Promise<void> {
        return await this.POST(
            "/friend",
            params && params.queryParams,
        );
    }
    /**
     *
     * @summary authenticate
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async authenticate(params: {
        authenticationDTO: AuthenticationDTO;
    }): Promise<TokensDTO> {
        return await this.POST(
            "/authentication/login",
            {},
            { body: params.authenticationDTO, contentType: "application/json" }
        );
    }
    /**
     *
     * @summary authenticateWithGoogle
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async authenticateWithGoogle(params: {
        googleAuthDTO: GoogleAuthDTO;
    }): Promise<TokensDTO> {
        return await this.POST(
            "/authentication/login/google",
            {},
            { body: params.googleAuthDTO, contentType: "application/json" }
        );
    }
    /**
     *
     * @summary changeLocationPermission
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async changeLocationPermission(params: {
        queryParams?: { id?: string, friendUsername?: string, locationPermission?: LocationPermissionDTO,  };
    }): Promise<void> {
        return await this.POST(
            "/friend/location-permission",
            params && params.queryParams,
        );
    }
    /**
     *
     * @summary deleteFriend
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async deleteFriend(params: {
        queryParams?: { id?: string, friendUsername?: string,  };
    }): Promise<void> {
        return await this.DELETE(
            "/friend",
            params && params.queryParams,
        );
    }
    /**
     *
     * @summary getFriendList
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getFriendList(params: {
        queryParams?: { id?: string,  };
    }): Promise<Array<FriendDTO>> {
        return await this.POST(
            "/friend/list",
            params && params.queryParams,
        );
    }
    /**
     *
     * @summary getPublicKeys
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async getPublicKeys(): Promise<Array<KeyDTO>> {
        return await this.GET(
            "/authentication/public-keys",
            {},
        );
    }
    /**
     *
     * @summary refreshToken
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async refreshToken(params: {
        refreshTokenDTO: RefreshTokenDTO;
    }): Promise<TokenDTO> {
        return await this.POST(
            "/authentication/refresh-token",
            {},
            { body: params.refreshTokenDTO, contentType: "application/json" }
        );
    }
    /**
     *
     * @summary register
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async register(params: {
        userDTO: UserDTO;
    }): Promise<StatusDTO> {
        return await this.POST(
            "/user/register",
            {},
            { body: params.userDTO, contentType: "application/json" }
        );
    }
    /**
     *
     * @summary resetPassword
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async resetPassword(params: {
        queryParams?: { email?: string, emailCode?: string, newPassword?: string,  };
    }): Promise<PasswordResetStatusDTO> {
        return await this.POST(
            "/user/password/reset",
            params && params.queryParams,
        );
    }
    /**
     *
     * @summary saveLocation
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async saveLocation(params: {
        locationDTO: LocationDTO;
    }): Promise<void> {
        return await this.POST(
            "/user/location",
            {},
            { body: params.locationDTO, contentType: "application/json" }
        );
    }
    /**
     *
     * @summary sendEmailCode
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async sendEmailCode(params: {
        queryParams?: { id?: string,  };
    }): Promise<void> {
        return await this.POST(
            "/user/email/send-code",
            params && params.queryParams,
        );
    }
    /**
     *
     * @summary sendPasswordEmail
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async sendPasswordEmail(params: {
        queryParams?: { email?: string,  };
    }): Promise<void> {
        return await this.POST(
            "/user/password/send-email",
            params && params.queryParams,
        );
    }
    /**
     *
     * @summary verifyEmail
     * @param {*} [params] Request parameters, including pathParams, queryParams (including bodyParams) and http options.
     * @throws {HttpError}
     */
    public async verifyEmail(params: {
        queryParams?: { id?: string, emailCode?: string,  };
    }): Promise<EmailStatusDTO> {
        return await this.POST(
            "/user/email/verify",
            params && params.queryParams,
        );
    }
}

export const servers: ApplicationApis[] = [
    {
        defaultApi: new DefaultApi("/"),
    },
];

