import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "../pages/User/Home/HomePage";
import routes from "./index";
import AboutUs from "../pages/User/AboutUS/AboutUSPage";
import StorePage from "../pages/Store/StorePage";
import ProductDetail from "../pages/Store/ProductDetail";
import CartPage from "../pages/Cart/CartPage";
import CheckoutPage from "../pages/Checkout/CheckoutPage";
import RegisterPage from "../pages/Auth/RegisterPage";
import LoginPage from "../pages/Auth/LoginPage";
import UserLayouts from "../layouts/User/UserLayouts";
import ProfilePage from "../pages/User/Profile/ProfilePage";
import Dashboard from "../pages/Admin/Dashboard";
import AdminLayout from "../layouts/Admin/AdminLayouts";
import OrderManagement from "../pages/Admin/OrderManagement";
import NotAuthorizedPage from "../pages/NotAuthorizePage";
import PrivateRoute from "./privateRouter";
import AdminPage from "../pages/Admin/AdminPage";
import UserManagement from "../pages/Admin/UserManagement";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path={routes.register} element={<RegisterPage />} />
        <Route
          path="/*"
          element={
            <UserLayouts>
              <Routes>
                <Route path={routes.login} element={<LoginPage />} />
                <Route path={routes.home} element={<HomePage />} />
                <Route path={routes.aboutus} element={<AboutUs />} />
                <Route path={routes.store} element={<StorePage />} />
                <Route
                  path={routes.productDetail}
                  element={<ProductDetail />}
                />
                <Route path={routes.cart} element={<CartPage />} />
                <Route path={routes.checkout} element={<CheckoutPage />} />
                <Route path={routes.profile} element={<ProfilePage />} />
              </Routes>
            </UserLayouts>
          }
        />
        <Route
          path="/admin/*"
          element={
            <AdminLayout>
              {" "}
              {/* Admin Layout to wrap dashboard and related routes */}
              <Routes>
                <Route
// Thêm 'index' để làm trang mặc định
                  path={routes.dashboard}
                  element={
                    <PrivateRoute
                      element={AdminPage} // Dùng AdminPage mới
                      role="admin"
                    ></PrivateRoute>
                  }
                />
                <Route
                  path={routes.products}
                  element={
                    <PrivateRoute
                      element={Dashboard}
                      role="admin"
                    ></PrivateRoute>
                  }
                />
                <Route
                  path={routes.orders}
                  element={
                    <PrivateRoute
                      element={OrderManagement}
                      role="admin"
                    ></PrivateRoute>
                  }
                />
                <Route
                  path={routes.users}
                  element={
                    <PrivateRoute
                      element={UserManagement}
                      role="admin"
                    ></PrivateRoute>
                  }
                />
                {/* Add other admin pages here */}
              </Routes>
            </AdminLayout>
          }
        />
        <Route
          path={routes.notAuthorizedPage}
          element={<NotAuthorizedPage />}
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
