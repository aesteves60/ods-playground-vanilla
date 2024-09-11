import { contact } from "../contact";
import { hasSessionToken } from "../helpers/session";
import { SignIn } from "../page/signIn/signIn";

enum RouteName {
  SIGN_IN = 'SIGN_IN',
  DASHBOARD = 'DASHBOARD',
  USERS = 'USERS',
  PRODUCTS = 'PRODUCTS',
}

interface Route {
  afterEnter?: () => void;
  afterExit?: () => void;
  guard?: () => boolean;
  instance: unknown
  template: string;
  path: string;
}

const guard = () => {
  return hasSessionToken();
}

const routes: Record<RouteName, Route> = {
  [RouteName.SIGN_IN]: {
    path: '/',
    template: SignIn.loadTemplate(),
    instance: new SignIn(),
    afterEnter: function() {
      (this.instance as SignIn).init();
    },
    afterExit: function() {
      (this.instance as SignIn).destroy();
    }
  },
  [RouteName.DASHBOARD]: {
    path: '/dashboard',
    template: contact,
    instance: {},
    guard,
  },
  [RouteName.USERS]: {
    path: '/users',
    template: contact,
    instance: {},
    guard,
  },
  [RouteName.PRODUCTS]: {
    path: '/products',
    template: contact,
    instance: {},
    guard,
  },
};

export {
  RouteName,
  type Route,
  routes,
}
