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
  guard?: () => boolean;
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
    afterEnter: () => {
      const signIn = new SignIn();
      signIn.init();
    }
  },
  [RouteName.DASHBOARD]: {
    path: '/dashboard',
    template: contact,
    guard,
  },
  [RouteName.USERS]: {
    path: '/users',
    template: contact,
    guard,
  },
  [RouteName.PRODUCTS]: {
    path: '/products',
    template: contact,
    guard,
  },
};

export {
  RouteName,
  type Route,
  routes,
}
