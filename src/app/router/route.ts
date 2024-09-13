import { Dashboard } from "../page/dashboard/dashboard";
import { EditProduct } from "@app/page/products/edit/edit-product";
import { NewProduct } from "../page/products/new/new-product";
import { Products } from "../page/products/list/products";
import { SignIn } from "../page/signIn/signIn";
import { Users } from "../page/users/users";
import { hasSessionToken } from "../helpers/session";

enum RouteName {
  SIGN_IN = 'SIGN_IN',
  DASHBOARD = 'DASHBOARD',
  USERS = 'USERS',
  PRODUCTS = 'PRODUCTS',
  EDIT_PRODUCTS = 'EDIT_PRODUCTS',
  NEW_PRODUCTS = 'NEW_PRODUCTS',
}

interface Route {
  afterEnter?: () => void;
  afterExit?: () => void;
  guard?: () => boolean;
  instance: {
    init: () => void,
    destroy: () => void,
  }
  template: string;
  path: string;
}

function guard () {
  return hasSessionToken()
}

const routes: Record<RouteName, Route> = {
  [RouteName.SIGN_IN]: {
    afterEnter() {
      this.instance.init();
    },
    afterExit() {
      this.instance.destroy();
    },
    instance: new SignIn(),
    path: '/',
    template: SignIn.loadTemplate(),
  },
  [RouteName.DASHBOARD]: {
    afterEnter() {
      this.instance.init();
    },
    afterExit() {
      this.instance.destroy();
    },
    guard,
    instance: new Dashboard(),
    path: '/dashboard',
    template: Dashboard.loadTemplate(),
  },
  [RouteName.USERS]: {
    afterEnter() {
      this.instance.init();
    },
    afterExit() {
      this.instance.destroy();
    },
    guard,
    instance: new Users(),
    path: '/users',
    template: Users.loadTemplate(),
  },
  [RouteName.PRODUCTS]: {
    afterEnter() {
      this.instance.init();
    },
    afterExit() {
      this.instance.destroy();
    },
    guard,
    instance: new Products(),
    path: '/products',
    template: Products.loadTemplate(),
  },
  [RouteName.NEW_PRODUCTS]: {
    afterEnter() {
      this.instance.init();
    },
    afterExit() {
      this.instance.destroy();
    },
    guard,
    instance: new NewProduct(),
    path: '/products/new',
    template: NewProduct.loadTemplate(),
  },
  [RouteName.EDIT_PRODUCTS]: {
    afterEnter() {
      this.instance.init();
    },
    afterExit() {
      this.instance.destroy();
    },
    guard,
    instance: new EditProduct(),
    path: '/products/:id',
    template: EditProduct.loadTemplate(),
  },
};

export {
  RouteName,
  type Route,
  routes,
}
