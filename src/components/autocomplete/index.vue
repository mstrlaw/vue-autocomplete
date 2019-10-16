<template>
  <div
    ref="autocompleteContainer"
    class="c-Autocomplete"
    :class="autocompleteClassObject"
  >
    <label
      v-if="showLabel"
      :for="id"
      class="c-Autocomplete__label"
      v-text="label"
    />
    <div class="c-Autocomplete__wrapper">
      <input
        ref="input"
        :id="id"
        :name="inputName"
        :placeholder="placeholder"
        :disabled="disabled"
        v-model="query"
        class="c-Autocomplete__input"
        autocomplete="off"
        @input="focusInput"
        @focus="focusInput"
        @blur="blurInput"
        @keydown.up.down.enter="handleKeyboardNavigation"
      >
      <transition name="slide">
        <div
          v-if="isMenuVisible"
          ref="menu"
          class="c-Autocomplete__selectMenu"
          :style="menuPositioning"
        >
          <span
            v-for="(option, index) in filteredOptions"
            :key="index"
            :value="option.value"
            :name="optionsName"
            :disabled="option.disabled"
            v-html="renderedOptionLabel(option)"
            class="c-Autocomplete__option"
            :class="optionClassObject(option)"
            @click.prevent="setSelectedOption(option)"
          />
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import {
  ref,
  reactive,
  toRefs,
  computed,
  watch,
  onMounted,
} from '@vue/composition-api';
import {
  highlightMatches,
} from './regexUtils';
import useFilterOptions from '@/components/autocomplete/useFilterOptions';
import useDomHandler from '@/components/autocomplete/useDomHandler';
import { longStackSupport } from 'q';
/*
  Component should:
  - Accept options as a prop
  - Display the options list on focus (optional)
  - Filter options as user types
  - Display a "no results" message if no match
  - Display a caret icon in the input (optionally hide)
  - Highlight the part of sring that natch what user typed
  - Allow for tab navigation of options
  - Allow for arrow navigation of options
*/

