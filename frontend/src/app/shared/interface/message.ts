export interface Message {
  content: string;
  level: number;
  duration: number;
  actionFunction: Function;
  messageOptions: MessageOptions;
}
export interface MessageOptions {
  isBoxShadowShown: boolean;
  boxShadowDestroyMessage: boolean;
  [key: string]: boolean;
}
