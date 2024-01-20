import {
  DASHBOARD_ROUTE,
  NOTIFICATIONS_ROUTE,
  POSTS_ROUTE,
  TI_HOUSE_ROUTE,
  USERS_ROUTE,
  VIDEOS_ROUTE,
} from '@/utils/constants/ROUTES';
import { useProvideAuth } from '@/utils/hooks/auth';
import { Navbar } from '@nextui-org/react';
import { usePathname } from 'next/navigation';
import { AccountsIcon } from '../icons/sidebar/accounts-icon';
import { CustomersIcon } from '../icons/sidebar/customers-icon';
import { HomeIcon } from '../icons/sidebar/home-icon';
import { PaymentsIcon } from '../icons/sidebar/payments-icon';
import { ReportsIcon } from '../icons/sidebar/reports-icon';
import { useSidebarContext } from '../layout/layout-context';
import { UserDropdown } from '../navbar/user-dropdown';
import { CompaniesDropdown } from './companies-dropdown';
import { SidebarItem } from './sidebar-item';
import { SidebarMenu } from './sidebar-menu';
import { Sidebar } from './sidebar.styles';

// Define route variables

export const SidebarWrapper = () => {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useSidebarContext();
  const { user } = useProvideAuth();
  const isActive = user?.user?.is_active;
  const isStaff = user?.user?.is_staff;

  return (
    <aside className="h-screen z-[202] sticky top-0">
      {collapsed ? (
        <div className={Sidebar.Overlay()} onClick={setCollapsed} />
      ) : null}
      <div
        className={Sidebar({
          collapsed: collapsed,
        })}
      >
        <div className={Sidebar.Header()}>
          <CompaniesDropdown />
        </div>
        <div className="flex flex-col justify-between h-full">
          <div className={Sidebar.Body()}>
            <SidebarItem
              title="Home"
              icon={<HomeIcon />}
              isActive={pathname === '/'}
              href="/"
            />
            <SidebarMenu title="User Menu">
              <SidebarItem
                isActive={pathname === POSTS_ROUTE}
                title="Posts"
                icon={<PaymentsIcon />}
                href={POSTS_ROUTE}
              />
              <SidebarItem
                isActive={pathname === VIDEOS_ROUTE}
                title="Videos"
                icon={<CustomersIcon />}
                href={VIDEOS_ROUTE}
              />
            </SidebarMenu>
            {isStaff && isActive && (
              <SidebarMenu title="Admin Menu">
                <SidebarItem
                  isActive={pathname === DASHBOARD_ROUTE}
                  title="Dashboard"
                  icon={<PaymentsIcon />}
                  href={DASHBOARD_ROUTE}
                />
                <SidebarItem
                  isActive={pathname === USERS_ROUTE}
                  title="Users"
                  icon={<CustomersIcon />}
                  href={USERS_ROUTE}
                />
                <SidebarItem
                  isActive={pathname === NOTIFICATIONS_ROUTE}
                  title="Notifications"
                  icon={<AccountsIcon />}
                  href={NOTIFICATIONS_ROUTE}
                />
                <SidebarItem
                  isActive={pathname === TI_HOUSE_ROUTE}
                  title="Ti-house"
                  icon={<ReportsIcon />}
                  href={TI_HOUSE_ROUTE}
                />
              </SidebarMenu>
            )}
          </div>
        </div>
        <div>
          <Navbar>
            <UserDropdown />
          </Navbar>
        </div>
      </div>
    </aside>
  );
};
