import { hijackAddEventListener } from "./addEventListener";
import { hijackIntersectionObserver } from "./intersectionObserver";
import { hijackSetInterval } from "./setInterval";

const hijacks = [
  hijackAddEventListener,
  hijackIntersectionObserver,
  hijackSetInterval,
];

export default hijacks;
