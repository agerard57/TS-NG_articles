import {
	Component,
	OnInit,
	OnDestroy,
	Inject,
	Renderer2,
	Optional,
	ElementRef,
	ViewChild,
} from "@angular/core";
import { DOCUMENT } from "@angular/common";

import { AppInfoService } from "../../shared";
import { AuthService } from "app/services/auth.service";

export function isHtmlLinkElement(
	element: Element,
): element is HTMLLinkElement {
	return element.tagName.toLowerCase() === "a";
}

interface LinkItem {
	title: string;
	path: string[];
	activeOptions?: { exact: boolean };
}

@Component({
	selector: "app-nav",
	templateUrl: "./nav.component.html",
	styleUrls: ["./nav.component.scss"],
})
export class NavComponent implements OnInit, OnDestroy {
	links: LinkItem[] = [
		{ path: ["/article/add"], title: "Add articles" },
		{ path: ["/article/list"], title: "Articles" },
		{ path: ["/user/list"], title: "User list" },
	];

	appTitle = this.appInfo.title;
	appVersion = this.appInfo.version;
	appEnv = this.appInfo.environment;
	isDebug = this.appInfo.isDebug;

	isMenuOpened = false;
	@ViewChild("menu", { static: true }) menuElementRef: ElementRef | undefined;

	private domClickListener$$!: () => void;
	id = this.auth.currentUser.id;

	constructor(
		@Optional()
		@Inject(DOCUMENT)
		private document: any,
		private appInfo: AppInfoService,
		public auth: AuthService,
		private renderer: Renderer2,
	) {}

	ngOnInit(): void {
		this.domClickListener$$ = this.renderer.listen(
			this.document,
			"click",
			this.onBodyClick.bind(this),
		);
	}

	ngOnDestroy(): void {
		this.domClickListener$$();
	}

	onBodyClick(event: Event): void {
		if (!this.menuElementRef || !this.isMenuOpened) {
			return;
		}

		if (
			event.target === this.menuElementRef.nativeElement ||
			this.menuElementRef.nativeElement.contains(event.target as Node)
		) {
			const target = event.target as Element;
			if (!isHtmlLinkElement(target)) {
				return;
			}
		}
		this.isMenuOpened = false;
	}
}
