import {
  computed,
} from '@vue/composition-api';
import {
  buildSearchRegExp,
} from '@/utilities/regexes';

export default function useFilterOptions(query = '', options = []) {
  const searchOptions = (q) => {
    const regexp = buildSearchRegExp(q);
    const results = options.filter(item => (item.label.match(regexp) !== null && !item.disabled));

    return results;
  };

  const filteredOptions = computed(() => {
    const q = query.value.trim();
    if (q.length > 0) {
      return searchOptions(q, options);
    }
    return options;
  });

  return {
    filteredOptions,
  };
}
