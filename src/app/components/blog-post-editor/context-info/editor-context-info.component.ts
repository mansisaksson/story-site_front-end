import { Component, OnInit, } from '@angular/core';
import { BlogPostEditorService, AlertService } from '../../../_services'
import { ChapterContent, BlogPostMetaData, ChapterMetaData } from '../../../_models';

interface NavTitle {
  fontSize: number,
  padding: number
}

class DrawableElem {
  public tagName: string
  public content: string
  public payload: any
}

@Component({
  selector: 'app-editor-context-info',
  templateUrl: './editor-context-info.component.html',
  styleUrls: ['./editor-context-info.component.css']
})
export class EditorContextInfoComponent implements OnInit {
  private navTitles: { [key: string]: NavTitle } = {
    "h1": { fontSize: 12, padding: 10 },
    "h2": { fontSize: 10, padding: 15 },
    "h3": { fontSize: 8, padding: 20 },
  }

  public blogPost: BlogPostMetaData = <BlogPostMetaData>{ title: "..." }
  public titleElements: DrawableElem[] = []

  constructor(
    private blogEditor: BlogPostEditorService,
    private alertService: AlertService
    ) {

  }

  ngOnInit() {
    this.blogEditor.getCurrentBlog().subscribe((blogPost) => {
      this.titleElements = []
      if (blogPost) {
        this.blogPost = blogPost
        this.blogPost.chapters.forEach((chapter: ChapterMetaData) => {
          let elem = <DrawableElem>{
            tagName: 'h2',
            content: chapter.title,
            payload: chapter.chapterId
          }
          this.titleElements.push(elem)
        })
      } else {
        blogPost = <BlogPostMetaData>{ title: "..." }
      }
    })
  }

  editChapter(chapterId: string) {
    this.blogEditor.editChapter(chapterId)
  }

  reorderChapter(chapterId: string, moveUp: boolean) {
    let index = this.titleElements.findIndex(te => te.payload == chapterId)
    if (index != -1) {
      let newIndex = moveUp ? index -1 : index + 1
      if (newIndex < this.titleElements.length) {
        this.blogEditor.swapChapterOrder(chapterId, this.titleElements[newIndex].payload).then(() => {
          this.alertService.success("Chapters rearranged!")
        }).catch(e => { this.alertService.error(e) })
      }
    }
  }

  parseChapter(chapter: ChapterContent) {
    // let parser = new DOMParser()
    // let htmlDoc = parser.parseFromString(chapter.content, "text/html")
    // let elements = htmlDoc.querySelectorAll('h1, h2, h3')
    // this.titleElements = []
    // for (let index = 0; index < elements.length; index++) {
    //   const element = elements[index]
    //   if (this.navTitles[element.tagName.toLowerCase()]) {
    //     this.titleElements.push(element)
    //   }
    // }
  }
}