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

  return {
    activeElement,
    setActiveElement,
    clearActiveElement,
  };
}
