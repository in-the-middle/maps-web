import {
    AuthenticationDTO,
    EmailStatusDTO,
    FriendDTO,
    FriendDTOFriendStatusEnum,
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
} from "../model";

export class Random {
    seed: number;
    constructor(seed: number) {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) this.seed += 2147483646;
    }

    next(): number {
        this.seed = (this.seed * 16807) % 2147483647;
        return this.seed;
    }

    nextFloat(): number {
        return (this.next() - 1) / 2147483646;
    }

    nextInt(limit: number): number {
        return this.next() % limit;
    }

    nextnumber(limit: number): number {
        return this.next() % limit;
    }

    nextBoolean(): boolean {
        return this.nextInt(2) == 0;
    }

    pickOne<T>(options: Array<T>): T {
        return options[this.nextInt(options.length)];
    }

    pickSome<T>(options: Array<T>, n?: number): T[] {
        const shuffled = options.sort(() => 0.5 - this.next());
        return shuffled.slice(0, n || this.nextInt(options.length));
    }

    uuidv4(): string {
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
            const r = this.nextInt(16) | 0;
            const v = c == "x" ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });
    }
}

type Factory<T> = {
    [P in keyof T]?: ((sampleData: TestSampleData) => T[P]) | T[P];
};

type ModelFactory<T> = Factory<T> | ((testData: TestSampleData) => T);

export interface SampleModelFactories {
    AuthenticationDTO?: ModelFactory<AuthenticationDTO>;
    EmailStatusDTO?: ModelFactory<EmailStatusDTO>;
    FriendDTO?: ModelFactory<FriendDTO>;
    GoogleAuthDTO?: ModelFactory<GoogleAuthDTO>;
    KeyDTO?: ModelFactory<KeyDTO>;
    LocationDTO?: ModelFactory<LocationDTO>;
    LocationPermissionDTO?: ModelFactory<LocationPermissionDTO>;
    PasswordResetStatusDTO?: ModelFactory<PasswordResetStatusDTO>;
    RefreshTokenDTO?: ModelFactory<RefreshTokenDTO>;
    StatusDTO?: ModelFactory<StatusDTO>;
    TokenDTO?: ModelFactory<TokenDTO>;
    TokensDTO?: ModelFactory<TokensDTO>;
    UserDTO?: ModelFactory<UserDTO>;
}

export interface SamplePropertyValues {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: (sampleData: TestSampleData) => any;
}

export interface TestData {
    seed?: number;
    sampleModelProperties?: SampleModelFactories;
    samplePropertyValues?: SamplePropertyValues;
    now?: Date;
}

export interface PropertyDefinition {
    containerClass: string;
    propertyName: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    example?: string | null | Array<any>;
    isNullable?: boolean;
}

export class TestSampleData {
    random: Random;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sampleModelProperties: any;
    samplePropertyValues: SamplePropertyValues;
    now: Date;

    constructor({ seed, sampleModelProperties, samplePropertyValues, now }: TestData) {
        this.random = new Random(seed || 100);
        this.now = now || new Date(2019, 1, seed);
        this.sampleModelProperties = sampleModelProperties || {};
        this.samplePropertyValues = samplePropertyValues || {};
    }

    nextFloat(): number {
        return this.random.nextFloat();
    }

    nextInt(limit: number): number {
        return this.random.nextInt(limit);
    }

    nextBoolean(): boolean {
        return this.random.nextBoolean();
    }

    sampleboolean(): boolean {
        return this.random.nextBoolean();
    }

    pickOne<T>(options: Array<T>): T {
        return this.random.pickOne(options);
    }

    pickSome<T>(options: Array<T>): T[] {
        return this.random.pickSome(options);
    }

    uuidv4(): string {
        return this.random.uuidv4();
    }

    randomArray<T>(generator: (n: number) => T, length?: number): T[] {
        if (!length) length = this.nextInt(3) + 1;
        return Array.from({ length }).map((_, index) => generator(index));
    }

    randomEmail(): string {
        return (
            this.randomFirstName().toLowerCase() +
            "." +
            this.randomLastName().toLowerCase() +
            "@" +
            this.randomDomain()
        );
    }

    randomFirstName(): string {
        return this.pickOne(["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Linda"]);
    }

    randomLastName(): string {
        return this.pickOne(["Smith", "Williams", "Johnson", "Jones", "Brown", "Davis", "Wilson"]);
    }

