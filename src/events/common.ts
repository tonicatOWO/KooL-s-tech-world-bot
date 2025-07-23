import type { ArgsOf } from "discordx";
import { Discord, On } from "discordx";

@Discord()
export class Events {
  @On()
  threadCreate([thread]: ArgsOf<"threadCreate">): void {
    // console.log("Thread created:", thread.name, "in channel:", thread.parent?.name, "by", thread.ownerId);
    console.log(
      "Thread created:",
      thread.name,
      "in channel:",
      thread.parent?.name,
      "by",
      thread.fetchOwner().then((owner) => owner.user.username)
    );
  }
}
