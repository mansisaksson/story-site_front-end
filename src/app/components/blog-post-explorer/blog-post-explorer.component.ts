import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { BlogPostService, AlertService, UserService, UIService } from '../../_services/index'
import { BlogPostMetaData, User } from '../../_models/index'
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-blog-post-explorer',
  templateUrl: './blog-post-explorer.component.html',
  styleUrls: ['./blog-post-explorer.component.css']
})
export class BlogPostExplorerComponent implements OnInit {
  BlogPostMetaData: BlogPostMetaData[] = []
  authors: { [key: string]: User } = {}
  userId: string = ""

  constructor(
    private BlogPostService: BlogPostService,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private uiService: UIService,
    private userService: UserService) {
  }

  hasInit = false
  ngOnInit() {
    this.uiService.setBannerURI(undefined)

    this.activatedRoute.params.subscribe(params => {
      this.userId = params['user_id']
      if (this.userId) {
        this.userService.getUser(this.userId).then(user => {
          this.uiService.setBannerURI(user.bannerURI)
          this.userService.setCurrentlyViewedUser(user)
        }).catch(e => { })
      }
    })

    this.hasInit = true
    this.refreshBlogList()
  }

  refreshBlogList() {
    if (this.hasInit) {
      this.BlogPostService.getBlogPosts(this.userId).then((data: BlogPostMetaData[]) => {
        this.BlogPostMetaData = data

        // Find author information
        this.authors = {}
        let authorIds = this.BlogPostMetaData.map(blogPost => blogPost.authorId)
        authorIds.forEach(id => this.authors[id] = <User>{ username: "..." })
        this.userService.getUsers(authorIds).then(users => {
          users.forEach(user => this.authors[user.id] = user)
        }).catch(e => this.alertService.error(e))
      }).catch(e => this.alertService.error(e))
    }
  }

  timeSince(date: number) {
    let seconds = Math.floor(Date.now() / 1000 - date / 1000)
    let interval = Math.floor(seconds / 31536000)

    if (interval > 1) {
      return interval + " years"
    }
    interval = Math.floor(seconds / 2592000)
    if (interval > 1) {
      return interval + " months"
    }
    interval = Math.floor(seconds / 86400)
    if (interval > 1) {
      return interval + " days"
    }
    interval = Math.floor(seconds / 3600)
    if (interval > 1) {
      return interval + " hours"
    }
    interval = Math.floor(seconds / 60)
    if (interval > 1) {
      return interval + " minutes"
    }
    return Math.floor(seconds) + " seconds"
  }

  formatedTime(date: number) {
    function formatDate(date) {
      var monthNames = [
        "Jan", "Feb", "Mar",
        "Apr", "May", "Jun", "Jul",
        "Aug", "Sep", "Oct",
        "Nov", "Dec"
      ];

      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();

      return day + ' ' + monthNames[monthIndex] + ' ' + year;
    }

    return formatDate(new Date(date))
  }

  getAuthorName(author: User) {
    return author.displayName ? author.displayName : author.username
  }

  getAccessibilityColor(accessibility: string): string {
    switch (accessibility) {
      case 'public':
        return 'white'

      default: /*'private'*/
        return '#cca310'
    }
  }

  getThumbnailURL(thumbnailURI): string {
    if (thumbnailURI && thumbnailURI.length > 0) {
      return environment.backendAddr + '/api/file/content/' + thumbnailURI
    } else {
      return "assets/default_thumbnail.png"
    }
  }

  getBlogURL(blogPost: BlogPostMetaData): string {
    if (blogPost.friendlyId != undefined && blogPost.friendlyId != "") {
      return blogPost.friendlyId
    }
    return blogPost.storyId
  }

}
