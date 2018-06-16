import { Component, OnInit, } from '@angular/core';
import { StoryEditorComponent } from './../story-editor.component'
import { StoryEditorService } from './../../../_services'
import { StoryDocument, StoryMetaData } from '../../../_models';

interface NavTitle {
  fontSize: number,
  padding: number
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
  private storyDocs: { [key: string]: StoryDocument } = {}
  private titleElements: Element[] = []

  constructor(private storyEditor: StoryEditorService) {

  }

  ngOnInit() {
    this.storyEditor.getStory().subscribe((story) => {
      if (story) {
        this.story = story
        story.storyURIs.forEach((uri) => {
          this.storyEditor.getStoryDocument(uri).subscribe((document) => {
            this.parseDocument(document)
          })
        })
      }
    })
  }

  parseDocument(document: StoryDocument) {
    let parser = new DOMParser()
    let htmlDoc = parser.parseFromString(document.content, "text/html")
    let elements = htmlDoc.querySelectorAll('h1, h2, h3')
    this.titleElements = []
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index]
      if (this.navTitles[element.tagName.toLowerCase()]) {
        this.titleElements.push(element)
      }
    }
  }
}