    randomFullName(): string {
        return this.randomFirstName() + " " + this.randomLastName();
    }

    randomDomain(): string {
        return (
            this.pickOne(["a", "b", "c", "d", "e"]) +
            ".example." +
            this.pickOne(["net", "com", "org"])
        );
    }

    randomPastDateTime(now: Date): Date {
        return new Date(now.getTime() - this.nextInt(4 * 7 * 24 * 60 * 60 * 1000));
    }

    sampleDateTime(): Date {
        return this.randomPastDateTime(this.now);
    }

    samplenumber(): number {
        return this.nextInt(10000);
    }

    sampleDate(): Date {
        return this.randomPastDateTime(this.now);
    }

    sampleString(dataFormat?: string, example?: string): string {
        if (dataFormat === "uuid") {
            return this.uuidv4();
        }
        if (dataFormat === "uri") {
            return "https://" + this.randomDomain() + "/" + this.randomFirstName().toLowerCase();
        }
        if (dataFormat === "email") {
            return this.randomEmail();
        }
        if (example && example !== "null") return example;
        return "foo";
    }

    sampleArrayString(length?: number): Array<string> {
        return Array.from({ length: length || this.arrayLength() }).map(() => this.sampleString());
    }

    generate(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        template?: ((sampleData: TestSampleData) => any) | any,
        propertyDefinition?: PropertyDefinition,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        generator?: () => any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ): any {
        if (template) {
            return typeof template === "function" ? template(this) : template;
        }
        if (propertyDefinition) {
            const { containerClass, propertyName, example } = propertyDefinition;
            if (this.sampleModelProperties[containerClass]) {
                const propertyFactory = this.sampleModelProperties[containerClass][propertyName];
                if (propertyFactory && typeof propertyFactory === "function") {
                    return propertyFactory(this);
                } else if (propertyFactory) {
                    return propertyFactory;
                }
            }
            if (this.samplePropertyValues[propertyName]) {
                return this.samplePropertyValues[propertyName](this);
            }
            if (example && example !== "null") return example;
        }
        return generator && generator();
    }

