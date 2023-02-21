/** Inspired by https://github.com/ericclemmons/click-to-component */

export {};
const style = document.createElement("style");
style.setAttribute("type", "text/css");
style.setAttribute("data-vite-dev-id", "react-click-to-component");
style.innerHTML = `[data-click-to-component-target] {
  outline: auto 1px !important;
}
#click-to-component-menu {
  position: fixed !important;
  z-index: 1000 !important;
  margin-top: 8px !important;
  margin-bottom: 8px !important;
  background: #222 !important;
  color: white !important;
  padding: 8px !important;
  border-radius: 6px !important;
  font-size: 14px !important;
  line-height: 1.5 !important;
  display: flex !important;
  gap: 2px !important;
  overflow: auto !important;
}
.click-to-component-menu-item {
  padding: 4px !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  display: flex !important;
  justify-content: space-between !important;
  gap: 8px !important;
}
.click-to-component-menu-item:hover {
  background: #333 !important;
}
`;
document.head.appendChild(style);

const root = "__ROOT__";
let currentTarget: HTMLElement | undefined;
let hasMenu = false;
const menuElement = document.createElement("div");
menuElement.setAttribute("id", "click-to-component-menu");

window.addEventListener("keyup", (event) => {
  if (!event.altKey && (hasMenu || currentTarget)) cleanUp();
});

window.addEventListener("mousemove", (event) => {
  if (!event.altKey) {
    cleanUp();
    return;
  }
  if (hasMenu) return;
  if (!(event.target instanceof HTMLElement)) {
    clearOverlay();
    return;
  }
  if (event.target === currentTarget) return;
  clearOverlay();
  currentTarget = event.target;
  event.target.dataset.clickToComponentTarget = "true";
});

window.addEventListener("contextmenu", (event) => {
  if (!event.altKey) return;
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  event.preventDefault();
  const layers = getLayersForElement(target);
  if (layers.length === 0) return;
  const rect = target.getBoundingClientRect();
  if (rect.bottom < window.innerHeight / 2) {
    menuElement.style.top = `${rect.bottom}px`;
    menuElement.style.bottom = "";
    menuElement.style.maxHeight = `${window.innerHeight - rect.bottom - 16}px`;
  } else if (rect.top > window.innerHeight / 2) {
    menuElement.style.bottom = `${window.innerHeight - rect.top}px`;
    menuElement.style.top = "";
    menuElement.style.maxHeight = `${rect.top - 16}px`;
  } else {
    menuElement.style.bottom = `${window.innerHeight - rect.bottom}px`;
    menuElement.style.top = "";
    menuElement.style.maxHeight = `${rect.bottom - 16}px`;
  }
  if (rect.left < window.innerWidth / 2) {
    menuElement.style.left = `${rect.left}px`;
    menuElement.style.right = "";
  } else {
    menuElement.style.right = `${window.innerWidth - rect.right}px`;
    menuElement.style.left = "";
  }
  while (menuElement.firstChild) {
    menuElement.removeChild(menuElement.firstChild);
  }
  menuElement.style.flexDirection = menuElement.style.top
    ? "column"
    : "column-reverse";
  for (const layer of layers) {
    const item = document.createElement("div");
    item.className = "click-to-component-menu-item";
    const spanL = document.createElement("span");
    spanL.textContent = `<${layer.name} />`;
    item.appendChild(spanL);
    const spanR = document.createElement("span");
    spanR.textContent = layer.path.replace(`${root}/`, "");
    item.appendChild(spanR);
    item.addEventListener("click", () => {
      fetch(`/__open-in-editor?file=${encodeURIComponent(layer.path)}`);
      cleanUp();
    });
    menuElement.appendChild(item);
  }
  if (!hasMenu) {
    document.body.appendChild(menuElement);
    hasMenu = true;
  }
});

const cleanUp = () => {
  clearOverlay();
  removeMenu();
};

const clearOverlay = () => {
  if (!currentTarget) return;
  const current = document.querySelector<HTMLElement>(
    "[data-click-to-component-target]",
  );
  if (current) delete current.dataset.clickToComponentTarget;
  currentTarget = undefined;
};

const removeMenu = () => {
  if (!hasMenu) return;
  document.body.removeChild(menuElement);
  hasMenu = false;
};

const getLayersForElement = (element: Element) => {
  let instance = getReactInstanceForElement(element);

  const layers: { name: string; path: string }[] = [];
  while (instance) {
    const path = getPath(instance);
    if (path) {
      const name =
        typeof instance.type === "string"
          ? instance.type
          : instance.type.displayName ?? instance.type.name;
      layers.push({ name, path });
    }
    instance = instance._debugOwner;
  }

  return layers;
};

const getPath = (fiber: Fiber) => {
  if (!fiber._debugSource) {
    console.debug("Couldn't find a React instance for the element", fiber);
    return;
  }
  const { columnNumber = 1, fileName, lineNumber = 1 } = fiber._debugSource;
  return `${fileName}:${lineNumber}:${columnNumber}`;
};

type Fiber = {
  _debugSource?: {
    columnNumber?: number;
    fileName: string;
    lineNumber?: number;
  };
  _debugOwner?: Fiber;
  type: string | { displayName?: string; name: string };
};

const getReactInstanceForElement = (element: Element): Fiber | undefined => {
  // Prefer React DevTools, which has direct access to `react-dom` for mapping `element` <=> Fiber
  if ("__REACT_DEVTOOLS_GLOBAL_HOOK__" in window) {
    const { renderers } = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;

    for (const renderer of renderers.values()) {
      try {
        const fiber = renderer.findFiberByHostInstance(element);
        if (fiber) return fiber;
      } catch {
        // If React is mid-render, references to previous nodes may disappear during the click events
        // (This is especially true for interactive elements, like menus)
      }
    }
  }

  if ("_reactRootContainer" in element) {
    return (element as any)._reactRootContainer._internalRoot.current.child;
  }

  for (const key in element) {
    if (key.startsWith("__reactFiber")) return (element as any)[key];
  }
};
