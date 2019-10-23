import { Routing } from './shared/helpers/routing';
import { UserProfile } from './shared/models/user.profile.namespace';
import { ROLE } from './shared/helpers/const';

export class MenuSidenav {
  static GetMenus() {
    const menus = [];
    menus.push({
        state: '/',
        name: 'Trang chủ',
        type: 'link',
        special: 'project',
        icon: 'dashboard'
      });
    menus.push({
      state: Routing.CONTACTS,
      name: 'Khách hàng',
      type: 'link',
      icon: 'people'
    });
    if (UserProfile.getRole() === ROLE.ADMINISTRATOR || UserProfile.getRole() === ROLE.MANAGER) {
      menus.push({
        state: Routing.CONTACT_SOURCES,
        name: 'Nguồn khách hàng',
        type: 'link',
        icon: 'group'
      });
    }
    if (UserProfile.getRole() === ROLE.SALES) {
      menus.push({
        state: Routing.DAILYREPORTS,
        name: 'Ghi nhận ngày',
        type: 'link',
        icon: 'assignment'
      });
    } else {
      if (UserProfile.getRole() === ROLE.ADMINISTRATOR) {
        menus.push({
          state: Routing.DAILYREPORTS,
          name: 'Ghi nhận ngày',
          type: 'link',
          icon: 'assignment'
        });
      }
      menus.push({
        state: Routing.RATING_REPORTS,
        name: 'Báo cáo phiểu',
        type: 'link',
        icon: 'assignment'
      });
      menus.push({
        state: Routing.TELESALES_REPORTS,
        name: 'Báo cáo telesales',
        type: 'link',
        icon: 'assignment'
      });
      menus.push({
        state: Routing.REPORTS,
        name: 'Báo cáo tổng',
        type: 'link',
        icon: 'assignment'
      });
    }
    return menus;
    // return [
    //   {
    //     state: '/',
    //     name: 'Trang Chủ',
    //     type: 'link',
    //     special: 'project',
    //     icon: 'dashboard'
    //   },
    // {
    //   // state: Routing.CONTACTS,
    //   state: '/contacts',
    //   // name: LABEL.CONTACTS,
    //   name: 'Khách hàng',
    //   type: 'sub',
    //   icon: 'group',
    //   children: [
    //     // { state: Routing.OVERVIEW, name: LABEL.OVERVIEW },
    //     { state: '/overview', name: 'Tổng quan'},
    //     { state: '/overview', name: 'T1'},
    //   ]
    // },
    // ];
  }
}


