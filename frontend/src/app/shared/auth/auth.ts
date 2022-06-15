export interface AuthPublisher {
  subscribers: AuthSubscriber[];
  logInNotify(): void;
  logOutNotify(): void;
}
export interface AuthSubscriber {
  logInUpdate(): void;
  logOutUpdate(): void;
}
