<template>
  <div>
    <div class="side-by-side">
      <section class="is-half">
        <h4>Default Autocomplete</h4>
        <Autocomplete
          :id="'default'"
          :options="domains"
          @change="saveFirstOption"
        />
        <br>
        {{ firstSelection }}
      </section>
      <section class="is-half">
        <h4>With wide menu options</h4>
      <Autocomplete
        :id="'wideOptions'"
        :options="urls"
        @change="saveFourthOption"
      />
      <br>
      {{ fourthSelection }}
      </section>
    </div>
    <br>
    <hr />
    <div class="side-by-side">
      <section class="is-half">
        <h4>With an initial selection</h4>
        <Autocomplete
          :id="'initialSelection'"
          :options="flavors"
          :selected="initialValue"
          @change="saveThirdOption"
        />
        <br>
        {{ thirdSelection }}
      </section>
      <section class="is-half">
        <h4>Menu only shown on keyboard input &amp; typed query</h4>
        <Autocomplete
          :id="'hideMenu'"
          :options="flavors"
          :placeholder="'Select..'"
          :showMenuOnFocus="false"
          @change="saveSecondOption"
        />
        <br>
        {{ secondSelection }}
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Autocomplete from '@/components/autocomplete/index.vue';
import domains from '@/mockData/domains';
import urls from '@/mockData/urls';

export default {
  name: 'home',
  components: {
    Autocomplete,
  },
  data() {
    return {
      domains,
      urls,
      flavors: [
        {
          value: 1,
          label: 'Chocolate Icecream',
        },
        {
          value: 2,
          label: 'Coconut Cookie',
        },
        {
          value: 3,
          label: 'Cookie Mint Chocolate',
        },
        {
          value: 4,
          label: 'Strawberry Cake',
        },
        {
          value: 5,
          label: 'Vanilla Icecream',
        },
      ],
      // Local selections
      initialValue: {
        value: 2,
        label: 'Coconut Cookie',
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
