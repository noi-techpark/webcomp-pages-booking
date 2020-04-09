import { LitElement, html } from 'lit-element';
import { unsafeHTML } from 'lit-html/directives/unsafe-html.js';
import _ from 'lodash';
import moment from 'moment';
import $ from 'jquery';
import Pikaday from 'pikaday';

import { renderFonts, ensureFonts } from './lib/typography.js';
import { renderContents } from './lib/contents.js';
import { scrollFromStart, scrollUntilEnd } from './lib/scroll.js';

import fonts__kievit_regular_woff from './fonts/Kievit.woff';
import fonts__kievit_bold_woff from './fonts/Kievit-Bold.woff';

import styles__normalize from 'normalize.css/normalize.css';
import styles from './booking.scss';

import assets__calendar_icon from './images/calendar.svg';

const fonts = [
  {
    name: 'pages-kievit',
    woff: fonts__kievit_regular_woff,
    weight: 400
  },
  {
    name: 'pages-kievit',
    woff: fonts__kievit_bold_woff,
    weight: 700
  }
];

class BookingWidget extends LitElement {

  constructor() {
    super();

    // TODO initialise default options
  }

  static get properties() {
    return {
      // TODO define custom properties/attributes
    };
  }

  render() {
    return html`
      <style>
        ${renderFonts(fonts)}
        ${styles__normalize}
        ${styles}
      </style>
      <div id="container">
        <nav>
          <form action="https://lp.suedtirol.info/de-unterkunftsuchen/3" method="get" target="_blank">
            <input type="hidden" name="detailPages" value="1"/>
            <input type="hidden" name="guestpass_show" value="1"/>
            <input type="hidden" id="arrival" name="arrival" value=""/>
            <input type="hidden" id="departure" name="departure" value=""/>
            <div id="contains-from-date">
              <label for="from-date">Anreisedatum</label>
              <input type="text" id="from-date" readonly/>
              ${unsafeHTML(assets__calendar_icon)}
            </div>
            <div id="contains-to-date">
              <label for="to-date">Abreisedatum</label>
              <input type="text" id="to-date" readonly/>
              ${unsafeHTML(assets__calendar_icon)}
            </div>
            <button id="submit">Unterkunft finden</button>
          </form>
        </nav>
      </div>
    `;
  }

  adjustBasedOnScrollPosition() {
    let container = $(this.shadowRoot.getElementById('container'));

    if (scrollFromStart() >= 80) {
      container.addClass('has-left-the-beginning');
    } else {
      container.removeClass('has-left-the-beginning');
    }

    if (scrollUntilEnd() <= 16) {
      container.addClass('has-reached-the-end');
    } else {
      container.removeClass('has-reached-the-end');
    }
  }

  async firstUpdated() {
    let self = this;
    let root = self.shadowRoot;

    ensureFonts(fonts);

    let arrivalField = root.getElementById('arrival');
    let departureField = root.getElementById('departure');

    let fromField = root.getElementById('from-date');
    let toField = root.getElementById('to-date');

    var fromPicker = null, toPicker = null;

    let updateFromDate = (date) => {
      var dayAfter = new Date();
      dayAfter.setDate(date.getDate() + 1);

      fromPicker.setStartRange(date);
      toPicker.setStartRange(date);
      toPicker.setMinDate(dayAfter);
    };

    let updateToDate = (date) => {
      fromPicker.setEndRange(date);
      fromPicker.setMaxDate(date);
      toPicker.setEndRange(date);
    };

    let fromClickHandler = (e) => {
      if (fromPicker.isVisible()) {
        if ($(e.target).closest('pages-booking').length === 0 && $(e.target).closest('#contains-from-date').length === 0) {
          fromPicker.hide();
        }
      }
    };

    let toClickHandler = (e) => {
      if (toPicker.isVisible()) {
        if ($(e.target).closest('pages-booking').length === 0 && $(e.target).closest('#contains-to-date').length === 0) {
          toPicker.hide();
        }
      }
    };

    fromPicker = new Pikaday({
      container: root.getElementById('contains-from-date'),
      field: fromField,
      bound: false,
      format: 'DD.MM.YYYY',
      minDate: new Date(),
      onOpen: () => {
        if (!!toPicker) toPicker.hide();
      },
      onSelect: (date) => {
        fromField.value = moment(date).format('DD.MM.YYYY');
        arrivalField.value = moment(date).format('DD.MM.YYYY');

        updateFromDate(date);

        fromPicker.hide();
        toPicker.show();
      }
    });

    $(window).on('click', fromClickHandler);

    toPicker = new Pikaday({
      container: root.getElementById('contains-to-date'),
      field: toField,
      bound: false,
      format: 'DD.MM.YYYY',
      onOpen: () => {
        if (!!fromPicker) fromPicker.hide();
      },
      onSelect: (date) => {
        toField.value = moment(date).format('DD.MM.YYYY');
        departureField.value = moment(date).format('DD.MM.YYYY');

        updateToDate(date);

        toPicker.hide();
      }
    });

    $(window).on('click', toClickHandler);

    var defaultFrom = moment();
    var defaultTo = moment().add(3, 'days');

    fromPicker.setDate(defaultFrom.format('YYYY-MM-DD'));
    fromField.value = defaultFrom.format('DD.MM.YYYY');
    arrivalField.value = defaultFrom.format('DD.MM.YYYY');

    toPicker.setDate(defaultTo.format('YYYY-MM-DD'));
    toField.value = defaultTo.format('DD.MM.YYYY');
    departureField.value = defaultTo.format('DD.MM.YYYY');

    fromField.addEventListener('click', (e) => {
      if (fromPicker.isVisible()) {
        fromPicker.hide();
      } else {
        fromPicker.show();
      }
    });

    toField.addEventListener('click', (e) => {
      if (toPicker.isVisible()) {
        toPicker.hide();
      } else {
        toPicker.show();
      }
    });

    fromPicker.hide();
    toPicker.hide();

    $(document).on('scroll', function() {
      self.adjustBasedOnScrollPosition();
    });

    $(document).on('resize', function() {
      self.adjustBasedOnScrollPosition();
    });

    self.adjustBasedOnScrollPosition();

    $(document.body).css.paddingBottom = '80px';
  }

}

if (!customElements.get('pages-booking')) {
  customElements.define('pages-booking', BookingWidget);
}