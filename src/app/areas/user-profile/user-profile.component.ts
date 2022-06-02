import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { UserService } from "app/services/user.service";
import { Article } from "app/shared/models/article.model";
import { Comment } from "app/shared/models/comment.model";
import { User } from "app/shared/models/user.model";
import { ToastComponent } from "app/shared/toast/toast.component";

@Component({
	selector: "app-user-profile",
	templateUrl: "./user-profile.component.html",
	styleUrls: ["./user-profile.component.scss"],
})
export class UserProfileComponent implements OnInit {
	user = new User();
	article = new Article();
	articles: Article[] = []
	comment = new Comment();
	comments: Comment[] = [];
	id="1"

	constructor(
		private route: ActivatedRoute,
		private userService: UserService,

		public toast: ToastComponent,
	) {}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.id = params["id"];
			this.getUserInfo(params["id"]);
			this.getLastArticles(params["id"]);
			this.getLastComments(params["id"]); //Use var
		});
	}

	isCurrentUser():boolean{
		const userID= localStorage.get("id")

		return this.user === userID;
	}

	getUserInfo(id: number): void {
		this.userService.getUser(id).subscribe({
			next: (article: Article) => (console.log(article)),
			error: (_error: any) =>
				this.toast.setMessage("Error fetching users", "danger"),
		});
	}

	getLastArticles(id:number): void {
		this.userService.getArticlesByUser(id).subscribe({
			next: (articles: Article[]) => (this.articles = articles.slice(Math.max(articles.length - 3,0))),
			error: (_error: any) =>
				this.toast.setMessage("Error fetching users", "danger"),
		});
	}

	getLastComments(id:number): void {
		this.userService.getCommentsByUser(id).subscribe({
			next: (comments: Comment[]) => (this.comments = comments.slice(Math.max(comments.length - 3,0))),
			error: (_error: any) =>
				this.toast.setMessage("Error fetching users", "danger"),
		});
	}

	onImgError(event: { target: { src: string } }) {
		event.target.src =
			"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";
	}
}
