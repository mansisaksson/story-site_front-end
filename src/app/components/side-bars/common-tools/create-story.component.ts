import { Component } from '@angular/core'
import { User, StoryMetaData } from './../../../_models'
import { StoryService, AuthenticationService, AlertService, UIService, DynamicForm, FormValues } from './../../../_services'
import { Router } from '@angular/router';

@Component({
  selector: 'app-common-tools',
  template: `
  <div>
    <button (click)="createStory()" class="btn btn-primary">Create New Story</button>
  </div>`
})
export class CreateStoryComponent {

  constructor(
    private router: Router,
    private storyService: StoryService,
    private uiService: UIService,
    private authenticationService: AuthenticationService,
    private alertService: AlertService
  ) { }

  createStory() {
    this.authenticationService.withLoggedInUser().then((user: User) => {
      let form: DynamicForm = new DynamicForm("Create Story", "Create!")
      form.addTextInput("Story Title", "title", "Title Here")
      form.addTextInput("Chapter 1 Title", "chapter_title", "Chapter 1")

      this.uiService.promptForm('', form).then((values: FormValues) => {
        this.storyService.createStory(user.id, values["title"], values["chapter_title"]).then((story: StoryMetaData) => {
          this.router.navigate(['story-editor/'+story.storyId])
        }).catch((error) => {
          this.alertService.error(error)
        })
      }).catch(e => this.alertService.error(e))
    }).catch(e => {
      this.alertService.error(e)
    })
  }

}