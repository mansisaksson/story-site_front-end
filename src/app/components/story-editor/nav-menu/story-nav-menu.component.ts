import { Component, OnInit, } from '@angular/core';
import { StoryEditorComponent } from './../story-editor.component'
import { StoryEditorService } from './../../../_services'
import { StoryChapter, StoryMetaData, ChapterMetaData } from '../../../_models';

interface NavTitle {
  fontSize: number,
  padding: number
}

class DrawableElem {
  public tagName: string
  public content: string
}

@Component({
  selector: 'app-story-nav-menu',
  templateUrl: './story-nav-menu.component.html',
  styleUrls: ['./story-nav-menu.component.css']
})
export class StoryNavMenuComponent implements OnInit {
  private navTitles: { [key: string]: NavTitle } = {
    "h1": { fontSize: 18, padding: 5 },
    "h2": { fontSize: 15, padding: 10 },
    "h3": { fontSize: 12, padding: 15 },
  }

  private story: StoryMetaData = <StoryMetaData>{ title: "..." }
  private titleElements: DrawableElem[] = []

  constructor(private storyEditor: StoryEditorService) {

  }

  ngOnInit() {
    this.storyEditor.getStory().subscribe((story) => {
      this.titleElements = []
      if (story) {
        this.story = story
        this.story.chapters.forEach((chapter: ChapterMetaData) => {
          let elem = <DrawableElem> {
            tagName: 'h2',
            content: chapter.title
          }
          this.titleElements.push(elem)
        })
      }
    })
  }

  parseChapter(chapter: StoryChapter) {
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