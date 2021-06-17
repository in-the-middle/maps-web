import {
    CenterInputDTO,
    CenterOutputDTO,
    LocationDTO,
    RouteInputDTO,
    RouteOutputDTO,
    SummaryDTO,
    TravelModeDTO,
    UserInfoDTO,
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
    CenterInputDTO?: ModelFactory<CenterInputDTO>;
    CenterOutputDTO?: ModelFactory<CenterOutputDTO>;
    LocationDTO?: ModelFactory<LocationDTO>;
    RouteInputDTO?: ModelFactory<RouteInputDTO>;
    RouteOutputDTO?: ModelFactory<RouteOutputDTO>;
    SummaryDTO?: ModelFactory<SummaryDTO>;
    TravelModeDTO?: ModelFactory<TravelModeDTO>;
    UserInfoDTO?: ModelFactory<UserInfoDTO>;
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
            case "CenterInputDTO":
                return this.sampleCenterInputDTO();
            case "Array<CenterInputDTO>":
                return this.sampleArrayCenterInputDTO();
            case "CenterOutputDTO":
                return this.sampleCenterOutputDTO();
            case "Array<CenterOutputDTO>":
                return this.sampleArrayCenterOutputDTO();
            case "LocationDTO":
                return this.sampleLocationDTO();
            case "Array<LocationDTO>":
                return this.sampleArrayLocationDTO();
            case "RouteInputDTO":
                return this.sampleRouteInputDTO();
            case "Array<RouteInputDTO>":
                return this.sampleArrayRouteInputDTO();
            case "RouteOutputDTO":
                return this.sampleRouteOutputDTO();
            case "Array<RouteOutputDTO>":
                return this.sampleArrayRouteOutputDTO();
            case "SummaryDTO":
                return this.sampleSummaryDTO();
            case "Array<SummaryDTO>":
                return this.sampleArraySummaryDTO();
            case "TravelModeDTO":
                return this.sampleTravelModeDTO();
            case "Array<TravelModeDTO>":
                return this.sampleArrayTravelModeDTO();
            case "UserInfoDTO":
                return this.sampleUserInfoDTO();
            case "Array<UserInfoDTO>":
                return this.sampleArrayUserInfoDTO();
            default:
                throw new Error("Unknown type " + modelName);
        }
    }

    sampleCenterInputDTO(template: Factory<CenterInputDTO> = {}): CenterInputDTO {
        const containerClass = "CenterInputDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            users: this.generate(
                template?.users,
                { containerClass, propertyName: "users", example: null, isNullable: false },
                () => this.sampleArrayUserInfoDTO()
            ),
        };
    }

    sampleArrayCenterInputDTO(
        template: Factory<CenterInputDTO> = {},
        length?: number
    ): Array<CenterInputDTO> {
        return this.randomArray(
            () => this.sampleCenterInputDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleCenterOutputDTO(template: Factory<CenterOutputDTO> = {}): CenterOutputDTO {
        const containerClass = "CenterOutputDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            location: this.generate(
                template?.location,
                { containerClass, propertyName: "location", example: "null", isNullable: false },
                () => this.sampleLocationDTO()
            ),
        };
    }

    sampleArrayCenterOutputDTO(
        template: Factory<CenterOutputDTO> = {},
        length?: number
    ): Array<CenterOutputDTO> {
        return this.randomArray(
            () => this.sampleCenterOutputDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleLocationDTO(template: Factory<LocationDTO> = {}): LocationDTO {
        const containerClass = "LocationDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
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

    sampleRouteInputDTO(template: Factory<RouteInputDTO> = {}): RouteInputDTO {
        const containerClass = "RouteInputDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            origin: this.generate(
                template?.origin,
                { containerClass, propertyName: "origin", example: "null", isNullable: false },
                () => this.sampleLocationDTO()
            ),
            destination: this.generate(
                template?.destination,
                { containerClass, propertyName: "destination", example: "null", isNullable: false },
                () => this.sampleLocationDTO()
            ),
            mode: this.generate(
                template?.mode,
                { containerClass, propertyName: "mode", example: "null", isNullable: false },
                () => this.sampleTravelModeDTO()
            ),
            includeTolls: this.generate(
                template?.includeTolls,
                { containerClass, propertyName: "includeTolls", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
            includeHighways: this.generate(
                template?.includeHighways,
                { containerClass, propertyName: "includeHighways", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
            includeFerries: this.generate(
                template?.includeFerries,
                { containerClass, propertyName: "includeFerries", example: "null", isNullable: false },
                () => this.sampleboolean()
            ),
        };
    }

    sampleArrayRouteInputDTO(
        template: Factory<RouteInputDTO> = {},
        length?: number
    ): Array<RouteInputDTO> {
        return this.randomArray(
            () => this.sampleRouteInputDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleRouteOutputDTO(template: Factory<RouteOutputDTO> = {}): RouteOutputDTO {
        const containerClass = "RouteOutputDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            units: this.generate(
                template?.units,
                { containerClass, propertyName: "units", isNullable: false },
                () => this.sampleString("", "null")
            ),
            language: this.generate(
                template?.language,
                { containerClass, propertyName: "language", isNullable: false },
                () => this.sampleString("", "null")
            ),
            origin: this.generate(
                template?.origin,
                { containerClass, propertyName: "origin", example: "null", isNullable: false },
                () => this.sampleLocationDTO()
            ),
            destination: this.generate(
                template?.destination,
                { containerClass, propertyName: "destination", example: "null", isNullable: false },
                () => this.sampleLocationDTO()
            ),
            summary: this.generate(
                template?.summary,
                { containerClass, propertyName: "summary", example: "null", isNullable: false },
                () => this.sampleSummaryDTO()
            ),
            shape: this.generate(
                template?.shape,
                { containerClass, propertyName: "shape", isNullable: false },
                () => this.sampleString("", "null")
            ),
        };
    }

    sampleArrayRouteOutputDTO(
        template: Factory<RouteOutputDTO> = {},
        length?: number
    ): Array<RouteOutputDTO> {
        return this.randomArray(
            () => this.sampleRouteOutputDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleSummaryDTO(template: Factory<SummaryDTO> = {}): SummaryDTO {
        const containerClass = "SummaryDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            minLat: this.generate(
                template?.minLat,
                { containerClass, propertyName: "minLat", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            minLon: this.generate(
                template?.minLon,
                { containerClass, propertyName: "minLon", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            maxLat: this.generate(
                template?.maxLat,
                { containerClass, propertyName: "maxLat", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            maxLon: this.generate(
                template?.maxLon,
                { containerClass, propertyName: "maxLon", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            time: this.generate(
                template?.time,
                { containerClass, propertyName: "time", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
            length: this.generate(
                template?.length,
                { containerClass, propertyName: "length", example: "null", isNullable: false },
                () => this.samplenumber()
            ),
        };
    }

    sampleArraySummaryDTO(
        template: Factory<SummaryDTO> = {},
        length?: number
    ): Array<SummaryDTO> {
        return this.randomArray(
            () => this.sampleSummaryDTO(template),
            length ?? this.arrayLength()
        );
    }

    sampleTravelModeDTO(): TravelModeDTO {
        const containerClass = "TravelModeDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return this.pickOne([
            TravelModeDTO.DRIVING,
            TravelModeDTO.WALKING,
            TravelModeDTO.BICYCLING,
            TravelModeDTO.TRANSIT,
        ]);
    }

    sampleArrayTravelModeDTO(length?: number): Array<TravelModeDTO> {
        return this.randomArray(
            () => this.sampleTravelModeDTO(),
            length ?? this.arrayLength()
        );
    }

    sampleUserInfoDTO(template: Factory<UserInfoDTO> = {}): UserInfoDTO {
        const containerClass = "UserInfoDTO";
        if (typeof this.sampleModelProperties[containerClass] === "function") {
            return this.sampleModelProperties[containerClass](this);
        }
        return {
            location: this.generate(
                template?.location,
                { containerClass, propertyName: "location", example: "null", isNullable: false },
                () => this.sampleLocationDTO()
            ),
            mode: this.generate(
                template?.mode,
                { containerClass, propertyName: "mode", example: "null", isNullable: false },
                () => this.sampleTravelModeDTO()
            ),
        };
    }

    sampleArrayUserInfoDTO(
        template: Factory<UserInfoDTO> = {},
        length?: number
    ): Array<UserInfoDTO> {
        return this.randomArray(
            () => this.sampleUserInfoDTO(template),
            length ?? this.arrayLength()
        );
    }
}
