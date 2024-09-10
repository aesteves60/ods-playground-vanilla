import { EditProduct } from "@app/page/products/edit/edit-product";
import { hasSessionToken } from "../helpers/session";
import { Dashboard } from "../page/dashboard/dashboard";
import { Products } from "../page/products/list/products";
import { NewProduct } from "../page/products/new/new-product";
import { SignIn } from "../page/signIn/signIn";
import { Users } from "../page/users/users";

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

const guard = () => {
  return hasSessionToken();
}

const routes: Record<RouteName, Route> = {
  [RouteName.SIGN_IN]: {
    path: '/',
    template: SignIn.loadTemplate(),
    instance: new SignIn(),
    afterEnter: function() {
      this.instance.init();
    },
    afterExit: function() {
      this.instance.destroy();
    }
  },
  [RouteName.DASHBOARD]: {
    path: '/dashboard',
    template: Dashboard.loadTemplate(),
    instance: new Dashboard(),
    afterEnter: function() {
      this.instance.init();
    },
    afterExit: function() {
      this.instance.destroy();
    },
    guard,
  },
  [RouteName.USERS]: {
    path: '/users',
    template: Users.loadTemplate(),
    instance: new Users(),
    afterEnter: function() {
      this.instance.init();
    },
    afterExit: function() {
      this.instance.destroy();
    },
    guard,
  },
  [RouteName.PRODUCTS]: {
    path: '/products',
    template: Products.loadTemplate(),
    instance: new Products(),
    afterEnter: function() {
      this.instance.init();
    },
    afterExit: function() {
      this.instance.destroy();
    },
    guard,
  },
  [RouteName.NEW_PRODUCTS]: {
    path: '/products/new',
    template: NewProduct.loadTemplate(),
    instance: new NewProduct(),
    afterEnter: function() {
      this.instance.init();
    },
    afterExit: function() {
      this.instance.destroy();
    },
    guard,
  },
  [RouteName.EDIT_PRODUCTS]: {
    path: '/products/:id',
    template: EditProduct.loadTemplate(),
    instance: new EditProduct(),
    afterEnter: function() {
      this.instance.init();
    },
    afterExit: function() {
      this.instance.destroy();
    },
    guard,
  },
};

export {
  RouteName,
  type Route,
  routes,
}
