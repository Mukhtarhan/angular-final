import { Component, DestroyRef, inject, OnInit } from "@angular/core";
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from "@angular/router";
import { catchError, switchMap } from "rxjs/operators";
import { combineLatest, of, throwError } from "rxjs";
import { UserService } from "../../../../core/auth/services/user.service";
import { Profile } from "../../models/profile.model";
import { ProfileService } from "../../services/profile.service";
import { AsyncPipe, NgIf } from "@angular/common";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { FollowButtonComponent } from "../../components/follow-button.component";
import { mockUser } from "../../components/mock-user";

@Component({
  selector: "app-profile-page",
  templateUrl: "./profile.component.html",
  imports: [
    FollowButtonComponent,
    NgIf,
    RouterLink,
    AsyncPipe,
    RouterLinkActive,
    RouterOutlet,
    FollowButtonComponent,
  ],
  standalone: true,
})
export class ProfileComponent implements OnInit {
  profile: Profile = mockUser;
  isUser: boolean = false;
  destroyRef = inject(DestroyRef);
  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly profileService: ProfileService,
  ) {}

  ngOnInit() {
    // You need to modify this for Task 3
    this.profileService
      .get(this.route.snapshot.params["username"])
      .pipe(
        // catchError((error) => {
        //   void this.router.navigate(["/"]);
        //   return throwError(() => error);
        // }),
        switchMap((profile) => {
          return combineLatest([of(profile), this.userService.currentUser]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([profile, user]) => {
        this.profile = profile;
        this.isUser = profile.username === user?.username;
      });
  }

  onToggleFollowing(profile: Profile) {
    this.profile = profile;
  }
}

// Angular Final Exam, Fall 2024

// 3 tasks, each task 33% of 20 points. ~6.6

// Important: There a lot of stuff going on in this project, but my tasks will only require you to modify things you actually know.

// 1. HttpClient requests for Articles are not working to due to issue with server. Replace article requests with observables, return mock data so that project will show an actual data.

// 2. Modify Auth component so that I can login using mock data. Remove API calls and edit "login" method of User.service so that it will setUser regardless.

// 3. I removed all guards related to "/profile/:username" route. Edit the code so that accessing URL "_yourprojecturl_/profile/smth" will show mock data.

// Explanation:
// 3.1 Create new TS file with 1 variable: mockUser, make it Profile type.
// 3.2 Import this variable into Profile component, check if URL is "profile/smth"
// 3.3 If true, show your mock data, if false, show "Wrong user" text.
