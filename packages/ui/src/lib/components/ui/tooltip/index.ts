import { Tooltip as TooltipPrimitive } from "bits-ui";
import Content from "./tooltip-content.svelte";
import Arrow from "./tooltip-arrow.svelte";

const Root = TooltipPrimitive.Root;
const Trigger = TooltipPrimitive.Trigger;
const Provider = TooltipPrimitive.Provider;

export {
  Root,
  Trigger,
  Content,
  Arrow,
  Provider,
  //
  Root as Tooltip,
  Content as TooltipContent,
  Arrow as TooltipArrow,
  Trigger as TooltipTrigger,
  Provider as TooltipProvider,
};
