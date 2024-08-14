export type Employee = {
    id: number,
    lastName: string,
    firstName: string,
    email: string
    level: Level;
    jobPosition: JobPosition;
    salary: number

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