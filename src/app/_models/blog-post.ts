export interface ChapterMetaData {
    chapterId: string
    storyId: string // TODO: Rename to blogPostId
    URI: string
    title: string
}

export class ChapterContent {
    URI: string
    content: string
}

export interface BlogPostMetaData {
    storyId: string // TODO: Rename to blogPostId, or just id
    authorId: string
    title: string
    description: string
    accessibility: string
    upvotes: number
    downvotes: number
    thumbnailURI: string
    submittedAt: number
    lastUpdated: number
    revision: number
    chapters: ChapterMetaData[]
}