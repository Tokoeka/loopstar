import { $path, set } from "libram";
import { PathInfo } from "../pathinfo";
import { findAndMerge, Task } from "../../engine/task";
import { Engine } from "../../engine/engine";
import { myPath, runChoice, visitUrl } from "kolmafia";
import { NADeltas, NAQuest } from "./tasks";
import { NAPullQuest, NAPulls } from "./pulls";
import { NAEngine } from "./engine";
import { getTasks, step } from "grimoire-kolmafia";
import { buildPullRequirements, Requirement } from "../../sim";

export class SmolInfo implements PathInfo {
  name(): string {
    return "Shrunken Adventurer";
  }

  active(): boolean {
    return myPath() === $path`A Shrunken Adventurer am I`;
  }

  finished(): boolean {
    return step("questL13Final") > 11;
  }

  getTasks(tasks: Task[]): Task[] {
    const newTasks = getTasks([NAQuest, NAPullQuest], false, false);
    return findAndMerge([...newTasks, ...tasks], NADeltas);
  }

  getRoute(route: string[]): string[] {
    return route;
  }

  getEngine(tasks: Task[]): Engine {
    return new NAEngine(tasks);
  }

  runIntro() {
    // Clear intro adventure
    set("choiceAdventure1507", 1);
    if (visitUrl("main.php").includes("dense, trackless jungle")) runChoice(-1);
  }

  getRequirements(reqs: Requirement[]): Requirement[] {
    return [
      ...reqs,
      ...buildPullRequirements(NAPulls),
    ];
  }
}
