/*eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["bar"] }]*/
/* eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["container"] }] */

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

  return {
    activeElement,
    setActiveElement,
    clearActiveElement,
    scrollIntoView,
  };
}
