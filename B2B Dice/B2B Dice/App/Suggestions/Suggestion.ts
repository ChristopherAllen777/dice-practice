export interface ISuggestion {
    Title: string,
    Description: string,
    CreatedBy: string,
    CreatedDate: string,
    Upvotes: number,
    Downvotes: number,
    ApprovalRate: number,
    Voters: string[],
    Comments: {
        Text: string,
        Date: string,
        CommentedBy: string
    }[]
}