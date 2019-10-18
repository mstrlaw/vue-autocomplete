/*
  eslint no-param-reassign: ["error", {
    "props": true,
    "ignorePropertyModificationsFor": ["container"]
  }]
*/

import {
  ref,
} from '@vue/composition-api';

export default function useDomHandler() {
  const activeElement = ref(null);

  const setActiveElement = (element) => {
    activeElement.value = element;
  };

  const clearActiveElement = () => {
    activeElement.value = null;
  };

  const scrollIntoView = (container, target) => {
    const intialScroll = container.scrollTop;
    const {
      top: containerTop,
      bottom: containerBottom,
    } = container.getBoundingClientRect();

    const {
      top: targetTop,
      bottom: targetBottom,
    } = target.getBoundingClientRect();

    const itemHeight = targetBottom - targetTop;
    const positionDiff = targetBottom - containerBottom;

    if (targetBottom > containerBottom) {
      container.scrollTop = intialScroll + positionDiff + itemHeight;
    }

    if (targetTop < containerTop) {
      container.scrollTop = intialScroll + positionDiff;
    }
  };

  const positionElement = (maxHeight, element) => {
    /**
     * Max-height
     * Menu element
     */
    const marginOffset = 15;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const maxWidth = Math.floor(windowWidth / 2) - marginOffset;

    let styles = {
      height: 'auto',
      'max-height': `${maxHeight}px`,
      'max-width': `${maxWidth}px`,
      overflow: 'auto',
    };

    if (element) {
      const {
        right,
        left,
        bottom,
      } = element.getBoundingClientRect();

      //  Horizontal alignment
      if (right > windowWidth) {
        const w = windowWidth - left - marginOffset;

        styles = {
          ...styles,
          width: `${w}px`,
        };
      }

      //  Vertical alignment
      // if (bottom > windowHeight && inputIsFocused.value) {
      if (bottom > windowHeight) {
        styles = {
          ...styles,
          bottom: '34px',
        };
      } else {
        styles = {
          ...styles,
          top: '34px',
        };
      }
    }

    return styles;
  };

  return {
    activeElement,
    setActiveElement,
    clearActiveElement,
    scrollIntoView,
    positionElement,
  };
}
