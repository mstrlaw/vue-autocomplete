export function escapeRegExpCharacters(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
}

export function buildSearchRegExp(q) {
  let regString = '';
  const cleanedString = escapeRegExpCharacters(q);
  if (cleanedString.split(' ').length > 1) {
    cleanedString.split(' ').forEach((term) => {
      regString += `(?=.*${term})`;
    });
    regString = `^${regString}.+`;
  } else {
    regString = cleanedString;
  }

  return new RegExp(regString, 'gmi');
}

const buildHighlightRegExp = (q) => {
  let regString = '';
  const cleanedString = escapeRegExpCharacters(q);
  if (cleanedString.split(' ').length > 0) {
    regString = [];
    cleanedString.split(' ').forEach((term) => {
      if (term.trim().length > 0) {
        regString.push(`(${term})`);
      }
    });
    regString = regString.join('|');
  } else {
    regString = `(${cleanedString})`;
  }

  return new RegExp(regString, 'gmi');
};

const extractMatchIndexes = (partialMatches, originalString) => {
  let processedString = originalString;
  const indexes = [];
  /* Save position of each match */
  partialMatches.forEach((str) => {
    if (str.trim().length > 0) {
      const matchRegExp = new RegExp(str, 'gim');
      const partialMatch = matchRegExp.exec(processedString);

      if (partialMatch !== null) {
        const { index } = partialMatch;
        indexes.push({
          str,
          position: index,
          length: str.length,
        });
        const placeholder = Array(str.length + 1).join('■');
        processedString = `${processedString.slice(0, index)}${placeholder}${processedString.substr(index + str.length)}`;
      }
    }
  });

  return indexes;
};

export function highlightMatches(query, originalString, highlightClass) {
  let highlightedString = originalString;

  const regExp = buildHighlightRegExp(query);
  const partialMatches = highlightedString.match(regExp);

  if (partialMatches !== null) {
    let indexes = extractMatchIndexes(partialMatches, originalString);

    if (indexes.length > 0) {
      // Reorder matched indexes descendingly otherwise
      // slicing highlightedString will rebuild at wrong positions
      indexes = indexes.sort((a, b) => b.position - a.position);

      indexes.forEach((index) => {
        highlightedString = `${highlightedString.slice(0, index.position)}<mark class="${highlightClass}">${index.str}</mark>${highlightedString.substr(index.position + index.length)}`;
      });
    }
  }

  return highlightedString;
}
