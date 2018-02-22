export interface IPurchaseOrder {
    PONumber: string,
    ThreadID: number,
    ProfileID: string,
    lstOfSteps: { Name: string, POStatus: number }[]
}