// return [
//   {
//     state: '/',
//     name: 'HOME',
//     type: 'link',
//     icon: 'explore'
//   },
//   {
//     state: 'apps',
//     name: 'APPS',
//     type: 'sub',
//     icon: 'apps',
//     // badge: [
//     //   {type: 'red', value: '5'}
//     // ],
//     children: [
//       { state: 'calendar', name: 'CALENDAR' },
//       { state: 'media', name: 'MEDIA' },
//       { state: 'messages', name: 'MESSAGES' },
//       { state: 'social', name: 'SOCIAL' },
//       { state: 'chat', name: 'CHAT' }
//     ]
//   },
//   {
//     state: 'widgets',
//     name: 'WIDGETS',
//     type: 'link',
//     icon: 'photo'
//   },
//   {
//     state: 'material',
//     name: 'MATERIAL',
//     type: 'sub',
//     icon: 'equalizer',
//     // badge: [
//     //   {type: 'purple', value: '10'}
//     // ],
//     children: [
//       { state: 'autocomplete', name: 'AUTOCOMPLETE' },
//       { state: 'button', name: 'BUTTON' },
//       { state: 'button-toggle', name: 'BUTTONTOGGLE' },
//       { state: 'card', name: 'CARDS' },
//       { state: 'checkbox', name: 'CHECKBOX' },
//       { state: 'chips', name: 'CHIPS' },
//       { state: 'datepicker', name: 'DATEPICKER' },
//       { state: 'dialog', name: 'DIALOG' },
//       { state: 'drawer', name: 'DRAWER' },
//       { state: 'expansion', name: 'EXPANSION' },
//       { state: 'grid-list', name: 'GRID' },
//       { state: 'input', name: 'INPUT' },
//       { state: 'list', name: 'LISTS' },
//       { state: 'menu', name: 'MENU' },
//       { state: 'progress-bar', name: 'PROGRESSBAR' },
//       { state: 'progress-spinner', name: 'PROGRESSSPINNER' },
//       { state: 'radio', name: 'RADIO' },
//       { state: 'ripple', name: 'RIPPLE' },
//       { state: 'select', name: 'SELECT' },
//       { state: 'slide-toggle', name: 'SLIDETOGGLE' },
//       { state: 'slider', name: 'SLIDER' },
//       { state: 'snack-bar', name: 'SNACKBAR' },
//       { state: 'stepper', name: 'STEPPER' },
//       { state: 'table', name: 'TABLE' },
//       { state: 'tabs', name: 'TABS' },
//       { state: 'toolbar', name: 'TOOLBAR' },
//       { state: 'tooltip', name: 'TOOLTIP' },
//       { state: 'typography', name: 'TYPOGRAPHY' }
//     ]
//   },
//   {
//     state: 'forms',
//     name: 'FORMS',
//     type: 'sub',
//     icon: 'looks_3',
//     children: [
//       // {state: 'editor', name: 'EDITOR'},
//       { state: 'validation', name: 'VALIDATION' },
//       { state: 'upload', name: 'UPLOAD' },
//       { state: 'tree', name: 'TREE' },
//     ]
//   },
//   {
//     state: 'tables',
//     name: 'DATATABLE',
//     type: 'sub',
//     icon: 'format_line_spacing',
//     // badge: [
//     //   {type: 'blue-grey', value: '8'
//     //   }
//     // ],
//     children: [
//       { state: 'fullscreen', name: 'FULLSCREEN' },
//       { state: 'editing', name: 'EDITING' },
//       { state: 'filter', name: 'FILTER' },
//       { state: 'paging', name: 'PAGING' },
//       { state: 'sorting', name: 'SORTING' },
//       { state: 'pinning', name: 'PINNING' },
//       { state: 'selection', name: 'SELECTION' },
//     ]
//   },
//   {
//     state: 'ecommerce',
//     name: 'ECOMMERCE',
//     type: 'sub',
//     icon: 'looks_3',
//     // badge: [
//     //   {type: 'red', value: 'new'
//     //   }
//     // ],
//     children: [
//       { state: 'products', name: 'PRODUCTS' },
//       { state: 'compact', name: 'COMPACT' },
//       { state: 'detail', name: 'DETAIL' },
//     ]
//   },
//   {
//     state: 'taskboard',
//     name: 'TASKBOARD',
//     type: 'link',
//     icon: 'view_column',
//   },
//   {
//     state: 'charts',
//     name: 'CHARTS',
//     type: 'link',
//     icon: 'show_chart',
//   },
//   {
//     state: 'maps',
//     name: 'MAPS',
//     type: 'sub',
//     icon: 'navigation',
//     children: [
//       { state: 'google', name: 'GOOGLE' },
//       { state: 'leaflet', name: 'LEAFLET' }
//     ]
//   },
//   {
//     state: 'dragndrop',
//     name: 'DND',
//     type: 'link',
//     icon: 'show_chart',
//   },
//   {
//     state: 'pages',
//     name: 'PAGES',
//     type: 'sub',
//     icon: 'pages',
//     children: [
//       { state: 'invoice', name: 'INVOICE' },
//       { state: 'timeline', name: 'TIMELINE' },
//       { state: 'user', name: 'USER' },
//       { state: 'blank', name: 'BLANK' },
//       { state: 'pricing', name: 'PRICING' },
//     ]
//   },
//   {
//     state: 'session',
//     name: 'SESSION',
//     type: 'sub',
//     icon: 'face',
//     children: [
//       { state: '404', name: '404' },
//       { state: 'error', name: 'ERROR' },
//       { state: 'signin', name: 'SIGNIN' },
//       { state: 'signup', name: 'SIGNUP' },
//       { state: 'forgot', name: 'FORGOT' },
//       { state: 'lockscreen', name: 'LOCKSCREEN' },
//     ]
//   },
//   {
//     state: 'http://primer.nyasha.me/docs',
//     name: 'DOCS',
//     type: 'extTabLink',
//     icon: 'local_library'
//   }
// ];
