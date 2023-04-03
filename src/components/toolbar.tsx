import { createContext, PropsWithChildren, useContext } from 'react';
import ReactDOM from 'react-dom';

export type ToolbarContextValue = {
  toolbarNode: HTMLDivElement | null;
} | null;

export const ToolbarContext = createContext<ToolbarContextValue>(null);

export function ToolbarTool(properties: PropsWithChildren<{}>) {
  const { children } = properties;
  const toolbarContext = useContext(ToolbarContext);
  if (!toolbarContext) {
    throw new Error('<ToolbarTool/> component requires ToolbarContext provider.');
  }
  const { toolbarNode } = toolbarContext;
  if (toolbarNode) {
    return ReactDOM.createPortal(children, toolbarNode);
  }
  return null;
}
