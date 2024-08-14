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

