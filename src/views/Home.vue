<template>
  <div>
    <div class="side-by-side">
      <section class="is-half">
        <h4>Default Autocomplete</h4>
        <Autocomplete
          :id="'default'"
          :options="domains"
          :label="'Available domains'"
          :placeholder="'Select a domain'"
          @change="saveFirstOption"
        />
        <br>
        <br>
        {{ firstSelection }}
      </section>
      <section class="is-half">
        <h4>With an initial selection</h4>
        <p><em>:selected="{ id: 123, label='some text' }"</em></p>
        <Autocomplete
          :id="'initialSelection'"
          :options="sectionNine"
          :label="'Section 9 investigators'"
          :placeholder="'Pick a character'"
          :selected="initialValue"
          @change="saveThirdOption"
        />
        <br>
        <br>
        {{ thirdSelection }}
      </section>
    </div>
    <br>
    <hr />
    <div class="side-by-side">
      <section class="is-half">
        <h4>Menu only shown on keyboard input &amp; typed query</h4>
        <p><em>:showMenuOnFocus="false"</em></p>
        <Autocomplete
          :id="'hideMenu'"
          :options="flavors"
          :label="'Select a flavor'"
          :placeholder="'Type to search..'"
          :showMenuOnFocus="false"
          @change="saveSecondOption"
        />
        <br>
        <br>
        {{ secondSelection }}
      </section>
      <section class="is-half">
        <h4>With wide menu options</h4>
        <p>Resize the window and open the menu to see it adapt to the viewport width</p>
        <Autocomplete
          :id="'wideOptions'"
          :options="urls"
          @change="saveFourthOption"
        />
        <br>
        <br>
        {{ fourthSelection }}
      </section>
    </div>
    <br>
    <hr />
    <div class="side-by-side">
      <section class="is-half">
        <h4>Disabled input</h4>
        <p><em>:disabled="true"</em></p>
        <Autocomplete
          :id="'disabled'"
          :disabled="true"
          :options="flavors"
          :label="'Select a flavor'"
          :placeholder="'Type to search..'"
        />
      </section>
      <section class="is-half">
        <h4>No matching highlight</h4>
        <p><em>:highlightMatches="false"</em></p>
        <Autocomplete
          :id="'noHighlight'"
          :highlightMatches="false"
          :options="flavors"
          :label="'Select a flavor'"
          :placeholder="'Type to search..'"
        />
      </section>
    </div>
    <br>
    <br>
    <hr />
    <div class="side-by-side">
      <section>
        <br>
        <b>TODO</b>
        <ul>
          <li>implement <em>required = true</em> validation</li>
          <li>implement text selection prop to select all input value on focus</li>
          <li>implement auto-highlight of first option results</li>
          <li>fix menu positioning when height changes and when too close to viewport bottom</li>
          <li>fix RegExp bug when using special characters . ? (and more)</li>
          <li>unit tests</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Autocomplete from '@/components/autocomplete/index.vue';
import domains from '@/mockData/domains';
import urls from '@/mockData/urls';
import sectionNine from '@/mockData/sectionNine';
import flavors from '@/mockData/flavors';

export default {
  name: 'home',
  components: {
    Autocomplete,
  },
  data() {
    return {
      domains,
      urls,
      sectionNine,
      flavors,
      // Local selections
      initialValue: {
        value: 3,
        label: 'Major Motoko Kusanagi',
      },
      firstSelection: {},
      secondSelection: {},
      thirdSelection: {},
      fourthSelection: {},
    };
  },
  methods: {
    saveFirstOption(value) {
      this.firstSelection = value;
    },
    saveSecondOption(value) {
      this.secondSelection = value;
    },
    saveThirdOption(value) {
      this.thirdSelection = value;
    },
    saveFourthOption(value) {
      this.fourthSelection = value;
    },
  },
};
</script>

<style lang="scss">
  .side-by-side {
    display: flex;
    padding: 0 2em;
  }
  section {
    width: 100%;
    &.is-half {
      width: 50%;
    }
  }
</style>
