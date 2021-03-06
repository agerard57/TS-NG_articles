import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AuthService } from "app/services/auth.service";
import { FindUsernameById } from "app/services/find-username-by-id.service";
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
	editMode: boolean = false;
	user = new User();
	article = new Article();
	articles: Article[] = [];
	comment = new Comment();
	comments: Comment[] = [];
	id = 1;

	constructor(
		private route: ActivatedRoute,
		private auth: AuthService,
		private findByIdService: FindUsernameById,
		private userService: UserService,
		public toast: ToastComponent,
	) {}

	ngOnInit(): void {
		this.route.params.subscribe((params) => {
			this.id = params["id"];
			this.getUserInfo(this.id);
			this.getLastArticles(this.id);
			this.getLastComments(this.id);
		});
	}

	isCurrentUser(): boolean {
		const token = localStorage.getItem("token");
		if (token) {
			return this.id == this.auth.decodeIdFromToken(token);
		}
		return false;
	}

	getUserInfo(id: number): void {
		this.userService.getUser(id).subscribe({
			next: (user: User) => (this.user = user),
			error: (_error: any) =>
				this.toast.setMessage("Error fetching users", "danger"),
		});
	}

	getLastArticles(id: number): void {
		this.userService.getArticlesByUser(id).subscribe({
			next: (articles: Article[]) =>
				(this.articles = articles.slice(
					Math.max(articles.length - 3, 0),
				)),
			error: (_error: any) =>
				this.toast.setMessage("Error fetching articles", "danger"),
		});
	}

	getLastComments(id: number): void {
		this.userService.getCommentsByUser(id).subscribe({
			next: (comments: Comment[]) =>
				(this.comments = comments.slice(
					Math.max(comments.length - 3, 0),
				)),
			error: (_error: any) =>
				this.toast.setMessage("Error fetching comments", "danger"),
		});
	}

	findUsername(id: number): string | undefined {
		return this.findByIdService.getUsername(id);
	}

	onImgError(event: { target: { src: string } }) {
		event.target.src =
			"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460__340.png";
	}

	editModeToggle(): void {
		this.editMode = !this.editMode;
	}

	deleteProfile(): void {
		const deletePrompt = prompt(
			"Delete profile?\nPlease enter your username to continue...",
		);
		if (deletePrompt === this.user.pseudo) {
			alert("Good Bye !");
			this.userService.deleteUser(this.id).subscribe({
				next: (_res) => {
					this.toast.setMessage(
						"You successfully deleted your account!",
						"success",
					);
					this.auth.logout;
				},
				error: (_error) =>
					this.toast.setMessage(
						"Please delete all your comments and articles beforehand",
						"danger",
					),
			});
		}
	}
}
