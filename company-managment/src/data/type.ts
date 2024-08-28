export type Employee = {
    id?: string,
    lastName: string,
    firstName: string,
    email: string,
    phoneNumber: string,
    level: Level,
    jobPosition: JobPosition,
    salary: number,
    isBusy: boolean,
    ordersid?: string[] | null
}

export type Order = {
    id?: string,
    web: Web,
    pages: number,
    style: WebStyle,
    service: boolean,
    deadline: Date,
    notice: string,
    status: WebStatus,
    price: number
    employeeid?: string[] | null
    Employees?: Employee[] | null
}

export type CustomerUser = {
    uid: string,
    email: string,
    role: UserRole,
    ordersid?: Order[];
}

export enum UserRole {
    USER = 'user',
    ADMIN = 'admin'
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
    Completed

}