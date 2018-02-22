export interface ITrackingInfo {
    TrackingNumber: string,
    ExpectedDeliveryDate: Date,
    ProgressSteps: [{
        Date: Date,
        Location: string,
        Status: string
    }]
}