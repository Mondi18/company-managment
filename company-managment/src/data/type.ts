export type Employee = {
    lastName: string,
    firstName: string,
    email: string,
    phoneNumber: string,
    level: Level,
    jobPosition: JobPosition,
    salary: number,
    isBusy: boolean,
}
export enum Level {
    Junior,
    Medior,
    Senior
}
export enum JobPosition {
    SystemAdministrator,
    Frontend,
    Backend,
    FullStack,
    DevOps,
    TeamLeader
}

export enum Web {
    Blog,
    Webshop,
    Portfolio,
    SpecificApplication
}

export enum WebStyle {
    Modern,
    MobileFirst,
    Traditional,
    Minimalist
}

export enum WebStatus {
    Processing,
    InProgress,
    Competed
}
export type Order = {
    goal: Web,
    pages: number,
    style: WebStyle,
    service: boolean,
    deadline: Date,
    notice: string[],
    status: WebStatus,
    price: number
}