export default {
  name: 'Autocomplete',
  props: {
    id: {
      type: String,
      required: true,
      default: 'autocompleteInput',
    },
    selected: {
      type: Object,
      required: false,
      default: () => {},
    },
    inputName: {
      type: String,
      required: false,
      default: 'textInput',
    },
    optionsName: {
      type: String,
      required: false,
      default: 'optionItem',
    },
    options: {
      type: Array,
      required: true,
      default: () => [],
      validator(option) {
        return Object.prototype.hasOwnProperty.call(option[0], 'value') && Object.prototype.hasOwnProperty.call(option[0], 'label');
      },
    },
    label: {
      type: String,
      required: false,
      default: '',
    },
    placeholder: {
      type: String,
      required: false,
      default: () => undefined,
    },
    required: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    disabled: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    showLabel: {
      type: Boolean,
      required: false,
      default: true,
    },
    showBorder: {
      type: Boolean,
      required: false,
      default: true,
    },
    showMenuOnFocus: {
      type: Boolean,
      required: false,
      default: true,
    },
    highlightMatches: {
      type: Boolean,
      required: false,
      default: true,
    },
    maxMenuHeight: {
      type: Number,
      required: false,
      default: 250,
    },
    state: {
      type: String,
      required: false,
      default: () => 'neutral',
      validator(kind) {
        return [
          '',
          'neutral',
          'positive',
          'negative',
        ].includes(kind);
      },
    },
    feedback: {
      type: String,
      required: false,
      default: () => null,
    },
  },
  setup(props, {
    emit,
  }) {
    const refs = reactive({
      autocompleteContainer: null,
      menu: null,
      input: null,
    });

    const inputIsFocused = ref(false);
    const query = ref('');
    const selectedOption = ref(props.selected);
    const focusedOptionIndex = ref(0);

    const {
      activeElement,
      setActiveElement,
      clearActiveElement,
    } = useDomHandler();

    const setSelectedOption = (option) => {
      if (!option.disabled) {
        selectedOption.value = option;
        query.value = option.label;
      }
    };

    const clearSelectedOption = () => {
      selectedOption.value = {};
    };

    const {
      filteredOptions,
    } = useFilterOptions(query, props.options);

    onMounted(() => {
      if (props.selected && Object.keys(props.selected).length > 0) {
        setSelectedOption(props.selected);
      }
    });

    const resetOptionIndex = () => {
      focusedOptionIndex.value = 0;
    };

    const focusInput = () => {
      inputIsFocused.value = true;
    };

    const blurInput = () => {
      setTimeout(() => {
        inputIsFocused.value = false;
        if (query.value.trim().length === 0) {
          clearSelectedOption();
        }
      }, 50);
    };

    const isMenuVisible = computed(() => (
      props.showMenuOnFocus
        ? (props.showMenuOnFocus && inputIsFocused.value)
        : query.value.trim().length > 0 && (inputIsFocused.value && !props.showMenuOnFocus)
    ));

    const autocompleteClassObject = computed(() => ({
      [`c-Autocomplete--${props.state}`]: props.state,
      'c-Autocomplete--has-open-menu': isMenuVisible.value,
      'c-Autocomplete--borderless': !props.showBorder,
    }));

    const optionClassObject = option => ({
      'c-Autocomplete__option--is-disabled': option.disabled,
    });

    const menuPositioning = computed(() => {
      const marginOffset = 15;
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const maxWidth = Math.floor(windowWidth / 2) - marginOffset;

      let styles = {
        height: 'auto',
        'max-height': `${props.maxMenuHeight}px`,
        'max-width': `${maxWidth}px`,
        overflow: 'auto',
      };

      if (refs.menu) {
        const {
          right,
          left,
          bottom,
        } = refs.menu.getBoundingClientRect();

        //  Horizontal alignment
        if (right > windowWidth) {
          const w = windowWidth - left - marginOffset;

          styles = {
            ...styles,
            width: `${w}px`,
          };
        }

        //  Vertical alignment
        if (bottom > windowHeight && inputIsFocused.value) {
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
    });

    const renderedOptionLabel = (option) => {
      if (query.value.trim().length > 0 && props.highlightMatches) {
        return highlightMatches(query.value, option.label, 'c-Autocomplete__highlightedChar');
      }
      return option.label;
    };

    watch(focusedOptionIndex, (newIndex) => {
      const option = document.querySelector(`[name="${props.optionsName}"]:not(:disabled):nth-child(${newIndex})`);

      if (option !== null) {
        setActiveElement(option);
        //  Add selected state to option item & scroll to it
        option.classList.add('is-highlighted');
        option.scrollIntoView();

        //  Remove select state from all other option items
        document
          .querySelectorAll(`[name="${props.optionsName}"]:not(:nth-child(${newIndex}))`)
          .forEach((el) => {
            el.classList.remove('is-highlighted');
          });
      } else {
        resetOptionIndex();
      }
    });

    const handleKeyboardNavigation = (e) => {
      e.preventDefault();

      const availableOptionsLength = filteredOptions.value.length;

      switch (e.keyCode) {
        case 13:
          if (activeElement.value !== null) {
            setSelectedOption(filteredOptions
              .value
              .find(option => option.value === parseInt(activeElement.value.getAttribute('value'), 10)));
            setTimeout(() => {
              blurInput();
            }, 60);
          }
          break;

        case 38:
          if (focusedOptionIndex.value - 1 > 0) {
            focusedOptionIndex.value -= 1;
          } else {
            focusedOptionIndex.value = availableOptionsLength;
          }
          break;

        default:
        case 40:
          if (focusedOptionIndex.value + 1 <= availableOptionsLength) {
            focusedOptionIndex.value += 1;
          } else {
            focusedOptionIndex.value = 1;
          }
          break;
      }
    };

    /*
      Event emission
    */
    watch(selectedOption, (value) => {
      if (typeof value !== 'undefined') {
        emit('change', value);
      } else {
        emit('change', {});
      }
    });

    return {
      ...toRefs(refs),
      query,
      focusInput,
      blurInput,
      handleKeyboardNavigation,
      renderedOptionLabel,
      setSelectedOption,
      filteredOptions,
      menuPositioning,
      isMenuVisible,
      autocompleteClassObject,
      optionClassObject,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '~@unbabel/ui/src/_variables';

.c-Autocomplete {
  position: relative;
  display: inline-block;
  vertical-align: $un-form-vertical-align;
  font-size: 1rem;

  &:focus {
    outline: none!important;
  }

  &--negative &__input,
  &--negative &__feedback {
    color: $un-red;
  }
  &--negative &__input {
    border-color: $un-red;
  }

  &--positive &__feedback {
    color: $un-green;
  }
  &--positive &__input {
    border-color: $un-green;
  }

  &--borderless {
    border: $un-form-border-width solid transparent!important;
    border-radius: 0;
  }

  &--has-open-menu &__wrapper {
    &:after{
      transform: rotate(180deg);
      transition: transform .3s ease;
    }
  }

  &__wrapper {
    position: relative;
    &:after {
      content: '';
      display: flex;
      position: absolute;
      top: 1px;
      right: 1px;
      width: 24px;
      height: 32px;
      pointer-events: none;
      background-position: center;
      background-repeat: no-repeat;
      background-image: url('data:image/svg+xml,%3Csvg width="11" height="7" viewBox="0 0 11 7" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M5.166 4.21L8.976.4a.795.795 0 0 1 1.125 1.125l-4.409 4.41a.795.795 0 0 1-1.288-.238L.233 1.527A.795.795 0 0 1 1.358.401L5.166 4.21z" fill="%23343F50" fill-rule="evenodd"/%3E%3C/svg%3E%0A');
      transform: rotate(0deg);
      transition: transform .3s ease;
    }
  }

  &__label {
    display: block;
    margin-bottom: .375rem;
  }

  &__input {
    display: block;
    box-sizing: border-box;
    font-size: 0.875rem;
    width: 100%;
    color: $un-gray4-light;
    border-radius: $un-control-radius;
    border: $un-form-border-width solid $un-gray2-dark;
    padding: .5em 1.5em .5em 1em;
    background-color: $un-white;
    -webkit-appearance: none;
    cursor: pointer;

    // Disabled state
    &[disabled] {
      color: $un-gray1-dark;
      border-color: $un-gray1-dark;
      cursor: not-allowed;
    }
  }

  &__selectMenu {
    position: absolute;
    left: 0;
    display: flex;
    flex-direction: column;
    padding: 0;
    border-radius: 4px;
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    background-color: #FFF;
    z-index: 10;
  }

  &__option {
    display: block;
    cursor: pointer;
    padding: 1.5em 1em;
    line-height: .2em;
    text-decoration: none;
    color: #000;
    overflow: hidden;
    word-break: break-all;
    text-overflow: ellipsis;
    white-space: nowrap;

    &:hover {
      background-color: darken(#EEE, 5%);
    }

    &.is-highlighted,
    &:focus {
      background-color: #EEE;
    }

    &--is-disabled {
      color: $un-gray2;

      &:focus,
      &.is-highlighted,
      &:hover {
        background-color: #FFF;
        cursor: default;
      }

      /deep/ b {
        color: $un-gray2!important;
      }
    }

    /deep/ b {
      color: $un-purple;
    }
  }
}

.slide-enter-active {
  transition: all 0.3s ease;
  opacity: 1;
}
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter,
.slide-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>