    arrayLength(): number {
        return this.nextInt(3) + 1;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sample(modelName: string): any {
        switch (modelName) {
            case "AuthenticationDTO":
                return this.sampleAuthenticationDTO();
            case "Array<AuthenticationDTO>":
                return this.sampleArrayAuthenticationDTO();
            case "EmailStatusDTO":
                return this.sampleEmailStatusDTO();
            case "Array<EmailStatusDTO>":
                return this.sampleArrayEmailStatusDTO();
            case "FriendDTO":
                return this.sampleFriendDTO();
            case "Array<FriendDTO>":
                return this.sampleArrayFriendDTO();
            case "GoogleAuthDTO":
                return this.sampleGoogleAuthDTO();
            case "Array<GoogleAuthDTO>":
                return this.sampleArrayGoogleAuthDTO();
            case "KeyDTO":
                return this.sampleKeyDTO();
            case "Array<KeyDTO>":
                return this.sampleArrayKeyDTO();
            case "LocationDTO":
                return this.sampleLocationDTO();
            case "Array<LocationDTO>":
                return this.sampleArrayLocationDTO();
            case "LocationPermissionDTO":
                return this.sampleLocationPermissionDTO();
            case "Array<LocationPermissionDTO>":
                return this.sampleArrayLocationPermissionDTO();
            case "PasswordResetStatusDTO":
                return this.samplePasswordResetStatusDTO();
            case "Array<PasswordResetStatusDTO>":
                return this.sampleArrayPasswordResetStatusDTO();
            case "RefreshTokenDTO":
                return this.sampleRefreshTokenDTO();
            case "Array<RefreshTokenDTO>":
                return this.sampleArrayRefreshTokenDTO();
            case "StatusDTO":
                return this.sampleStatusDTO();
            case "Array<StatusDTO>":
                return this.sampleArrayStatusDTO();
            case "TokenDTO":
                return this.sampleTokenDTO();
            case "Array<TokenDTO>":
                return this.sampleArrayTokenDTO();
            case "TokensDTO":
                return this.sampleTokensDTO();
            case "Array<TokensDTO>":
                return this.sampleArrayTokensDTO();
            case "UserDTO":
                return this.sampleUserDTO();
            case "Array<UserDTO>":
                return this.sampleArrayUserDTO();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleAuthenticationDTO(template: Factory<AuthenticationDTO> = {}): AuthenticationDTO {
        const containerClass = "AuthenticationDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            username: this.generate(
                template?.username,
                { containerClass, propertyName: "username", isNullable: false },
                () => this.sampleString("", "null")
            ),
            encryptedPassword: this.generate(
                template?.encryptedPassword,
                { containerClass, propertyName: "encryptedPassword", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayAuthenticationDTO(
        template: Factory<AuthenticationDTO> = {},
        length?: number
    ): Array<AuthenticationDTO> {
        return this.randomArray(
            () => this.sampleAuthenticationDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleEmailStatusDTO(): EmailStatusDTO {
        const containerClass = "EmailStatusDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return this.pickOne([
            EmailStatusDTO.VERIFIED,
            EmailStatusDTO.WRONGCODE,
            EmailStatusDTO.TOOMANYTRIES,
        ]);
    }

    sampleArrayEmailStatusDTO(length?: number): Array<EmailStatusDTO> {
        return this.randomArray(
            () => this.sampleEmailStatusDTO(),
            length ?? this.arrayLength()
        );
    }

    sampleFriendDTO(template: Factory<FriendDTO> = {}): FriendDTO {
        const containerClass = "FriendDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            username: this.generate(
                template?.username,
                { containerClass, propertyName: "username", isNullable: false },
                () => this.sampleString("", "null")
            ),
            locationPermission: this.generate(
                template?.locationPermission,
                { containerClass, propertyName: "locationPermission", example: "null", isNullable: false },
                () => this.sampleLocationPermissionDTO()
            ),
            friendStatus: this.generate(
                template?.friendStatus,
                { containerClass, propertyName: "friendStatus", example: "null", isNullable: false },
                () =>
                    this.pickOne([
                        FriendDTOFriendStatusEnum.FRIENDS,
                        FriendDTOFriendStatusEnum.INVITEDBYME,
                        FriendDTOFriendStatusEnum.INVITEDBYHIM,
                    ])
            ),
            lat: this.generate(
                template?.lat,
                { containerClass, propertyName: "lat", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            lon: this.generate(
                template?.lon,
                { containerClass, propertyName: "lon", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
        };
    }

    sampleArrayFriendDTO(
        template: Factory<FriendDTO> = {},
        length?: number
    ): Array<FriendDTO> {
        return this.randomArray(
            () => this.sampleFriendDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleGoogleAuthDTO(template: Factory<GoogleAuthDTO> = {}): GoogleAuthDTO {
        const containerClass = "GoogleAuthDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            tokenId: this.generate(
                template?.tokenId,
                { containerClass, propertyName: "tokenId", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayGoogleAuthDTO(
        template: Factory<GoogleAuthDTO> = {},
        length?: number
    ): Array<GoogleAuthDTO> {
        return this.randomArray(
            () => this.sampleGoogleAuthDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleKeyDTO(template: Factory<KeyDTO> = {}): KeyDTO {
        const containerClass = "KeyDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            kid: this.generate(
                template?.kid,
                { containerClass, propertyName: "kid", isNullable: false },
                () => this.sampleString("", "null")
            ),
            alg: this.generate(
                template?.alg,
                { containerClass, propertyName: "alg", isNullable: false },
                () => this.sampleString("", "null")
            ),
            value: this.generate(
                template?.value,
                { containerClass, propertyName: "value", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayKeyDTO(
        template: Factory<KeyDTO> = {},
        length?: number
    ): Array<KeyDTO> {
        return this.randomArray(
            () => this.sampleKeyDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleLocationDTO(template: Factory<LocationDTO> = {}): LocationDTO {
        const containerClass = "LocationDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            id: this.generate(
                template?.id,
                { containerClass, propertyName: "id", isNullable: false },
                () => this.sampleString("", "null")
            ),
            lat: this.generate(
                template?.lat,
                { containerClass, propertyName: "lat", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            lon: this.generate(
                template?.lon,
                { containerClass, propertyName: "lon", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
        };
    }

    sampleArrayLocationDTO(
        template: Factory<LocationDTO> = {},
        length?: number
    ): Array<LocationDTO> {
        return this.randomArray(
            () => this.sampleLocationDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleLocationPermissionDTO(): LocationPermissionDTO {
        const containerClass = "LocationPermissionDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return this.pickOne([
            LocationPermissionDTO.ALLOWED,
            LocationPermissionDTO.NOTALLOWED,
        ]);
    }

    sampleArrayLocationPermissionDTO(length?: number): Array<LocationPermissionDTO> {
        return this.randomArray(
            () => this.sampleLocationPermissionDTO(),
            length ?? this.arrayLength()
        );
    }

    samplePasswordResetStatusDTO(): PasswordResetStatusDTO {
        const containerClass = "PasswordResetStatusDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return this.pickOne([
            PasswordResetStatusDTO.PASSWORDCHANGED,
            PasswordResetStatusDTO.WRONGCODE,
            PasswordResetStatusDTO.WEAKPASSWORD,
        ]);
    }

    sampleArrayPasswordResetStatusDTO(length?: number): Array<PasswordResetStatusDTO> {
        return this.randomArray(
            () => this.samplePasswordResetStatusDTO(),
            length ?? this.arrayLength()
        );
    }

    sampleRefreshTokenDTO(template: Factory<RefreshTokenDTO> = {}): RefreshTokenDTO {
        const containerClass = "RefreshTokenDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            token: this.generate(
                template?.token,
                { containerClass, propertyName: "token", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayRefreshTokenDTO(
        template: Factory<RefreshTokenDTO> = {},
        length?: number
    ): Array<RefreshTokenDTO> {
        return this.randomArray(
            () => this.sampleRefreshTokenDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleStatusDTO(): StatusDTO {
        const containerClass = "StatusDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return this.pickOne([
            StatusDTO.CREATED,
            StatusDTO.USERNAMEALREADYEXISTS,
            StatusDTO.EMAILALREADYEXISTS,
            StatusDTO.WEAKPASSWORD,
        ]);
    }

    sampleArrayStatusDTO(length?: number): Array<StatusDTO> {
        return this.randomArray(
            () => this.sampleStatusDTO(),
            length ?? this.arrayLength()
        );
    }

    sampleTokenDTO(template: Factory<TokenDTO> = {}): TokenDTO {
        const containerClass = "TokenDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            token: this.generate(
                template?.token,
                { containerClass, propertyName: "token", isNullable: false },
                () => this.sampleString("", "null")
            ),
            tokenType: this.generate(
                template?.tokenType,
                { containerClass, propertyName: "tokenType", isNullable: false },
                () => this.sampleString("", "null")
            ),
            expiresInSeconds: this.generate(
                template?.expiresInSeconds,
                { containerClass, propertyName: "expiresInSeconds", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
        };
    }

    sampleArrayTokenDTO(
        template: Factory<TokenDTO> = {},
        length?: number
    ): Array<TokenDTO> {
        return this.randomArray(
            () => this.sampleTokenDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleTokensDTO(template: Factory<TokensDTO> = {}): TokensDTO {
        const containerClass = "TokensDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            accessToken: this.generate(
                template?.accessToken,
                { containerClass, propertyName: "accessToken", example: "null", isNullable: false },
                () => this.sampleTokenDTO()
            ),
            refreshToken: this.generate(
                template?.refreshToken,
                { containerClass, propertyName: "refreshToken", example: "null", isNullable: false },
                () => this.sampleTokenDTO()
            ),
        };
    }

    sampleArrayTokensDTO(
        template: Factory<TokensDTO> = {},
        length?: number
    ): Array<TokensDTO> {
        return this.randomArray(
            () => this.sampleTokensDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleUserDTO(template: Factory<UserDTO> = {}): UserDTO {
        const containerClass = "UserDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            username: this.generate(
                template?.username,
                { containerClass, propertyName: "username", isNullable: false },
                () => this.sampleString("", "null")
            ),
            firstName: this.generate(
                template?.firstName,
                { containerClass, propertyName: "firstName", isNullable: false },
                () => this.sampleString("", "null")
            ),
            lastName: this.generate(
                template?.lastName,
                { containerClass, propertyName: "lastName", isNullable: false },
                () => this.sampleString("", "null")
            ),
            email: this.generate(
                template?.email,
                { containerClass, propertyName: "email", isNullable: false },
                () => this.sampleString("", "null")
            ),
            encryptedPassword: this.generate(
                template?.encryptedPassword,
                { containerClass, propertyName: "encryptedPassword", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayUserDTO(
        template: Factory<UserDTO> = {},
        length?: number
    ): Array<UserDTO> {
        return this.randomArray(
            () => this.sampleUserDTO(template),
            length ?? this.arrayLength()
        );
    }
}
